document.addEventListener("DOMContentLoaded", () => {
  // Theme
  applyTheme(localStorage.getItem("theme") || "dark");

  // Language
  setLanguage(localStorage.getItem("lang") || currentLang);
});
