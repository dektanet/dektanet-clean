import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { checkPenalty } from "./penaltyCheck.js";

const btn = document.getElementById("withdrawBtn");

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  document.getElementById("dekta").innerText =
    snap.data().balances?.dekta || 0;
  document.getElementById("baby").innerText =
    snap.data().balances?.babydekta || 0;
});

btn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const penaltyResult = await checkPenalty(user.uid);

  if (!penaltyResult.ok) {
    alert(
      "Box CLOSED ❌\nPenalty: 30%\nOr buy Reactivate Key"
    );
    return;
  }

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const data = snap.data();

  if (
    (data.balances?.dekta || 0) === 0 &&
    (data.balances?.babydekta || 0) === 0
  ) {
    alert("No balance");
    return;
  }

  // simulate withdraw
  await updateDoc(ref, {
    "balances.dekta": 0,
    "balances.babydekta": 0
  });

  alert("Withdraw success ✅");
});
