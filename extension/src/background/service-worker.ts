type MCPResponse = {
  id: string;
  ok: boolean;
  result?: Record<string, unknown>;
  error?: { code: string; message: string; retryable?: boolean };
  traceId: string;
  timestamp: string;
};

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

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null;
}

if (typeof chrome !== "undefined") {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);
  });

  chrome.runtime.onMessage.addListener((raw: any, _sender: any, sendResponse: any) => {
    if (!isObject(raw) || typeof raw.type !== "string") {
      sendResponse({ ok: false, error: "INVALID_MESSAGE" });
      return false;
    }

    if (raw.type === "RUN_TOOL") {
      if (!isObject(raw.payload)) {
        sendResponse({ ok: false, error: "INVALID_PAYLOAD" });
        return false;
      }
      if (!port) connectNativeHost();
      if (!port) {
        sendResponse({ ok: false, error: "HOST_UNAVAILABLE" });
        return false;
      }
      port.postMessage({ ...raw.payload, selectedTabId });
      sendResponse({ ok: true });
      return true;
    }

    if (raw.type === "SET_SELECTED_TAB") {
      selectedTabId = Number(raw.tabId);
      sendResponse({ ok: true, selectedTabId });
      return true;
    }

    if (raw.type === "GET_STATUS") {
      sendResponse({ ok: true, status: lastStatus, selectedTabId });
      return true;
    }

    sendResponse({ ok: false, error: "UNSUPPORTED_MESSAGE" });
    return false;
  });

  chrome.tabs.onActivated.addListener((activeInfo: any) => {
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
