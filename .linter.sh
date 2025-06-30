#!/bin/bash
cd /home/kavia/workspace/code-generation/chessmate-95936-18a78b84/chess_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

