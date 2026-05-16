TimestampPrompt.init({
  id: "chatgpt",
  inputSelectors: [
    "#prompt-textarea",
    "div[contenteditable='true'][data-virtualkeyboard='true']",
    "textarea[data-id='root']"
  ],
  sendSelectors: [
    "button[data-testid='send-button']",
    "button[aria-label*='Send']",
    "button[aria-label*='send']"
  ]
});
