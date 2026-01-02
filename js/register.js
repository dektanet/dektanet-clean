// js/register.js
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const btn = document.getElementById("registerBtn");

btn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Email & Password required");
    return;
  }

  try {
    // 1️⃣ Create Auth user
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // 2️⃣ Create Firestore user document
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "user",

      dekta: 30,
      babyDekta: 0,
      dektaboxEarn: 30,

      boxActive: false,
      boxEverActivated: false,
      boxExpiresAt: null,

      referralCode: user.uid.slice(0, 8),
      referredBy: "",

      createdAt: serverTimestamp()
    });

    alert("✅ Account created");
    window.location.href = "login.html";

  } catch (e) {
    console.error(e);
    alert(e.message);
  }
});
