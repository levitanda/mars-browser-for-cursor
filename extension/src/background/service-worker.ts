import { extensionMessageSchema, mcpRequestSchema, type MCPResponse } from "@mars/shared";

const NATIVE_HOST = "com.mars.browser_bridge";
let port: any = null;
let lastStatus: { connected: boolean; version?: string } = { connected: false };
let selectedTabId: number | null = null;

function connectNativeHost() {
  if (port) return;
  try {
    port = chrome.runtime.connectNative(NATIVE_HOST);
    lastStatus = { connected: true };
    port.onMessage.addListener((message: any) => {
      chrome.runtime.sendMessage({ type: "TOOL_RESULT", payload: message });
    });
    port.onDisconnect.addListener(() => {
      port = null;
      lastStatus = { connected: false };
      chrome.runtime.sendMessage({ type: "HOST_STATUS", connected: false });
    });
    chrome.runtime.sendMessage({ type: "HOST_STATUS", connected: true });
  } catch (error) {
    lastStatus = { connected: false };
    console.error("Native host connection failed", error);
  }
}

if (typeof chrome !== "undefined") {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);
  });

  chrome.runtime.onMessage.addListener((raw: any, _sender: any, sendResponse: any) => {
    const parsed = extensionMessageSchema.safeParse(raw);
    if (!parsed.success) {
      sendResponse({ ok: false, error: "INVALID_MESSAGE" });
      return;
    }

    const message = parsed.data;
    if (message.type === "RUN_TOOL") {
      const request = mcpRequestSchema.parse(message.payload);
      if (!port) connectNativeHost();
      if (!port) {
        sendResponse({ ok: false, error: "HOST_UNAVAILABLE" });
        return;
      }

      port.postMessage({ ...request, selectedTabId });
      sendResponse({ ok: true });
    }

    if (raw.type === "SET_SELECTED_TAB") {
      selectedTabId = Number(raw.tabId);
      sendResponse({ ok: true, selectedTabId });
    }

    if (raw.type === "GET_STATUS") {
      sendResponse({ ok: true, status: lastStatus, selectedTabId });
    }

    return true;
  });

  chrome.tabs.onActivated.addListener(async (activeInfo: any) => {
    if (!selectedTabId) {
      selectedTabId = activeInfo.tabId;
    }
  });

  chrome.runtime.onConnect.addListener((clientPort: any) => {
    if (clientPort.name === "popup") {
      connectNativeHost();
      clientPort.postMessage({ type: "HOST_STATUS", ...lastStatus });
    }
  });
}

export function __test_makeResponse(id: string): MCPResponse {
  return {
    id,
    ok: true,
    result: { alive: true },
    timestamp: new Date().toISOString(),
    traceId: crypto.randomUUID()
  };
}
