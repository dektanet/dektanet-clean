import { applyTheme } from "./theme.js";
import { setLanguage, detectLanguage } from "./i18n.js";

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(localStorage.getItem("theme") || "light");
  setLanguage(detectLanguage());
});
