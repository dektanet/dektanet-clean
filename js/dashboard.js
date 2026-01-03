import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("userEmail").innerText =
    "Welcome: " + user.email;

  const refLink = `${location.origin}/register.html?ref=${user.uid}`;
  document.getElementById("refLink").value = refLink;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = snap.data();
    document.getElementById("dekta").innerText = data.dekta || 0;
    document.getElementById("baby").innerText = data.baby || 0;
  }
});

window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};
