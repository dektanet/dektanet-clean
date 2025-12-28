import { login } from "./auth.js";

document.getElementById("loginBtn").onclick = async () => {
  try {
    await login(
      document.getElementById("email").value,
      document.getElementById("password").value
    );
    window.location.href = "dashboard.html";
  } catch (e) {
    alert(e.message);
  }
};
