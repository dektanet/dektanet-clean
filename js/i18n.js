const translations = {
  en: {
    title: "DEKTANET Clean Version",
    subtitle: "Project initialized successfully",
    login: "Login",
    theme: "Change Theme"
  },
  ar: {
    title: "النسخة النظيفة DEKTANET",
    subtitle: "تم تشغيل المشروع بنجاح",
    login: "تسجيل الدخول",
    theme: "تغيير النمط"
  }
};

function applyLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang] && translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });

  document.documentElement.lang = lang;
}

function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  applyLanguage(lang);
}

function detectLanguage() {
  return localStorage.getItem("lang") || "en";
}

document.addEventListener("DOMContentLoaded", () => {
  const lang = detectLanguage();
  applyLanguage(lang);

  const select = document.getElementById("langSelect");
  if (select) {
    select.value = lang;
    select.onchange = e => setLanguage(e.target.value);
  }
});
