#!/usr/bin/env bash
set -euo pipefail
rm -f "$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.mars.browser_bridge.json"
rm -f "$HOME/.config/google-chrome/NativeMessagingHosts/com.mars.browser_bridge.json"
echo "Uninstalled native host manifests from common macOS/Linux locations."
