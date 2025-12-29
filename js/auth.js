// js/auth.js
import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

export async function login(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function register(email, password) {
  await createUserWithEmailAndPassword(auth, email, password);
}
