import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { doc, getDoc, updateDoc, Timestamp } from
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const statusEl = document.getElementById("boxStatus");
const btn = document.getElementById("activateBoxBtn");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const data = snap.data();

  statusEl.innerText = data.boxActive ? "ACTIVE" : "INACTIVE";

  btn.onclick = async () => {
    if (data.dekta < 30) {
      alert("Not enough DEKTA");
      return;
    }

    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    await updateDoc(ref, {
      dekta: data.dekta - 30,
      boxActive: true,
      boxEverActivated: true,
      boxExpiresAt: Timestamp.fromDate(expires)
    });

    alert("Box Activated ✅");
    location.reload();
  };
});
