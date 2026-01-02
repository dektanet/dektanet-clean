// ================================
// LOGIN MODULE
// ================================

import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

console.log("✅ login.js loaded");

export async function loginUser(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return cred.user;
  } catch (err) {
    throw new Error(err.message);
  }
}
