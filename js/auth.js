import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// LOGIN
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// REGISTER
export function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// LOGOUT
export function logout() {
  return signOut(auth);
}

// AUTH STATE
export function watchAuth(callback) {
  onAuthStateChanged(auth, callback);
}

console.log("✅ auth.js real loaded");
