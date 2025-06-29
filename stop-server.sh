#!/bin/bash
if [ -f .server_pid ]; then
  PID=$(cat .server_pid)
  kill $PID
  rm .server_pid
  echo "FamiPrint server with PID $PID stopped."
else
  echo "No FamiPrint server PID found."
fi