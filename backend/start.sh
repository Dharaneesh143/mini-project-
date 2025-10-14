#!/bin/bash

echo "Starting Movie Recommendation Backend..."
echo

# Check if MongoDB is running
echo "Checking MongoDB connection..."
if ! mongosh --eval "db.runCommand('ping')" >/dev/null 2>&1; then
    echo "ERROR: MongoDB is not running!"
    echo "Please start MongoDB first:"
    echo "1. Install MongoDB if not installed"
    echo "2. Start MongoDB service"
    echo "3. Run this script again"
    exit 1
fi

echo "MongoDB is running!"
echo

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo
fi

# Start the server
echo "Starting the server..."
echo "Server will be available at: http://localhost:3001"
echo "API endpoints: http://localhost:3001/api"
echo "Health check: http://localhost:3001/health"
echo
echo "Press Ctrl+C to stop the server"
echo

npm run dev
