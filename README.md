# TimeStamp · The Optimizers

Prepends the current date, time, and timezone to every prompt you
send to ChatGPT, Claude, Gemini, and Grok.

Typing `summarize this` and hitting Enter actually submits:
`[2026-05-15 14:32:07 CDT] summarize this`

Everything runs locally. No network requests, no analytics, no
tracking. Settings sync through your Chrome profile.

## Supported sites
ChatGPT (chatgpt.com, chat.openai.com) · Claude (claude.ai) ·
Gemini (gemini.google.com) · Grok (grok.com)

## Install (unpacked)
1. Open chrome://extensions
2. Turn on Developer mode (top right)
3. Click Load unpacked and select the timestamp-extension folder
4. Pin the icon for one-click access to the popup

## Settings
The popup holds the global on/off and a live preview. The options
page holds the format picker (ISO, US, EU, or custom), a custom
token string (YYYY, MM, DD, HH, mm, ss, TZ, ZZ), and per-site
toggles.

## Behavior
The stamp is added once, at the moment you send, Enter without
Shift or the Send button, and your message goes through as normal.
Composition input (IME) is left alone so Japanese and Chinese
typing never breaks.

## Honest limits
These sites redraw their composers every few months. If stamping
silently stops on one site, its selectors in src/content/ need a
one-line update. Voice and dictation submits are not intercepted.

## Icons

A graphite tile with a white JetBrains Mono "T" framed by crimson bracket ticks, bundled in `icons/` at 16, 32, 48, and 128 px. The bracket is the mark the Optimizers share; GeoStamp carries the same tile with a "G". The tiles are transparent outside the rounded shape, so they sit cleanly on a light or dark toolbar, and the ticks drop away at 16 px to keep the letter crisp. To use your own art, replace the four PNGs in `icons/` at the same sizes; no manifest change is needed.

## Privacy

Everything runs in your browser. No network requests of its own, no analytics, no telemetry. The only data stored is your settings, via Chrome's `storage.sync`, which Chrome syncs through your Google account. Your prompt text is never stored or transmitted by the extension. Full details: [PRIVACY.md](PRIVACY.md).

## License

MIT. See [LICENSE](LICENSE).

## The Optimizers
One of three sibling extensions, TimeStamp, GeoStamp, and
FileStamp, by Amastatr Innovation Haus, sharing one discipline:
stamps fire once, on send only, and everything stays local.
