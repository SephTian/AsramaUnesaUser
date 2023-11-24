import { fetchApi } from "./utility/fetch.js";

let booking_data = JSON.parse(window.sessionStorage.getItem("booking-data"));
const FLOOR_FILTER = document.querySelector("#floor-filter");
const FLOOR_LIST = document.querySelector("#floor-list");
console.log(booking_data);

// Balik ke Halaman News
document.querySelector("#back-news-btn").addEventListener("click", () => {
  window.sessionStorage.removeItem("booking-data");
  window.location.href = "news.html";
});

//ASSIGN BUILDING NAME
document.querySelector("#building-name").textContent = booking_data.building_name;

// ? Fetch disini
const ROOM_DATA = await fetchApi(`getRooms?building_reference_id=${booking_data.building_id}`);

if (ROOM_DATA != null) {
  sortByFloor(ROOM_DATA);
}

// FILTER LANTAI PADA GEDUNG SEKARANG
let FLOOR_DATA = [];
if (ROOM_DATA !== null) {
  FLOOR_DATA = Array.from(
    ROOM_DATA.reduce((map, data) => {
      let key = `${data.room_floor}`;
      if (!map.has(key)) {
        map.set(key, { room_floor: data.room_floor });
      }
      return map;
    }, new Map()).values()
  );

  //menampilkan list floor di bagian filter
  FLOOR_DATA.forEach((item) => {
    const FILTER_OPTION = document.createElement("option");
    FILTER_OPTION.value = item.room_floor;
    FILTER_OPTION.textContent = `${item.room_floor} Floor`;

    FLOOR_FILTER.appendChild(FILTER_OPTION);
  });
}

//menampilkan Floor dan Room
showFloor(ROOM_DATA);

// Menampilkan Floor dan Room sesuai filter lantai
FLOOR_FILTER.addEventListener("change", (e) => {
  //menampilkan Floor dan Room
  showFloor(ROOM_DATA);
});

function sortByFloor(arr) {
  arr.sort((a, b) => {
    return a.room_floor - b.room_floor;
  });
}

function showFloor(data = []) {
  FLOOR_LIST.textContent = "";

  if (ROOM_DATA === null) {
    const NO_AVAIL_ROOM = document.createElement("div");
    NO_AVAIL_ROOM.className = "font-medium text-5xl mt-20 text-unesa italic";
    NO_AVAIL_ROOM.textContent = `
      No Room Available    
    `;
    FLOOR_LIST.appendChild(NO_AVAIL_ROOM);

    return false;
  }

  // Ini dia ngefilter sesuai floor yang dipilih terus masuk ke function showRoom untuk nampilin data roomnya
  const FILTER = FLOOR_FILTER.value;
  if (FILTER !== "") {
    //menampilkan room
    showRoom(data, FILTER);
  } else {
    FLOOR_DATA.forEach((item) => {
      //menampilkan room
      showRoom(data, item.room_floor);
    });
  }
}

function showRoom(data = [], filter_ = "") {
  data = data.filter((item) => {
    return item.room_floor === parseInt(filter_);
  });

  //Membuat Details Floornya Terlebih Dahulu
  const FLOOR_DETAILS = document.createElement("details");
  FLOOR_DETAILS.className = "shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border";
  FLOOR_DETAILS.innerHTML = `
      <summary class="w-full text-start p-2 text-unesa font-medium text-xl cursor-pointer">
        ${data[0].room_floor} Floor
      </summary>
      <div class="px-4 pt-2 pb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      id="room-list${data[0].room_floor}">
      </div>      
  `;

  console.log(data);
  //Menampilkan room sesuai floor
  const CURRENT_ROOM_LIST = FLOOR_DETAILS.querySelector(`#room-list${data[0].room_floor}`);
  data.forEach((item) => {
    const LEFT_CAPACITY = item.room_capacity - item.room_occupants;
    const ROOM_DIV = document.createElement("div");
    ROOM_DIV.className = `p-2 flex justify-between items-center bg-white border border-slate-500 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-xl ${LEFT_CAPACITY > 0 ? `cursor-pointer` : ``}`;
    ROOM_DIV.innerHTML = `
      <div class="flex flex-col justify-start items-start">
          <div class="flex gap-1 items-center">
              <div class="text-unesa text-xl font-semibold text-start break-all line-clamp-1">${item.room_name}</div>
              ${
                booking_data.building_gender == "Perempuan"
                  ? `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#df67e1"
                      d="M12 4a6 6 0 0 1 6 6c0 2.97-2.16 5.44-5 5.92V18h2v2h-2v2h-2v-2H9v-2h2v-2.08c-2.84-.48-5-2.95-5-5.92a6 6 0 0 1 6-6m0 2a4 4 0 0 0-4 4a4 4 0 0 0 4 4a4 4 0 0 0 4-4a4 4 0 0 0-4-4Z" />
                </svg>
                
                `
                  : booking_data.building_gender == "Pria"
                  ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path fill="#2451ff"
                          d="M9 9c1.29 0 2.5.41 3.47 1.11L17.58 5H13V3h8v8h-2V6.41l-5.11 5.09c.7 1 1.11 2.2 1.11 3.5a6 6 0 0 1-6 6a6 6 0 0 1-6-6a6 6 0 0 1 6-6m0 2a4 4 0 0 0-4 4a4 4 0 0 0 4 4a4 4 0 0 0 4-4a4 4 0 0 0-4-4Z" />
                    </svg>`
                  : ""
              }
          </div>
          <p id="w-fit text-lg font-medium">${item.room_floor} Floor</p>
      </div>
      <div class="flex items-center gap-3">
          <p class="font-bold text-black text-xl w-[60px]"> ${item.room_occupants} / ${item.room_capacity}
          </p>
          <div class="w-4 h-4 rounded-full ${LEFT_CAPACITY == 0 ? `bg-red-700` : LEFT_CAPACITY <= item.room_capacity / 2 ? `bg-orange-700` : `bg-green-700`}">
          </div>
      </div>
    `;

    // Jika div room ditekan maka akan lanjut ke halaman pembayaran
    if (LEFT_CAPACITY > 0) {
      ROOM_DIV.addEventListener("click", () => {
        booking_data.room_id = item.room_id;
        booking_data.room_name = item.room_name;
        booking_data.room_price = item.room_price;

        console.log(booking_data);
        window.sessionStorage.setItem("booking-data", JSON.stringify(booking_data));

        // ? tinggal ke halaman berikutnya
        window.location.href = "booking.html";
      });
    }

    CURRENT_ROOM_LIST.appendChild(ROOM_DIV);
  });

  FLOOR_LIST.appendChild(FLOOR_DETAILS);
}
