const btn = document.querySelector(".clearAll");

btn.addEventListener("click", clearAll);

function clearAll() {
  fetch("/clearAll", {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
  });
  window.location.reload();
}
