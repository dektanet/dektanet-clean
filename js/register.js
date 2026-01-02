// js/register.js
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const btn = document.getElementById("registerBtn");

btn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Email & password required");
    return;
  }

  try {
    // 1️⃣ Create Auth user
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // 2️⃣ Create Firestore user (THIS WAS MISSING ❌)
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "user",
      createdAt: serverTimestamp(),

      // balances
      dekta: 0,
      babyDekta: 0,

      // welcome gift
      dektaboxEarn: 30,

      // box
      boxActive: false,
      boxExpiresAt: null,

      // referral
      referralCode: user.uid.slice(0, 8),
      referredBy: ""
    });

    alert("Account created");
    window.location.href = "login.html";

  } catch (e) {
    alert(e.message);
  }
});
