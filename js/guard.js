import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, user => {
  if (!user) {
    // ❌ موش مسجّل → نرجّعو للـ login
    window.location.href = "login.html";
  }
  // ✅ مسجّل → يخليه يكمل
});
