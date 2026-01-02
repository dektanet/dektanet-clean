// ===============================
// DASHBOARD MODULE (CLEAN)
// ===============================

import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// DOM
const dektaEl = document.getElementById("dektaBalance");
const babyDektaEl = document.getElementById("babyDektaBalance");
const boxStatusEl = document.getElementById("boxStatus");

// ===============================
// LOAD DASHBOARD DATA
// ===============================
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    // موش مسجل
    window.location.href = "login.html";
    return;
  }

  try {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      alert("User not found in Firestore");
      return;
    }

    const data = snap.data();

    // BALANCES
    if (dektaEl) {
      dektaEl.textContent = data.dekta ?? 0;
    }

    if (babyDektaEl) {
      babyDektaEl.textContent = data.babyDekta ?? 0;
    }

    // BOX STATUS
    if (boxStatusEl) {
      boxStatusEl.textContent = data.boxActive ? "ACTIVE" : "INACTIVE";
    }

  } catch (err) {
    console.error(err);
    alert("Dashboard load error");
  }
});
