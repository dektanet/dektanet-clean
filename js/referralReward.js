import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function rewardReferral(userId, l1Amount, l2Amount) {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const data = snap.data();
  if (!data.referral?.by) return;

  // LEVEL 1
  const l1Ref = doc(db, "users", data.referral.by);
  await updateDoc(l1Ref, {
    "balances.dekta": increment(l1Amount),
    "referral.level1": increment(1)
  });

  // LEVEL 2
  const l1Snap = await getDoc(l1Ref);
  const l1Data = l1Snap.data();
  if (l1Data?.referral?.by) {
    const l2Ref = doc(db, "users", l1Data.referral.by);
    await updateDoc(l2Ref, {
      "balances.dekta": increment(l2Amount),
      "referral.level2": increment(1)
    });
  }
}
