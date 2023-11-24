// % Jika ada error pada input
export function setErrorMsg(element, message) {
  const data = element.parentElement;
  const small = data.querySelector("small");
  small.innerText = message;
}

// % Jika tidak ada error pada input
export function setSuccessMsg(element) {
  const data = element.parentElement;
  const small = data.querySelector("small");
  small.innerText = "";
}

// % Validasi input-input pada setiap halaman
export function inputValidation(assoc_array, true_count) {
  let count = 0;
  Object.values(assoc_array).forEach((value) => {
    if (value === true) {
      count++;
    }
  });
  if (count === true_count) {
    return true;
  } else {
    return false;
  }
}

export function inputWarning(type_input = "string", input_object, minimum_char = 0, warning_msg_empty = "", warning_msg_not_empty = "", need_parent = false) {
  let obj_e = "";
  if (need_parent) {
    obj_e = input_object.parentElement;
  } else if (!need_parent) {
    obj_e = input_object;
  }

  const OBJECT_VALUE = input_object.value;
  // Kalau mau input nya string
  if (type_input === "string") {
    if (OBJECT_VALUE.trim() === "") {
      setErrorMsg(obj_e, warning_msg_empty);
      return false;
    } else if (OBJECT_VALUE.trim().length < minimum_char) {
      setErrorMsg(obj_e, warning_msg_not_empty);
      return false;
    } else {
      setSuccessMsg(obj_e);
      return true;
    }

    // Kalau mau input nya number
  } else if (type_input === "number") {
    if (OBJECT_VALUE.toString() === "") {
      setErrorMsg(obj_e, warning_msg_empty);
      return false;
    } else if (OBJECT_VALUE.toString().length < minimum_char) {
      setErrorMsg(obj_e, warning_msg_not_empty);
      return false;
    } else {
      setSuccessMsg(obj_e);
      return true;
    }

    // kalau mau inputnya yang simple simple aja a Bolehhh
  } else if (type_input === "simple") {
    if (OBJECT_VALUE.toString() === "") {
      setErrorMsg(obj_e, warning_msg_empty);
      return false;
    } else {
      setSuccessMsg(obj_e);
      return true;
    }
  }
}
