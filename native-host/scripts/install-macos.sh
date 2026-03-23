#!/usr/bin/env bash
set -euo pipefail
HOST_NAME="com.mars.browser_bridge"
TARGET="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
mkdir -p "$TARGET"
BIN_PATH="$(cd "$(dirname "$0")/.." && pwd)/dist/native-host.js"
MANIFEST="$TARGET/$HOST_NAME.json"
cat > "$MANIFEST" <<JSON
{
  "name": "$HOST_NAME",
  "description": "Mars Browser Bridge native host",
  "path": "$BIN_PATH",
  "type": "stdio",
  "allowed_origins": ["chrome-extension://__EXTENSION_ID__/"]
}
JSON
echo "Installed: $MANIFEST"
