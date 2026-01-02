// js/box.js
import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const statusEl = document.getElementById("boxStatus");
const btn = document.getElementById("activateBoxBtn");

const FIRST_PRICE = 30;
const RENEW_PRICE = 10;
const BOX_DURATION_DAYS = 30;

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();

  // عرض الحالة
  if (data.boxActive === true && data.boxExpiresAt?.toMillis() > Date.now()) {
    statusEl.textContent = "ACTIVE";
    btn.disabled = true;
    btn.textContent = "BOX ACTIVE";
  } else {
    statusEl.textContent = "INACTIVE";
    btn.disabled = false;
    btn.textContent = "Activate Box";
  }

  btn.onclick = async () => {
    const freshSnap = await getDoc(ref);
    const fresh = freshSnap.data();

    const price = fresh.boxEverActivated ? RENEW_PRICE : FIRST_PRICE;

    if ((fresh.dekta || 0) < price) {
      alert("❌ Not enough DEKTA");
      return;
    }

    const expires = new Date();
    expires.setDate(expires.getDate() + BOX_DURATION_DAYS);

    await updateDoc(ref, {
      dekta: fresh.dekta - price,
      boxActive: true,
      boxEverActivated: true,
      boxExpiresAt: Timestamp.fromDate(expires),
      updatedAt: serverTimestamp()
    });

    alert("✅ Box Activated (PAID)");
    location.reload();
  };
});
