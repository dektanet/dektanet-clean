import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const email = document.getElementById("email");
const phone = document.getElementById("phone");
const btn = document.getElementById("registerBtn");

window.recaptchaVerifier = new RecaptchaVerifier(
  auth,
  "recaptcha-container",
  { size: "invisible" }
);

btn.onclick = async () => {
  try {

    // ✅ EMAIL REGISTER
    if (email.value) {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.value,
        "12345678" // مثال، بعد تنجّم تطوّرها
      );

      await createUserDoc(cred.user);
      location.href = "dashboard.html";
      return;
    }

    // ✅ PHONE REGISTER
    if (phone.value) {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phone.value,
        window.recaptchaVerifier
      );

      const code = prompt("Enter SMS code");
      const result = await confirmation.confirm(code);

      await createUserDoc(result.user);
      location.href = "dashboard.html";
    }

  } catch (e) {
    alert(e.message);
  }
};

async function createUserDoc(user) {
  await setDoc(doc(db, "users", user.uid), {
    email: user.email || null,
    phone: user.phoneNumber || null,

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
}
