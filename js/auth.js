// js/auth.js
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { auth } from "./firebase.js";

// LOGIN
export async function login(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
}

// LOGOUT
export async function logout() {
  await signOut(auth);
}

// AUTH GUARD (حماية)
export function checkAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}
