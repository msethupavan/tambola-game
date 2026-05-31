# 📦 Tambola Game Package Configuration

This document describes the package structure and dependencies for the Tambola Game project.

## Backend Dependencies

### Runtime Dependencies

- **express** (^4.18.2): Fast, unopinionated web framework for Node.js
- **socket.io** (^4.6.1): Real-time bidirectional communication library
- **cors** (^2.8.5): Express middleware for enabling CORS

### Development Dependencies

- **nodemon** (^3.0.1): Automatically restarts Node.js application when files change

## Frontend Dependencies

### Runtime Dependencies

- **@angular/animations** (^17.0.0): Angular animations module
- **@angular/common** (^17.0.0): Common Angular directives and services
- **@angular/compiler** (^17.0.0): Angular compiler
- **@angular/core** (^17.0.0): Angular core functionality
- **@angular/forms** (^17.0.0): Angular forms module
- **@angular/platform-browser** (^17.0.0): Angular platform-browser module
- **@angular/platform-browser-dynamic** (^17.0.0): Dynamic platform-browser module
- **@angular/router** (^17.0.0): Angular router module
- **rxjs** (~7.8.0): Reactive Extensions for JavaScript
- **socket.io-client** (^4.6.1): Client for Socket.IO
- **tslib** (^2.3.0): TypeScript helpers library
- **zone.js** (~0.14.2): Zone.js execution context

### Development Dependencies

- **@angular-devkit/build-angular** (^17.0.0): Angular build tools
- **@angular/cli** (^17.0.0): Angular command line interface
- **@angular/compiler-cli** (^17.0.0): Angular compiler CLI
- **@types/node** (^20.10.0): TypeScript definitions for Node.js
- **typescript** (~5.2.2): TypeScript compiler

## Scripts

### Backend Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Frontend Scripts

```bash
ng serve           # Start Angular dev server
npm run build      # Build for production
npm run watch      # Build with file watching
npm test           # Run tests
```

## Version Requirements

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Angular**: v17
- **TypeScript**: v5.2+

## Installation

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
ng build
```

## Security Notes

All dependencies are regularly updated to patch security vulnerabilities. Always run `npm audit` before deploying to production.
