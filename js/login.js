// ==============================
// LOGIN MODULE (CLEAN)
// ==============================

import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

console.log("✅ login.js loaded");

const btn = document.getElementById("loginBtn");

btn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("❌ Email & password required");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);

    alert("✅ Login successful");

    // Redirect to dashboard
    window.location.href = "dashboard.html";

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});
