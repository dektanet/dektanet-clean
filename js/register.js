import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const btn = document.getElementById("registerBtn");
const msg = document.getElementById("msg");

btn.onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", cred.user.uid), {
      email: email,
      role: "user",
      dekta: 0,
      babyDekta: 0,
      boxActive: false,
      createdAt: new Date()
    });

    msg.innerText = "✅ Registered successfully";

  } catch (e) {
    msg.innerText = e.message;
  }
};
