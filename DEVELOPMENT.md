# Development Notes

## Architecture Overview

### Backend (Node.js + Express + Socket.IO)

**server.js**
- Main entry point
- Sets up Express server on 0.0.0.0 to accept LAN connections
- Configures Socket.IO for real-time communication
- Serves built Angular app from dist folder
- Handles all socket events (create-room, join-room, call-number, etc.)

**game/RoomManager.js**
- Manages all active game rooms
- Generates unique 6-character room codes
- Handles player joining/leaving
- Tracks room state (waiting, playing, finished)
- Cleans up rooms when host disconnects

**game/GameEngine.js**
- Generates valid Tambola tickets (3×9 grid, 15 numbers)
- Ensures proper ticket format (5 numbers per row, sorted columns)
- Calls random numbers 1-90 without repeats
- Validates pattern claims (early5, lines, fullHouse)

### Frontend (Angular 17 Standalone)

**Components:**
- `HomeComponent`: Landing page with create/join options
- `HostComponent`: Host controls for room and game management
- `PlayerComponent`: Player view with ticket and claim buttons

**Services:**
- `SocketService`: Manages Socket.IO connection and events

**Routing:**
- `/` → Home
- `/host` → Host view
- `/player` → Player view

## Key Design Decisions

1. **Server-side validation**: All claims validated on server to prevent cheating
2. **Auto-marking**: Numbers auto-marked on player tickets when called
3. **Single winner per pattern**: First valid claim wins, pattern locked
4. **LAN-first**: Server binds to 0.0.0.0 for easy WiFi access
5. **Standalone components**: Angular 17 standalone API (no NgModule)

## Socket Events

**Client → Server:**
- `create-room`: Host creates a new game room
- `join-room`: Player joins with room code
- `start-game`: Host starts the game
- `call-number`: Host calls next number
- `claim-pattern`: Player claims a pattern
- `end-game`: Host ends the game
- `leave-room`: Player leaves

**Server → Client:**
- `player-joined`: New player joined room
- `player-left`: Player left room
- `game-started`: Game has started
- `number-called`: New number called
- `claim-validated`: Pattern claimed and validated
- `game-ended`: Game finished

## Future Enhancements

- [ ] Add sound effects for number calls
- [ ] Implement reconnection with state recovery
- [ ] Add game history/statistics
- [ ] Support multiple simultaneous games
- [ ] Add chat between players
- [ ] Implement custom winning patterns
- [ ] Add database for persistent game history
- [ ] Create mobile apps (React Native)
- [ ] Add authentication/user profiles
- [ ] Tournament mode with multiple rounds
