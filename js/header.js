// ===============================
// HEADER LOADER + AUTH BINDING
// ===============================

import { watchAuth, logout } from "./auth.js";

async function loadHeader() {
  try {
    // header.html في root
    const res = await fetch("/header.html");
    if (!res.ok) throw new Error("Header not found");

    const html = await res.text();
    document.body.insertAdjacentHTML("afterbegin", html);

    // عناصر
    const loginLink = document.getElementById("loginLink");
    const dashboardLink = document.getElementById("dashboardLink");
    const logoutBtn = document.getElementById("logoutBtn");

    // AUTH STATE
    watchAuth(user => {
      if (user) {
        // مسجّل
        loginLink.style.display = "none";
        dashboardLink.style.display = "inline";
        logoutBtn.style.display = "inline";
      } else {
        // موش مسجّل
        loginLink.style.display = "inline";
        dashboardLink.style.display = "none";
        logoutBtn.style.display = "none";
      }
    });

    // LOGOUT
    if (logoutBtn) {
      logoutBtn.addEventListener("click", e => {
        e.preventDefault();
        logout();
      });
    }

    // LANGUAGE (SAFE)
    const select = document.getElementById("langSelect");
    if (select && typeof setLanguage === "function") {
      select.value = localStorage.getItem("lang") || "en";
      select.addEventListener("change", e => {
        setLanguage(e.target.value);
      });
    }

  } catch (err) {
    console.error("❌ Header load failed:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadHeader);
