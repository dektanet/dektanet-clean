import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { rewardReferral } from "./referralReward.js";

const activateBtn = document.getElementById("activateBox");
const renewBtn = document.getElementById("renewBox");

async function getUserData() {
  const user = auth.currentUser;
  if (!user) throw "NOT_LOGGED_IN";

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw "USER_NOT_FOUND";

  return { user, ref, data: snap.data() };
}

// =======================
// ACTIVATE BOX (FIRST TIME)
// =======================
if (activateBtn) {
  activateBtn.onclick = async () => {
    try {
      const { user, ref, data } = await getUserData();

      if (data.box?.status === "active") {
        alert("BOX already ACTIVE");
        return;
      }

      if ((data.balances?.dekta || 0) < 30) {
        alert("Not enough DEKTA");
        return;
      }

      const expires = new Date();
      expires.setDate(expires.getDate() + 30);

      await updateDoc(ref, {
        "balances.dekta": increment(-30),
        "box.status": "active",
        "box.activatedAt": serverTimestamp(),
        "box.expiresAt": expires
      });

      // 🔥 Referral reward (example box 130$)
      await rewardReferral(user.uid, 10, 1);

      alert("BOX ACTIVATED ✅");
      location.reload();
    } catch (e) {
      alert(e);
    }
  };
}

// =======================
// RENEW KEY (10$)
// =======================
if (renewBtn) {
  renewBtn.onclick = async () => {
    try {
      const { user, ref, data } = await getUserData();

      if ((data.balances?.dekta || 0) < 10) {
        alert("Not enough balance for renew");
        return;
      }

      const expires = new Date();
      expires.setDate(expires.getDate() + 30);

      await updateDoc(ref, {
        "balances.dekta": increment(-10),
        "box.status": "active",
        "box.expiresAt": expires,
        "box.renewedAt": serverTimestamp()
      });

      // 🔥 Referral reward for renew
      await rewardReferral(user.uid, 4, 0.5);

      alert("BOX RENEWED 🔁");
      location.reload();
    } catch (e) {
      alert(e);
    }
  };
}
