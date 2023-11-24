import { config } from "./utility/config.js";
import { fetchApi, fetchApiImage } from "./utility/fetch.js";
import { dateYYYYMonthDD } from "./utility/date_formatter.js";
import { setErrorMsg, setSuccessMsg, inputValidation, inputWarning } from "./utility/form_handler.js";

const DATA_PROFILE = await fetchApi("getUsersProfile");
console.log(DATA_PROFILE);

//@ SEMUA ELEMENT DATA YANG HARUS DIMASUKKIN
const USER_IMAGE = document.querySelector("#user-image");
const USER_STATUS = document.querySelector("#user-status");
const USER_ACC_ID = document.querySelector("#user-acc-id");
const USER_NAME = document.querySelectorAll("#user-name");
const USER_ID = document.querySelector("#user-id");
const USER_BIRTH = document.querySelector("#user-birth");
const USER_PHONE = document.querySelector("#user-phone");
const FATHER_NAME = document.querySelector("#user-father-name");
const FATHER_NIK = document.querySelector("#user-father-nik");
const FATHER_PHONE = document.querySelector("#user-father-phone");
const MOTHER_NAME = document.querySelector("#user-mother-name");
const MOTHER_NIK = document.querySelector("#user-mother-nik");
const MOTHER_PHONE = document.querySelector("#user-mother-phone");

//@ SEMUA ELEMENT DATA Untuk EDIT
const EDIT_F_NAME = document.querySelector("#edit-first-name");
const EDIT_L_NAME = document.querySelector("#edit-last-name");
const EDIT_PHONE = document.querySelector("#edit-phone");
const EDIT_FATHER_PHONE = document.querySelector("#edit-father-phone");
const EDIT_MOTHER_PHONE = document.querySelector("#edit-mother-phone");

//@ SEMUA ELEMENT DATA Untuk ADD FATHER
const ADD_F_NIK = document.querySelector("#add-father-nik");
const ADD_F_NAME = document.querySelector("#add-father-name");
const ADD_F_PHONE = document.querySelector("#add-father-phone");

//@ SEMUA ELEMENT DATA Untuk ADD MOTHER
const ADD_M_NIK = document.querySelector("#add-mother-nik");
const ADD_M_NAME = document.querySelector("#add-mother-name");
const ADD_M_PHONE = document.querySelector("#add-mother-phone");

//@ SEMUA ELEMENT DATA Untuk change pass
const OLD_PASS = document.querySelector("#old-pass");
const TOGGLE_OLD = document.querySelector("#toggle-old-pass");
const NEW_PASS = document.querySelector("#new-pass");
const TOGGLE_NEW = document.querySelector("#toggle-new-pass");

// @ SEMUA ELEMENT DIALOG
const DIALOG_EDIT_PROFILE = document.querySelector("#dialog-edit-profile");
const DIALOG_ADD_FATHER = document.querySelector("#dialog-add-father");
const DIALOG_ADD_MOTHER = document.querySelector("#dialog-add-mother");
const DIALOG_CHANGE_PASS = document.querySelector("#dialog-change-pass");
const DIALOG_CONFIRMATION = document.querySelector("#dialog-confirmation");
const LOADING_SCREEN = document.querySelector("#loading-screen");

//Memasukkan data pada halaman profil
if (DATA_PROFILE.Profile.student_number !== "") {
  USER_STATUS.textContent = "Active Student";
} else if (DATA_PROFILE.Profile.student_number !== "") {
  USER_STATUS.textContent = "Active Lecturer";
}
USER_IMAGE.src = `${config.api}getFiles?id_user=${DATA_PROFILE.Profile.user_id}`;
USER_ACC_ID.textContent = DATA_PROFILE.Profile.user_id;
USER_NAME.forEach((name) => {
  name.textContent = `${DATA_PROFILE.Profile.first_name} ${DATA_PROFILE.Profile.last_name}`;
});
USER_ID.textContent = DATA_PROFILE.Profile.student_number;
USER_BIRTH.textContent = `${DATA_PROFILE.Profile.pob}, ${dateYYYYMonthDD(DATA_PROFILE.Profile.dob.slice(0, 10))}`;
USER_PHONE.textContent = DATA_PROFILE.Profile.phone_num;

//===============================================

