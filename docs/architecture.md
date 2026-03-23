# Architecture

```mermaid
flowchart LR
  A[Cursor/Claude/VS Code MCP Client] -->|stdio MCP| B[Native Host MCP Server]
  C[Chrome MV3 Extension Service Worker] -->|Native Messaging| B
  D[Popup/Options/Sidepanel UI] --> C
  E[Content Script in selected tab] --> C
  C -->|tab actions, scripting| F[Real Chrome Tabs]
```

- Primary transport: Native Messaging (extension ↔ local host).
- MCP: stdio endpoint in native host for any MCP-compatible client.
- Optional HTTP mode: localhost-only (127.0.0.1), origin-checked, token-gated, disabled by default.
- Security defaults: deny-by-default, read-only toggle, per-action approvals, domain allowlist, emergency stop.
