// ===============================
// DEKTA BOX MODULE (CLEAN)
// ===============================

import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// CONFIG
const FIRST_PRICE = 30; // أول مرة
const RENEW_PRICE = 10; // تجديد
const BOX_DURATION_DAYS = 30;

// DOM
const statusEl = document.getElementById("boxStatus");
const btn = document.getElementById("activateBoxBtn");

// ===============================
// HELPERS
// ===============================
function addDays(days) {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return Timestamp.fromDate(now);
}

// ===============================
// LOAD BOX STATUS
// ===============================
auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();

  // إذا الصندوق Active وتعدّى الوقت → سكّرو
  if (
    data.boxActive === true &&
    data.boxExpiresAt &&
    data.boxExpiresAt.toMillis() < Date.now()
  ) {
    await updateDoc(ref, {
      boxActive: false
    });
    statusEl.textContent = "INACTIVE";
    btn.textContent = "Renew Box";
    return;
  }

  // عرض الحالة
  if (data.boxActive) {
    statusEl.textContent = "ACTIVE";
    btn.textContent = "Active";
    btn.disabled = true;
  } else {
    statusEl.textContent = "INACTIVE";
    btn.textContent = data.boxEverActivated
      ? "Renew Box"
      : "Activate Box";
  }
});

// ===============================
// ACTIVATE / RENEW
// ===============================
btn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Not logged in");
    return;
  }

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();

  // لو Active ما يعمل شي
  if (data.boxActive === true) {
    alert("Box already active");
    return;
  }

  const price = data.boxEverActivated ? RENEW_PRICE : FIRST_PRICE;

  if ((data.dekta || 0) < price) {
    alert("Not enough DEKTA");
    return;
  }

  // UPDATE
  await updateDoc(ref, {
    dekta: data.dekta - price,
    boxActive: true,
    boxEverActivated: true,
    boxExpiresAt: addDays(BOX_DURATION_DAYS),
    updatedAt: serverTimestamp()
  });

  alert("DEKTA-BOX Activated");
  location.reload();
});
