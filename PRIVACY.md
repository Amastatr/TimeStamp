# Privacy Policy — Timestamp Prompt

**Effective date:** June 25, 2026

Timestamp Prompt is a browser extension that prepends the current date, time, and timezone to the message you submit on supported AI chat sites (ChatGPT, Claude, Gemini, and Grok).

## What the extension does with your data

When you send a message on a supported site, the extension reads the text already in the message box and adds a timestamp to the front of it, in your browser, before the site receives it. That modified text is then sent by you to the AI site you chose. The extension itself sends nothing anywhere.

- It makes no network requests of its own.
- It contains no analytics, tracking, or telemetry.
- It does not transmit your prompts, your text, or any usage data to the developer or to any third party.

The text of your messages is never stored. The extension reads it only at the moment of sending, to add the timestamp, and keeps no copy.

## What is stored, and where

The extension stores only your settings: whether it is on or off, your chosen timestamp format, your custom format string, and the per-site on/off toggles. These settings are saved with Chrome's `storage.sync` API, which means Chrome syncs them across the browsers where you are signed in to the same Google account. That sync is handled by Google as part of Chrome, under Google's own terms; the developer has no access to it.

## Permissions and why they are used

- `storage` — to save the settings described above.
- Host access to `chatgpt.com`, `chat.openai.com`, `claude.ai`, `gemini.google.com`, and `grok.com` — so the extension can run on those pages and insert the timestamp into the message box. The extension runs only on these sites.

## Your control

You can disable the extension globally or per site from its popup and options page at any time. Removing the extension deletes it; clearing Chrome synced data removes the stored settings.

## Contact

Questions about this policy: `<your-contact-email>`

## Changes

If this policy changes, the updated version will be posted at this URL with a new effective date.
