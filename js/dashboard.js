import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const welcome = document.getElementById("welcome");
const dektaEl = document.getElementById("dekta");
const babyDektaEl = document.getElementById("babyDekta");
const boxStatusEl = document.getElementById("boxStatus");
const logoutBtn = document.getElementById("logout");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  welcome.textContent = `Welcome ${user.email}`;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();

    dektaEl.textContent = data.dekta ?? 0;
    babyDektaEl.textContent = data.babyDekta ?? 0;

    boxStatusEl.textContent = data.boxActive ? "Active" : "Inactive";
  }
});

logoutBtn.onclick = async () => {
  await signOut(auth);
  window.location.href = "login.html";
};
