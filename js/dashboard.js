import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    document.getElementById("userEmail").innerText = user.email;
  }
});

document.getElementById("logoutBtn").onclick = async () => {
  await signOut(auth);
  window.location.href = "login.html";
};
