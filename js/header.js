// ================= HEADER LOADER =================

async function loadHeader() {
  const res = await fetch("header.html");
  const html = await res.text();

  document.body.insertAdjacentHTML("afterbegin", html);

  // language select
  const select = document.getElementById("langSelect");
  if (select) {
    select.value = localStorage.getItem("lang") || detectLanguage();
    select.addEventListener("change", e => {
      setLanguage(e.target.value);
    });
  }
}

document.addEventListener("DOMContentLoaded", loadHeader);
