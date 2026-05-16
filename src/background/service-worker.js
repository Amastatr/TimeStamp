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

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.sync.get(null);
  const merged = { ...DEFAULT_SETTINGS, ...existing };
  merged.sites = { ...DEFAULT_SETTINGS.sites, ...(existing.sites || {}) };
  await chrome.storage.sync.set(merged);
});
