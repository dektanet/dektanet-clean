// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDFmblIQM74uszOkDURiXrEGoCFJGdh_o",
  authDomain: "dektanet-app.firebaseapp.com",
  projectId: "dektanet-app",
  storageBucket: "dektanet-app.firebasestorage.app",
  messagingSenderId: "891992962502",
  appId: "1:891992962502:web:b18d97723d92b12d0feec7"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
