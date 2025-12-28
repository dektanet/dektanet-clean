const themes = ["dark", "light", "purple"];
let currentTheme = localStorage.getItem("theme") || "dark";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  let index = themes.indexOf(currentTheme);
  currentTheme = themes[(index + 1) % themes.length];
  applyTheme(currentTheme);
}

applyTheme(currentTheme);
