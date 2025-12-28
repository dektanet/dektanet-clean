// ================================
// AUTH MODULE (REAL VERSION)
// ================================

import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ================================
// LOAD CHECK
// ================================
console.log("✅ auth.js real loaded");

// حماية خفيفة (اختيارية)
if (!auth) {
  console.error("❌ Firebase auth not initialized");
}

// ================================
// LOGIN
// ================================
export function login(email, password) {
  if (!email || !password) {
    return Promise.reject("Email and password required");
  }
  return signInWithEmailAndPassword(auth, email, password);
}

// ================================
// REGISTER
// ================================
export function register(email, password) {
  if (!email || !password) {
    return Promise.reject("Email and password required");
  }
  return createUserWithEmailAndPassword(auth, email, password);
}

// ================================
// LOGOUT
// ================================
export function logout() {
  return signOut(auth);
}

// ================================
// AUTH STATE LISTENER
// ================================
export function watchAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
