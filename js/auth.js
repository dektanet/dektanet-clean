import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* REGISTER */
export async function register(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", cred.user.uid), {
    uid: cred.user.uid,
    email: email,
    role: "user",
    createdAt: serverTimestamp()
  });

  return cred;
}

/* LOGIN */
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

/* LOGOUT */
export function logout() {
  return signOut(auth);
}

/* AUTH WATCHER */
export function watchAuth(cb) {
  return onAuthStateChanged(auth, cb);
}
