import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function register(email, password, phone) {
  const userCredential =
    await createUserWithEmailAndPassword(auth, email, password);

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    email,
    phone: phone || "",
    balance: 0,
    createdAt: Date.now()
  });

  return user;
}
