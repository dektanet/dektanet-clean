import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.getElementById("registerBtn").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      createdAt: Date.now(),
      balances: {
        dekta: 0,
        babydekta: 0
      },
      referral: {
        code: Math.floor(100000 + Math.random() * 900000).toString(),
        by: "",
        level1: 0,
        level2: 0
      }
    });

    alert("Registered successfully");
    window.location.href = "login.html";
  } catch (e) {
    alert(e.message);
  }
};
