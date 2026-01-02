import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function rewardReferral(userId, amountL1, amountL2) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  const userData = userSnap.data();
  if (!userData.referral || !userData.referral.by) return;

  // ===== LEVEL 1 =====
  const ref1Id = userData.referral.by;
  const ref1Ref = doc(db, "users", ref1Id);
  const ref1Snap = await getDoc(ref1Ref);

  if (!ref1Snap.exists()) return;
  const ref1Data = ref1Snap.data();

  if (ref1Data.box?.status === "active") {
    await updateDoc(ref1Ref, {
      "balances.dekta": increment(amountL1),
      "referral.level1": increment(1)
    });
  }

  // ===== LEVEL 2 =====
  if (ref1Data.referral?.by) {
    const ref2Ref = doc(db, "users", ref1Data.referral.by);
    const ref2Snap = await getDoc(ref2Ref);

    if (!ref2Snap.exists()) return;
    const ref2Data = ref2Snap.data();

    if (ref2Data.box?.status === "active") {
      await updateDoc(ref2Ref, {
        "balances.dekta": increment(amountL2),
        "referral.level2": increment(1)
      });
    }
  }
}
