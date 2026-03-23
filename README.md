# Mars Browser Bridge for Cursor

Production-grade local-first Chrome extension + Native Messaging host exposing MCP tools for real-tab automation.

## Monorepo packages
- `extension`: MV3 extension with popup/options/onboarding/session inspector and content script instrumentation.
- `native-host`: Native Messaging host + MCP stdio server with policy engine and optional localhost HTTP module (disabled by default).
- `shared`: Zod schemas, contracts, tool/resource/prompt catalog.
- `demo-app`: Local QA target for e2e/manual validation.

## Quick start
```bash
pnpm install
pnpm build
pnpm test
```

See `docs/installation.md` and `docs/cursor-setup.md`.
