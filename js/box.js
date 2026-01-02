import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const statusEl = document.getElementById("boxStatus");
const btn = document.getElementById("activateBoxBtn");

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    alert("User not found in Firestore");
    return;
  }

  const data = snap.data();
  renderBox(data);

  btn.onclick = async () => {
    await handleBox(userRef, data);
  };
});

function renderBox(data) {
  if (data.boxActive === true) {
    statusEl.textContent = "ACTIVE";
    btn.textContent = "Renew Box (10 DEKTA)";
  } else {
    statusEl.textContent = "INACTIVE";
    btn.textContent = "Activate Box (30 DEKTA)";
  }
}

async function handleBox(userRef, data) {
  // FIRST ACTIVATION
  if (data.boxEverActivated !== true) {
    if (data.dekta < 30) {
      alert("Not enough DEKTA");
      return;
    }

    await updateDoc(userRef, {
      dekta: data.dekta - 30,
      boxActive: true,
      boxEverActivated: true,
      boxExpiresAt: addDays(30),
      updatedAt: serverTimestamp()
    });

    alert("Box Activated ✅");
    location.reload();
    return;
  }

  // RENEW
  if (data.dekta < 10) {
    alert("Not enough DEKTA to renew");
    return;
  }

  await updateDoc(userRef, {
    dekta: data.dekta - 10,
    boxActive: true,
    boxExpiresAt: addDays(30),
    updatedAt: serverTimestamp()
  });

  alert("Box Renewed 🔁");
  location.reload();
}

function addDays(days) {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
}
