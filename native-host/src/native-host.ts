import { mcpRequestSchema } from "@mars/shared";
import { runTool, type HostState } from "./mcp/tools.js";

const state: HostState = { emergencyStop: false, logs: [], version: "0.1.0" };

function readNativeMessage(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    process.stdin.once("readable", () => {
      const header = process.stdin.read(4) as Buffer;
      if (!header) return reject(new Error("No input"));
      const length = header.readUInt32LE(0);
      const body = process.stdin.read(length) as Buffer;
      if (!body) return reject(new Error("Incomplete input"));
      resolve(body);
    });
  });
}

function writeNativeMessage(message: unknown) {
  const encoded = Buffer.from(JSON.stringify(message));
  const header = Buffer.alloc(4);
  header.writeUInt32LE(encoded.length, 0);
  process.stdout.write(header);
  process.stdout.write(encoded);
}

async function run() {
  while (true) {
    try {
      const body = await readNativeMessage();
      const incoming = JSON.parse(body.toString("utf8"));
      if (incoming.type === "SET_EMERGENCY_STOP") {
        state.emergencyStop = Boolean(incoming.enabled);
        writeNativeMessage({ ok: true, emergencyStop: state.emergencyStop });
        continue;
      }
      const request = mcpRequestSchema.parse(incoming);
      const response = runTool(request, state);
      writeNativeMessage(response);
    } catch (error) {
      writeNativeMessage({ ok: false, error: { code: "NATIVE_HOST_ERROR", message: String(error), retryable: true } });
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
