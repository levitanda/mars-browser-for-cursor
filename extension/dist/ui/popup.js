const statusEl = document.querySelector("#status");
const logsEl = document.querySelector("#logs");
function log(msg) {
  const li = document.createElement("li");
  li.textContent = `${new Date().toLocaleTimeString()} ${msg}`;
  logsEl.prepend(li);
}

async function refreshStatus() {
  const result = await chrome.runtime.sendMessage({ type: "GET_STATUS" });
  statusEl.textContent = result?.status?.connected ? "Host running" : "Host missing/disconnected";
}

document.querySelector("#start")?.addEventListener("click", async () => {
  await chrome.runtime.sendMessage({
    type: "RUN_TOOL",
    payload: {
      id: crypto.randomUUID(),
      tool: "system.ping",
      args: {},
      safety: { sessionId: "local", readOnly: true, approvalRequired: false, allowDomains: [], maxActions: 1, maxPages: 1 },
      client: { name: "extension-ui", version: "0.1.0", clientId: "popup" }
    }
  });
  log("Bridge started");
  await refreshStatus();
});

document.querySelector("#select-tab")?.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    await chrome.runtime.sendMessage({ type: "SET_SELECTED_TAB", tabId: tab.id });
    log(`Selected tab ${tab.id}`);
  }
});

document.querySelector("#stop")?.addEventListener("click", async () => {
  await chrome.storage.local.set({ emergencyStop: true });
  log("Emergency stop enabled");
});

refreshStatus().catch((error) => {
  statusEl.textContent = `Error: ${String(error)}`;
});
