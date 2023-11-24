import { fetchApi } from "./utility/fetch.js";

const MENU = document.querySelector("#menu");
const CLOSE_MENU = document.querySelector("#close-menu");
const OPEN_MENU = document.querySelector("#open-menu");
const LOGOUT_BTN = document.querySelector("#logout-btn");
const OPEN_NOTIF_BTN = document.querySelector("#open-notif-btn");
const CLOSE_NOTIF_BTN = document.querySelector("#close-notif-btn");
const NOTIF_BAR = document.querySelector("#notif-bar");
const NOTIF_LIST = document.querySelector("#notif-list");
const IS_NOTIF = document.querySelector("#is-notif");
let user_data = JSON.parse(window.sessionStorage.getItem("user-data"));
if (!user_data) {
  window.location.href = "login.html";
}
let user_notif = JSON.parse(window.sessionStorage.getItem("user-notif"));
document.querySelector("#user-greet").textContent = user_data.user_first_name;

OPEN_MENU.addEventListener("click", (e) => {
  MENU.style.width = "256px";
});

CLOSE_MENU.addEventListener("click", (e) => {
  MENU.style.width = "0px";
});

//untuk close menu jika tombol bukan di area menu
document.addEventListener("click", function (e) {
  if (!OPEN_MENU.contains(e.target) && !MENU.contains(e.target)) {
    MENU.style.width = "0px";
  }

  if (!NOTIF_BAR.contains(e.target) && !OPEN_NOTIF_BTN.contains(e.target)) {
    NOTIF_BAR.style.height = "0px";
  }
});

// ==================================================

LOGOUT_BTN.addEventListener("click", function (e) {
  sessionStorage.clear();
  window.location.href = "login.html";
});

// ==================================================

// yang di refresh itu jumlah notif yang belum di read
// jika notif yang belum di read menambah maka nyalain tanda notif baru
user_notif.current_unread = await fetchApi(`getNotificationCount?user_id=${user_data.user_id}`); //?nanti ini taro disession buat datanya
if (user_notif.last_unread < user_notif.current_unread) {
  if (IS_NOTIF.classList.contains("hidden")) {
    IS_NOTIF.classList.remove("hidden");
  }
}

let notificationIneterval = setInterval(async () => {
  // ? disini nanti buat fetch API buat ngambil jumlah notif
  user_notif.current_unread = await fetchApi(`getNotificationCount?user_id=${user_data.user_id}`);
  if (user_notif.last_unread < user_notif.current_unread) {
    if (IS_NOTIF.classList.contains("hidden")) {
      IS_NOTIF.classList.remove("hidden");
    }
  }
}, 2000);

OPEN_NOTIF_BTN.addEventListener("click", async () => {
  let { Notifications } = await fetchApi(`getMyNotifications?user_id=${user_data.user_id}`);
  NOTIF_BAR.style.height = "552px";
  if (!IS_NOTIF.classList.contains("hidden")) {
    IS_NOTIF.classList.add("hidden");
  }
  console.log(Notifications);
  if (Notifications === null) {
    const notifDiv = document.createElement("div");
    notifDiv.className = "font-medium text-center text-xl mt-20 text-unesa italic";
    notifDiv.textContent = `
        No notification available
    `;

    NOTIF_LIST.appendChild(notifDiv);
    return false;
  }
  if (user_notif.opened === 0) {
    // ? API FETCH DATA & MUNGKIN JG TARO SEKELTON LOADING
    NOTIF_LIST.textContent = "";
    Notifications.forEach((element) => {
      const notifDiv = document.createElement("div");
      notifDiv.className = `w-full border-b mb-2`;
      notifDiv.innerHTML = `
          <div class="flex justify-end gap-5">
            <p class="font-medium text-sm">${ubahFormatTanggal(element.created_on.slice(0, -1))}</p>
          </div>
          <p class="font-bold text-base">${element.notification_title}</p>
          <p class="font-medium text-sm mb-1">
            ${element.notification_content}
          </p>
        `;

      NOTIF_LIST.appendChild(notifDiv);
    });
    user_notif.opened = 1;
  } else if (user_notif.last_unread < user_notif.current_unread) {
    // ? API FETCH DATA & MUNGKIN JG TARO SEKELTON LOADING
    NOTIF_LIST.textContent = "";
    Notifications.forEach((element) => {
      const notifDiv = document.createElement("div");
      notifDiv.className = `w-full border-b mb-2`;
      notifDiv.innerHTML = `
        <div class="flex justify-end gap-5">
          <p class="font-medium text-sm">${ubahFormatTanggal(element.created_on.slice(0, -1))}</p>
        </div>
        <p class="font-bold text-base">${element.notification_title}</p>
        <p class="font-medium text-sm mb-1">
          ${element.notification_content}
        </p>
        `;

      NOTIF_LIST.appendChild(notifDiv);
    });
  }

  // ? disini nanti buat api kalau notif telah di read
  user_notif.last_unread += user_notif.current_unread - user_notif.last_unread;
  //
  //
});

CLOSE_NOTIF_BTN.addEventListener("click", () => {
  NOTIF_BAR.style.height = "0px";
});

// untuk format tanggal pada notifikasi
function ubahFormatTanggal(tanggal) {
  const now = new Date();
  const targetDate = new Date(tanggal);

  // Kondisi 1: Jika sekarang masih di hari yang sama
  if (now.getFullYear() === targetDate.getFullYear() && now.getMonth() === targetDate.getMonth() && now.getDate() === targetDate.getDate()) {
    const jamMenit = targetDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    return jamMenit;
  }

  // Kondisi 2: Jika sekarang masih di bulan yang sama
  if (now.getFullYear() === targetDate.getFullYear() && now.getMonth() === targetDate.getMonth()) {
    const tanggalBulan = targetDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    return tanggalBulan;
  }

  // Kondisi 3: Jika 2 kondisi di atas tidak memenuhi
  const bulanTahun = targetDate.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
  return bulanTahun;
}
