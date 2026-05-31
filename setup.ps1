# Tambola Game - Complete Setup Script
# Run this in PowerShell from the tambola-game directory

Write-Host "`n===========================================`n" -ForegroundColor Cyan
Write-Host "🎲 Tambola Game - Complete Setup" -ForegroundColor Green
Write-Host "`n===========================================`n" -ForegroundColor Cyan

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend dependencies installed`n" -ForegroundColor Green

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ..\frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend dependencies installed`n" -ForegroundColor Green

# Build frontend
Write-Host "🔨 Building Angular frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend built successfully`n" -ForegroundColor Green

# Return to root
Set-Location ..

Write-Host "`n===========================================`n" -ForegroundColor Cyan
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "`n===========================================`n" -ForegroundColor Cyan
Write-Host "To start the server, run:" -ForegroundColor Yellow
Write-Host "  cd backend" -ForegroundColor Cyan
Write-Host "  npm start`n" -ForegroundColor Cyan
Write-Host "Then open http://localhost:3000 in your browser`n" -ForegroundColor White
