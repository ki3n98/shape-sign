#!/bin/bash

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../models
source venv/bin/activate
pip install -r requirements.txt

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Start backend
cd ../models
source venv/bin/activate
python main.py &
BACKEND_PID=$!

# Kill both when this script is interrupted
trap "kill $FRONTEND_PID $BACKEND_PID 2>/dev/null; exit" SIGINT SIGTERM

echo "Frontend (PID: $FRONTEND_PID) and Backend (PID: $BACKEND_PID) are running."
echo "Press Ctrl+C to stop both."

wait
