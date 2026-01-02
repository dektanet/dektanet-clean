import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log("✅ register.js loaded");

const btn = document.getElementById("registerBtn");

btn.onclick = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!email || !password) {
    alert("Email و Password لازم");
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    await setDoc(doc(db, "users", user.uid), {
      email,
      phone,
      createdAt: serverTimestamp(),
      referralCode: Math.floor(100000 + Math.random() * 900000), // ID قصير
      balances: {
        dekta: 0,
        babydekta: 0,
        dektabox: 30 // 🎁 هدية ترحيب
      },
      box: {
        active: false,
        expiresAt: null
      }
    });

    alert("✅ تم إنشاء الحساب");
    window.location.href = "login.html";

  } catch (err) {
    alert("❌ " + err.message);
    console.error(err);
  }
};
