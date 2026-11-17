@echo off
title Skillora AI Launcher
echo ==========================================================
echo  Starting Skillora AI Educational Intelligence Platform
echo ==========================================================

echo [1/3] Launching Python FastAPI AI Engine on port 8000...
start "Skillora AI - Python ML Engine" cmd /k "cd /d %~dp0ai-service && python -m uvicorn api:app --host 127.0.0.1 --port 8000"

echo [2/3] Launching Express REST API Server on port 5000...
start "Skillora AI - Backend API" cmd /k "cd /d %~dp0backend && node server.js"

echo [3/3] Launching React Vite Frontend on port 3000...
start "Skillora AI - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 >nul
start http://localhost:3000
echo.
echo All services launched! Access Skillora AI at http://localhost:3000
