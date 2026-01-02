import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

document.getElementById("registerBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", cred.user.uid), {
      email: email,
      dekta: 0,
      babyDekta: 0,
      boxActive: false,
      boxEverActivated: false,
      boxExpiresAt: null,
      role: "user",
      createdAt: serverTimestamp()
    });

    window.location.href = "dashboard.html";
  } catch (e) {
    alert(e.message);
  }
});
