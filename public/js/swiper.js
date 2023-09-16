// init Swiper:
new Swiper(".swiper", {
  // Optional parameters
  //   autoplay: true,
  //   delay: 2000,
  disableOnInteraction: false,
  direction: "horizontal",
  loop: true,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
