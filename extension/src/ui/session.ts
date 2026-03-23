const target = document.querySelector("#data") as HTMLPreElement;

async function run() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  const result = await chrome.tabs.sendMessage(tab.id, { type: "COLLECT_PAGE_STATE" });
  target.textContent = JSON.stringify(result, null, 2);
}

run().catch((error) => {
  target.textContent = String(error);
});
