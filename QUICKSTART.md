# Quick Start Guide

## 🚀 Quick Setup (3 Steps)

### 1. Install Dependencies
```powershell
# Backend
cd backend
npm install

# Frontend  
cd ..\frontend
npm install
```

### 2. Build Frontend
```powershell
# From frontend directory
npm run build
```

### 3. Start Server
```powershell
# From backend directory
cd ..\backend
npm start
```

## 📱 Access the Game

- **Host**: Open `http://localhost:3000`
- **Players**: Open `http://YOUR_IP:3000` (IP shown in terminal)

## 🎮 Game Flow

1. **Host** creates room → Gets room code
2. **Players** join with room code
3. **Host** starts game
4. **Host** calls numbers (manual or auto)
5. **Players** mark tickets and claim patterns
6. **First to claim wins** each pattern!

## 🏆 Patterns to Win

- 🌟 Early 5
- ⬆️ Top Line
- ➡️ Middle Line  
- ⬇️ Bottom Line
- 🏠 Full House

That's it! Enjoy the game! 🎉
