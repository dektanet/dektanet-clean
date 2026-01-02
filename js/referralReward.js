// =====================================
// REFERRAL REWARD MODULE - DEKTANET CLEAN
// =====================================

import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/**
 * rewardReferral
 * @param {string} buyerUid - UID متع الشخص اللي شرى / جدّد
 * @param {number} level1Amount - ربح level 1 (مثال 4)
 * @param {number} level2Amount - ربح level 2 (مثال 0.5)
 */
export async function rewardReferral(buyerUid, level1Amount, level2Amount) {

  const buyerRef = doc(db, "users", buyerUid);
  const buyerSnap = await getDoc(buyerRef);
  if (!buyerSnap.exists()) return;

  const buyer = buyerSnap.data();
  if (!buyer.referredBy) return; // ما عندوش ريفيرال

  // ======================
  // LEVEL 1
  // ======================
  const level1Uid = buyer.referredBy;
  const level1Ref = doc(db, "users", level1Uid);
  const level1Snap = await getDoc(level1Ref);

  if (level1Snap.exists()) {
    const level1 = level1Snap.data();

    // الربح كان الصندوق ACTIVE
    if (level1.boxActive === true) {
      await updateDoc(level1Ref, {
        dekta: increment(level1Amount),
        "referral.level1": increment(1),
        updatedAt: serverTimestamp()
      });
    }
  }

  // ======================
  // LEVEL 2
  // ======================
  if (level1Snap.exists()) {
    const level1 = level1Snap.data();
    if (level1.referredBy) {
      const level2Uid = level1.referredBy;
      const level2Ref = doc(db, "users", level2Uid);
      const level2Snap = await getDoc(level2Ref);

      if (level2Snap.exists()) {
        const level2 = level2Snap.data();

        if (level2.boxActive === true) {
          await updateDoc(level2Ref, {
            dekta: increment(level2Amount),
            "referral.level2": increment(1),
            updatedAt: serverTimestamp()
          });
        }
      }
    }
  }
}
