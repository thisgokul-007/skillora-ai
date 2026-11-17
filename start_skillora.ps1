# Skillora AI - Master Launch Script for Windows PowerShell
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting Skillora AI Educational Intelligence Platform   " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

Write-Host "[1/3] Launching Python FastAPI AI Engine on port 8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$root\ai-service`"; python -m uvicorn api:app --host 127.0.0.1 --port 8000"

Write-Host "[2/3] Launching Express REST API Server on port 5000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$root\backend`"; node server.js"

Write-Host "[3/3] Launching React Vite Frontend on port 3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$root\frontend`"; npm run dev"

Start-Sleep -Seconds 3
Write-Host "`nAll 3 tiers launched successfully!" -ForegroundColor Cyan
Write-Host "Opening Skillora AI Portal at http://localhost:3000..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"
