@echo off
echo 🚀 Starting Balaji Loan Application Setup...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo 1. Go to https://nodejs.org/
    echo 2. Download the LTS version
    echo 3. Run the installer and check "Add to PATH"
    echo 4. Restart your computer
    echo 5. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js is installed!
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed!
) else (
    echo ✅ Dependencies already installed
)

REM Check if environment file exists
if not exist ".env.local" (
    echo 📝 Creating environment file...
    copy env.example .env.local
    echo ✅ Environment file created!
) else (
    echo ✅ Environment file already exists
)

echo.
echo 🎉 Setup complete! Starting the application...
echo.
echo 🌐 The app will open at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
npm run dev
