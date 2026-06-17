@echo off
echo Starting Doctor Hub locally...
echo.
start "Doctor Hub API" cmd /k "cd /d %~dp0backend && npm start"
timeout /t 3 /nobreak >nul
start "Doctor Hub Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Test login: patient@test.com / password123
echo Run seed first: npm run seed
