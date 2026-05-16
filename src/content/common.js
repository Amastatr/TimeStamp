// Shared by every site content script. Site files call TimestampPrompt.init(config).
// Loaded into the isolated world via manifest.json content_scripts.
globalThis.TimestampPrompt = (() => {
  const DEFAULTS = {
    enabled: true,
    format: "iso",
    customFormat: "YYYY-MM-DD HH:mm:ss TZ",
    sites: { chatgpt: true, claude: true, gemini: true, grok: true }
  };

  let settings = { ...DEFAULTS };
  let activeConfig = null;

  function pad(n) { return String(n).padStart(2, "0"); }

  function tzAbbr(date) {
    // "America/Chicago" → "CDT" via Intl.DateTimeFormat tokens
    const parts = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" }).formatToParts(date);
    const tz = parts.find(p => p.type === "timeZoneName");
    return tz ? tz.value : "";
  }

  function tzOffset(date) {
    const offMin = -date.getTimezoneOffset();
    const sign = offMin >= 0 ? "+" : "-";
    const abs = Math.abs(offMin);
    return `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
  }

  function formatTimestamp(date = new Date()) {
    const Y = date.getFullYear();
    const M = pad(date.getMonth() + 1);
    const D = pad(date.getDate());
    const h = pad(date.getHours());
    const m = pad(date.getMinutes());
    const s = pad(date.getSeconds());

    switch (settings.format) {
      case "iso":
        return `[${Y}-${M}-${D} ${h}:${m}:${s} ${tzAbbr(date)}]`;
      case "us": {
        const hr12 = date.getHours() % 12 || 12;
        const ampm = date.getHours() < 12 ? "AM" : "PM";
        return `[${M}/${D}/${Y} ${pad(hr12)}:${m}:${s} ${ampm} ${tzAbbr(date)}]`;
      }
      case "eu":
        return `[${D}/${M}/${Y} ${h}:${m}:${s} ${tzAbbr(date)}]`;
      case "custom":
        return `[${applyCustom(settings.customFormat, date)}]`;
      default:
        return `[${Y}-${M}-${D} ${h}:${m}:${s} ${tzAbbr(date)}]`;
    }
  }

  function applyCustom(fmt, d) {
    return fmt
      .replace(/YYYY/g, d.getFullYear())
      .replace(/MM/g, pad(d.getMonth() + 1))
      .replace(/DD/g, pad(d.getDate()))
      .replace(/HH/g, pad(d.getHours()))
      .replace(/mm/g, pad(d.getMinutes()))
      .replace(/ss/g, pad(d.getSeconds()))
      .replace(/TZ/g, tzAbbr(d))
      .replace(/ZZ/g, tzOffset(d));
  }

  function prependToTextarea(el, text) {
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set;
    setter.call(el, text + el.value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function prependToContentEditable(el, text) {
    el.focus();
    const sel = window.getSelection();
    const range = document.createRange();
    range.setStart(el, 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    // execCommand is deprecated but remains the most reliable way to insert
    // text into a contenteditable that React/ProseMirror is observing.
    document.execCommand("insertText", false, text);
  }

  function prepend(el, text) {
    if (el.tagName === "TEXTAREA") prependToTextarea(el, text);
    else prependToContentEditable(el, text);
  }

  function findInput() {
    for (const sel of activeConfig.inputSelectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function findSendButton() {
    for (const sel of activeConfig.sendSelectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function siteEnabled() {
    return settings.enabled && settings.sites[activeConfig.id];
  }

  let recentlyHandled = false;
  function markHandled() {
    recentlyHandled = true;
    setTimeout(() => { recentlyHandled = false; }, 300);
  }

  function isInsideInput(target) {
    const input = findInput();
    if (!input) return false;
    return input === target || input.contains(target);
  }

  function onKeydown(e) {
    if (recentlyHandled) return;
    if (e.key !== "Enter" || e.shiftKey || e.isComposing) return;
    if (!siteEnabled()) return;
    if (!isInsideInput(e.target)) return;

    const input = findInput();
    if (!input) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    prepend(input, formatTimestamp() + " ");
    markHandled();

    // Replay the submit. Some sites need a tick for their state to update
    // before the send button reflects the new content.
    setTimeout(() => {
      const btn = findSendButton();
      if (btn && !btn.disabled) {
        btn.click();
      } else {
        const ev = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
        input.dispatchEvent(ev);
      }
    }, 30);
  }

  function onClick(e) {
    if (recentlyHandled) return;
    if (!siteEnabled()) return;

    const btn = findSendButton();
    if (!btn) return;
    if (e.target !== btn && !btn.contains(e.target)) return;

    const input = findInput();
    if (!input) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    prepend(input, formatTimestamp() + " ");
    markHandled();
    setTimeout(() => btn.click(), 30);
  }

  async function loadSettings() {
    const stored = await chrome.storage.sync.get(null);
    settings = {
      ...DEFAULTS,
      ...stored,
      sites: { ...DEFAULTS.sites, ...(stored.sites || {}) }
    };
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    for (const [k, { newValue }] of Object.entries(changes)) {
      if (k === "sites") settings.sites = { ...DEFAULTS.sites, ...newValue };
      else settings[k] = newValue;
    }
  });

  async function init(config) {
    activeConfig = config;
    await loadSettings();
    document.addEventListener("keydown", onKeydown, true);
    document.addEventListener("click", onClick, true);
  }

  return { init, formatTimestamp };
})();
