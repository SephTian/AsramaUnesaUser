import { config } from "./config.js";

let token = sessionStorage.getItem("token");
export async function fetchApi(url, meth = "GET", send_data = null, convert_formdata = true) {
  const endpoint = `${config.api}${url}`;

  // If type of fetch is GET
  if (meth === "GET") {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    });
    const { data } = await response.json();

    // Return the data
    return data;

    // If type of fetch is POST or PUT
  } else if (meth === "POST" || meth === "PUT") {
    let formData = "";

    // If type of fetch is POST
    if (meth === "POST") {
      // Converting form data by parameter on API
      if (convert_formdata) {
        formData = new URLSearchParams();
        for (const [key, value] of Object.entries(send_data)) {
          formData.append(key, value.toString());
        }

        // Not Converting cause API need pure Raw Data
      } else {
        formData = send_data;
        console.warn(`Passing Raw Data: ${formData}`);
      }

      // If type of fetch is PUT
    } else if (meth === "PUT") {
      // Converting form data by parameter on API
      let formData = new URLSearchParams();
      for (const [key, value] of Object.entries(send_data)) {
        formData.append(key, value.toString());
      }
      console.warn(`Passing Raw Data: ${formData}`);
    }

    // DOING FETCH
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

    // If fetch is SUCCEED
    if (responseData != null) {
      return responseData;

      // If fetch is FAILED
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
