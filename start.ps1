# Tambola Game - Start Server Script
# Run this in PowerShell from the tambola-game directory

Write-Host "`n===========================================`n" -ForegroundColor Cyan
Write-Host "🎲 Starting Tambola Game Server..." -ForegroundColor Green
Write-Host "`n===========================================`n" -ForegroundColor Cyan

Set-Location backend
npm start
