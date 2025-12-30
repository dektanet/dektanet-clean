import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const btn = document.getElementById("activateBox");

if (btn) {
  btn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("❌ لازم Login");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      alert("❌ User غير موجود");
      return;
    }

    const data = snap.data();

    /* ====== إعدادات المفتاح ====== */
    const KEY_PRICE = 30; // سعر المفتاح
    const BOX_DAYS = 30;  // مدة الصندوق

    /* ====== تحقق ====== */
    if (data.box?.status === "active") {
      alert("⚠️ الصندوق مفعّل بالفعل");
      return;
    }

    if ((data.balances?.dekta || 0) < KEY_PRICE) {
      alert("❌ DEKTA غير كافية");
      return;
    }

    /* ====== تواريخ ====== */
    const now = new Date();
    const expires = new Date();
    expires.setDate(expires.getDate() + BOX_DAYS);

    /* ====== تفعيل الصندوق ====== */
    await updateDoc(userRef, {
      "balances.dekta": increment(-KEY_PRICE),
      "box.status": "active",
      "box.activatedAt": serverTimestamp(),
      "box.expiresAt": expires
    });

    /* ====== إحالة (Level 1 فقط) ====== */
    if (data.referral?.by) {
      const refRef = doc(db, "users", data.referral.by);
      const refSnap = await getDoc(refRef);

      if (refSnap.exists()) {
        const refData = refSnap.data();

        // يتحسب الربح كان المُحيل Active
        if (refData.box?.status === "active") {
          await updateDoc(refRef, {
            "balances.dekta": increment(4),
            "referral.level1": increment(1)
          });
        }
      }
    }

    alert("✅ تم تفعيل الصندوق بنجاح");
    location.reload();
  });
}
