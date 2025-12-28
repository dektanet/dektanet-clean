// ===============================
// HEADER LOADER (CLEAN + SAFE)
// ===============================

async function loadHeader() {
  try {
    // header.html موجود في root
    const res = await fetch("/header.html");
    if (!res.ok) throw new Error("Header not found");

    const html = await res.text();

    document.body.insertAdjacentHTML("afterbegin", html);

    // Language select (SAFE)
    const select = document.getElementById("langSelect");
    if (select && typeof setLanguage === "function") {
      const savedLang = localStorage.getItem("lang") || "en";
      select.value = savedLang;

      select.addEventListener("change", e => {
        setLanguage(e.target.value);
      });
    }

  } catch (err) {
    console.error("❌ Header load failed:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadHeader);
