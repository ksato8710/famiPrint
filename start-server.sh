#!/bin/bash
npm run dev > /dev/null 2>&1 &
echo $! > .server_pid
echo "FamiPrint server started with PID $(cat .server_pid)"