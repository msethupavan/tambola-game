const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const os = require('os');
const RoomManager = require('./game/RoomManager');
const GameEngine = require('./game/GameEngine');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Serve static Angular build files
app.use(express.static(path.join(__dirname, '../frontend/dist/tambola-frontend')));

// Middleware
app.use(express.json());

const roomManager = new RoomManager();
const gameEngine = new GameEngine();

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// REST API endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.get('/api/server-info', (req, res) => {
  res.json({
    ip: getLocalIP(),
    port: PORT
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Create room (host)
  socket.on('create-room', (data, callback) => {
    try {
      const { hostName } = data;
      const room = roomManager.createRoom(socket.id, hostName);
      socket.join(room.code);
      callback({ success: true, room });
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  // Join room (player)
  socket.on('join-room', (data, callback) => {
    try {
      const { roomCode, playerName } = data;
      const upperRoomCode = roomCode.toUpperCase();
      const room = roomManager.joinRoom(upperRoomCode, socket.id, playerName);
      socket.join(upperRoomCode);
      
      // Generate ticket for player
      const ticket = gameEngine.generateTicket();
      room.players[socket.id].ticket = ticket;
      
      // Notify all in room
      io.to(upperRoomCode).emit('player-joined', {
        players: Object.values(room.players)
      });
      
      callback({ success: true, room, ticket });
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  // Start game (host only)
  socket.on('start-game', (data, callback) => {
    try {
      const { roomCode } = data;
      const upperRoomCode = roomCode.toUpperCase();
      const room = roomManager.getRoom(upperRoomCode);
      
      if (room.host !== socket.id) {
        throw new Error('Only host can start the game');
      }
      
      room.status = 'playing';
      room.calledNumbers = [];
      room.winners = {};
      
      io.to(upperRoomCode).emit('game-started', {
        status: 'playing'
      });
      
      callback({ success: true });
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  // Call number (host only)
  socket.on('call-number', (data, callback) => {
    try {
      const { roomCode } = data;
      const upperRoomCode = roomCode.toUpperCase();
      const room = roomManager.getRoom(upperRoomCode);
      
      if (room.host !== socket.id) {
        throw new Error('Only host can call numbers');
      }
      
      if (room.status !== 'playing') {
        throw new Error('Game is not in playing state');
      }
      
      const number = gameEngine.callNumber(room.calledNumbers);
      room.calledNumbers.push(number);
      
      io.to(upperRoomCode).emit('number-called', {
        number,
        calledNumbers: room.calledNumbers
      });
      
      callback({ success: true, number });
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  // Claim pattern
  socket.on('claim-pattern', (data, callback) => {
    try {
      const { roomCode, pattern } = data;
      const upperRoomCode = roomCode.toUpperCase();
      const room = roomManager.getRoom(upperRoomCode);
      const player = room.players[socket.id];
      
      if (!player) {
        throw new Error('Player not found in room');
      }
      
      // Check if pattern already claimed
      if (room.winners[pattern]) {
        callback({ 
          success: false, 
          error: `${pattern} already claimed by ${room.winners[pattern].name}` 
        });
        return;
      }
      
      // Validate claim
      const isValid = gameEngine.validateClaim(
        player.ticket,
        room.calledNumbers,
        pattern
      );
      
      if (isValid) {
        room.winners[pattern] = {
          playerId: socket.id,
          name: player.name,
          timestamp: Date.now()
        };
        
        io.to(upperRoomCode).emit('claim-validated', {
          pattern,
          winner: room.winners[pattern],
          allWinners: room.winners
        });
        
        callback({ success: true, pattern });
      } else {
        callback({ success: false, error: 'Invalid claim' });
      }
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  // End game (host only)
  socket.on('end-game', (data, callback) => {
    try {
      const { roomCode } = data;
      const upperRoomCode = roomCode.toUpperCase();
      const room = roomManager.getRoom(upperRoomCode);
      
      if (room.host !== socket.id) {
        throw new Error('Only host can end the game');
      }
      
      room.status = 'finished';
      
      io.to(upperRoomCode).emit('game-ended', {
        winners: room.winners,
        calledNumbers: room.calledNumbers
      });
      
      callback({ success: true });
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  // Leave room
  socket.on('leave-room', (data) => {
    try {
      const { roomCode } = data;
      const upperRoomCode = roomCode.toUpperCase();
      const room = roomManager.getRoom(upperRoomCode);
      
      if (room) {
        socket.leave(upperRoomCode);
        roomManager.removePlayer(upperRoomCode, socket.id);
        
        io.to(upperRoomCode).emit('player-left', {
          players: Object.values(room.players)
        });
      }
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    roomManager.handleDisconnect(socket.id, (roomCode, room) => {
      if (room) {
        io.to(roomCode).emit('player-left', {
          players: Object.values(room.players)
        });
      }
    });
  });
});

// Serve Angular app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/tambola-frontend/index.html'));
});

// Start server on 0.0.0.0 to allow LAN connections
server.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log('\n===========================================');
  console.log('🎲  Tambola Game Server Started!');
  console.log('===========================================');
  console.log(`Local:   http://localhost:${PORT}`);
  console.log(`Network: http://${localIP}:${PORT}`);
  console.log('===========================================');
  console.log('Share the Network URL with players on WiFi');
  console.log('===========================================\n');
});
