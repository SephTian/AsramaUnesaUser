import { fetchApi } from "./utility/fetch.js";
import { dateYYYYMonDD } from "./utility/date_formatter.js";

let user_data = JSON.parse(window.sessionStorage.getItem("user-data"));
const BOOKING_LIST = document.querySelector("#booking-list");

document.querySelector("#pay-btn").addEventListener("click", () => {
  window.location.href = "payment-due.html";
});

const DATA_HISTORY = await fetchApi("getMyBookings");
console.log(DATA_HISTORY);

showBookingHistory(DATA_HISTORY.Bookings);

// Menampilkan data sesuai filter search
document.querySelector("#filter-search").addEventListener("keyup", (e) => {
  const SEARCH_VALUE = e.target.value.toLowerCase();
  const SEARCHED_DATA = DATA_HISTORY.Bookings.filter((item) => {
    return item.booking_room.toLowerCase().includes(SEARCH_VALUE) || item.booking_id.toLowerCase().includes(SEARCH_VALUE);
  });
  showBookingHistory(SEARCHED_DATA);
});

function showBookingHistory(data = []) {
  BOOKING_LIST.textContent = "";

  //INI AKAN MENAMPILKAN JIKA TIDAK ADA BOOKING
  if (data === null || data.length === 0) {
    const NO_BOOKING = document.createElement("div");
    NO_BOOKING.className = "font-medium text-center text-xl mt-20 text-unesa italic";
    NO_BOOKING.textContent = `
        no bookings available
    `;
    BOOKING_LIST.appendChild(NO_BOOKING);

    return false;
  }

  // INI MENAMPILKAN SEMUA BOOKING YANG ADA
  data.forEach((element) => {
    const BOOKING_DIV = document.createElement("div");
    BOOKING_DIV.className = `h-fit p-4 border border-gray-600 rounded-lg`;
    BOOKING_DIV.innerHTML = `
    <div class="flex flex-wrap gap-4 items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
            <path fill="#0b4d70"
                d="m16.75 22.16l-2.75-3L15.16 18l1.59 1.59L20.34 16l1.16 1.41l-4.75 4.75M18 2c1.1 0 2 .9 2 2v9.34c-.63-.22-1.3-.34-2-.34V4h-5v8l-2.5-2.25L8 12V4H6v16h6.08c.12.72.37 1.39.72 2H6c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h12Z" />
        </svg>
        <p class="text-lg font-bold">Booking</p>
        <p class="text-lg font-medium">${dateYYYYMonDD(element.booking_date.slice(0, 10))}</p>
        <div class="py-1 px-2 text-white font-semibold border bg-red-700 ${
          element.booking_status_name === "Menunggu Konfirmasi Pembayaran" && element.booking_status_name === "Dibatalkan"
            ? `bg-red-700`
            : element.booking_status_name === "Belum Berjalan" && element.booking_status_name === "Sedang Berjalan"
            ? `bg-orange-700`
            : element.booking_status_name === "Selesai"
            ? `bg-blue-700`
            : ``
        } rounded-md">${element.booking_status_name}
        </div>
        <p class="text-lg font-medium">${element.booking_id}</p>
    </div>
    <div class="mt-3 flex flex-wrap gap-2 items-center">
        <p class="text-lg font-bold">${element.booking_room}</p>
        <p class="text-lg font-medium">[1 Adult, 1 Bed]</p>
    </div>
    <div class="mt-1 flex flex-wrap gap-2 items-center">
        <p class="text-lg font-medium">${dateYYYYMonDD(element.booking_check_in.slice(0, 10))}</p>
        <p class="text-lg ">-</p>
        <p class="text-lg font-medium">${dateYYYYMonDD(element.booking_check_out.slice(0, 10))}</p>
    </div>

    <div class="mt-3 flex flex-wrap gap-2 justify-between items-center">
        <div class="flex gap-2 items-center">
            <img class="h-4" src="../asset/image/bca-logo.png" alt="">
            <p class="text-lg font-medium line-clamp-1">${element.booking_payment_method}</p>
        </div>
        ${
          element.booking_status_name === "Menunggu Konfirmasi Pembayaran"
            ? `
            <button id="pay-btn"
              class="bg-unesa py-2 px-6 font-bold text-white text-base shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] border rounded-lg border-unesa">
              Pay for booking
            </button>
          `
            : element.booking_status_name === "Sedang Berjalan"
            ? `
            <button id="extend-btn"
                class="hidden bg-unesa py-2 px-6 font-bold text-white text-base shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] border rounded-lg border-unesa">
                Extend
            </button>
          `
            : ``
        }
    </div>
    `;

    const PAY_BTN = BOOKING_DIV.querySelector("#pay-btn");
    const EXTEND_BTN = BOOKING_DIV.querySelector("#extend-btn"); // ? FITUR INI MASI NGAWANG BOSQUE

    if (PAY_BTN) {
      PAY_BTN.addEventListener("click", () => {
        window.location.href = `payment-due.html?bid=${element.booking_id}`;
      });
    }

    BOOKING_LIST.appendChild(BOOKING_DIV);
  });
}
