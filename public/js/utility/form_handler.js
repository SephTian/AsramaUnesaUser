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
