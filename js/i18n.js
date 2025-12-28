const translations = {
  en: {
    title: "DEKTANET Clean Version",
    subtitle: "Project initialized successfully",
    login: "Login",
    theme: "Change Theme"
  },
  ar: {
    title: "نسخة DEKTANET النظيفة",
    subtitle: "تم تشغيل المشروع بنجاح",
    login: "تسجيل الدخول",
    theme: "تغيير الثيم"
  }
};

export function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });
}

export function detectLanguage() {
  return localStorage.getItem("lang") || "en";
}
