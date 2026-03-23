import type { MCPRequest } from "@mars/shared";

const destructivePrefixes = ["page.click", "page.type", "page.press_key", "page.select_option", "page.check", "page.uncheck", "page.drag_and_drop", "page.upload_file_user_approved"];

export function enforcePolicy(request: MCPRequest, emergencyStop: boolean) {
  if (emergencyStop) return { ok: false, code: "EMERGENCY_STOP", message: "Session stopped by user" };
  if (request.safety.readOnly && destructivePrefixes.some((prefix) => request.tool.startsWith(prefix))) {
    return { ok: false, code: "READ_ONLY", message: `Tool ${request.tool} blocked in read-only mode` };
  }

  const url = String(request.args.url ?? "");
  if (url && request.safety.allowDomains.length > 0) {
    const domainAllowed = request.safety.allowDomains.some((domain) => url.includes(domain));
    if (!domainAllowed) {
      return { ok: false, code: "DOMAIN_BLOCKED", message: "Target domain is not approved" };
    }
  }

  return { ok: true };
}
