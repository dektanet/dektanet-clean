import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const dektaEl = document.getElementById("dektaBalance");
const babyDektaEl = document.getElementById("babyDektaBalance");
const boxStatusEl = document.getElementById("boxStatus");
const boxExpireText = document.getElementById("boxExpireText");
const boxExpiresAtEl = document.getElementById("boxExpiresAt");
const activateBtn = document.getElementById("activateBoxBtn");

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const ref = doc(db, "users", user.uid);

  // LIVE LISTENER
  onSnapshot(ref, snap => {
    if (!snap.exists()) return;

    const data = snap.data();

    // BALANCES
    dektaEl.textContent = data.dekta ?? 0;
    babyDektaEl.textContent = data.babyDekta ?? 0;

    // BOX STATUS
    if (data.boxActive === true) {
      boxStatusEl.textContent = "ACTIVE";
      boxStatusEl.style.color = "lime";
      activateBtn.style.display = "none";

      if (data.boxExpiresAt) {
        const date = data.boxExpiresAt.toDate();
        boxExpireText.style.display = "block";
        boxExpiresAtEl.textContent = date.toLocaleString();
      }
    } else {
      boxStatusEl.textContent = "INACTIVE";
      boxStatusEl.style.color = "red";
      activateBtn.style.display = "inline-block";
      boxExpireText.style.display = "none";
    }
  });
});
