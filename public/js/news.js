import { fetchApi } from "./utility/fetch.js";

const name = "asep";
const sid = "c14200200";

const NEWS_LIST = document.querySelector("#swiper-news");
const BUILDING_LIST = document.querySelector("#building-list");

// ? Fetch dengan Parameter Gender Disini
const BUILDING_DATA = [
  {
    id: 1,
    building_name: "Flashpoint",
    building_gender: "Perempuan",
  },
  {
    id: 2,
    building_name: "Edgewire",
    building_gender: "Pria",
  },
  {
    id: 3,
    building_name: "Plambee",
    building_gender: "Pria",
  },
  {
    id: 4,
    building_name: "Zoomlounge",
    building_gender: "Pria",
  },
  {
    id: 5,
    building_name: "Thoughtstormasdasdsad",
    building_gender: "Pria",
  },
];

showBuilding(BUILDING_DATA);

function showBuilding(data = []) {
  BUILDING_LIST.textContent = "";
  data.forEach((item) => {
    const BUILDING_DIV = document.createElement("div");
    BUILDING_DIV.className = "rounded-xl overflow-hidden aspect-square relative cursor-pointer shadow-[6px_7px_4px_0px_rgba(0,0,0,0.25)]";
    BUILDING_DIV.id = `${item.id}`;
    BUILDING_DIV.innerHTML = `
        <img class="w-full h-full object-cover" src="../asset/image/towerA.jpg" alt="">
        <div class="absolute top-0 left-0 p-4 w-full h-full bg-black/20 text-white text-xl font-semibold break-all md:text-2xl lg:text-3xl">
            ${item.building_name}
        </div>
    `;

    BUILDING_DIV.addEventListener("click", () => {
      let booking_data = {
        user_name: name,
        user_id: sid,
        building_id: item.id,
        building_name: item.building_name,
        building_gender: item.building_gender,
        room_id: "",
        room_name: "",
        check_in: "",
        check_out: "",
      };
      window.sessionStorage.setItem("booking-data", JSON.stringify(booking_data));
      window.location.href = `room.html?bname=${item.building_name}&gender=${item.building_gender}`;
    });

    BUILDING_LIST.appendChild(BUILDING_DIV);
  });
}
