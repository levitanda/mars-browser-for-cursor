# Quickstart: start using Mars Browser Bridge

## 1) Build and load extension

```bash
pnpm install
pnpm build
```

- Open `chrome://extensions`
- Enable **Developer mode**
- Click **Load unpacked** and choose `extension/dist`

## 2) Install and register native host

- macOS: `native-host/scripts/install-macos.sh`
- Linux: `native-host/scripts/install-linux.sh`
- Windows: `powershell -ExecutionPolicy Bypass -File native-host/scripts/install-windows.ps1`

Then update the generated native host manifest `allowed_origins` with your extension id.

## 3) Start a local session in Chrome

- Click extension icon → **Start Local Agent Bridge**
- Open target tab
- Click **Select tab for agent**
- (Optional) enable read-only mode or approval-per-action mode

## 4) Verify the bridge

- In popup, host status should show connected/running.
- In terminal (optional): run `node tests/integration/messaging.test.mjs`
