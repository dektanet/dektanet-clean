import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const btn = document.getElementById("activateBox");

if (btn) {
  btn.addEventListener("click", async () => {

    const user = auth.currentUser;
    if (!user) {
      alert("Not logged in");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        alert("User not found");
        return;
      }

      const data = snap.data();
      const now = new Date();
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);

      const firstTime = !data.box?.activatedAt;

      // ❌ الصندوق مفعل
      if (data.box?.status === "active") {
        alert("BOX already active");
        return;
      }

      // 🔁 مش أول مرة → لازم رصيد
      if (!firstTime && (data.balances?.dekta || 0) < 30) {
        alert("Not enough DEKTA");
        return;
      }

      // 🔁 خصم كان مش أول مرة
      const updateData = {
        "box.status": "active",
        "box.activatedAt": now,
        "box.expiresAt": expires
      };

      if (!firstTime) {
        updateData["balances.dekta"] = increment(-30);
      }

      await updateDoc(userRef, updateData);

      // 🔗 REFFERAL (كان الصندوق متاع المُحيل Active)
      if (data.referral?.by) {
        const refRef = doc(db, "users", data.referral.by);
        const refSnap = await getDoc(refRef);

        if (refSnap.exists()) {
          const refData = refSnap.data();

          if (refData.box?.status === "active") {
            await updateDoc(refRef, {
              "balances.dekta": increment(4),
              "referral.level1": increment(1)
            });
          }
        }
      }

      alert(firstTime ? "FREE BOX activated 🎁" : "BOX activated ✅");
      location.reload();

    } catch (err) {
      alert(err.message);
    }
  });
}
