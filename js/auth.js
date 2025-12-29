import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export async function login(email, password) {
  const userCredential =
    await signInWithEmailAndPassword(auth, email, password);

  return userCredential.user;
}

export function logout() {
  return signOut(auth);
}

export function onUserChanged(callback) {
  onAuthStateChanged(auth, callback);
}
