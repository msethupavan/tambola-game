class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  generateRoomCode() {
    // Generate 6-character room code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  createRoom(hostSocketId, hostName) {
    const code = this.generateRoomCode();
    
    const room = {
      code,
      host: hostSocketId,
      status: 'waiting', // waiting, playing, finished
      players: {
        [hostSocketId]: {
          id: hostSocketId,
          name: hostName,
          isHost: true,
          ticket: null
        }
      },
      calledNumbers: [],
      winners: {},
      createdAt: Date.now()
    };
    
    this.rooms.set(code, room);
    return room;
  }

  getRoom(roomCode) {
    const room = this.rooms.get(roomCode);
    if (!room) {
      throw new Error('Room not found');
    }
    return room;
  }

  joinRoom(roomCode, socketId, playerName) {
    const room = this.getRoom(roomCode);
    
    if (room.status === 'playing') {
      throw new Error('Game already in progress');
    }
    
    if (Object.keys(room.players).length >= 20) {
      throw new Error('Room is full');
    }
    
    room.players[socketId] = {
      id: socketId,
      name: playerName,
      isHost: false,
      ticket: null
    };
    
    return room;
  }

  removePlayer(roomCode, socketId) {
    const room = this.rooms.get(roomCode);
    if (!room) return;
    
    delete room.players[socketId];
    
    // If host leaves, delete room
    if (room.host === socketId) {
      this.rooms.delete(roomCode);
    }
  }

  handleDisconnect(socketId, callback) {
    for (const [code, room] of this.rooms.entries()) {
      if (room.players[socketId]) {
        this.removePlayer(code, socketId);
        callback(code, room);
        break;
      }
    }
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }
}

module.exports = RoomManager;
