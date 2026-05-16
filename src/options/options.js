const DEFAULTS = {
  enabled: true,
  format: "iso",
  customFormat: "YYYY-MM-DD HH:mm:ss TZ",
  sites: { chatgpt: true, claude: true, gemini: true, grok: true }
};

const customInput = document.getElementById("customFormat");
const preview = document.getElementById("preview");
const savedIndicator = document.getElementById("saved-indicator");

function pad(n) { return String(n).padStart(2, "0"); }

function tzAbbr(d) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" }).formatToParts(d);
  const tz = parts.find(p => p.type === "timeZoneName");
  return tz ? tz.value : "";
}
function tzOffset(d) {
  const offMin = -d.getTimezoneOffset();
  const sign = offMin >= 0 ? "+" : "-";
  const abs = Math.abs(offMin);
  return `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

function formatTimestamp(format, customFormat, date = new Date()) {
  const Y = date.getFullYear();
  const M = pad(date.getMonth() + 1);
  const D = pad(date.getDate());
  const h = pad(date.getHours());
  const m = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  switch (format) {
    case "us": {
      const hr12 = date.getHours() % 12 || 12;
      const ampm = date.getHours() < 12 ? "AM" : "PM";
      return `[${M}/${D}/${Y} ${pad(hr12)}:${m}:${s} ${ampm} ${tzAbbr(date)}]`;
    }
    case "eu": return `[${D}/${M}/${Y} ${h}:${m}:${s} ${tzAbbr(date)}]`;
    case "custom":
      return "[" + (customFormat || "")
        .replace(/YYYY/g, Y).replace(/MM/g, M).replace(/DD/g, D)
        .replace(/HH/g, h).replace(/mm/g, m).replace(/ss/g, s)
        .replace(/TZ/g, tzAbbr(date)).replace(/ZZ/g, tzOffset(date)) + "]";
    default: return `[${Y}-${M}-${D} ${h}:${m}:${s} ${tzAbbr(date)}]`;
  }
}

function updatePreview() {
  const format = document.querySelector("input[name='format']:checked")?.value || "iso";
  preview.textContent = formatTimestamp(format, customInput.value);
  customInput.disabled = format !== "custom";
}

function flashSaved() {
  savedIndicator.textContent = "Saved";
  savedIndicator.classList.add("show");
  clearTimeout(flashSaved._t);
  flashSaved._t = setTimeout(() => savedIndicator.classList.remove("show"), 1000);
}

async function save() {
  const format = document.querySelector("input[name='format']:checked")?.value || "iso";
  const customFormat = customInput.value;
  const sites = {};
  for (const cb of document.querySelectorAll("input[data-site]")) {
    sites[cb.dataset.site] = cb.checked;
  }
  await chrome.storage.sync.set({ format, customFormat, sites });
  flashSaved();
}

async function load() {
  const stored = await chrome.storage.sync.get(null);
  const settings = {
    ...DEFAULTS,
    ...stored,
    sites: { ...DEFAULTS.sites, ...(stored.sites || {}) }
  };

  const radio = document.querySelector(`input[name='format'][value='${settings.format}']`);
  if (radio) radio.checked = true;
  customInput.value = settings.customFormat;
  for (const cb of document.querySelectorAll("input[data-site]")) {
    cb.checked = !!settings.sites[cb.dataset.site];
  }
  updatePreview();
}

document.querySelectorAll("input[name='format']").forEach(r =>
  r.addEventListener("change", () => { updatePreview(); save(); }));
customInput.addEventListener("input", () => { updatePreview(); save(); });
document.querySelectorAll("input[data-site]").forEach(cb =>
  cb.addEventListener("change", save));

load();

// Tick the preview each second so the seconds field doesn't look stale.
setInterval(updatePreview, 1000);
