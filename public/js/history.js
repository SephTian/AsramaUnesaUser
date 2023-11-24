import { fetchApi } from "./utility/fetch.js";
import { dateYYYYMonDD } from "./utility/date_formatter.js";

let user_data = JSON.parse(window.sessionStorage.getItem("user-data"));
const BOOKING_LIST = document.querySelector("#booking-list");

const DATA_HISTORY = await fetchApi("getMyBookings");
showBookingHistory(DATA_HISTORY.Bookings);
console.log(DATA_HISTORY);

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
    <div class="flex justify-between items-center">
        <div class="flex flex-wrap gap-4 items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
              <path fill="#0b4d70"
                  d="m16.75 22.16l-2.75-3L15.16 18l1.59 1.59L20.34 16l1.16 1.41l-4.75 4.75M18 2c1.1 0 2 .9 2 2v9.34c-.63-.22-1.3-.34-2-.34V4h-5v8l-2.5-2.25L8 12V4H6v16h6.08c.12.72.37 1.39.72 2H6c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h12Z" />
          </svg>
          <p class="text-lg font-bold">Booking</p>
          <p class="text-lg font-medium">${dateYYYYMonDD(element.booking_date.slice(0, 10))}</p>
          <div class="py-1 px-2 text-white font-semibold border ${
            element.booking_status_name === "Menunggu Konfirmasi Pembayaran" || element.booking_status_name === "Dibatalkan"
              ? `bg-red-700`
              : element.booking_status_name === "Belum Berjalan" || element.booking_status_name === "Sedang Berjalan"
              ? `bg-orange-700`
              : element.booking_status_name === "Selesai"
              ? `bg-blue-700`
              : ``
          } rounded-md">${element.booking_status_name}
          </div>
          <p class="text-lg font-medium">${element.booking_id}</p>
        </div>
        <div class="cursor-pointer px-2 py-0.5 flex gap-2 items-center border rounded-lg shadow-[0_1px_1px_0px_rgba(0,0,0,0.25)]
        " id="download-btn">
          <p class="font-bold">Detail</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11l-5 5Zm-6 4q-.825 0-1.413-.588T4 18v-3h2v3h12v-3h2v3q0 .825-.588 1.413T18 20H6Z"/></svg>
        </div>
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
              Check Payment Status
            </button>
          `
            : element.booking_status_name === "Sedang Berjalan"
            ? `
            <div class="flex gap-3 items-center">
              <span class="font-bold text-green-600">
                ${element.is_extend_able === true ? `You already extend this booking` : ``}
              </span>
              <button id="extend-btn"
                  class="bg-unesa py-2 px-6 font-bold text-white text-base rounded-lg shadow-[0_4px_4px_0px_rgba(0,0,0,0.25)] disabled:shadow-none disabled:bg-gray-500" disabled>
                  Extend
              </button>
            </div>
          `
            : ``
        }
    </div>
    `;

    const PAY_BTN = BOOKING_DIV.querySelector("#pay-btn");
    const EXTEND_BTN = BOOKING_DIV.querySelector("#extend-btn"); // ? FITUR INI MASI NGAWANG BOSQUE
    const DOWNLOAD_BTN = BOOKING_DIV.querySelector("#download-btn");
    if (PAY_BTN) {
      PAY_BTN.addEventListener("click", () => {
        window.location.href = `payment-due.html?bid=${element.booking_id}`;
      });
    }
    if (DOWNLOAD_BTN) {
      DOWNLOAD_BTN.addEventListener("click", () => {
        // window.location.href = `invoice.html?id=${element.booking_id}`;
        window.location.href = `invoice.html?id=${element.booking_id}`;
      });
    }

    // // ini liat tanggal skrg untuk extend buttonnya
    // let TODAY = new Date();

    // ini buat tanggal check in yang baru
    let CHECK_IN_EXTEND = new Date(element.booking_check_out.slice(0, -1));
    CHECK_IN_EXTEND.setDate(CHECK_IN_EXTEND.getDate() + 1);

    // ini buat tanggal check out yang baru
    let MONTH_PLAN = monthDiff(element.booking_check_in.slice(0, 10), element.booking_check_out.slice(0, 10));
    let CHECK_OUT_EXTEND = new Date(element.booking_check_out.slice(0, -1));
    CHECK_OUT_EXTEND.setDate(CHECK_OUT_EXTEND.getDate() + 1);
    CHECK_OUT_EXTEND.setMonth(CHECK_OUT_EXTEND.getMonth() + parseInt(MONTH_PLAN));
    let EXTEND_OUT_DATE = getLastDateOfMonth(parseInt(CHECK_OUT_EXTEND.getFullYear()), parseInt(CHECK_OUT_EXTEND.getMonth() + 1));

    // ini buat cari tanggal kapan user boleh extend
    // let IS_EXTENDABLE_DATE = new Date(element.booking_check_out.slice(0, -1));
    // IS_EXTENDABLE_DATE.setDate(18);
    // IS_EXTENDABLE_DATE.setHours(23);
    // IS_EXTENDABLE_DATE.setMinutes(59);
    // IS_EXTENDABLE_DATE.setSeconds(59);

    if (EXTEND_BTN) {
      EXTEND_BTN.disabled = false;

      EXTEND_BTN.addEventListener("click", () => {
        let booking_data = {
          user_name: `${user_data.user_first_name} ${user_data.user_last_name}`,
          user_id: user_data.user_id,
          room_id: element.room_id,
          room_name: element.booking_room,
          room_price: element.room_price,
          check_in: `${CHECK_IN_EXTEND.getFullYear()}-${String(CHECK_IN_EXTEND.getMonth() + 1).padStart(2, "0")}-${CHECK_IN_EXTEND.getDate()}`,
          check_out: `${CHECK_OUT_EXTEND.getFullYear()}-${String(CHECK_OUT_EXTEND.getMonth() + 1).padStart(2, "0")}-${EXTEND_OUT_DATE}T23:59:59`,
          booking_id: element.booking_id,
          payment: "",
          ppn: "",
          booking_notes: "",
          is_extend: true,
        };

        window.sessionStorage.setItem("booking-data", JSON.stringify(booking_data));
        window.location.href = `payment.html`;
      });
    }

    BOOKING_LIST.appendChild(BOOKING_DIV);
  });
}

function monthDiff(date_input1, date_input2) {
  let date1 = new Date(date_input1);
  let date2 = new Date(date_input2);
  let months = (date2.getFullYear() - date1.getFullYear()) * 12;
  months -= date1.getMonth();
  months += date2.getMonth();
  return months <= 0 ? 0 : months;
}
function getLastDateOfMonth(year, month) {
  return String(new Date(year, month, 0).getDate()).padStart(2, "0");
}
