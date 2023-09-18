import { config } from "./config.js";

let token = sessionStorage.getItem("token");
export async function fetchApi(url, meth = "GET", send_data = null, convert_formdata = true) {
  const endpoint = `${config.api}${url}`;

  if (meth == "GET") {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    });
    const { data } = await response.json();

    return data; // Return the data
  } else if (meth == "POST") {
    let formData = "";

    if (convert_formdata) {
      //Convert ke formdata
      formData = new URLSearchParams();
      for (const [key, value] of Object.entries(send_data)) {
        formData.append(key, value.toString());
      }
      console.log(formData);
    } else {
      //Passing raw data
      formData = send_data;
      console.warn(`Passing Raw Data: ${formData}`);
    }

    const response = await fetch(endpoint, {
      method: meth,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const responseData = await response.json();

    if (responseData != null) {
      return responseData;
    } else {
      await Swal.fire({
        title: `${responseData["message"]}`,
        text: "please try again...",
        icon: "error",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2000,
      });

      return false;
    }
  } else if (meth == "PUT") {
    let formData = new URLSearchParams();
    for (const [key, value] of Object.entries(send_data)) {
      formData.append(key, value.toString());
    }
    console.warn(`Passing Raw Data: ${formData}`);

    const response = await fetch(endpoint, {
      method: meth,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const responseData = await response.json();

    if (responseData != null) {
      return responseData;
    } else {
      await Swal.fire({
        title: `${responseData["message"]}`,
        text: "please try again...",
        icon: "error",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2000,
      });

      return false;
    }
  }
}
