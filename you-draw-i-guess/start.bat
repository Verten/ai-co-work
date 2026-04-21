@echo off
echo Starting You-Draw-I-Guess...
echo.

cd /d "%~dp0"

echo Starting server...
start "YouDrawGuess-Server" cmd /k "cd /d %~dp0server && node index.js"

timeout /t 2 /nobreak > nul

echo Starting client...
start "YouDrawGuess-Client" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo ========================================
echo You-Draw-I-Guess is starting!
echo Server: http://localhost:3001
echo Client: http://localhost:5173
echo ========================================
echo.
echo Close this window to exit
pause
