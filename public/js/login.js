import { fetchApi } from "./utility/fetch.js";

const LOGIN_BTN = document.querySelector("#login-btn");
const LOGIN_FORM = document.querySelector("#login-form");
LOGIN_FORM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.querySelector("#username");
  const password = document.querySelector("#password");

  // Make login btn disabled cause loading to fetch and api
  const BUTTON_ON_LOAD = document.createElement("div");
  BUTTON_ON_LOAD.className = "w-6 h-6 border-4 border-gray-500 border-t-white border-r-white rounded-full animate-spin ease-in duration-300";
  LOGIN_BTN.textContent = "";
  LOGIN_BTN.appendChild(BUTTON_ON_LOAD);
  LOGIN_BTN.disabled = true;

  // Fetching a Data
  let data = {};
  data.user_number = username.value;
  data.password = password.value;
  let result = await fetchApi(`login`, "POST", data);

  // If theres Something wrong with the fetch or the server
  if (result == false) {
    console.error("Fetch Error");
    return false;
  }

  // If user login failed
  if (result.status === 401) {
    await Swal.fire({
      title: `Wrong 
          ID or Password`,
      text: `Please wait...`,
      icon: "error",
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 2000,
      customClass: "",
    });

    // Make login btn enabled again cause loading is done
    LOGIN_BTN.textContent = "Log In";
    LOGIN_BTN.disabled = false;

    // If user login Succeed
  } else if (result.status === 200) {
    await Swal.fire({
      title: `Log In Success`,
      text: `Please wait...`,
      icon: "success",
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 2000,
      customClass: "",
    });

    //Assign Data to Session And Redirect to news page
    let user_temp_data = {
      user_id: result.data.user_id,
      user_name: result.data.user_name,
      user_role: result.data.role_id,
      user_gender: result.data.gender_id,
    };
    sessionStorage.clear();
    sessionStorage.setItem("token", result.data.Token);
    sessionStorage.setItem("user-data", JSON.stringify(user_temp_data));
    window.location.href = "news.html";
  }
});

const REGISTER_BTN = document.querySelector("#register-btn");
REGISTER_BTN.addEventListener("click", () => {
  window.location.href = "register.html";
});
