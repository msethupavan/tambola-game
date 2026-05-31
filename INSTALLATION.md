# 🛠️ Installation & Setup Guide

Comprehensive guide for setting up Tambola Game on your system.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (v18 or higher)
   - [Download Node.js](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (v9 or higher)
   - Comes bundled with Node.js
   - Verify installation: `npm --version`

### Optional

- **Git**: For cloning the repository
- **Angular CLI**: For development (`npm install -g @angular/cli`)

## 🚀 Installation Methods

### Method 1: Automated Setup (Recommended for Windows)

```powershell
# Clone repository
git clone https://github.com/yourusername/tambola-game.git
cd tambola-game

# Run automated setup script
.\setup.ps1
```

### Method 2: Manual Setup (All Platforms)

#### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/tambola-game.git
cd tambola-game
```

#### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

#### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

#### Step 4: Build Frontend

```bash
npm run build
```

#### Step 5: Start Server

```bash
cd ../backend
npm start
```

### Method 3: Development Setup

For development with hot reload:

```bash
# Terminal 1: Backend with nodemon
cd backend
npm run dev

# Terminal 2: Frontend with Angular dev server
cd frontend
ng serve --open
```

## 🎮 Running the Game

### Production Mode

```bash
cd backend
npm start
```

Server will start at:
- **Local**: `http://localhost:3000`
- **Network**: `http://[YOUR_IP]:3000`

### Development Mode

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
ng serve
```

Accesses:
- **Frontend**: `http://localhost:4200`
- **Backend**: `http://localhost:3000`

## 🔧 Configuration

### Changing Port

```bash
# Windows
$env:PORT=3001; npm start

# macOS/Linux
PORT=3001 npm start
```

### Network Access

Ensure firewall allows port 3000:

**Windows:**
```powershell
# Allow port through firewall
netsh advfirewall firewall add rule name="Tambola Game" dir=in action=allow protocol=tcp localport=3000
```

**macOS:**
```bash
# Allow port through firewall (via System Preferences)
# System Preferences → Security & Privacy → Firewall Options → Add Node.js
```

**Linux:**
```bash
# Allow port through ufw
sudo ufw allow 3000/tcp
```

## 📱 Network Setup

### Finding Your IP Address

**Windows:**
```powershell
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter.

**macOS:**
```bash
ifconfig | grep inet
```

**Linux:**
```bash
hostname -I
```

### Connecting Players

1. Ensure all devices are on the **same WiFi network**
2. Share Network URL: `http://[YOUR_IP]:3000`
3. Players open URL in their browser
4. No additional setup needed on client devices!

## ✅ Verification

After installation, verify everything works:

1. **Server Starts**: See startup message with local and network URLs
2. **Frontend Loads**: Can access game in browser
3. **Host Can Create Room**: Create room button works
4. **Join Functionality**: Can enter room code and join
5. **Socket Connection**: Real-time updates work (numbers broadcast)

## 🐛 Troubleshooting Installation

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
- Change port: `PORT=3001 npm start`
- Or kill existing process: `npx kill-port 3000`

### Missing Dependencies

```
Error: Cannot find module 'express'
```

**Solution:**
```bash
cd backend
npm install
```

### Build Errors

```
NG1234: Cannot find module '@angular/...'
```

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Network Not Working

```
ERR_CONNECTION_REFUSED at http://[IP]:3000
```

**Solutions:**
1. Verify server is running
2. Check firewall settings
3. Ensure correct IP address
4. Disable VPN if enabled
5. Check WiFi connection

## 📦 Dependencies

### Backend
- Express.js 4.18.2
- Socket.IO 4.6.1
- CORS middleware

### Frontend
- Angular 17
- RxJS 7.8
- Socket.IO Client 4.6.1
- TypeScript 5.2

See [PACKAGES.md](PACKAGES.md) for full details.

## 🚀 Next Steps

1. Read [QUICKSTART.md](QUICKSTART.md) for quick gameplay guide
2. Check [DEVELOPMENT.md](DEVELOPMENT.md) for architecture details
3. See [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute

## 📞 Need Help?

- Check [README.md](README.md#-troubleshooting) troubleshooting section
- Open an [issue](https://github.com/msethupavan/tambola-game/issues) on GitHub
- Join [discussions](https://github.com/msethupavan/tambola-game/discussions)

---

**Happy gaming!** 🎲
