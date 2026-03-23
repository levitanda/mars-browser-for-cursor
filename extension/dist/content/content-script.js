const ringBufferLimit = 200;
const consoleMessages = [];
const networkEvents = [];

function pushBounded(arr, value) {
  arr.push(value);
  if (arr.length > ringBufferLimit) arr.shift();
}

for (const level of ["log", "warn", "error"]) {
  const original = console[level];
  console[level] = (...args) => {
    pushBounded(consoleMessages, {
      level,
      args: args.map((arg) => String(arg)),
      ts: new Date().toISOString()
    });
    original.apply(console, args);
  };
}

const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  pushBounded(networkEvents, {
    url: String(args[0]),
    ok: response.ok,
    status: response.status,
    ts: new Date().toISOString()
  });
  return response;
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "COLLECT_PAGE_STATE") {
    sendResponse({
      url: location.href,
      title: document.title,
      text: document.body?.innerText?.slice(0, 8000) ?? "",
      html: document.documentElement.outerHTML.slice(0, 20000),
      consoleMessages,
      networkEvents
    });
  }
});
