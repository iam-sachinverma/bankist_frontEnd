'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

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
