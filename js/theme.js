// Theme system (GLOBAL)

const themes = ["dark", "light", "purple"];

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  let current = localStorage.getItem("theme") || "dark";
  let index = themes.indexOf(current);
  let next = themes[(index + 1) % themes.length];
  applyTheme(next);
}

// Apply theme on load
applyTheme(localStorage.getItem("theme") || "dark");
