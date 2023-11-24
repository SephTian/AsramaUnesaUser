import { config } from "./config.js";

let token = sessionStorage.getItem("token");
export async function fetchApi(url, meth = "GET", send_data = null, convert_formdata = true, include_photo = false) {
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
    checkAuth(response);
    return data; // Return the data
  } else if (meth == "POST") {
    let formData = "";

    if (convert_formdata) {
      //Convert ke formdata
      formData = new URLSearchParams();
      for (const [key, value] of Object.entries(send_data)) {
        if (include_photo) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
      // Display the key/value pairs
      // for (var pair of formData.entries()) {
      //   console.log(pair);
      // }
    } else {
      //Passing raw data
      formData = send_data;
      console.warn(`Passing Raw Data: ${formData}`);
    }

    if (include_photo) {
      const response = await fetch(endpoint, {
        method: meth,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const responseData = await response.json();
      checkAuth(response);
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
    } else {
      //POST NO PHOTO
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
      checkAuth(response);
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
  } else if (meth == "PUT") {
    // console.warn(`Passing Raw Data: ${formData}`);

    if (include_photo) {
      let formData = new FormData();
      for (const [key, value] of Object.entries(send_data)) {
        formData.append(key, value);
      }
      const response = await fetch(endpoint, {
        method: meth,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const responseData = await response.json();
      //Check Auth
      checkAuth(response);
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
    } else {
      let formData = new URLSearchParams();
      for (const [key, value] of Object.entries(send_data)) {
        formData.append(key, value.toString());
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
      //Check Auth
      checkAuth(response);
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
  } else if (meth == "PHOTO") {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    checkAuth(response);
    return response; // Return the data
  }
}

async function checkAuth(response) {
  if (!response.ok) {
    if (response.status === 401) {
      await Swal.fire({
        title: `UNAUTHORIZED`,
        text: "please try again...",
        icon: "error",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2000,
      });
      window.location.href = "./";
    } else {
      await Swal.fire({
        title: response.status,
        text: "please try again...",
        icon: "error",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2000,
      });
    }
  }
}
