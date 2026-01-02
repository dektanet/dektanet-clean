m// ================================
// REGISTER MODULE (CLEAN VERSION)
// ================================

import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================================
// REGISTER FUNCTION
// ================================
export async function registerUser({
  email,
  password,
  phone = "",
  referralCode = null
}) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // 1️⃣ Create auth user
  const cred = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = cred.user;

  // 2️⃣ Generate simple referral ID (numbers only)
  const referralId = Math.floor(
    1000000 + Math.random() * 9000000
  ).toString();

  // 3️⃣ Create user document in Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: email,
    phone: phone,

    // 🔗 Referral
    referralId: referralId,
    referredBy: referralCode || null,

    // 💰 Balances
    dekta: 0,
    babydekta: 0,
    dektaboxEarn: 30, // 🎁 Welcome bonus (assets – not withdrawable)

    // 📦 BOX
    boxActive: false,
    boxExpiresAt: null,

    // 🕒 Meta
    createdAt: serverTimestamp(),
    status: "active"
  });

  return user;
}
