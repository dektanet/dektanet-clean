// Global settings loader

document.addEventListener("DOMContentLoaded", () => {
  // Theme
  applyTheme(localStorage.getItem("theme") || "dark");

  // Language
  setLanguage(detectLanguage());
});
