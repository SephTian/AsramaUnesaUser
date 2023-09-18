const MENU = document.querySelector("#menu");
const CLOSE_MENU = document.querySelector("#close-menu");
const OPEN_MENU = document.querySelector("#open-menu");

OPEN_MENU.addEventListener("click", (e) => {
  MENU.style.width = "256px";
});

CLOSE_MENU.addEventListener("click", (e) => {
  MENU.style.width = "0px";
});

document.addEventListener("click", function (e) {
  if (!OPEN_MENU.contains(e.target) && !MENU.contains(e.target)) {
    MENU.style.width = "0px";
  }
});
