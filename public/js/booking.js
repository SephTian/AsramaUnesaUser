import { fetchApi } from "./utility/fetch.js";

let booking_data = JSON.parse(window.sessionStorage.getItem("booking-data"));
console.log(booking_data);

// Balik ke Halaman Booking
document.querySelector("#back-btn").addEventListener("click", () => {
  booking_data.room_id = "";
  booking_data.room_name = "";
  booking_data.room_price = "";
  window.sessionStorage.setItem("booking-data", JSON.stringify(booking_data));
  window.location.href = "room.html";
});

//Assign Room Name
document.querySelector("#booking-room").textContent = booking_data.room_name;

//Assign Personal Information
document.querySelector("#booking-name").textContent = booking_data.user_name;
document.querySelector("#booking-user-id").textContent = booking_data.user_id;

document.querySelector("#book-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const PERIOD_VALUE = document.querySelector("#booking-period").value;

  // Mengambil tanggal sekarang
  const TODAY = new Date();
  let today_dd = String(TODAY.getDate()).padStart(2, "0");
  let today_mm = String(TODAY.getMonth() + 1).padStart(2, "0");
  let today_yyyy = TODAY.getFullYear();
  const CHECK_IN = `${today_yyyy}-${today_mm}-${today_dd}`;

  // Menambahkan ke Bulan yang dipilih
  TODAY.setMonth(TODAY.getMonth() + parseInt(PERIOD_VALUE - 1));
  let after_mm = String(TODAY.getMonth() + 1).padStart(2, "0");
  let after_yyyy = TODAY.getFullYear();
  let after_dd = getLastDateOfMonth(parseInt(after_yyyy), parseInt(after_mm));
  const CHECK_OUT = `${after_yyyy}-${after_mm}-${after_dd}`;

  // Kalau tanggal lebih dari 21 mahasiswa gabisa booking
  if (parseInt(today_dd) > 31) {
    await Swal.fire({
      title: `Please wait next month to book`,
      text: `Please wait...`,
      icon: "error",
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 2000,
      customClass: "",
    });
  } else {
    // Memasukkan ke Session
    booking_data.check_in = CHECK_IN;
    booking_data.check_out = CHECK_OUT;
    window.sessionStorage.setItem("booking-data", JSON.stringify(booking_data));

    window.location.href = "payment.html";
  }
});

function getLastDateOfMonth(year, month) {
  return String(new Date(year, month, 0).getDate()).padStart(2, "0");
}
