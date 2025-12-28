import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, user => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  document.getElementById("userInfo").innerText =
    `Email: ${user.email}\nUID: ${user.uid}`;
});
