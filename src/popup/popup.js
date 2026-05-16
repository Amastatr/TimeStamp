const enabledToggle = document.getElementById("enabled");
const statusLabel = document.getElementById("status-label");
const preview = document.getElementById("preview");
const openOptions = document.getElementById("open-options");

function pad(n) { return String(n).padStart(2, "0"); }

function tzAbbr(d) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" }).formatToParts(d);
  const tz = parts.find(p => p.type === "timeZoneName");
  return tz ? tz.value : "";
}

function formatPreview(settings, date = new Date()) {
  const Y = date.getFullYear();
  const M = pad(date.getMonth() + 1);
  const D = pad(date.getDate());
  const h = pad(date.getHours());
  const m = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  switch (settings.format) {
    case "us": {
      const hr12 = date.getHours() % 12 || 12;
      const ampm = date.getHours() < 12 ? "AM" : "PM";
      return `[${M}/${D}/${Y} ${pad(hr12)}:${m}:${s} ${ampm} ${tzAbbr(date)}]`;
    }
    case "eu": return `[${D}/${M}/${Y} ${h}:${m}:${s} ${tzAbbr(date)}]`;
    case "custom":
      return "[" + (settings.customFormat || "")
        .replace(/YYYY/g, Y).replace(/MM/g, M).replace(/DD/g, D)
        .replace(/HH/g, h).replace(/mm/g, m).replace(/ss/g, s)
        .replace(/TZ/g, tzAbbr(date)) + "]";
    default: return `[${Y}-${M}-${D} ${h}:${m}:${s} ${tzAbbr(date)}]`;
  }
}

function setStatus(on) {
  statusLabel.textContent = on ? "Enabled" : "Disabled";
  statusLabel.classList.toggle("on", on);
}

async function load() {
  const settings = await chrome.storage.sync.get(["enabled", "format", "customFormat"]);
  enabledToggle.checked = settings.enabled !== false;
  setStatus(enabledToggle.checked);
  preview.textContent = formatPreview({
    format: settings.format || "iso",
    customFormat: settings.customFormat
  });
}

enabledToggle.addEventListener("change", async () => {
  await chrome.storage.sync.set({ enabled: enabledToggle.checked });
  setStatus(enabledToggle.checked);
});

openOptions.addEventListener("click", () => chrome.runtime.openOptionsPage());

load();
