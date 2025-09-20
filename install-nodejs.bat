@echo off
echo 🔧 Node.js Installation Helper
echo.

REM Check if Node.js is already installed
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js is already installed!
    node --version
    echo.
    echo You can now run: start-app.bat
    pause
    exit /b 0
)

echo ❌ Node.js is not installed
echo.
echo 📥 Opening Node.js download page...
echo.
echo Please follow these steps:
echo 1. The Node.js website will open in your browser
echo 2. Click the green "LTS" button to download
echo 3. Run the downloaded installer
echo 4. IMPORTANT: Check "Add to PATH" during installation
echo 5. Restart your computer after installation
echo 6. Run this script again to verify
echo.

REM Open Node.js download page
start https://nodejs.org/

echo.
echo After installing Node.js and restarting your computer,
echo run this script again to verify the installation.
echo.
pause
