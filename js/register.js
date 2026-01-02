// =============================
// REGISTER MODULE (FIXED)
// =============================

import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log("✅ register.js loaded");

const btn = document.getElementById("registerBtn");

btn.addEventListener("click", async () => {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("❌ Email & Password required");
    return;
  }

  try {
    // 1️⃣ Create Auth user
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // 2️⃣ Create Firestore user
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "user",
      createdAt: serverTimestamp(),

      // balances
      dekta: 0,
      babyDekta: 0,
      dektaboxEarn: 30, // welcome gift

      // box
      boxActive: false,
      boxExpiresAt: null,

      // referral
      referralCode: user.uid.slice(0, 8),
      referredBy: ""
    });

    alert("✅ Account created + Firestore OK");

    // 3️⃣ redirect
    window.location.href = "login.html";

  } catch (e) {
    console.error(e);
    alert("🔥 ERROR: " + e.message);
  }

});
