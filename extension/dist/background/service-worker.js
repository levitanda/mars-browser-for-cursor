const NATIVE_HOST = "com.mars.browser_bridge";
let port = null;
let lastStatus = { connected: false };
let selectedTabId = null;

function connectNativeHost() {
  if (port) return;
  try {
    port = chrome.runtime.connectNative(NATIVE_HOST);
    lastStatus = { connected: true };
    port.onMessage.addListener((message) => {
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

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);
});

chrome.runtime.onMessage.addListener((raw, _sender, sendResponse) => {
  if (raw?.type === "RUN_TOOL") {
    if (!port) connectNativeHost();
    if (!port) {
      sendResponse({ ok: false, error: "HOST_UNAVAILABLE" });
      return;
    }
    port.postMessage({ ...raw.payload, selectedTabId });
    sendResponse({ ok: true });
    return true;
  }

  if (raw?.type === "SET_SELECTED_TAB") {
    selectedTabId = Number(raw.tabId);
    sendResponse({ ok: true, selectedTabId });
    return true;
  }

  if (raw?.type === "GET_STATUS") {
    sendResponse({ ok: true, status: lastStatus, selectedTabId });
    return true;
  }

  sendResponse({ ok: false, error: "INVALID_MESSAGE" });
  return false;
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  if (!selectedTabId) selectedTabId = activeInfo.tabId;
});
