const domains = document.querySelector("#domains");
const save = document.querySelector("#save");

chrome.storage.local.get(["allowDomains"]).then((r) => {
  domains.value = (r.allowDomains ?? []).join("\n");
});

save.addEventListener("click", async () => {
  const allowDomains = domains.value.split("\n").map((d) => d.trim()).filter(Boolean);
  await chrome.storage.local.set({ allowDomains });
  save.textContent = "Saved";
});
