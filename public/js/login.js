const LOGIN_FORM = document.querySelector("#login-form");
LOGIN_FORM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.querySelector("#username");
  const password = document.querySelector("#password");

  //? Fetch
  window.location.href = "news.html";
});

const REGISTER_BTN = document.querySelector("#register-btn");
REGISTER_BTN.addEventListener("click", () => {
  window.location.href = "register.html";
});
