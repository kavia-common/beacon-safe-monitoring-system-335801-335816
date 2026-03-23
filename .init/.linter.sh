#!/bin/bash
cd /home/kavia/workspace/code-generation/beacon-safe-monitoring-system-335801-335816/frontend_client
npm install --no-audit --no-fund
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

