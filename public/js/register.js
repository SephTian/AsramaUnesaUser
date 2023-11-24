import { fetchApi, fetchApiImage } from "./utility/fetch.js";
import { setErrorMsg, setSuccessMsg, inputValidation, inputWarning } from "./utility/form_handler.js";

const LOADING_SCREEN = document.querySelector("#loading-screen");
const PAGE_ONE = document.querySelector("[register-page-1]");
const FIRST_NAME = PAGE_ONE.querySelector("#first-name");
const LAST_NAME = PAGE_ONE.querySelector("#last-name");
const SID = PAGE_ONE.querySelector("#sid");
const PHOTO = PAGE_ONE.querySelector("#photo");
const BIRTH_PLACE = PAGE_ONE.querySelector("#birth-place");
const BIRTH_DATE = PAGE_ONE.querySelector("#birth-date");
const GENDER = PAGE_ONE.querySelector(`[name="gender"]:checked`);
const PHONE_NUMBER = PAGE_ONE.querySelector(`#phone`);
const PASS = PAGE_ONE.querySelector(`#password`);
const F_PASS = PAGE_ONE.querySelector(`#confirm-password`);
const PAGE_TWO = document.querySelector("[register-page-2]");
const FATHER_NIK = PAGE_TWO.querySelector("#father-nik");
const FATHER_NAME = PAGE_TWO.querySelector("#father-name");
const FATHER_PHONE = PAGE_TWO.querySelector("#father-phone");
const MOTHER_NIK = PAGE_TWO.querySelector("#mother-nik");
const MOTHER_NAME = PAGE_TWO.querySelector("#mother-name");
const MOTHER_PHONE = PAGE_TWO.querySelector("#mother-phone");

//LOADING_SCREEN.showModal();

LOADING_SCREEN.addEventListener("cancel", function (e) {
  e.preventDefault();
});

let validate = {
  f_name: false,
  l_name: false,
  sid: false,
  birth_p: false,
  birth_d: false,
  phone: false,
  pass: false,
  f_pass: false,
};

let currentPage = 1;
document.querySelector("#back-button").addEventListener("click", () => {
  if (currentPage > 1) {
    document.querySelector(`[register-page-${currentPage}]`).classList.add("hidden");
    currentPage--;
    document.querySelector(`[register-page-${currentPage}]`).classList.remove("hidden");
    return true;
  }

  window.location.href = "login.html";
  return true;
});

// PHOTO
const PHOTO_NAME_VIEWER = PAGE_ONE.querySelector(`#photo-name-viewer`);
PHOTO.addEventListener("change", (e) => {
  const img = e.target.files[0];
  PHOTO_NAME_VIEWER.textContent = img.name;
});

// CHECKING ON CHANGE PADA INPUTAN DI PAGE PERTAMA
FIRST_NAME.addEventListener("change", () => {
  validate.f_name = inputWarning("string", FIRST_NAME, 3, "Please input first name correctly!", `Please input minimum 3 character!`);
});
LAST_NAME.addEventListener("change", () => {
  validate.l_name = inputWarning("string", LAST_NAME, 3, "Please input last name correctly!", `Please input minimum 3 character!`);
});
SID.addEventListener("change", () => {
  validate.sid = inputWarning("string", SID, 5, "Please input student id correctly!", `Please input minimum 5 character!`);
});
BIRTH_PLACE.addEventListener("change", () => {
  validate.birth_p = inputWarning("string", BIRTH_PLACE, 3, "Please input birth place correctly!", `Please input minimum 3 character!`);
});
BIRTH_DATE.addEventListener("change", () => {
  validate.birth_d = inputWarning("simple", BIRTH_DATE, 3, "Please input birth date correctly!", `Please input minimum 3 character!`);
});
PHONE_NUMBER.addEventListener("change", () => {
  validate.phone = inputWarning("number", PHONE_NUMBER, 10, "Please input phone number correctly!", `Please input minimum 10 character!`);
});
PASS.addEventListener("change", () => {
  validate.pass = inputWarning("string", PASS, 5, "Please input pass correctly!", `Please input minimum 5 character!`);
});
F_PASS.addEventListener("change", () => {
  if (F_PASS.value === "") {
    setErrorMsg(F_PASS, "Please input pass correctly!");
    validate.f_pass = false;
    return false;
  } else if (F_PASS.value.length < 5) {
    setErrorMsg(F_PASS, "Please input minimum 5 character!");
    validate.f_pass = false;
    return false;
  } else if (F_PASS.value !== PASS.value) {
    setErrorMsg(F_PASS, "Password is not the same!");
    validate.f_pass = false;
    return false;
  } else {
    setSuccessMsg(F_PASS);
    validate.f_pass = true;
    return true;
  }
});

