"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// Scrolling
btnScrollTo.addEventListener("click", function () {
  const secCords = section1.getBoundingClientRect();

  // window.scrollTo({
  //   left: secCords.left + window.pageXOffset,
  //   top: secCords.top + window.pageYOffset,
  //   behavior: "smooth",
  // });

  section1.scrollIntoView({
    behavior: "smooth",
  });
});

// Adding event listener on every element
// document.querySelectorAll(".nav__link").forEach(function (el) {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     // console.log(this);
//     const id = this.getAttribute("href");
//     // console.log(id);
//     document.querySelector(id).scrollIntoView({
//       behavior: "smooth",
//     });
//   });
// });

// Event delegation
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    if (id === "#") return;
    document.querySelector(id).scrollIntoView({
      behavior: "smooth",
    });
  }
});

// -------------Building a tabbed component---------------

const tabsContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const operationsContent = document.querySelectorAll(".operations__content");

tabsContainer.addEventListener("click", toggleTabs);
function toggleTabs(e) {
  const clicked = e.target.closest(".operations__tab");

  // Guard clause
  if (!clicked) return;

  //removing the active classes from each tab
  tabs.forEach((el) => {
    el.classList.remove("operations__tab--active");
  });

  //adding the active class to the selected tab
  clicked.classList.add("operations__tab--active");

  //removing the active class from operations content
  operationsContent.forEach((el) => {
    el.classList.remove("operations__content--active");
  });

  //getting the tab number of the selected tab
  const id = clicked.dataset.tab;

  //adding the active class to the selected operations content
  document
    .querySelector(`.operations__content--${id}`)
    .classList.add("operations__content--active");
}

// ------- Adding hover functionality -----------------
const logo = document.getElementById("logo");
const nav = document.querySelector(".nav");
nav.addEventListener("mouseover", hoverHandler.bind(0.5));
// document.querySelector(".nav").addEventListener("mouseout", changeOpacity);
nav.addEventListener("mouseout", hoverHandler.bind(1));

function hoverHandler(e) {
  if (e.target.classList.contains("nav__link")) {
    // console.log(e.target);
    document.querySelectorAll(".nav__link").forEach((el) => {
      if (el !== e.target) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
}

//----- an efficient way to add sticky navigation using the intersection observer api-----------------

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const obsCallback = (entries) => {
  const [entry] = entries;
  const { isIntersecting } = entry;
  // console.log(isIntersecting);
  if (!isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(obsCallback, obsOptions);
headerObserver.observe(header);

//-------------Revealing elements on scroll------------
const sections = document.querySelectorAll(".section");
const secCallback = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};
const secOptions = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(secCallback, secOptions);
// sectionObserver.observe()
sections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// -------------- Lazy Loading Images --------------------
const images = document.querySelectorAll(".features__img");
// console.log(images);
const imgCallback = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  const srcNew = entry.target.dataset.src;
  entry.target.setAttribute("src", srcNew);
  entry.target.addEventListener("load", () => {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgOptions = {
  root: null,
  threshold: 0,
  rootMargin: "200px",
};

const imgObserver = new IntersectionObserver(imgCallback, imgOptions);

images.forEach(function (img) {
  imgObserver.observe(img);
});

//The slider function
function slider() {
  const btnSliderLeft = document.querySelector(".slider__btn--left");
  const btnSliderRight = document.querySelector(".slider__btn--right");
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".dots");
  let currSlide = 0;

  //Initial conditions
  init();

  //init function
  function init() {
    goToSlide();
    createDots();
    activateDot(0);
  }

  //The go to slide function
  function goToSlide(currSlide = 0) {
    slides.forEach((sl, i) => {
      sl.style.transform = `translateX(${100 * (i - currSlide)}%)`;
    });
  }

  //Creating and adding dots based on the number of slides
  function createDots() {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide=${i}></button>`
      );
    });
  }

  //next Slide function
  function nextSlide() {
    currSlide++;
    if (currSlide === slides.length) currSlide = 0;
    // -100% 0 100% 200%
    goToSlide(currSlide);
    activateDot(currSlide);
  }

  //Activate dots function

  function activateDot(dot_slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    const dot = [...document.querySelectorAll(".dots__dot")].find(
      (dot) => dot.dataset.slide == dot_slide
    );

    dot.classList.add("dots__dot--active");
  }

  //Previous slide function
  function prevSlide() {
    currSlide--;
    if (currSlide < 0) currSlide = slides.length - 1;
    // console.log("left");
    goToSlide(currSlide);
    activateDot(currSlide);
  }

  //Left slider
  btnSliderLeft.addEventListener("click", prevSlide);

  //Right slider
  btnSliderRight.addEventListener("click", nextSlide);

  //Handling right and left arrow key events
  document.addEventListener("keydown", (e) => {
    // console.log(e);
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

  //building the dots functionality
  dotsContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("dots__dot")) return;
    // console.log("a dot");
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  });
}

slider();
