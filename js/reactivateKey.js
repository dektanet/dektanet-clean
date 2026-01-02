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
    if (!snap.exists()) return;

    const data = snap.data();

    // check balance
    if ((data.balances?.dekta || 0) < 10) {
      alert("Not enough DEKTA");
      return;
    }

    const now = Timestamp.now();
    const expires = Timestamp.fromMillis(
      now.toMillis() + 30 * 24 * 60 * 60 * 1000
    );

    await updateDoc(userRef, {
      "balances.dekta": increment(-10),
      "box.status": "active",
      "box.expiresAt": expires
    });

    // referral reward on renew
    if (data.referral?.by) {
      const refRef = doc(db, "users", data.referral.by);
      const refSnap = await getDoc(refRef);
      if (refSnap.exists()) {
        await updateDoc(refRef, {
          "balances.dekta": increment(4),
          "referral.level1": increment(1)
        });
      }
    }

    alert("Box reactivated ✅");
    location.reload();
  });
}