// Jika Mau Lanjut ke Page Selanjutnya
PAGE_ONE.querySelector("#next-register-page-btn").addEventListener("click", async () => {
  registerPageOneFullCheck();
  if (inputValidation(validate, Object.keys(validate).length)) {
    LOADING_SCREEN.showModal();

    // Pengecekan student number
    let currentSID = {
      student_number: SID.value,
    };
    let result = await fetchApi(`validateStudentNumber?student_number=${SID.value}`, "POST", currentSID);

    // Jika student number sudah dipakai oleh orang lain
    if (result.Data) {
      LOADING_SCREEN.close();
      await Swal.fire({
        title: `Student number already taken`,
        text: "please try again...",
        icon: "error",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2000,
      });

      return false;
    }

    // Jika student number belum dipakai
    LOADING_SCREEN.close();
    document.querySelector(`[register-page-${currentPage}]`).classList.add("hidden");
    currentPage++;
    document.querySelector(`[register-page-${currentPage}]`).classList.remove("hidden");
  }
});

let validate_parent = {
  add_father: false,
  father_name: false,
  father_phone: false,
  add_mother: false,
  mother_name: false,
  mother_phone: false,
};

// Untuk mengubah inputan jika nik AYAH telah di masukkan
FATHER_NIK.addEventListener("change", (e) => {
  if (e.target.value.toString().length < 5) {
    FATHER_NAME.disabled = true;
    FATHER_NAME.value = "";
    setSuccessMsg(FATHER_NAME);
    FATHER_PHONE.disabled = true;
    FATHER_PHONE.value = "";
    setSuccessMsg(FATHER_PHONE);
    return true;
  }
  //? nanti pas assign data ada pengecekan lagi biar nanti kirim niknya jadi ""

  FATHER_PHONE.disabled = false;
  FATHER_NAME.disabled = false;
});

// Untuk mengubah inputan jika nik IBU telah di masukkan
MOTHER_NIK.addEventListener("change", (e) => {
  if (e.target.value.toString().length < 5) {
    MOTHER_NAME.disabled = true;
    MOTHER_NAME.value = "";
    setSuccessMsg(MOTHER_NAME);
    MOTHER_PHONE.disabled = true;
    MOTHER_PHONE.value = "";
    setSuccessMsg(MOTHER_PHONE);
    return true;
  }
  //? nanti pas assign data ada pengecekan lagi biar nanti kirim niknya jadi ""

  MOTHER_PHONE.disabled = false;
  MOTHER_NAME.disabled = false;
});

// pengecekan untuk bagian FATHER
FATHER_NAME.addEventListener("change", () => {
  validate_parent.father_name = inputWarning("string", FATHER_NAME, 3, "Please input father name correctly", `Please input minimum 3 character`);
});
FATHER_PHONE.addEventListener("change", () => {
  validate_parent.father_phone = inputWarning("number", FATHER_PHONE, 10, "Please input father phone correctly", `Please input minimum 10 character`);
});

// pengecekan untuk bagian MOTHER
MOTHER_NAME.addEventListener("change", () => {
  validate_parent.mother_name = inputWarning("string", MOTHER_NAME, 3, "Please input mother name correctly", `Please input minimum 3 character`);
});
MOTHER_PHONE.addEventListener("change", () => {
  validate_parent.mother_phone = inputWarning("number", MOTHER_PHONE, 10, "Please input mother phone correctly", `Please input minimum 10 character`);
});

