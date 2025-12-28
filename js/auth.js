// ================================
// AUTH MODULE (FINAL / CLEAN)
// ================================

import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ================================
// SAFETY CHECK
// ================================
if (!auth) {
  throw new Error("❌ Firebase auth not initialized");
}

console.log("✅ auth.js loaded");

// ================================
// LOGIN
// ================================
export async function login(email, password) {
  if (!email || !password) {
    throw new Error("Email and password required");
  }
  return signInWithEmailAndPassword(auth, email, password);
}

// ================================
// REGISTER
// ================================
export async function register(email, password) {
  if (!email || !password) {
    throw new Error("Email and password required");
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

// ================================
// PAGE PROTECTION
// ================================
export function requireAuth(redirect = "login.html") {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = redirect;
    }
  });
}

// ================================
// REDIRECT IF LOGGED
// ================================
export function redirectIfLogged(target = "dashboard.html") {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = target;
    }
  });
}
