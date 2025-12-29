import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  // جلب user data
  const snap = await getDoc(doc(db, "users", user.uid));
  const data = snap.data();

  // عرض المعلومات
  document.getElementById("userInfo").innerText =
    `Email: ${user.email || data.phone}\nUID: ${user.uid}`;

  document.getElementById("dektaBalance").innerText =
    data.balances?.dekta ?? 0;

  document.getElementById("boxBalance").innerText =
    data.box?.bonus ?? 30;

  document.getElementById("boxStatus").innerText =
    data.box?.status ?? "INACTIVE";
});
