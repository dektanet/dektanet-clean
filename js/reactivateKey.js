import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const btn = document.getElementById("reactivateKey");

if (btn) {
  btn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Not logged in");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      alert("User not found");
      return;
    }

    const data = snap.data();

    // لازم الصندوق يكون مغلق
    if (data.box?.status !== "closed") {
      alert("Box already active");
      return;
    }

    // لازم رصيد كافي (10$)
    if ((data.balances?.dekta || 0) < 10) {
      alert("Not enough balance to reactivate");
      return;
    }

    const now = Timestamp.now();
    const expires = Timestamp.fromDate(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    );

    // خصم + فتح الصندوق
    await updateDoc(userRef, {
      "balances.dekta": increment(-10),
      "box.status": "active",
      "box.expiresAt": expires
    });

    // 🔗 ربح الإحالة من التجديد
    if (data.referral?.by) {
      const ref1Ref = doc(db, "users", data.referral.by);
      const ref1Snap = await getDoc(ref1Ref);

      if (ref1Snap.exists()) {
        await updateDoc(ref1Ref, {
          "balances.dekta": increment(4),
          "referral.level1": increment(1)
        });

        const ref1Data = ref1Snap.data();

        if (ref1Data.referral?.by) {
          const ref2Ref = doc(db, "users", ref1Data.referral.by);
          await updateDoc(ref2Ref, {
            "balances.dekta": increment(0.5),
            "referral.level2": increment(1)
          });
        }
      }
    }

    alert("Box reactivated successfully");
    location.reload();
  });
}
