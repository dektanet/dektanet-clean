import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const emailEl = document.getElementById("user-email");
const dektaEl = document.getElementById("dekta");
const babyDektaEl = document.getElementById("babyDekta");
const roleEl = document.getElementById("role");
const logoutBtn = document.getElementById("logout");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  emailEl.innerText = user.email;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    dektaEl.innerText = data.dekta ?? 0;
    babyDektaEl.innerText = data.babyDekta ?? 0;
    roleEl.innerText = data.role ?? "user";
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});
