import { auth, db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();

  document.getElementById("boxStatus").innerText =
    data.box?.status?.toUpperCase() || "CLOSED";

  if (data.box?.expiresAt) {
    document.getElementById("boxExpire").innerText =
      data.box.expiresAt.toDate().toLocaleString();
  } else {
    document.getElementById("boxExpire").innerText = "---";
  }

  // show / hide buttons
  if (data.box?.status === "active") {
    document.getElementById("activateBoxBtn").style.display = "none";
  } else {
    document.getElementById("reactivateKey").style.display = "none";
  }
});
