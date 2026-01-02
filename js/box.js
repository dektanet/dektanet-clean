import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const BOX_DURATION_DAYS = 30;
const FIRST_PRICE = 30;
const RENEW_PRICE = 10;

const statusEl = document.getElementById("boxStatus");
const btn = document.getElementById("activateBoxBtn");

auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();

  // عرض الحالة
  if (data.boxActive) {
    statusEl.innerText = "ACTIVE";
    btn.disabled = true;
    btn.innerText = "BOX ACTIVE";
  } else {
    statusEl.innerText = "INACTIVE";
  }

  btn.onclick = async () => {
    const price = data.boxEverActivated ? RENEW_PRICE : FIRST_PRICE;

    // ❌ ما عندوش رصيد
    if (data.dekta < price) {
      alert(`❌ رصيدك غير كافي (يلزمك ${price} DEKTA)`);
      return;
    }

    // ✅ حساب تاريخ الانتهاء
    const expires = new Date();
    expires.setDate(expires.getDate() + BOX_DURATION_DAYS);

    // ✅ تحديث Firestore
    await updateDoc(ref, {
      dekta: data.dekta - price,
      boxActive: true,
      boxEverActivated: true,
      boxExpiresAt: Timestamp.fromDate(expires),
      updatedAt: serverTimestamp(),
    });

    alert("✅ Box Activated (Paid)");
    location.reload();
  };
});
