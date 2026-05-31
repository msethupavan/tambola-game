# 🔌 API Documentation

## Socket.IO Events Reference

Tambola Game uses Socket.IO for real-time bidirectional communication between client and server.

---

## Server Events (Backend)

### Room Management

#### `create-room`

**Client sends:**
```typescript
socket.emit('create-room', { hostName: string }, callback)
```

**Parameters:**
- `hostName` (string): Name of the host player

**Response:**
```typescript
{
  success: boolean,
  room: {
    code: string,           // 6-character room code
    host: string,           // Socket ID of host
    status: string,         // 'waiting'
    players: { [id]: Player }
  }
}
```

**Example:**
```typescript
socket.emit('create-room', { hostName: 'John' }, (response) => {
  if (response.success) {
    console.log('Room code:', response.room.code);
  }
});
```

---

#### `join-room`

**Client sends:**
```typescript
socket.emit('join-room', { roomCode: string, playerName: string }, callback)
```

**Parameters:**
- `roomCode` (string): 6-character room code (case-insensitive)
- `playerName` (string): Name of the joining player

**Response:**
```typescript
{
  success: boolean,
  room: Room,
  ticket: number[][]      // 3x9 grid of numbers
}
```

---

#### `leave-room`

**Client sends:**
```typescript
socket.emit('leave-room', { roomCode: string })
```

**Parameters:**
- `roomCode` (string): Room code to leave

---

### Game Control

#### `start-game`

**Client sends:**
```typescript
socket.emit('start-game', { roomCode: string }, callback)
```

**Parameters:**
- `roomCode` (string): Room code to start game in

**Response:**
```typescript
{ success: boolean }
```

**Notes:**
- Only host can call this
- Minimum 1 player required (excluding host)

---

#### `call-number`

**Client sends:**
```typescript
socket.emit('call-number', { roomCode: string }, callback)
```

**Parameters:**
- `roomCode` (string): Room code

**Response:**
```typescript
{
  success: boolean,
  number: number          // Called number (1-90)
}
```

**Notes:**
- Only host can call this
- Numbers 1-90, no repeats
- Broadcasts to all players in room

---

#### `end-game`

**Client sends:**
```typescript
socket.emit('end-game', { roomCode: string }, callback)
```

**Parameters:**
- `roomCode` (string): Room code to end

**Response:**
```typescript
{ success: boolean }
```

**Notes:**
- Only host can call this

---

### Player Actions

#### `claim-pattern`

**Client sends:**
```typescript
socket.emit('claim-pattern', { roomCode: string, pattern: string }, callback)
```

**Parameters:**
- `roomCode` (string): Room code
- `pattern` (string): One of `early5`, `topLine`, `middleLine`, `bottomLine`, `fullHouse`

**Response:**
```typescript
{
  success: boolean,
  pattern: string,
  error?: string         // If unsuccessful
}
```

**Validation:**
- Pattern not already claimed
- Numbers match the pattern on ticket
- Claim must be valid Tambola pattern

---

## Client Events (Frontend)

Events the server broadcasts to connected clients.

### `player-joined`

**Server broadcasts:**
```typescript
io.to(roomCode).emit('player-joined', {
  players: Player[]      // All players in room
})
```

**Triggered when:**
- A player successfully joins the room

---

### `player-left`

**Server broadcasts:**
```typescript
io.to(roomCode).emit('player-left', {
  players: Player[]      // Updated player list
})
```

**Triggered when:**
- A player disconnects or leaves the room

---

### `game-started`

**Server broadcasts:**
```typescript
io.to(roomCode).emit('game-started', {
  status: 'playing'
})
```

**Triggered when:**
- Host clicks "Start Game"

---

### `number-called`

**Server broadcasts:**
```typescript
io.to(roomCode).emit('number-called', {
  number: number,                  // Called number
  calledNumbers: number[]          // All called numbers so far
})
```

**Triggered when:**
- Host calls a number
- Auto-call interval completes

---

### `claim-validated`

**Server broadcasts:**
```typescript
io.to(roomCode).emit('claim-validated', {
  pattern: string,
  winner: {
    playerId: string,
    name: string,
    timestamp: number
  },
  allWinners: { [pattern]: Winner }
})
```

**Triggered when:**
- A player's pattern claim is validated

---

### `game-ended`

**Server broadcasts:**
```typescript
io.to(roomCode).emit('game-ended', {
  winners: { [pattern]: Winner },
  calledNumbers: number[]
})
```

**Triggered when:**
- Host clicks "End Game"

---

## Data Models

### Room

```typescript
interface Room {
  code: string;                    // 6-character code
  host: string;                    // Socket ID
  status: 'waiting' | 'playing' | 'finished';
  players: { [socketId: string]: Player };
  calledNumbers: number[];
  winners: { [pattern: string]: Winner };
  createdAt: number;               // Timestamp
}
```

### Player

```typescript
interface Player {
  id: string;                      // Socket ID
  name: string;
  isHost: boolean;
  ticket: number[][];              // 3x9 grid
}
```

### Winner

```typescript
interface Winner {
  playerId: string;
  name: string;
  timestamp: number;
}
```

### Patterns

```typescript
type Pattern = 'early5' | 'topLine' | 'middleLine' | 'bottomLine' | 'fullHouse';

// Pattern Definitions:
// early5: Any 5 numbers
// topLine: All 5 numbers in first row
// middleLine: All 5 numbers in second row
// bottomLine: All 5 numbers in third row
// fullHouse: All 15 numbers
```

---

## Error Handling

All callbacks follow this pattern:

```typescript
callback({
  success: false,
  error: 'Error message describing what went wrong'
})
```

**Common Errors:**
- `Room not found`
- `Only host can start the game`
- `Invalid claim`
- `Pattern already claimed`
- `Player not found in room`
- `Game is not in playing state`

---

## Rate Limiting

Currently no rate limiting implemented. For production, consider:

- Limit number calls to one per 1 second
- Limit claim attempts to one per 0.5 seconds
- Disconnect idle clients after 5 minutes

---

## Authentication

Currently uses no authentication. For security improvements:

- Implement user login system
- Add authentication tokens
- Encrypt sensitive data

---

## Version

Current API Version: **1.0.0**

Last Updated: May 31, 2026
