import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function watchAuth(cb) {
  return onAuthStateChanged(auth, cb);
}

export function logoutUser() {
  return signOut(auth);
}
