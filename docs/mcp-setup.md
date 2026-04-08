# Add Mars Browser Bridge to MCP clients

## Cursor

Add to Cursor MCP config:

```json
{
  "mcpServers": {
    "mars-browser": {
      "command": "node",
      "args": ["/absolute/path/mars-browser-for-cursor/native-host/dist/mcp-stdio.js"]
    }
  }
}
```

## Claude Desktop (stdio MCP)

Use equivalent stdio server config:

```json
{
  "mcpServers": {
    "mars-browser": {
      "command": "node",
      "args": ["/absolute/path/mars-browser-for-cursor/native-host/dist/mcp-stdio.js"]
    }
  }
}
```

## Generic MCP clients

Point client to stdio command:

```bash
node /absolute/path/mars-browser-for-cursor/native-host/dist/mcp-stdio.js
```

## Optional localhost HTTP mode (advanced)

HTTP mode is optional and disabled by default. If enabled, keep it local-only (`127.0.0.1`) and require origin + bearer token checks.
