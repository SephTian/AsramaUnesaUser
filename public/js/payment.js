import { fetchApi } from "./utility/fetch.js";
import { dateYYYYMonDD } from "./utility/date_formatter.js";
import { rupiahFormatter } from "./utility/price_formatter.js";
//rupiahFormatter

let booking_data = JSON.parse(window.sessionStorage.getItem("booking-data"));
console.log(booking_data);

// Balik ke Halaman Booking
document.querySelector("#back-btn").addEventListener("click", () => {
  if (booking_data.is_extend === true) {
    window.sessionStorage.removeItem("booking-data");
    window.location.href = "history.html";
  } else if (booking_data.is_extend === false) {
    booking_data.check_in = "";
    booking_data.check_out = "";
    window.sessionStorage.setItem("booking-data", JSON.stringify(booking_data));
    window.location.href = "booking.html";
  }
});

const BOOK_TYPE = document.querySelectorAll("#book-type");
BOOK_TYPE.forEach((e) => {
  if (booking_data.is_extend === true) {
    e.textContent = "Extend";
  } else if (booking_data.is_extend === false) {
    e.textContent = "Booking";
  }
});

//ASSIGN ROOM
const PAYMENT_ROOM = document.querySelectorAll("#payment-room");
PAYMENT_ROOM.forEach((element) => {
  element.textContent = booking_data.room_name;
});

//ASSIGN PERIOD
document.querySelector("#payment-check-in").textContent = dateYYYYMonDD(booking_data.check_in);
document.querySelector("#payment-check-out").textContent = dateYYYYMonDD(booking_data.check_out.slice(0, 10));

//ASSIGN PERSONAL INFORMATION
document.querySelector("#payment-name").textContent = booking_data.user_name;
document.querySelector("#payment-user-id").textContent = booking_data.user_id;

//Assign Payment
assignPaymentBill();

function assignPaymentBill() {
  // ? maybe in the future ditambahin if disini
  document.querySelector("#payment-name").textContent = booking_data.user_name;

  // Menghitung jumlah bulan yang di booking
  const IN = new Date(booking_data.check_in);
  const OUT = new Date(booking_data.check_out);
  let numMonth = OUT.getMonth() - IN.getMonth();
  numMonth = numMonth < 0 ? numMonth + 12 + 1 : numMonth + 1;

  // Menghitung Harga Nominal (Room Price * jml Month)
  const NOMINAL = numMonth * parseFloat(booking_data.room_price);
  document.querySelector("#payment-nominal").textContent = rupiahFormatter(NOMINAL);

  // Menghitung Harga TAX
  const CURRENT_TAX = 10 / 100;
  const TAX = NOMINAL * CURRENT_TAX;
  document.querySelector("#payment-tax").textContent = rupiahFormatter(TAX);

  // Assign per Month Bill
  document.querySelector("#payment-month-bill").innerHTML = `
    ${rupiahFormatter(booking_data.room_price)} 
    <span class="font-medium text-base"> / months</span>`;

  // Assign Total Bill (Nominal + Tax)
  const TOTAL_BILL = NOMINAL + TAX;
  document.querySelector("#payment-total-bill").textContent = rupiahFormatter(TOTAL_BILL);

  document.querySelector("#pay-btn").addEventListener("click", async (e) => {
    // Changing Button To make it on loading animation
    e.target.disabled = true;
    e.target.textContent = "";
    const BUTTON_ON_LOAD = document.createElement("div");
    BUTTON_ON_LOAD.className = "w-6 h-6 border-4 border-gray-500 border-t-white border-r-white rounded-full animate-loading-btn";
    e.target.appendChild(BUTTON_ON_LOAD);

    booking_data.booking_notes = `${booking_data.user_name} memesan kamar ${booking_data.room_name} pada gedung ${booking_data.building_name} untuk 1 orang dan 1 kasur`;
    booking_data.ppn = TAX;
    booking_data.payment_method_id = document.querySelector("#payment-method").value;

    let result = {};
    if (booking_data.is_extend === false) {
      booking_data.nominal = NOMINAL;
      result = await fetchApi("createNewBooking", "POST", booking_data);
    } else if (booking_data.is_extend === true) {
      booking_data.payment = NOMINAL;
      result = await fetchApi("extendTransactionUser", "PUT", booking_data);
    }
    console.log(result);
    if (result.status === 201) {
      await Swal.fire({
        title: `Booking Success`,
        text: `Please wait...`,
        icon: "success",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 5000,
        customClass: "",
      });
      window.location.href = "history.html";
    } else if (result.status === 200) {
      await Swal.fire({
        title: `Extend Success`,
        text: `Please wait...`,
        icon: "success",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 5000,
        customClass: "",
      });
      window.location.href = "history.html";
    } else if (result.status === 406) {
      await Swal.fire({
        title: `Anda tidak bisa memesan kamar karena telah melakukan booking`,
        text: `Please wait...`,
        icon: "error",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 5000,
        customClass: "",
      });
      window.location.href = "news.html";
    } else {
      await Swal.fire({
        title: `Booking Failed`,
        text: `Please wait...`,
        icon: "error",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 5000,
        customClass: "",
      });
      window.location.href = "history.html";
    }
  });
}
