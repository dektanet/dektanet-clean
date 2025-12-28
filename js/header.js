import { auth } from "./firebase.js";
import { logout } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

async function loadHeader() {
  const res = await fetch("/dektanet-clean/header.html");
  const html = await res.text();
  document.body.insertAdjacentHTML("afterbegin", html);

  const nav = document.getElementById("navLinks");
  const logoutBtn = document.getElementById("logoutBtn");

  onAuthStateChanged(auth, user => {
    if (user) {
      nav.innerHTML = `
        <a href="index.html">Home</a>
        <a href="dashboard.html">Dashboard</a>
      `;
      logoutBtn.style.display = "inline-block";
    } else {
      nav.innerHTML = `
        <a href="index.html">Home</a>
        <a href="login.html">Login</a>
        <a href="register.html">Register</a>
      `;
      logoutBtn.style.display = "none";
    }
  });

  logoutBtn.onclick = async () => {
    await logout();
    window.location.href = "login.html";
  };
}

document.addEventListener("DOMContentLoaded", loadHeader);
