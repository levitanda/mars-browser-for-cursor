import { z } from "zod";

export const PROTOCOL_VERSION = "1.0.0";

export const toolNames = [
  "browser.list_tabs","browser.get_active_tab","browser.select_tab","browser.open_tab","browser.close_tab","browser.navigate","browser.go_back","browser.go_forward","browser.reload","browser.wait_for_load_state",
  "page.get_url","page.get_title","page.get_html","page.get_text","page.get_accessibility_tree","page.query_selector","page.query_selectors","page.get_element_snapshot","page.get_form_fields","page.get_console_messages","page.get_network_events","page.get_cookies_metadata_nonsecret","page.get_local_storage_keys","page.get_session_storage_keys",
  "page.click","page.type","page.press_key","page.select_option","page.check","page.uncheck","page.hover","page.scroll","page.drag_and_drop","page.upload_file_user_approved","page.focus",
  "qa.assert_text","qa.assert_visible","qa.assert_hidden","qa.assert_url","qa.assert_count","qa.assert_console_clean","qa.assert_no_failed_requests","qa.wait_for_selector","qa.wait_for_text","qa.snapshot_state","qa.compare_snapshot","qa.generate_report",
  "capture.screenshot","capture.full_page_screenshot","capture.element_screenshot","capture.dom_snapshot","capture.trace_export",
  "extract.links","extract.images","extract.table","extract.list","extract.json_from_schema","extract.article","extract.metadata",
  "agent.get_capabilities","system.ping","system.health","system.version","system.logs_tail"
] as const;

export type ToolName = (typeof toolNames)[number];

export const safetySchema = z.object({
  readOnly: z.boolean().default(false),
  approvalRequired: z.boolean().default(true),
  sessionId: z.string(),
  tabId: z.number().optional(),
  allowDomains: z.array(z.string()).default([]),
  maxActions: z.number().int().positive().default(100),
  maxPages: z.number().int().positive().default(20)
});

export const mcpRequestSchema = z.object({
  id: z.string(),
  tool: z.enum(toolNames),
  args: z.record(z.string(), z.unknown()).default({}),
  safety: safetySchema,
  client: z.object({
    name: z.string(),
    version: z.string(),
    clientId: z.string()
  })
});

export const mcpResponseSchema = z.object({
  id: z.string(),
  ok: z.boolean(),
  result: z.record(z.string(), z.unknown()).optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    retryable: z.boolean().default(false)
  }).optional(),
  traceId: z.string(),
  timestamp: z.string()
});

export type MCPRequest = z.infer<typeof mcpRequestSchema>;
export type MCPResponse = z.infer<typeof mcpResponseSchema>;

export const extensionMessageSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("HOST_STATUS") , connected: z.boolean(), version: z.string().optional() }),
  z.object({ type: z.literal("RUN_TOOL"), payload: mcpRequestSchema }),
  z.object({ type: z.literal("TOOL_RESULT"), payload: mcpResponseSchema }),
  z.object({ type: z.literal("APPROVAL_REQUEST"), operation: z.string(), context: z.record(z.string(), z.unknown()) }),
  z.object({ type: z.literal("APPROVAL_RESULT"), approved: z.boolean(), reason: z.string().optional() })
]);

export type ExtensionMessage = z.infer<typeof extensionMessageSchema>;

export const resourceNames = [
  "resource://session/state",
  "resource://tab/dom-summary",
  "resource://logs/console",
  "resource://logs/network",
  "resource://qa/last-report",
  "resource://help/tools"
] as const;

export const promptNames = [
  "manual-qa-run",
  "smoke-test-page",
  "debug-login-flow",
  "scrape-page-structured",
  "verify-form-submission",
  "investigate-console-errors"
] as const;
