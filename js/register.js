// ===============================
// REGISTER MODULE – DEKTANET CLEAN
// ===============================

import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log("✅ register.js loaded");

const btn = document.getElementById("registerBtn");

if (!btn) {
  alert("Register button not found");
}

btn.addEventListener("click", async () => {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const referralInput = document.getElementById("referral")?.value.trim();

  if (!email || !password) {
    alert("❌ Email & password required");
    return;
  }

  try {
    // 1️⃣ Create Auth user
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // 2️⃣ Handle referral
    let referredBy = "";
    if (referralInput) {
      const q = query(
        collection(db, "users"),
        where("referralCode", "==", referralInput)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        referredBy = snap.docs[0].id;
      }
    }

    // 3️⃣ Generate referral code
    const referralCode =
      "DEKTA" + Math.floor(100000 + Math.random() * 900000);

    // 4️⃣ Create Firestore user document
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      role: "user",

      createdAt: serverTimestamp(),

      // balances
      dekta: 0,
      babyDekta: 0,
      dektaboxEarn: 30, // 🎁 welcome gift (non withdrawable)

      // box
      boxActive: false,
      boxExpiresAt: null,

      // referral
      referralCode: referralCode,
      referredBy: referredBy
    });

    alert("✅ Account created successfully");
    window.location.href = "login.html";

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});
