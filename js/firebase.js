// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDFmbl1QM74US0KDuIR1xEGoCFJ",
  authDomain: "dektanet-app.firebaseapp.com",
  projectId: "dektanet-app",
  storageBucket: "dektanet-app.appspot.com",
  messagingSenderId: "891992962502",
  appId: "1:891992962502:web:5fd3e2475e388ef30feec7"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
