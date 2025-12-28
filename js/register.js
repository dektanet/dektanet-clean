import { register } from "./auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.getElementById("registerBtn");

btn.addEventListener("click", async () => {
  try {
    await register(email.value, password.value);
    alert("Account created ✅");
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});