// Jika Mau Lanjut ke Page Selanjutnya
PAGE_TWO.querySelector("#submit-register-page-btn").addEventListener("click", async () => {
  let sendData = {
    fname: FIRST_NAME.value,
    lname: LAST_NAME.value,
    sid: SID.value,
    pob: BIRTH_PLACE.value,
    dob: BIRTH_DATE.value,
    gender: GENDER.value,
    phonenum: PHONE_NUMBER.value,
    password: F_PASS.value,
    father_nik: "",
    father_name: "",
    father_phonenum: "",
    mother_nik: "",
    mother_name: "",
    mother_phonenum: "",
  };

  if (PHOTO.files.length > 0) {
    sendData.photo = PHOTO.files[0];
  }

  // Pengecekan jika mahasiwa ingin menambahkan AYAH
  if (FATHER_NIK.value.toString().length >= 5 && MOTHER_NIK.value.toString().length < 5) {
    if (validate_parent.father_name === false || validate_parent.father_phone === false) {
      validate_parent.father_name = inputWarning("string", FATHER_NAME, 3, "Please input father name correctly", `Please input minimum 3 character`);
      validate_parent.father_phone = inputWarning("number", FATHER_PHONE, 10, "Please input father phone correctly", `Please input minimum 10 character`);

      return false;
    }

    sendData.father_nik = FATHER_NIK.value;
    sendData.father_name = FATHER_NAME.value;
    sendData.father_phonenum = FATHER_PHONE.value;

    // Pengecekan jika mahasiwa ingin menambahkan IBU
  } else if (FATHER_NIK.value.toString().length < 5 && MOTHER_NIK.value.toString().length >= 5) {
    if (validate_parent.mother_name === false || validate_parent.mother_phone === false) {
      validate_parent.mother_name = inputWarning("string", MOTHER_NAME, 3, "Please input mother name correctly", `Please input minimum 3 character`);
      validate_parent.mother_phone = inputWarning("number", MOTHER_PHONE, 10, "Please input mother phone correctly", `Please input minimum 10 character`);

      return false;
    }

    sendData.mother_nik = MOTHER_NIK.value;
    sendData.mother_name = MOTHER_NAME.value;
    sendData.mother_phonenum = MOTHER_PHONE.value;

    // Pengecekan jika mahasiwa ingin menambahkan AYAH DAN IBU
  } else if (FATHER_NIK.value.toString().length >= 5 && MOTHER_NIK.value.toString().length >= 5) {
    if (validate_parent.father_name === false || validate_parent.father_phone === false || validate_parent.mother_name === false || validate_parent.mother_phone === false) {
      validate_parent.father_name = inputWarning("string", FATHER_NAME, 3, "Please input father name correctly", `Please input minimum 3 character`);
      validate_parent.father_phone = inputWarning("number", FATHER_PHONE, 10, "Please input father phone correctly", `Please input minimum 10 character`);
      validate_parent.mother_name = inputWarning("string", MOTHER_NAME, 3, "Please input mother name correctly", `Please input minimum 3 character`);
      validate_parent.mother_phone = inputWarning("number", MOTHER_PHONE, 10, "Please input mother phone correctly", `Please input minimum 10 character`);

      return false;
    }

    sendData.father_nik = FATHER_NIK.value;
    sendData.father_name = FATHER_NAME.value;
    sendData.father_phonenum = FATHER_PHONE.value;
    sendData.mother_nik = MOTHER_NIK.value;
    sendData.mother_name = MOTHER_NAME.value;
    sendData.mother_phonenum = MOTHER_PHONE.value;
  } else {
    validate_parent.father_name = false;
    validate_parent.father_phone = false;
    validate_parent.mother_name = false;
    validate_parent.mother_phone = false;
    sendData.father_nik = "";
    sendData.mother_nik = "";
  }

  // ? FETCH SEND DATA DISINI
  LOADING_SCREEN.showModal();
  console.log(sendData);
  let result = await fetchApiImage(`registerUser`, "POST", sendData);

  // Jika student number sudah dipakai oleh orang lain
  if (result.status === 201) {
    LOADING_SCREEN.close();
    await Swal.fire({
      title: `Register Success`,
      text: "please wait..",
      icon: "success",
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 2000,
    });

    window.location.href = "login.html";
    return true;
  } else {
    LOADING_SCREEN.close();
    await Swal.fire({
      title: `Student number already taken`,
      text: "please try again...",
      icon: "error",
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 2000,
    });

    return false;
  }
});

function registerPageOneFullCheck() {
  validate.f_name = inputWarning("string", FIRST_NAME, 3, "Please input first name correctly", `Please input minimum 3 character`);
  validate.l_name = inputWarning("string", LAST_NAME, 3, "Please input last name correctly!", `Please input minimum 3 character!`);
  validate.sid = inputWarning("string", SID, 5, "Please input student id correctly!", `Please input minimum 5 character!`);
  validate.birth_p = inputWarning("string", BIRTH_PLACE, 3, "Please input birth place correctly!", `Please input minimum 3 character!`);
  validate.birth_d = inputWarning("simple", BIRTH_DATE, 3, "Please input birth date correctly!", `Please input minimum 3 character!`);
  validate.phone = inputWarning("number", PHONE_NUMBER, 10, "Please input phone number correctly!", `Please input minimum 10 character!`);
  validate.pass = inputWarning("string", PASS, 5, "Please input pass correctly!", `Please input minimum 5 character!`);
  if (F_PASS.value === "") {
    setErrorMsg(F_PASS, "Please input pass correctly!");
    validate.f_pass = false;
    return false;
  } else if (F_PASS.value.length < 5) {
    setErrorMsg(F_PASS, "Please input minimum 5 character!");
    validate.f_pass = false;
    return false;
  } else if (F_PASS.value !== PASS.value) {
    setErrorMsg(F_PASS, "Password is not the same!");
    validate.f_pass = false;
    return false;
  } else {
    setSuccessMsg(F_PASS);
    validate.f_pass = true;
    return true;
  }
}
