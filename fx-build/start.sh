#!/bin/bash
# Web/Lab launcher: backend :3001 (built from src), Vite :5000 (proxies /api -> 127.0.0.1:3001).
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT/backend"
[ -d node_modules ] || npm install
npx tsc -p tsconfig.json
node dist/index.js --port=3001 &
BACKEND_PID=$!
trap 'kill $BACKEND_PID 2>/dev/null' EXIT
sleep 2
cd "$ROOT/app"
[ -d node_modules ] || npm install
npx vite --port 5000 --host 0.0.0.0
