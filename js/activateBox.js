// ================================
// ACTIVBOX LOGIC – DEKTANET
// ================================

import { db, auth } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ================================
// CONSTANTS
// ================================
const BOX_DURATION_DAYS = 30;
const FIRST_KEY_PRICE = 30;   // أول تفعيل
const REACTIVE_KEY_PRICE = 10; // تجديد

// ================================
// HELPERS
// ================================
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isExpired(expiresAt) {
  if (!expiresAt) return true;
  return new Date() > expiresAt.toDate();
}

// ================================
// INIT USER BOX (ON REGISTER)
// ================================
export async function initUserBox(uid) {
  const ref = doc(db, "boxes", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      status: "INACTIVE",        // ACTIVE | INACTIVE
      activatedAt: null,
      expiresAt: null,
      level: "LEVEL-A",          // قابل للتوسعة
      totalEarned: 0,            // أرباح الإحالات
      createdAt: serverTimestamp()
    });
  }
}

// ================================
// ACTIVATE BOX (FIRST TIME)
// ================================
export async function activateBox(uid) {
  const ref = doc(db, "boxes", uid);

  const now = new Date();
  const expiresAt = addDays(now, BOX_DURATION_DAYS);

  await updateDoc(ref, {
    status: "ACTIVE",
    activatedAt: now,
    expiresAt: expiresAt,
    lastAction: "ACTIVATE",
    updatedAt: serverTimestamp()
  });
}

// ================================
// REACTIVATE BOX
// ================================
export async function reactivateBox(uid) {
  const ref = doc(db, "boxes", uid);

  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("BOX_NOT_FOUND");

  const data = snap.data();
  let baseDate = new Date();

  if (data.expiresAt && !isExpired(data.expiresAt)) {
    baseDate = data.expiresAt.toDate();
  }

  const newExpiresAt = addDays(baseDate, BOX_DURATION_DAYS);

  await updateDoc(ref, {
    status: "ACTIVE",
    expiresAt: newExpiresAt,
    lastAction: "REACTIVATE",
    updatedAt: serverTimestamp()
  });
}

// ================================
// CHECK BOX STATUS (FOR UI)
// ================================
export async function getBoxStatus(uid) {
  const ref = doc(db, "boxes", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return { exists: false };
  }

  const data = snap.data();
  const expired = isExpired(data.expiresAt);

  return {
    exists: true,
    status: expired ? "INACTIVE" : data.status,
    expiresAt: data.expiresAt,
    level: data.level,
    totalEarned: data.totalEarned
  };
}

// ================================
// AUTH LISTENER (AUTO INIT)
// ================================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await initUserBox(user.uid);
  }
});
