import { toolNames, type MCPRequest, type MCPResponse } from "@mars/shared";
import { enforcePolicy } from "../security/policy.js";

export type HostState = {
  emergencyStop: boolean;
  logs: string[];
  version: string;
};

export function runTool(request: MCPRequest, state: HostState): MCPResponse {
  const policy = enforcePolicy(request, state.emergencyStop);
  if (!policy.ok) {
    return {
      id: request.id,
      ok: false,
      error: { code: policy.code, message: policy.message, retryable: false },
      traceId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
  }

  const tool = request.tool;
  if (!toolNames.includes(tool)) {
    return {
      id: request.id,
      ok: false,
      error: { code: "UNKNOWN_TOOL", message: `Unknown tool ${tool}`, retryable: false },
      traceId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
  }

  state.logs.push(`${new Date().toISOString()} ${request.tool}`);
  state.logs = state.logs.slice(-500);

  if (tool === "system.ping") {
    return ok(request.id, { pong: true, version: state.version });
  }
  if (tool === "system.version") {
    return ok(request.id, { version: state.version, protocol: "1.0.0" });
  }
  if (tool === "agent.get_capabilities") {
    return ok(request.id, { tools: toolNames, resources: ["resource://session/state"] });
  }
  if (tool === "system.logs_tail") {
    return ok(request.id, { lines: state.logs.slice(-50) });
  }

  return ok(request.id, {
    executed: tool,
    args: request.args,
    note: "Browser-bound execution is handled by extension session bridge."
  });
}

function ok(id: string, result: Record<string, unknown>): MCPResponse {
  return { id, ok: true, result, traceId: crypto.randomUUID(), timestamp: new Date().toISOString() };
}
