// ================= HEADER LOADER (SMART) =================

import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

async function loadHeader() {
  try {
    const res = await fetch("/header.html");
    if (!res.ok) throw new Error("Header not found");

    const html = await res.text();
    document.body.insertAdjacentHTML("afterbegin", html);

    setupHeaderLogic();

  } catch (err) {
    console.error("❌ Header load failed:", err);
  }
}

function setupHeaderLogic() {
  const nav = document.getElementById("navLinks");
  const logoutBtn = document.getElementById("logoutBtn");

  // auth state
  onAuthStateChanged(auth, user => {
    if (user) {
      // LOGGED IN
      nav.innerHTML = `
        <a href="index.html">Home</a>
        <a href="dashboard.html">Dashboard</a>
      `;
      logoutBtn.style.display = "inline-block";
    } else {
      // LOGGED OUT
      nav.innerHTML = `
        <a href="index.html">Home</a>
        <a href="login.html">Login</a>
      `;
      logoutBtn.style.display = "none";
    }
  });

  // logout
  logoutBtn.onclick = async () => {
    await signOut(auth);
    window.location.href = "login.html";
  };

  // language
  const select = document.getElementById("langSelect");
  if (select && typeof setLanguage === "function") {
    select.value = localStorage.getItem("lang") || "en";
    select.onchange = e => setLanguage(e.target.value);
  }
}

document.addEventListener("DOMContentLoaded", loadHeader);
