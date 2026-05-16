TimestampPrompt.init({
  id: "claude",
  inputSelectors: [
    "div.ProseMirror[contenteditable='true']",
    "div[contenteditable='true'][role='textbox']"
  ],
  sendSelectors: [
    "button[aria-label*='Send']",
    "button[aria-label*='send']",
    "fieldset button[type='button']:has(svg)"
  ]
});
