import readline from "node:readline";
import { mcpRequestSchema } from "@mars/shared";
import { runTool, type HostState } from "./mcp/tools.js";

const state: HostState = { emergencyStop: false, logs: [], version: "0.1.0" };
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

rl.on("line", (line) => {
  try {
    const request = mcpRequestSchema.parse(JSON.parse(line));
    const response = runTool(request, state);
    process.stdout.write(`${JSON.stringify(response)}\n`);
  } catch (error) {
    process.stdout.write(`${JSON.stringify({ ok: false, error: { code: "PARSE_ERROR", message: String(error) } })}\n`);
  }
});
