import { auth, db } from "./firebase.js";
import {
  doc, getDoc, updateDoc, increment, Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { rewardReferral } from "./referralReward.js";

const activateBtn = document.getElementById("activateBtn");
const renewBtn = document.getElementById("renewBtn");

auth.onAuthStateChanged(async user => {
  if (!user) return location.href = "login.html";

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();

  /* FIRST ACTIVATE (FREE) */
  activateBtn?.addEventListener("click", async () => {
    if (data.box?.activatedOnce) return;

    const expires = Timestamp.fromMillis(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );

    await updateDoc(ref, {
      "box.status": "active",
      "box.expiresAt": expires,
      "box.activatedOnce": true
    });

    // مثال صندوق 130
    await rewardReferral(user.uid, 50, 10);

    alert("BOX ACTIVATED (FREE MONTH)");
    location.reload();
  });

  /* RENEW KEY 10$ */
  renewBtn?.addEventListener("click", async () => {
    if ((data.balances?.dekta || 0) < 10) {
      alert("Not enough balance");
      return;
    }

    const expires = Timestamp.fromMillis(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );

    await updateDoc(ref, {
      "balances.dekta": increment(-10),
      "box.status": "active",
      "box.expiresAt": expires
    });

    await rewardReferral(user.uid, 4, 0.5);

    alert("BOX RENEWED");
    location.reload();
  });
});
