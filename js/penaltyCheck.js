import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function checkPenalty(userId) {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { ok: false };

  const data = snap.data();

  if (data.box?.status === "active") {
    return { ok: true, penalty: 0 };
  }

  if (!data.box?.expiresAt) {
    return { ok: false };
  }

  const now = Timestamp.now();

  if (data.box.expiresAt.toMillis() > now.toMillis()) {
    return { ok: true, penalty: 0 };
  }

  // penalty 30%
  const total =
    (data.balances?.dekta || 0) +
    (data.balances?.babydekta || 0);

  const penalty = total * 0.3;

  return {
    ok: false,
    penalty: penalty
  };
}
