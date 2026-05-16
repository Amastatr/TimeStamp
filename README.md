# Timestamp Prompt

A Chrome extension (Manifest V3) that prepends the current date, time, and timezone to every prompt you send to ChatGPT, Claude, Gemini, and Grok.

Example: typing `summarize this` and hitting Enter actually submits `[2026-05-15 14:32:07 CDT] summarize this`.

Everything runs locally. No network requests, no analytics, no tracking. Settings sync via your Chrome profile.

## Supported sites

- ChatGPT — `chatgpt.com`, `chat.openai.com`
- Claude — `claude.ai`
- Gemini — `gemini.google.com`
- Grok — `grok.com`

## Install (developer mode)

1. Open `chrome://extensions`
2. Toggle **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `C:\dev\timestamp-extension` folder

The puzzle-piece icon will appear in the toolbar. Pin it for one-click access to the popup.

## File layout

```
manifest.json                 MV3 declaration: permissions, content scripts, popup, options
README.md
src/
  background/service-worker.js   Seeds default settings on install
  content/
    common.js                    Shared logic: timestamp formatting, text insertion, event interception
    chatgpt.js                   Per-site selectors for chatgpt.com / chat.openai.com
    claude.js                    Per-site selectors for claude.ai
    gemini.js                    Per-site selectors for gemini.google.com
    grok.js                      Per-site selectors for grok.com
  popup/
    popup.html / .css / .js      Toolbar popup: global on/off toggle + live preview
  options/
    options.html / .css / .js    Settings page: format picker, custom token string, per-site toggles
```

## Settings shape (`chrome.storage.sync`)

```js
{
  enabled: true,
  format: "iso" | "us" | "eu" | "custom",
  customFormat: "YYYY-MM-DD HH:mm:ss TZ",
  sites: { chatgpt: true, claude: true, gemini: true, grok: true }
}
```

## Custom format tokens

| Token | Meaning             | Example  |
|-------|---------------------|----------|
| YYYY  | 4-digit year        | 2026     |
| MM    | Zero-padded month   | 05       |
| DD    | Zero-padded day     | 15       |
| HH    | 24-hour hour        | 14       |
| mm    | Minute              | 32       |
| ss    | Second              | 07       |
| TZ    | Timezone abbrev.    | CDT      |
| ZZ    | UTC offset          | -05:00   |

## How submission interception works

The content script attaches `keydown` and `click` listeners to `document` at the **capture phase** with `useCapture = true`. When the user hits Enter (no Shift) inside the prompt field, or clicks the Send button:

1. The handler runs *before* the page's own listeners.
2. It calls `preventDefault()` + `stopImmediatePropagation()` to swallow the original submit.
3. It prepends the formatted timestamp to the input.
4. It re-triggers the submit by clicking the Send button (or replaying Enter as a fallback).

A short cooldown flag (`recentlyHandled`) prevents re-entry when our own click triggers the listener again.

## Text insertion strategy

- **`<textarea>`** (e.g., Grok): uses the native value setter so React's `onChange` fires.
- **`contenteditable` div** (ChatGPT, Claude, Gemini): uses `document.execCommand("insertText", ...)`. It's deprecated but is still the most reliable way to insert text that ProseMirror/Quill/Slate-style editors actually see.

## Known caveats

- Selectors target the current DOM. These sites ship UI changes frequently — if interception silently stops working, the selectors in `src/content/<site>.js` need updating. Use DevTools to find the new prompt field and update its entry.
- Composition input (IME) is ignored to avoid breaking Japanese/Chinese typing.
- Only Enter-to-submit and Send-button click are intercepted. Voice/dictation submits are not.

## Icons

No icons are bundled yet. Chrome will show a default puzzle-piece. To add icons, drop `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png` into `icons/` and add this to `manifest.json`:

```json
"icons": {
  "16":  "icons/icon16.png",
  "32":  "icons/icon32.png",
  "48":  "icons/icon48.png",
  "128": "icons/icon128.png"
},
"action": {
  "default_icon": { "16": "icons/icon16.png", "32": "icons/icon32.png" },
  ...
}
```
