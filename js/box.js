// ===============================
// BOX MODULE (ACTIVATE)
// ===============================

import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const activateBtn = document.getElementById("activateBoxBtn");
const boxStatusEl = document.getElementById("boxStatus");

if (activateBtn) {
  activateBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Not logged in");
      return;
    }

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      alert("User not found");
      return;
    }

    const data = snap.data();

    if (data.boxActive === true) {
      alert("Box already active");
      return;
    }

    if ((data.dekta ?? 0) < 30) {
      alert("Not enough DEKTA");
      return;
    }

    // حساب تاريخ الانتهاء (30 يوم)
    const expires = Timestamp.fromMillis(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );

    await updateDoc(ref, {
      dekta: data.dekta - 30,
      boxActive: true,
      boxEverActivated: true,
      boxExpiresAt: expires
    });

    alert("DEKTA-BOX Activated ✅");
    location.reload();
  });
}
