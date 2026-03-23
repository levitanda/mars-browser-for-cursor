# Threat model
- Malicious local MCP client: mitigated by per-client trust, approval gates, bounded actions.
- Malicious webpage prompt injection: user-visible scope, domain allowlist, warning in docs.
- DNS rebinding (HTTP mode): localhost bind + origin validation + bearer token; mode disabled by default.
- Extension privilege escalation: least-privilege permissions and optional host permissions.
- Data leakage: no raw cookie values, no secret extraction defaults.
- MV3 lifecycle edge cases: service-worker reconnect and host disconnect detection.
