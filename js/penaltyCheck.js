import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function checkPenalty(userId) {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return { ok: false };
  }

  const data = snap.data();

  // إذا الصندوق ACTIVE → مافماش penalty
  if (data.box?.status === "active") {
    return { ok: true, penalty: 0 };
  }

  // إذا ما عندوش expiresAt
  if (!data.box?.expiresAt) {
    return { ok: false };
  }

  const now = Timestamp.now();

  // إذا مازال الوقت ما وفاش
  if (data.box.expiresAt.toMillis() > now.toMillis()) {
    return { ok: true, penalty: 0 };
  }

  // 🔴 Penalty 30%
  const dekt = data.balances?.dekta || 0;
  const baby = data.balances?.babydekta || 0;

  const total = dekt + baby;
  const penalty = total * 0.3;

  return {
    ok: false,
    penalty: penalty
  };
}
