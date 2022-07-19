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

const header = document.querySelector('.header');

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

// * get height of nav using getBCR();
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entries);

  if (entry.isIntersecting) {
    nav.classList.remove('sticky');
  } else {
    nav.classList.add('sticky');
  }
};

const options = {
  root: null,
  threshold: 0, // when 0% header visbile viewport then we show sticky navbar
  rootMargin: `-${navHeight}px`, // visual margin box of 90 px appleid out of target elemtn
};

const headerObserver = new IntersectionObserver(stickyNav, options);
// *target element
headerObserver.observe(header);

// ! Reveal Sections

// * all elements which we want to obeserve
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

// * observe multiple elements
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// ! Lazy Loading  Images -- It is optimal approach for fast site load or improve slow internet user experience

// select tag with specific property
// * img[data-src] img tag with data-src property
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace src with data-src (low quality to high)
  entry.target.src = entry.target.dataset.src;

  // Todo we improve image loading using load event to load them in background and then represnt (remove blur class in my example)
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  // rootMargin: '100px',
  // Todo we can also use rootMargin to load image before target reach
});

imgTargets.forEach(img => imgObserver.observe(img));

// ! Slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  // Global var
  let curSlide = 0;
  const maxSlide = slides.length - 1;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide = "${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // Set translateX() on every slide
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Prev Slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event handlers
  btnLeft.addEventListener('click', prevSlide);
  btnRight.addEventListener('click', nextSlide);
  // * curSlide 1: -100%, 0%, 100%, 200%

  // using Arrow Key
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  // Event Delegation
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // * const slide = e.target.dataset.slide; OR using destrucing
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
