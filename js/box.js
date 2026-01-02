// ==============================
// DEKTA-BOX LOGIC
// ==============================

import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const ACTIVATE_PRICE = 30;   // أول مرة
const REACTIVATE_PRICE = 10; // تجديد
const BOX_DURATION_DAYS = 30;

function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const u = snap.data();

  // عرض الحالة
  document.getElementById("boxStatus").innerText =
    u.boxActive ? "ACTIVE" : "INACTIVE";

  document.getElementById("activateBoxBtn").onclick = async () => {
    // تحديد السعر (أول مرة ولا تجديد)
    const price = u.boxEverActivated ? REACTIVATE_PRICE : ACTIVATE_PRICE;

    if ((u.dekta || 0) < price) {
      alert("❌ رصيد DEKTA غير كافي");
      return;
    }

    // خصم السعر + تفعيل الصندوق
    await updateDoc(userRef, {
      dekta: increment(-price),
      boxActive: true,
      boxEverActivated: true,
      boxExpiresAt: addDays(BOX_DURATION_DAYS),
      updatedAt: serverTimestamp()
    });

    alert("✅ تم تفعيل DEKTA-BOX");
    location.reload();
  };
});
