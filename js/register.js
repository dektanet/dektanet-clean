import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const btn = document.getElementById("registerBtn");

btn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Email & password required");
    return;
  }

  try {
    // 1️⃣ Create Auth user
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    // 2️⃣ Create Firestore user document
    await setDoc(doc(db, "users", uid), {
      email,

      balances: {
        dekta: 0,
        babydekta: 0
      },

      card: {
        status: "NOT_ACTIVE",
        activatedAt: null,
        expiresAt: null
      },

      referral: {
        by: null,
        level1Count: 0,
        level2Count: 0
      },

      role: "user",
      createdAt: serverTimestamp()
    });

    // 3️⃣ Redirect
    window.location.href = "dashboard.html";

  } catch (err) {
    alert(err.message);
  }
});
