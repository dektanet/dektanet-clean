import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

async function loadHeader() {
  try {
    const res = await fetch("./header.html");
    if (!res.ok) throw new Error("header.html not found");

    document.body.insertAdjacentHTML("afterbegin", await res.text());
    setupHeader();
  } catch (e) {
    console.error("Header error:", e);
  }
}

function setupHeader() {
  const nav = document.getElementById("navLinks");
  const logoutBtn = document.getElementById("logoutBtn");

  onAuthStateChanged(auth, user => {
    if (user) {
      nav.innerHTML = `
        <a href="index.html">Home</a>
        <a href="#">Dashboard</a>
      `;
      logoutBtn.style.display = "inline-block";
    } else {
      nav.innerHTML = `
        <a href="index.html">Home</a>
        <a href="login.html">Login</a>
      `;
      logoutBtn.style.display = "none";
    }
  });

  logoutBtn.onclick = async () => {
    await signOut(auth);
    location.href = "login.html";
  };

  const select = document.getElementById("langSelect");
  if (select && window.setLanguage) {
    select.value = localStorage.getItem("lang") || "en";
    select.onchange = e => setLanguage(e.target.value);
  }
}

document.addEventListener("DOMContentLoaded", loadHeader);
