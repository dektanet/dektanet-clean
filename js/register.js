// js/register.js
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function register(email, password, phone) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  await setDoc(doc(db, "users", user.uid), {
    email,
    phone,
    dekta: 0,
    dektaBox: 30,
    boxStatus: "INACTIVE",
    createdAt: Date.now()
  });

  return user;
}
