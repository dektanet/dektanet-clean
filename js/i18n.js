// i18n - language system
let currentLang = "en";

export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  console.log("Language set to", lang);
}

export function getLanguage() {
  return localStorage.getItem("lang") || "en";
}
