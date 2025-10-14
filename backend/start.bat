@echo off
echo Starting Movie Recommendation Backend...
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
mongosh --eval "db.runCommand('ping')" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MongoDB is not running!
    echo Please start MongoDB first:
    echo 1. Install MongoDB if not installed
    echo 2. Start MongoDB service
    echo 3. Run this script again
    pause
    exit /b 1
)

echo MongoDB is running!
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Start the server
echo Starting the server...
echo Server will be available at: http://localhost:3001
echo API endpoints: http://localhost:3001/api
echo Health check: http://localhost:3001/health
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
