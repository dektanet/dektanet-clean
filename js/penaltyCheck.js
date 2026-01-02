import { db } from "./firebase.js";
import {
  doc, getDoc, updateDoc, increment, Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function applyPenalty(userId) {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  if (data.box?.status === "active") return;

  const now = Timestamp.now();
  if (data.box.expiresAt.toMillis() > now.toMillis()) return;

  const total =
    (data.balances.dekta || 0) +
    (data.balances.babydekta || 0);

  const penalty = total * 0.3;

  await updateDoc(ref, {
    "balances.dekta": increment(-penalty)
  });
}
