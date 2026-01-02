import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// نستنّاو الصفحة تكمل تحميل
window.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("form");
  if (!form) {
    alert("Form not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // مهمّة برشا

    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim() || "";
    const referralCode = document.getElementById("referral")?.value.trim() || "";

    if (!email || !password) {
      alert("Email و Password إجباريين");
      return;
    }

    if (password.length < 6) {
      alert("كلمة السر لازمها 6 حروف على الأقل");
      return;
    }

    try {
      // 1️⃣ إنشاء حساب Auth
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      // 2️⃣ إنشاء User في Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        phone: phone,
        createdAt: serverTimestamp(),

        // 🎁 هدية ترحيب
        balances: {
          dektabox: 30,   // أصول مجانية
          dektaboxEarn: 0,
          babydekta: 0
        },

        box: {
          status: "inactive",   // ما فماش صندوق مفتوح
          type: null,
          activatedAt: null,
          expiresAt: null
        },

        referral: {
          code: Math.floor(100000 + Math.random() * 900000).toString(),
          by: referralCode || null,
          level1: 0,
          level2: 0
        },

        language: "ar"
      });

      // 3️⃣ تحويل مباشر للـ Login
      window.location.href = "login.html";

    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  });
});
