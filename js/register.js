import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", cred.user.uid), {
      email: email,
      createdAt: new Date(),
      balances: {
        dekta: 0,
        babydekta: 0
      },
      box: {
        status: "inactive"
      },
      referral: {
        code: Math.floor(100000 + Math.random() * 900000).toString(),
        by: "",
        level1: 0,
        level2: 0
      }
    });

    alert("Account created successfully ✅");
    window.location.href = "login.html";

  } catch (err) {
    alert(err.message);
  }
});