document.querySelector("#change-picture-btn").addEventListener("change", async (e) => {
  LOADING_SCREEN.showModal();
  const NEW_PIC = e.target.files[0];
  let sendImage = {
    photo: NEW_PIC,
  };

  let result = await fetchApiImage(`updateFiles`, "PUT", sendImage);

  console.log(result);
  // // Jika student number sudah dipakai oleh orang lain
  if (result.status === 200) {
    LOADING_SCREEN.close();
    await Swal.fire({
      title: `Success Changing Photo`,
      text: "please wait..",
      icon: "success",
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 2000,
    });

    window.location.reload();
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

//===============================================

//Memasukkan data orang tua
//FATHER
if (DATA_PROFILE.Father.guest_nik !== "") {
  FATHER_NAME.textContent = DATA_PROFILE.Father.guest_names;
  FATHER_NIK.textContent = DATA_PROFILE.Father.guest_nik;
  FATHER_PHONE.textContent = DATA_PROFILE.Father.guest_phone_num;
} else {
  document.querySelector("#btn-add-father").classList.remove("hidden");
}
//IBU
if (DATA_PROFILE.Mother.guest_nik !== "") {
  MOTHER_NAME.textContent = DATA_PROFILE.Mother.guest_names;
  MOTHER_NIK.textContent = DATA_PROFILE.Mother.guest_nik;
  MOTHER_PHONE.textContent = DATA_PROFILE.Mother.guest_phone_num;
} else {
  document.querySelector("#btn-add-mother").classList.remove("hidden");
}

//======================================================

//Memasukkan data pada form edit data
document.querySelector("#btn-edit-profile").addEventListener("click", () => {
  DIALOG_EDIT_PROFILE.showModal();
  EDIT_F_NAME.value = DATA_PROFILE.Profile.first_name;
  EDIT_L_NAME.value = DATA_PROFILE.Profile.last_name;
  EDIT_PHONE.value = DATA_PROFILE.Profile.phone_num;
  EDIT_FATHER_PHONE.value = DATA_PROFILE.Father.guest_phone_num;
  EDIT_MOTHER_PHONE.value = DATA_PROFILE.Mother.guest_phone_num;
});

let validate_edit = {
  f_name: false,
  l_name: false,
  phone: false,
  f_phone: false,
  m_phone: false,
};

//Pengecakan EDIT data pada saat habis memasukkan input
EDIT_F_NAME.addEventListener("change", () => {
  validate_edit.f_name = inputWarning("string", EDIT_F_NAME, 1, "Please input your first name correctly", `Please input minimum 1 character`);
});
EDIT_L_NAME.addEventListener("change", () => {
  validate_edit.l_name = inputWarning("string", EDIT_L_NAME, 1, "Please input your last name correctly", `Please input minimum 1 character`);
});
EDIT_PHONE.addEventListener("change", () => {
  validate_edit.phone = inputWarning("number", EDIT_PHONE, 10, "Please input your phone number correctly", `Please input minimum 10 character`);
});

if (DATA_PROFILE.Father.guest_nik === "") {
  EDIT_FATHER_PHONE.disabled = true;
  validate_edit.f_phone = true;
} else {
  EDIT_FATHER_PHONE.addEventListener("change", () => {
    validate_edit.f_phone = inputWarning("number", EDIT_FATHER_PHONE, 10, "Please input father phone number correctly", `Please input minimum 10 character`);
  });
}

if (DATA_PROFILE.Mother.guest_nik === "") {
  EDIT_MOTHER_PHONE.disabled = true;
  validate_edit.m_phone = true;
} else {
  EDIT_MOTHER_PHONE.addEventListener("change", () => {
    validate_edit.m_phone = inputWarning("number", EDIT_MOTHER_PHONE, 10, "Please input mother phone number correctly", `Please input minimum 10 character`);
  });
}

//Lanjut ke tahap konfirmasi
document.querySelector("#form-edit-profile").addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("masuk");
  validate_edit.f_name = inputWarning("string", EDIT_F_NAME, 1, "Please input first name correctly", `Please input minimum 1 character`);
  validate_edit.l_name = inputWarning("string", EDIT_L_NAME, 1, "Please input last name correctly", `Please input minimum 1 character`);
  validate_edit.phone = inputWarning("number", EDIT_PHONE, 10, "Please input your phone number correctly", `Please input minimum 10 character`);
  if (DATA_PROFILE.Mother.guest_nik !== "") {
    validate_edit.m_phone = inputWarning("number", EDIT_MOTHER_PHONE, 10, "Please input mother phone number correctly", `Please input minimum 10 character`);
  }
  if (DATA_PROFILE.Father.guest_nik !== "") {
    validate_edit.f_phone = inputWarning("number", EDIT_FATHER_PHONE, 10, "Please input father phone number correctly", `Please input minimum 10 character`);
  }

  if (inputValidation(validate_edit, Object.keys(validate_edit).length)) {
    DIALOG_EDIT_PROFILE.close();
    let sendData = {
      first_name: EDIT_F_NAME.value,
      last_name: EDIT_L_NAME.value,
      phone_num: EDIT_PHONE.value,
      father_phone_num: EDIT_FATHER_PHONE.value,
      mother_phone_num: EDIT_MOTHER_PHONE.value,
    };

    openConfirmation(fetchApi, `editProfile`, "PUT", sendData, "Are you sure you want to edit your data?", "Success edit data");
  }
});

//================================================

//Membuka form untuk ADD father
document.querySelector("#btn-add-father").addEventListener("click", () => {
  DIALOG_ADD_FATHER.showModal();
});

let validate_add_father = {
  nik: false,
  name: false,
  phone: false,
};

//Pengecakan ADD father pada saat habis memasukkan input
ADD_F_NIK.addEventListener("change", () => {
  validate_add_father.father_nik = inputWarning("number", ADD_F_NIK, 5, "Please input father nik correctly", `Please input minimum 5 character`);
});
ADD_F_NAME.addEventListener("change", () => {
  validate_add_father.father_name = inputWarning("string", ADD_F_NAME, 3, "Please input father name correctly", `Please input minimum 3 character`);
});
ADD_F_PHONE.addEventListener("change", () => {
  validate_add_father.father_name = inputWarning("number", ADD_F_PHONE, 10, "Please input father phone correctly", `Please input minimum 10 character`);
});

//Lanjut ke tahap konfirmasi
document.querySelector("#form-add-father").addEventListener("submit", (e) => {
  e.preventDefault();

  validate_add_father.nik = inputWarning("number", ADD_F_NIK, 5, "Please input father nik correctly", `Please input minimum 5 character`);
  validate_add_father.name = inputWarning("string", ADD_F_NAME, 2, "Please input father name correctly", `Please input minimum 3 character`);
  validate_add_father.phone = inputWarning("number", ADD_F_PHONE, 10, "Please input father phone correctly", `Please input minimum 10 character`);

  if (inputValidation(validate_add_father, Object.keys(validate_add_father).length)) {
    DIALOG_ADD_FATHER.close();
    let sendData = {
      user_bind_id: DATA_PROFILE.Profile.user_id,
      father_nik: ADD_F_NIK.value,
      father_name: ADD_F_NAME.value,
      father_phonenum: ADD_F_PHONE.value,
    };

    openConfirmation(fetchApi, `createFather`, "POST", sendData, "Are you sure you want to add father's data?", "Success adding father");
  }
});

//==========================================================

//Membuka form untuk ADD mother
document.querySelector("#btn-add-mother").addEventListener("click", () => {
  DIALOG_ADD_MOTHER.showModal();
});

let validate_add_mother = {
  nik: false,
  name: false,
  phone: false,
};

//Pengecakan ADD mother pada saat habis memasukkan input
ADD_M_NIK.addEventListener("change", () => {
  validate_add_mother.mother_nik = inputWarning("number", ADD_M_NIK, 5, "Please input mother nik correctly", `Please input minimum 5 character`);
});
ADD_M_NAME.addEventListener("change", () => {
  validate_add_mother.mother_name = inputWarning("string", ADD_M_NAME, 3, "Please input mother name correctly", `Please input minimum 3 character`);
});
ADD_M_PHONE.addEventListener("change", () => {
  validate_add_mother.mother_name = inputWarning("number", ADD_M_PHONE, 10, "Please input mother phone correctly", `Please input minimum 10 character`);
});

//Lanjut ke tahap konfirmasi
document.querySelector("#form-add-mother").addEventListener("submit", (e) => {
  e.preventDefault();

  validate_add_mother.nik = inputWarning("number", ADD_M_NIK, 5, "Please input mother nik correctly", `Please input minimum 5 character`);
  validate_add_mother.name = inputWarning("string", ADD_M_NAME, 2, "Please input mother name correctly", `Please input minimum 3 character`);
  validate_add_mother.phone = inputWarning("number", ADD_M_PHONE, 10, "Please input mother phone correctly", `Please input minimum 10 character`);

  if (inputValidation(validate_add_mother, Object.keys(validate_add_mother).length)) {
    DIALOG_ADD_MOTHER.close();
    let sendData = {
      user_bind_id: DATA_PROFILE.Profile.user_id,
      mother_nik: ADD_M_NIK.value,
      mother_name: ADD_M_NAME.value,
      mother_phonenum: ADD_M_PHONE.value,
    };

    openConfirmation(fetchApi, `createMother`, "POST", sendData, "Are you sure you want to add mother's data?", "Success adding mother");
  }
});

//==========================================================
const T_ON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="currentColor">
                  <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18Zm19.146 10.083a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69c.12.362.12.752 0 1.113Z"/><path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12Zm-3.22 3.713l-4.243-4.244a3.75 3.75 0 0 0 4.243 4.243Z"/><path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114c1.489 4.467 5.704 7.69 10.675 7.69c1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z"/>
                </g>
              </svg>
`;
const T_OFF = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="currentColor"><path d="M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z"/>
                  <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69c.12.362.12.752 0 1.113c-1.487 4.471-5.705 7.697-10.677 7.697c-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0a5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd"/>
                </g>
              </svg>
`;

TOGGLE_NEW.addEventListener("click", () => {
  if (NEW_PASS.type === "password") {
    TOGGLE_NEW.innerHTML = T_ON;
    NEW_PASS.type = "text";
  } else if (NEW_PASS) {
    TOGGLE_NEW.innerHTML = T_OFF;
    NEW_PASS.type = "password";
  }
});

TOGGLE_OLD.addEventListener("click", () => {
  if (OLD_PASS.type === "text") {
    TOGGLE_OLD.innerHTML = T_OFF;
    OLD_PASS.type = "password";
  } else if (OLD_PASS) {
    TOGGLE_OLD.innerHTML = T_ON;
    OLD_PASS.type = "text";
  }
});

//Membuka form untuk CHANGE PASSWORD
document.querySelector("#btn-change-pass").addEventListener("click", () => {
  DIALOG_CHANGE_PASS.showModal();
  OLD_PASS.value = "";
  NEW_PASS.value = "";
});

let validate_change_pass = {
  old: false,
  new: false,
};
OLD_PASS.addEventListener("change", () => {
  validate_change_pass.old = inputWarning("string", OLD_PASS, 5, "Please input pass correctly!", `Please input minimum 5 character!`, true);
});
NEW_PASS.addEventListener("change", () => {
  validate_change_pass.new = inputWarning("string", NEW_PASS, 5, "Please input pass correctly!", `Please input minimum 5 character!`, true);
});

//Lanjut ke tahap konfirmasi
document.querySelector("#form-change-pass").addEventListener("submit", (e) => {
  e.preventDefault();

  validate_change_pass.old = inputWarning("string", OLD_PASS, 5, "Please input pass correctly!", `Please input minimum 5 character!`, true);
  validate_change_pass.new = inputWarning("string", NEW_PASS, 5, "Please input pass correctly!", `Please input minimum 5 character!`, true);

  if (inputValidation(validate_change_pass, Object.keys(validate_change_pass).length)) {
    DIALOG_CHANGE_PASS.close();
    let sendData = {
      old_password: OLD_PASS.value,
      password: NEW_PASS.value,
    };

    console.log(sendData);
    //? FETCH API CHANGE PASSWORD
    openConfirmation(fetchApi, `changePassword`, "PUT", sendData, "Are you sure you want to change your password?", "Success edit your password");
  }
});

//==========================================================
function openConfirmation(fetchFunction, link = "", type = "POST", data = {}, confirm_msg = "Are you sure", success_msg = "Success", failed_msg = "Failed") {
  DIALOG_CONFIRMATION.showModal();

  document.querySelector("#confirm-text").textContent = confirm_msg;

  //Jika Klik CANCEL
  DIALOG_CONFIRMATION.querySelector("#not-confirm").addEventListener("click", () => {
    DIALOG_CONFIRMATION.close();
  });

  //Jika Klik CONFIRM
  DIALOG_CONFIRMATION.querySelector("#confirm").addEventListener("click", async () => {
    DIALOG_CONFIRMATION.close();
    LOADING_SCREEN.showModal();
    let result = await fetchFunction(link, type, data);

    console.log(result);
    // Jika student number sudah dipakai oleh orang lain
    if (result.status === 200) {
      LOADING_SCREEN.close();
      await Swal.fire({
        title: success_msg,
        text: "please wait..",
        icon: "success",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2000,
      });

      window.location.href = "profile.html";
      return true;
    } else if (result.status === 201) {
      LOADING_SCREEN.close();
      await Swal.fire({
        title: success_msg,
        text: "please wait..",
        icon: "success",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2000,
      });

      window.location.href = "profile.html";
      return true;
    } else if (result.status === 202) {
      LOADING_SCREEN.close();
      await Swal.fire({
        title: success_msg,
        text: "please wait..",
        icon: "success",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2000,
      });

      window.location.href = "profile.html";
      return true;
    } else {
      LOADING_SCREEN.close();
      await Swal.fire({
        title: failed_msg,
        text: "please try again...",
        icon: "error",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2000,
      });

      return false;
    }
  });
}
