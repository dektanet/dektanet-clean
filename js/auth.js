// ======================================
// AUTH MODULE – CLEAN & FINAL VERSION
// ======================================

import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ======================================
// LOAD CHECK (IMPORTANT)
// ======================================
console.log("✅ auth.js loaded");

if (!auth) {
  throw new Error("❌ Firebase auth not initialized (check firebase.js)");
}

// ======================================
// LOGIN
// ======================================
export async function login(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  return signInWithEmailAndPassword(auth, email, password);
}

// ======================================
// REGISTER
// ======================================
export async function register(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  return createUserWithEmailAndPassword(auth, email, password);
}

// ======================================
// LOGOUT
// ======================================
export function logout() {
  return signOut(auth);
}

// ======================================
// AUTH STATE LISTENER
// ======================================
export function watchAuth(callback) {
  if (typeof callback !== "function") {
    throw new Error("watchAuth requires a callback function");
  }

  return onAuthStateChanged(auth, callback);
}
