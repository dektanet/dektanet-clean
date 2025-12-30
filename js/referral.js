import { auth, db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    alert("User data not found");
    return;
  }

  const data = snap.data();
  const email = user.email;
  const code = data.referral?.code;

  if (!code) {
    alert("Referral code missing");
    return;
  }

  const link = `${window.location.origin}/dektanet-clean/register.html?ref=${code}`;

  document.getElementById("userEmail").innerText = email;
  document.getElementById("refCode").innerText = code;
  document.getElementById("refLink").value = link;

  document.getElementById("copyBtn").onclick = () => {
    navigator.clipboard.writeText(link);
    alert("Referral link copied ✅");
  };
});
