// ===============================
// HEADER LOADER (FINAL VERSION)
// ===============================

async function loadHeader() {
  try {
    const res = await fetch("header.html");
    if (!res.ok) throw new Error("header.html not found");

    const html = await res.text();
    document.body.insertAdjacentHTML("afterbegin", html);

    // LANGUAGE
    const select = document.getElementById("langSelect");
    if (select && typeof setLanguage === "function") {
      const savedLang = localStorage.getItem("lang") || "en";
      select.value = savedLang;
      select.addEventListener("change", e => {
        setLanguage(e.target.value);
      });
    }

    // AUTH UI (SAFE)
    if (typeof watchAuth === "function") {
      watchAuth(user => {
        const login = document.getElementById("loginLink");
        const logout = document.getElementById("logoutLink");

        if (user) {
          login.style.display = "none";
          logout.style.display = "inline";
          logout.onclick = () => logoutUser();
        } else {
          login.style.display = "inline";
          logout.style.display = "none";
        }
      });
    }

  } catch (err) {
    console.error("❌ Header load failed:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadHeader);
