'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Smooth Scrolling to single element

btnScrollTo.addEventListener('click', function (e) {
  // getBoundingClientRect() is based on visible viewport, thats why it change on every scroll

  // 1. Get coordinates of section where to wanted to scroll
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  // coordinates of event trigger button
  console.log(e.target.getBoundingClientRect());

  // get Current Scroll Postiton
  console.log('Current Scroll X/Y', window.pageXOffset, window.pageYOffset);
  // Y is distance between current viewport to Top of page

  // Height and Width of Current Visible viewport
  console.log(
    'Height / Width of current visible viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Legacy

  // scrolling to section1
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  // add smooth effect
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behaviour: 'smooth',
  // })

  // Modern Way
  section1.scrollIntoView({ behavior: 'smooth' });
});

// ! Page Navigation or Smooth Scrolling of Nav Links

// * Naive Approach of scrolling
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     // console.log(id);
//     document.querySelector(id).scrollIntoView({
//       behavior: 'smooth',
//     });
//   });
// });

// * Optimal Approach using Bubbling OR Event Delegation
// Todo 1. Add event listener to common parent element
// Todo 2. Determine what element originated was created

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //   ! Matching strategy
  //   *here we get the target on which event happend inside parent div and match it with our taget clss

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

// ! Tabbed component

tabsContainer.addEventListener('click', function (e) {
  // Todo We have to handle span element with button with closest() to select genral parent class
  // * closest() is important in event delegation

  const clicked = e.target.closest('.operations__tab');

  // * if we click outside tabConatiner it return NULL beacuse closest()
  // * cannot find specific class to handle this case we use
  // Guard clause
  if (!clicked) return;

  // * Remove active classes
  // down all other unclicked tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));

  // active content remove
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // * Active tab or Up tab
  clicked.classList.add('operations__tab--active');

  // * Active content
  const data = clicked.dataset.tab;

  document
    .querySelector(`.operations__content--${data}`)
    .classList.add('operations__content--active');
});

// ! Menu Fade Animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibilings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibilings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Todo : Pass arugement in event handler func is NOT POSSIBLE but we choose tricky approach to set THIS keyword using bind() method
nav.addEventListener('mouseover', handleHover.bind(0.5));

// * to undo mouseover we need opposite event of mouseover : mouseout
nav.addEventListener('mouseout', handleHover.bind(1));

// ! Naive Approach Sticky Navigation --
// // Legacy Approach -- bad performance becoz scroll event trigger every time

// // * Get coordinates from which point we want nav to be sticky
// const initialCoords = section1.getBoundingClientRect();

// // * now perform scroll event on window
// window.addEventListener('scroll', function () {
//   // * curr scroll Y
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// ! Optimal Approach Sticky Navigation using Intersection Observer APi

const header = document.querySelector('.header');

const stickyNav = function (entries) {
  const [entry] = entries;
  console.log(entries);

  if (entry.isIntersecting) {
    nav.classList.remove('sticky');
  } else {
    nav.classList.add('sticky');
  }
};

const options = {
  root: null,
  threshold: 0, // when 0% header visbile viewport then we show sticky navbar
  rootMargin: '-90px', // visual margin box of 90 px appleid out of target elemtn
};

const headerObserver = new IntersectionObserver(stickyNav, options);
// *target element
headerObserver.observe(header);
