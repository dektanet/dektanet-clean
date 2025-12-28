import { watchAuth } from "./auth.js";

watchAuth(user => {
  if (!user) {
    window.location.href = "login.html";
  }
});
