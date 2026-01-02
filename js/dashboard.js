// ==============================
// DASHBOARD MODULE
// ==============================

import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Protect page
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();

  document.getElementById("dekta").innerText = data.dekta || 0;
  document.getElementById("baby").innerText = data.babydekta || 0;
  document.getElementById("boxEarn").innerText = data.dektabox || 30;

  document.getElementById("boxStatus").innerText =
    data.boxActive ? "ACTIVE" : "INACTIVE";
});

// Logout
document.getElementById("logoutBtn").onclick = async () => {
  await signOut(auth);
  window.location.href = "login.html";
};

// Activate box (logic later)
document.getElementById("activateBoxBtn").onclick = () => {
  alert("🔑 Box activation logic next step");
};
