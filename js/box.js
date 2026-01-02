import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const statusEl = document.getElementById("boxStatus");
const countdownEl = document.getElementById("countdown");
const activateBtn = document.getElementById("activateBtn");
const renewBtn = document.getElementById("renewBtn");

let userRef;
let userData;

/* ===================== LOAD USER ===================== */
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  userData = snap.data();
  renderBox();
});

/* ===================== RENDER ===================== */
function renderBox() {
  const box = userData.box || {};

  statusEl.textContent = box.status || "closed";

  if (box.expiresAt) {
    startCountdown(box.expiresAt.toMillis());
  } else {
    countdownEl.textContent = "---";
  }

  // first month free
  if (!box.activatedOnce) {
    activateBtn.classList.remove("disabled");
    renewBtn.classList.add("disabled");
  } else {
    activateBtn.classList.add("disabled");
    renewBtn.classList.remove("disabled");
  }
}

/* ===================== COUNTDOWN ===================== */
function startCountdown(ms) {
  setInterval(() => {
    const diff = ms - Date.now();
    if (diff <= 0) {
      countdownEl.textContent = "EXPIRED";
      return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    countdownEl.textContent = d + " days";
  }, 1000);
}

/* ===================== ACTIVATE (FIRST TIME) ===================== */
activateBtn.onclick = async () => {
  if (activateBtn.classList.contains("disabled")) return;

  const now = Timestamp.now();
  const expires = Timestamp.fromMillis(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  );

  await updateDoc(userRef, {
    "box.status": "active",
    "box.expiresAt": expires,
    "box.activatedOnce": true
  });

  // referral reward on first activation (example 130 box)
  if (userData.referral?.by) {
    const refRef = doc(db, "users", userData.referral.by);
    const refSnap = await getDoc(refRef);
    if (refSnap.exists()) {
      await updateDoc(refRef, {
        "balances.dekta": increment(50),
        "referral.level1": increment(1)
      });
    }
  }

  alert("BOX ACTIVATED (FREE FIRST MONTH)");
  location.reload();
};

/* ===================== RENEW KEY (10$) ===================== */
renewBtn.onclick = async () => {
  if (renewBtn.classList.contains("disabled")) return;

  if ((userData.balances?.dekta || 0) < 10) {
    alert("Not enough balance to renew");
    return;
  }

  const expires = Timestamp.fromMillis(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  );

  await updateDoc(userRef, {
    "balances.dekta": increment(-10),
    "box.status": "active",
    "box.expiresAt": expires
  });

  // referral reward on renew
  if (userData.referral?.by) {
    const refRef = doc(db, "users", userData.referral.by);
    const refSnap = await getDoc(refRef);
    if (refSnap.exists()) {
      await updateDoc(refRef, {
        "balances.dekta": increment(4),
        "referral
