const DEFAULT_SETTINGS = {
  enabled: true,
  format: "iso",
  customFormat: "YYYY-MM-DD HH:mm:ss TZ",
  sites: {
    chatgpt: true,
    claude: true,
    gemini: true,
    grok: true
  }
};

// Toolbar state badge: always shows state using the AI Contextualizers suite tokens.
// ON = "ON" on #188038; OFF = "OFF" on #C8102E; white text in both.
function applyBadge(enabled) {
  chrome.action.setBadgeTextColor({ color: "#FFFFFF" });
  if (enabled) {
    chrome.action.setBadgeBackgroundColor({ color: "#188038" });
    chrome.action.setBadgeText({ text: "ON" });
  } else {
    chrome.action.setBadgeBackgroundColor({ color: "#C8102E" });
    chrome.action.setBadgeText({ text: "OFF" });
  }
}

async function refreshBadge() {
  const { enabled } = await chrome.storage.sync.get("enabled");
  applyBadge(enabled !== false);
}

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.sync.get(null);
  const merged = { ...DEFAULT_SETTINGS, ...existing };
  merged.sites = { ...DEFAULT_SETTINGS.sites, ...(existing.sites || {}) };
  await chrome.storage.sync.set(merged);
  applyBadge(merged.enabled !== false);
});

chrome.runtime.onStartup.addListener(refreshBadge);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.enabled) {
    applyBadge(changes.enabled.newValue !== false);
  }
});

// Also set the badge whenever the service worker spins up.
refreshBadge();

