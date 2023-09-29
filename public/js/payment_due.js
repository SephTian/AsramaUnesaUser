import { fetchApi } from "./utility/fetch.js";
import { rupiahFormatter } from "./utility/price_formatter.js";

let url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let bid = params.get("bid");

const DUE_DATA = await fetchApi(`getBookingExpired?booking_id=${bid}`);

console.log(DUE_DATA);
let currDate = new Date();
let dueDate = new Date(DUE_DATA.Bookings[0].payment_deadline.slice(0, -1));
let dayName = dueDate.toLocaleDateString("en-US", { weekday: "long" });
let monthName = dueDate.toLocaleDateString("en-US", { month: "long" });
console.log(`${dayName}, ${dueDate.getDate()} ${monthName} ${dueDate.getFullYear()}`);

document.querySelector("#due-full-date").textContent = `${dayName}, ${dueDate.getDate()} ${monthName} ${dueDate.getFullYear()}`;
document.querySelector("#due-payment-method").textContent = DUE_DATA.Bookings[0].payment_method;
document.querySelector("#due-va").textContent = DUE_DATA.Bookings[0].payment_va;
document.querySelector("#due-payment-total").textContent = rupiahFormatter(DUE_DATA.Bookings[0].payment_total);

timeCountdown(currDate, dueDate);

/**
 *
 * @param {*} curr_time Waktu yang sekarang
 * @param {*} due_time waktu jatuh tempo
 */
function timeCountdown(curr_time, due_time) {
  const TIME_DIV = document.querySelector("#due-time");
  TIME_DIV.textContent = `Please wait...`;
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  let total_time = due_time.getTime() - curr_time.getTime();

  // % Jika total time hasilnya sudah minus
  if (total_time <= 0) {
    TIME_DIV.textContent = `00:00:00`;
    return true;
  }

  // % Assign pas page page udah reload
  let interval = setInterval(() => {
    TIME_DIV.textContent = `
    ${betterCountdownNumber(Math.floor(total_time / hour))}:${betterCountdownNumber(Math.floor((total_time % hour) / minute))}:${betterCountdownNumber(Math.floor((total_time % minute) / second))}`;
    total_time -= 1000;

    if (total_time < 1000) {
      TIME_DIV.textContent = `00:00:00`;
      clearInterval(interval);
    }
  }, 1000);
}

function betterCountdownNumber(number) {
  if (number < 10) {
    return `0${number}`;
  } else {
    return `${number}`;
  }
}
