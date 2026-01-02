// ================================
// DEKTA BOX MODULE (CLEAN)
// ================================

import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// UI
const statusEl = document.getElementById("boxStatus");
const btn = document.getElementById("activateBoxBtn");

// مدة الصندوق
const BOX_DAYS = 30;

// نحسب 30 يوم
function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return Timestamp.fromDate(d);
}

// نحدّث الواجهة
async function loadBoxStatus(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();

  // إذا الصندوق مفعّل وصالح
  if (data.boxActive && data.boxExpiresAt) {
    const now = Timestamp.now();

    if (data.boxExpiresAt.toMillis() > now.toMillis()) {
      statusEl.innerText = "ACTIVE";
      btn.innerText = "Renew Box (10 DEKTA)";
      return;
    }
  }

  // غير ذلك
  statusEl.innerText = "INACTIVE";
  btn.innerText = data.boxEverActivated
    ? "Renew Box (10 DEKTA)"
    : "Activate Box (30 DEKTA)";
}

// تفعيل / تجديد
async function activateBox() {
  const user = auth.currentUser;
  if (!user) {
    alert("❌ Not logged in");
    return;
  }

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();

  const firstTime = !data.boxEverActivated;
  const cost = firstTime ? 30 : 10;

  if ((data.dekta || 0) < cost) {
    alert("❌ Not enough DEKTA");
    return;
  }

  await updateDoc(ref, {
    dekta: (data.dekta || 0) - cost,
    boxActive: true,
    boxEverActivated: true,
    boxExpiresAt: addDays(BOX_DAYS),
    updatedAt: serverTimestamp()
  });

  alert("✅ DEKTA-BOX Activated");
  location.reload();
}

// EVENTS
if (btn) {
  btn.addEventListener("click", activateBox);
}

// AUTH LISTENER
auth.onAuthStateChanged((user) => {
  if (!user) return;
  loadBoxStatus(user);
});
