TimestampPrompt.init({
  id: "grok",
  inputSelectors: [
    "textarea[aria-label*='Ask']",
    "textarea[placeholder*='Ask']",
    "textarea",
    "div[contenteditable='true']"
  ],
  sendSelectors: [
    "button[aria-label*='Submit']",
    "button[type='submit']",
    "button[aria-label*='Send']"
  ]
});
