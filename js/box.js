// ===============================
// BOX MODULE - DEKTANET CLEAN
// ===============================

import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// DOM
const statusEl = document.getElementById("boxStatus");
const countdownEl = document.getElementById("countdown");
const activateBtn = document.getElementById("activateBoxBtn");
const renewBtn = document.getElementById("renewBoxBtn");

// Utils
function daysBetween(ts) {
  const now = new Date();
  const end = ts.toDate();
  const diff = end - now;
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
}

// Load box
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();

  // STATUS
  if (data.boxActive && data.boxExpiresAt) {
    const days = daysBetween(data.boxExpiresAt);
    if (days > 0) {
      statusEl.textContent = "ACTIVE";
      countdownEl.textContent = days + " days";
    } else {
      statusEl.textContent = "CLOSED";
      countdownEl.textContent = "Expired";
    }
  } else {
    statusEl.textContent = "INACTIVE";
    countdownEl.textContent = "-";
  }
});

// ===============================
// ACTIVATE BOX (FIRST TIME)
// ===============================
activateBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const data = snap.data();

  if (data.boxActive) {
    alert("❌ Box already active");
    return;
  }

  if ((data.dektaboxEarn || 0) < 30) {
    alert("❌ Not enough DEKTABOX");
    return;
  }

  const expires = Timestamp.fromDate(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );

  await updateDoc(ref, {
    dektaboxEarn: increment(-30),
    boxActive: true,
    boxExpiresAt: expires,
    boxActivatedAt: serverTimestamp()
  });

  alert("✅ Box activated (30 days)");
  location.reload();
});

// ===============================
// RENEW BOX (10$ KEY)
// ===============================
renewBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const data = snap.data();

  if ((data.dekta || 0) < 10) {
    alert("❌ Not enough DEKTA (10$ required)");
    return;
  }

  const expires = Timestamp.fromDate(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );

  await updateDoc(ref, {
    dekta: increment(-10),
    boxActive: true,
    boxExpiresAt: expires,
    lastRenewAt: serverTimestamp()
  });

  alert("🔁 Box renewed (30 days)");
  location.reload();
});
