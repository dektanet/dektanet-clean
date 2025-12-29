import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// توليد كود إحالة أرقام فقط
function generateReferralCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// قراءة ref من الرابط
function getReferralFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("ref"); // يرجّع null إذا ما فماش
}

export async function register(email, password, phone) {
  const refBy = getReferralFromURL(); // كود الإحالة إن وجد

  const userCredential =
    await createUserWithEmailAndPassword(auth, email, password);

  const user = userCredential.user;

  const myReferralCode = generateReferralCode();

  await setDoc(doc(db, "users", user.uid), {
    email,
    phone,

    referral: {
      code: myReferralCode,
      by: refBy || null,
      level1: 0,
      level2: 0
    },

    balances: {
      dekta: 0,
      babydekta: 0,
      dektabox: 0
    },

    box: {
      status: "inactive",
      activatedAt: null,
      expiresAt: null,
      level: "A"
    },

    createdAt: serverTimestamp()
  });

  return user;
}
