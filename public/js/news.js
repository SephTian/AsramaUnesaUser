import { fetchApi } from "./utility/fetch.js";

let user_data = JSON.parse(window.sessionStorage.getItem("user-data"));
console.log(user_data);
console.log(window.sessionStorage.getItem("token"));

const NEWS_LIST = document.querySelector("#swiper-news");
const BUILDING_LIST = document.querySelector("#building-list");

// ? Fetch dengan Parameter Gender Disini
const BUILDING_DATA = await fetchApi(`getAsramaBuildingsWithFilters?gender_id=${user_data.user_gender}`);

showBuilding(BUILDING_DATA.Buildings);

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
        user_name: user_data.user_name,
        user_id: user_data.user_id,
        building_id: item.building_id,
        building_name: item.building_name,
        building_gender: item.building_gender,
        room_id: "",
        room_name: "",
        room_price: "",
        check_in: "",
        check_out: "",
        nominal: "",
        ppn: "",
        booking_notes: "",
      };
      window.sessionStorage.setItem("booking-data", JSON.stringify(booking_data));
      window.location.href = `room.html`;
    });

    BUILDING_LIST.appendChild(BUILDING_DIV);
  });
}
