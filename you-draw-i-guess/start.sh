#!/bin/bash

echo "Starting You-Draw-I-Guess..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Start the server in background
echo "Starting server..."
cd "$SCRIPT_DIR/server"
node index.js &
SERVER_PID=$!

# Start the client in background
echo "Starting client..."
cd "$SCRIPT_DIR/client"
npm run dev &
CLIENT_PID=$!

echo ""
echo "========================================"
echo "You-Draw-I-Guess is running!"
echo "Server: http://localhost:3001"
echo "Client: http://localhost:5173"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for either process to exit
wait $SERVER_PID $CLIENT_PID
