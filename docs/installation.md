# Installation
1. `pnpm install && pnpm build`
2. Install host:
   - macOS: `native-host/scripts/install-macos.sh`
   - Linux: `native-host/scripts/install-linux.sh`
   - Windows: `powershell -ExecutionPolicy Bypass -File native-host/scripts/install-windows.ps1`
3. Load `extension/dist` as unpacked extension.
4. Update native host manifest `allowed_origins` with your extension id.
