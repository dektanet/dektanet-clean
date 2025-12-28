// Language system (GLOBAL)

let currentLang = "en";

const translations = {
  en: {
    title: "DEKTANET Clean Version",
    subtitle: "Project initialized successfully",
    login: "Login",
    theme: "Change Theme"
  },
  fr: {
    title: "Version Propre DEKTANET",
    subtitle: "Projet initialisé avec succès",
    login: "Connexion",
    theme: "Changer le thème"
  },
  ar: {
    title: "النسخة النظيفة DEKTANET",
    subtitle: "تم تهيئة المشروع بنجاح",
    login: "تسجيل الدخول",
    theme: "تغيير المظهر"
  }
};

export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });
}

export function detectLanguage() {
  return (
    localStorage.getItem("lang") ||
    navigator.language.slice(0, 2) ||
    "en"
  );
}
