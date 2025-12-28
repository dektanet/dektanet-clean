import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.getElementById("registerBtn");

btn.addEventListener("click", async () => {
  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    alert("Account created ✅");
    window.location.href = "index.html";

  } catch (err) {
    alert(err.message);
  }
});
