import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const refLinkDiv = document.getElementById("refLink");
const copyBtn = document.getElementById("copyBtn");

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      refLinkDiv.innerText = "User data not found";
      return;
    }

    const data = snap.data();

    if (!data.referral || !data.referral.code) {
      refLinkDiv.innerText = "Referral code missing";
      return;
    }

    const code = data.referral.code;

    const link =
      "https://dektanet.github.io/dektanet-clean/register.html?ref=" +
      code;

    refLinkDiv.innerText = link;

    copyBtn.onclick = async () => {
      await navigator.clipboard.writeText(link);
      alert("Referral link copied ✅");
    };
  } catch (err) {
    console.error(err);
    refLinkDiv.innerText = "Error loading referral";
  }
});
