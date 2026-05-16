TimestampPrompt.init({
  id: "gemini",
  inputSelectors: [
    "rich-textarea div.ql-editor[contenteditable='true']",
    "div.ql-editor[contenteditable='true']",
    "div[contenteditable='true'][role='textbox']"
  ],
  sendSelectors: [
    "button.send-button",
    "button[aria-label*='Send message']",
    "button[mattooltip*='Send']"
  ]
});
