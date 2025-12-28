// Global settings loader

import { applyTheme } from "./theme.js";
import { setLanguage, detectLanguage } from "./i18n.js";

document.addEventListener("DOMContentLoaded", () => {
  // Theme
  applyTheme(localStorage.getItem("theme") || "dark");

  // Language
  setLanguage(detectLanguage());
});
