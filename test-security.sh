#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
PORT=3101 node server.js >/tmp/ats-server-test.log 2>&1 &
pid=$!
trap 'kill "$pid" 2>/dev/null || true' EXIT
sleep 1
without_key=$(curl -sS http://127.0.0.1:3101/api/health)
if [[ "$without_key" != *'"hasEnvKey":false'* ]]; then
  echo "unexpected no-key health response: $without_key" >&2
  exit 1
fi
kill "$pid" 2>/dev/null || true
wait "$pid" 2>/dev/null || true
GEMINI_API_KEY='test-only-placeholder' PORT=3101 node server.js >/tmp/ats-server-test.log 2>&1 &
pid=$!
trap 'kill "$pid" 2>/dev/null || true' EXIT
sleep 1
with_key=$(curl -sS http://127.0.0.1:3101/api/health)
if [[ "$with_key" != *'"hasEnvKey":true'* || "$with_key" == *'test-only-placeholder'* ]]; then
  echo "unsafe key health response: $with_key" >&2
  exit 1
fi
printf 'security smoke tests passed\n'
