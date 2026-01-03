import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));
  const data = snap.data();

  document.getElementById("user-email").innerText = user.email;
  document.getElementById("dekta").innerText = data.dekta;
  document.getElementById("babyDekta").innerText = data.babyDekta;
  document.getElementById("role").innerText = data.role;
});

logout.addEventListener("click", async () => {
  await signOut(auth);
  location.href = "login.html";
});
