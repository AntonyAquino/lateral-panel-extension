importScripts("apps.js");

const init = () => { chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }); syncRules(); };
chrome.runtime.onInstalled.addListener(init);
chrome.runtime.onStartup.addListener(init);

// Quita las cabeceras que impiden mostrar cada sitio dentro del panel (incluye los que agregues).
async function syncRules() {
  const apps = await loadApps();
  const domains = [...new Set(apps.map(a => { try { return new URL(a.url).hostname.replace(/^www\./, ""); } catch (e) { return null; } }).filter(Boolean))];
  const addRules = domains.length ? [{
    id: 100, priority: 1,
    action: { type: "modifyHeaders", responseHeaders: [
      { header: "x-frame-options", operation: "remove" },
      { header: "content-security-policy", operation: "remove" },
      { header: "content-security-policy-report-only", operation: "remove" }
    ]},
    condition: { resourceTypes: ["sub_frame"], requestDomains: domains }
  }] : [];
  try { await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [100], addRules }); } catch (e) { console.error(e); }
}
chrome.storage.onChanged.addListener((c, area) => { if (area === "local" && c.apps) syncRules(); });

const closePanel = async (windowId) => {
  try { await chrome.sidePanel.close({ windowId }); } catch (e) { console.error(e); }
};
chrome.commands.onCommand.addListener(async (cmd) => {
  if (cmd !== "close-panel") return;
  const w = await chrome.windows.getCurrent();
  closePanel(w.id);
});

async function openPopup(app) {
  const key = "popup_" + app.id;
  const saved = (await chrome.storage.session.get(key))[key];
  if (saved) { try { await chrome.windows.update(saved, { focused: true, drawAttention: true }); return; } catch (e) {} }
  const cur = await chrome.windows.getLastFocused();
  const width = 430;
  const win = await chrome.windows.create({
    url: app.url, type: "popup", width,
    height: Math.max(500, (cur.height || 800) - 60),
    left: (cur.left || 0) + (cur.width || 1200) - width - 10,
    top: (cur.top || 0) + 50
  });
  await chrome.storage.session.set({ [key]: win.id });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "popup") { openPopup(msg.app); return; }
  if (!sender.tab) return;
  if (msg?.type === "close") { closePanel(sender.tab.windowId).then(() => sendResponse({})); return true; }
  if (msg?.type !== "open" && msg?.type !== "manage") return;
  if (msg.type === "open" && msg.app?.popup) { openPopup(msg.app).then(() => sendResponse({})); return true; }
  // open() va primero y sin esperas: necesita el gesto del clic del usuario
  const p = chrome.sidePanel.open({ windowId: sender.tab.windowId });
  if (msg.type === "open") chrome.storage.local.set({ last: msg.app.id });
  else chrome.storage.local.set({ manage: Date.now() });
  p.then(() => sendResponse({ ok: true })).catch((e) => sendResponse({ error: String(e?.message || e) }));
  return true;
});
