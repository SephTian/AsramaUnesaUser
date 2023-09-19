import { fetchApi } from "./utility/fetch.js";

let booking_data = JSON.parse(window.sessionStorage.getItem("booking-data"));
const FLOOR_FILTER = document.querySelector("#floor-filter");
const FLOOR_LIST = document.querySelector("#floor-list");
console.log(booking_data.building_gender);

// Balik ke Halaman News
document.querySelector("#back-news-btn").addEventListener("click", () => {
  window.sessionStorage.removeItem("booking-data");
  window.location.href = "news.html";
});

//ASSIGN BUILDING NAME
document.querySelector("#building-name").textContent = booking_data.building_name;

// ? Fetch dengan Parameter Gender Disini
const ROOM_DATA = [
  {
    room_id: 1,
    room_name: "BYN",
    current: 3,
    capacity: 5,
    floor: "1",
    floor_name: "1",
  },
  {
    room_id: 2,
    room_name: "IFN",
    current: 3,
    capacity: 5,
    floor: "2",
    floor_name: "2",
  },
  {
    room_id: 3,
    room_name: "KTX",
    current: 1,
    capacity: 5,
    floor: "3",
    floor_name: "3",
  },
  {
    room_id: 4,
    room_name: "RIB",
    current: 2,
    capacity: 5,
    floor: "3",
    floor_name: "3",
  },
  {
    room_id: 5,
    room_name: "YQR",
    current: 3,
    capacity: 5,
    floor: "2",
    floor_name: "2",
  },
  {
    room_id: 6,
    room_name: "NSN",
    current: 3,
    capacity: 5,
    floor: "2",
    floor_name: "2",
  },
  {
    room_id: 7,
    room_name: "KMC",
    current: 2,
    capacity: 5,
    floor: "1",
    floor_name: "1",
  },
  {
    room_id: 8,
    room_name: "XTR",
    current: 3,
    capacity: 5,
    floor: "2",
    floor_name: "2",
  },
  {
    room_id: 9,
    room_name: "CBJ",
    current: 2,
    capacity: 5,
    floor: "2",
    floor_name: "2",
  },
  {
    room_id: 10,
    room_name: "CNE",
    current: 5,
    capacity: 5,
    floor: "2",
    floor_name: "2",
  },
];

// FILTER LANTAI PADA GEDUNG SEKARANG
const FLOOR_DATA = Array.from(
  ROOM_DATA.reduce((map, data) => {
    let key = `${data.floor}-${data.floor_name}`;
    if (!map.has(key)) {
      map.set(key, { floor: data.floor, floor_name: data.floor_name });
    }
    return map;
  }, new Map()).values()
);

//menampilkan list floor di bagian filter
FLOOR_DATA.forEach((item) => {
  const FILTER_OPTION = document.createElement("option");
  FILTER_OPTION.value = item.floor;
  FILTER_OPTION.textContent = `${item.floor_name} Floor`;

  FLOOR_FILTER.appendChild(FILTER_OPTION);
});

//menampilkan Floor dan Room
showFloor(ROOM_DATA);

// Menampilkan Floor dan Room sesuai filter lantai
FLOOR_FILTER.addEventListener("change", (e) => {
  //menampilkan Floor dan Room
  showFloor(ROOM_DATA);
});

function showFloor(data = []) {
  FLOOR_LIST.textContent = "";

  // Ini dia ngefilter sesuai floor yang dipilih terus masuk ke function showRoom untuk nampilin data roomnya
  const FILTER = FLOOR_FILTER.value;
  if (FILTER !== "") {
    //menampilkan room
    showRoom(data, FILTER);
  } else {
    FLOOR_DATA.forEach((item) => {
      //menampilkan room
      showRoom(data, item.floor);
    });
  }
}

function showRoom(data = [], filter_ = "") {
  data = data.filter((item) => {
    return item.floor === filter_;
  });

  //Membuat Details Floornya Terlebih Dahulu
  const FLOOR_DETAILS = document.createElement("details");
  FLOOR_DETAILS.className = "shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border";
  FLOOR_DETAILS.innerHTML = `
      <summary class="p-2 mb-2 text-unesa font-medium text-xl cursor-pointer">
        ${data[0].floor_name} Floor
      </summary>
      <div class="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      id="room-list${data[0].floor}">
      </div>      
  `;

  //Menampilkan room sesuai floor
  const CURRENT_ROOM_LIST = FLOOR_DETAILS.querySelector(`#room-list${data[0].floor}`);
  data.forEach((item) => {
    const LEFT_CAPACITY = item.capacity - item.current;
    const ROOM_DIV = document.createElement("div");
    ROOM_DIV.className = `p-2 flex justify-between items-center bg-white border border-slate-500 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-xl ${LEFT_CAPACITY > 0 ? `cursor-pointer` : ``}`;
    ROOM_DIV.innerHTML = `
      <div>
          <div class="flex gap-1 items-center">
              <p class="text-unesa text-xl font-semibold line-clamp-1">${item.room_name}</p>
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
          <p id="text-lg font-medium">${item.floor_name} Floor</p>
      </div>
      <div class="flex items-center gap-3">
          <p class="font-bold text-black text-xl"> ${item.current} / ${item.capacity}
          </p>
          <div class="w-4 h-4 rounded-full ${LEFT_CAPACITY == 0 ? `bg-red-700` : LEFT_CAPACITY <= item.capacity / 2 ? `bg-orange-700` : `bg-green-700`}">
          </div>
      </div>
    `;

    // Jika div room ditekan maka akan lanjut ke halaman pembayaran
    if (LEFT_CAPACITY > 0) {
      ROOM_DIV.addEventListener("click", () => {
        booking_data.room_id = item.room_id;
        booking_data.room_name = item.room_name;

        console.log(booking_data);
        window.sessionStorage.setItem("booking-data", JSON.stringify(booking_data));

        // ? tinggal ke halaman berikutnya
      });
    }

    CURRENT_ROOM_LIST.appendChild(ROOM_DIV);
  });

  FLOOR_LIST.appendChild(FLOOR_DETAILS);
}
