// =====================
// THEME SWITCHER
// =====================

const themes = ["dark", "light", "purple"];

function setTheme(theme) {
  if (theme === "dark") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  const current = localStorage.getItem("theme") || "dark";
  const index = themes.indexOf(current);
  const nextTheme = themes[(index + 1) % themes.length];
  setTheme(nextTheme);
}

// Load saved theme on page load
(function () {
  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);
})();
