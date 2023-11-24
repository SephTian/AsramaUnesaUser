import { config } from "./utility/config.js";
import { fetchApi } from "./utility/fetch.js";
import { dateYYYYMonDD } from "./utility/date_formatter.js";
import { rupiahFormatter } from "./utility/price_formatter.js";

let params = new URLSearchParams(window.location.search);
let id = params.get("id");
// let user_data = JSON.parse(window.sessionStorage.getItem("user-data"));

document.querySelector("#btn-back").addEventListener("click", () => {
  window.location.href = "history.html";
});

document.querySelector("#btn-download").addEventListener("click", () => {
  window.print();
});

const { Booking_Details } = await fetchApi(`getUserBookingsDetail?booking_id=${id}`);
console.log(Booking_Details);
const BOOKING_ID = document.querySelector("#booking-id");
BOOKING_ID.textContent = Booking_Details[0].booking_id;
const TANGGAL = document.querySelector("#tanggal");
const TODAY = new Date();
const TODAY_DATE = TODAY.getDate();
const TODAY_MONTH = TODAY.getMonth() + 1;
const TODAY_YEAR = TODAY.getFullYear();
TANGGAL.textContent = dateYYYYMonDD(`${TODAY_YEAR}-${TODAY_MONTH}-${TODAY_DATE}`);
const USER_NAMA = document.querySelector("#user-nama");
USER_NAMA.textContent = Booking_Details[0].name;
const USER_ID = document.querySelector("#user-id");
USER_ID.textContent = Booking_Details[0].person_number;
const NAMA_GEDUNG = document.querySelector("#nama-gedung");
NAMA_GEDUNG.textContent = Booking_Details[0].building_name;
const ALAMAT_GEDUNG = document.querySelector("#alamat-gedung");
ALAMAT_GEDUNG.textContent = Booking_Details[0].building_street;

const TRANSACTION_TABLE = document.querySelector("#trans-list");
const TRANSACTION_DETAIL_TABLE = document.querySelector("#trans-detail-list");
let harga_keseluruhan = 0;
Booking_Details.forEach((item) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="text-center border-2 border-black py-2 font-medium ">${item.transaction_id}</td>
    <td class="text-center border-2 border-black py-2 font-medium ">1 kamar [${item.room_name}]</td>
    <td class="text-center border-2 border-black py-2 font-medium ">
        ${dateYYYYMonDD(item.transaction_check_in.slice(0, 10))} - ${dateYYYYMonDD(item.transaction_check_out.slice(0, 10))}
    </td>
    <td class="text-center border-2 border-black py-2 font-medium ">${rupiahFormatter(item.room_price)}</td>
    <td class="text-center border-2 border-black py-2 font-medium ">${item.va}</td>
    `;

  TRANSACTION_DETAIL_TABLE.appendChild(tr);
});
Booking_Details.forEach((item) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="text-center border-2 border-black py-2 font-medium ">${item.transaction_id}</td>
    <td class="text-center border-2 border-black py-2 font-medium ">${rupiahFormatter(item.transaction_nominal)}</td>
    <td class="text-center border-2 border-black py-2 font-medium ">${rupiahFormatter(item.ppn)}</td>
    <td class="text-center border-2 border-black py-2 font-medium ">${rupiahFormatter(item.ppn + item.transaction_nominal)}</td>
    <td class="text-center border-2 border-black py-2 font-medium ">${dateYYYYMonDD(item.date_expired.slice(0, 10))} (${item.date_expired.slice(11, 19)})</td>
    <td class="text-center border-2 border-black py-2 font-medium ">${item.payment_status}</td>
  `;

  harga_keseluruhan += item.transaction_nominal + item.ppn;

  TRANSACTION_TABLE.appendChild(tr);
});

const HARGA_TOTAL = document.querySelector("#harga-total");
HARGA_TOTAL.textContent = rupiahFormatter(harga_keseluruhan);
