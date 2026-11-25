@echo off
title GPUShare Dedicated Worker Server Node Daemon
color 0A
cls

echo =====================================================================
echo           ⚡ GPUSHARE WORKER SERVER NODE - GPU DAEMON ⚡
echo =====================================================================
echo.
echo [1/3] Checking Python 3.11+ installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not found in your PATH!
    echo Please install Python 3.11+ from https://www.python.org/
    echo Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)

echo [OK] Python is detected.
echo.
echo [2/3] Checking & Installing dependencies (FastAPI, PyTorch, FFmpeg)...
pip install -r server\requirements.txt --quiet
if %errorlevel% neq 0 (
    echo [WARNING] Pip encountered an issue installing some dependencies.
    echo Trying to proceed anyway...
)

echo.
echo [3/3] Detecting Local Network IPv4 Addresses...
echo ---------------------------------------------------------------------
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address" /c:"IP Address"') do (
    echo   ==^> Your Worker IP: %%a:8000
)
echo ---------------------------------------------------------------------
echo.
echo [READY] Server is starting on http://0.0.0.0:8000 ...
echo [DISCOVERY] UDP Broadcast listener active on Port 8002
echo.
echo Tell your friend with the laptop to enter one of the IPs above
echo or simply click "Scan LAN" in the GPUShare Client Studio!
echo.
echo Press Ctrl+C anytime to stop the server.
echo =====================================================================
echo.

python -m uvicorn server.app.main:app --host 0.0.0.0 --port 8000
pause
