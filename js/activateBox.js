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

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      alert("User not found");
      return;
    }

    const data = snap.data();

    if ((data.balances?.dekta || 0) < 30) {
      alert("Not enough DEKTA");
      return;
    }

    if (data.box?.status === "active") {
      alert("BOX already active");
      return;
    }

    const now = new Date();
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    await updateDoc(userRef, {
      "balances.dekta": increment(-30),
      "box.status": "active",
      "box.activatedAt": now,
      "box.expiresAt": expires
    });

    // referral reward
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

    alert("BOX activated ✅");
    location.reload();
  });
}
