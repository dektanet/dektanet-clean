import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const btn = document.getElementById("registerBtn");

// reCAPTCHA (required for phone auth)
window.recaptchaVerifier = new RecaptchaVerifier(
  auth,
  "recaptcha-container",
  { size: "invisible" }
);

btn.onclick = async () => {
  try {
    // ======================
    // EMAIL REGISTER
    // ======================
    if (emailInput && emailInput.value) {
      const password = "12345678"; // مؤقت
      const cred = await createUserWithEmailAndPassword(
        auth,
        emailInput.value,
        password
      );

      await createUserDoc(cred.user);
      window.location.href = "dashboard.html";
      return;
    }

    // ======================
    // PHONE REGISTER
    // ======================
    if (phoneInput && phoneInput.value) {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneInput.value,
        window.recaptchaVerifier
      );

      const code = prompt("Enter SMS code");
      const result = await confirmation.confirm(code);

      await createUserDoc(result.user);
      window.location.href = "dashboard.html";
      return;
    }

    alert("Enter email or phone number");
  } catch (e) {
    alert(e.message);
  }
};

// ======================
// CREATE USER MODEL
// ======================
async function createUserDoc(user) {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email || null,
    phone: user.phoneNumber || null,
    role: "user",

    balances: {
      dekta: 0,
      babyDekta: 0,
      dektaBox: 30 // 🎁 Welcome Bonus (NOT withdrawable)
    },

    box: {
      name: "DEKTA-BOX-WIN",
      status: "inactive", // inactive | active | expired
      level: "A",
      activatedAt: null,
      expiresAt: null
    },

    referral: {
      by: null,
      level1Count: 0,
      level2Count: 0,
      earned: {
        dekta: 0,
        dektaBox: 0
      }
    },

    withdraw: {
      paused: false
    },

    createdAt: serverTimestamp()
  });
}
