// ================================
// REGISTER MODULE (CLEAN)
// ================================

import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log("✅ register.js loaded");

const btn = document.getElementById("registerBtn");

btn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("❌ Email & password required");
    return;
  }

  try {
    // 🔐 Create Auth user
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // 🧾 Create Firestore user doc
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: serverTimestamp(),

      // 🔰 DEFAULT VALUES (حسب المنطق متاعنا)
      dekta: 0,
      babydekta: 0,
      dektaboxEarn: 30, // 🎁 Welcome bonus
      boxActive: false,
      boxExpiresAt: null,
      referralCode: user.uid.slice(0, 8) // code إحالة بسيط
    });

    alert("✅ Account created successfully");

    // 🔁 Redirect
    window.location.href = "login.html";

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});
