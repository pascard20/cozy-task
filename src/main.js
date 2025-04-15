import './style.css';
import content from './index.js';

/* ------------------------- VARIABLES AND CONSTANTS ------------------------ */

const elem = {
  containerTop: document.querySelector('.top'),
  containerBottom: document.querySelector('.bottom'),
  buttons: {
    home: document.querySelector('.btn--home'),
    menu: document.querySelector('.btn--menu'),
    about: document.querySelector('.btn--about'),
    contact: document.querySelector('.btn--contact'),
    arrow: document.querySelector('.top__menu-button'),
  }
}

const handlers = {
  home: () => handleButton('home', false),
  menu: () => handleButton('menu'),
  about: () => handleButton('about'),
  contact: () => handleButton('contact'),
  arrow: () => handleButton('arrow', false),
}

const dynamicElemConfig = {
  menu: {
    selector: '.menu__btn',
    handler: () => handleButton('contact')
  },
  about: {
    selector: '.about__btn',
    handler: () => handleButton('menu')
  }
}

let currentSectionName = null;
const dynamicHandlers = {};
const dynamicElements = {};

/* -------------------------------- FUNCTIONS ------------------------------- */

const handleContentLoad = (sectionName) => {
  if (currentSectionName) {
    if (currentSectionName === sectionName) return;
    const oldElem = dynamicElements[currentSectionName];
    const oldHandler = dynamicHandlers[currentSectionName];
    if (oldElem && oldHandler) {
      oldElem.removeEventListener('click', oldHandler);
      delete dynamicHandlers[currentSectionName];
      delete dynamicElements[currentSectionName];
    }
  }

  let selector = null, handler = null, newElem = null;

  if (dynamicElemConfig[sectionName]) {
    ({ selector, handler } = dynamicElemConfig[sectionName]);
    newElem = document.querySelector(selector);
  }

  if (newElem) {
    dynamicElements[sectionName] = newElem;
    dynamicHandlers[sectionName] = handler;

    newElem.addEventListener('click', handler);
  }

  currentSectionName = sectionName;
}

const initContent = sectionName => {
  elem.containerBottom.innerHTML = content[sectionName];
  handleContentLoad(sectionName);
}

const scrollToSection = (sectionName) => {
  const isTop = sectionName === 'home';
  const targetContainer = isTop ? elem.containerTop : elem.containerBottom;

  if (targetContainer) targetContainer.scrollIntoView({ behavior: 'smooth' });
}

const handleButton = (btnName, isContent = true) => {
  if (isContent) initContent(btnName);
  scrollToSection(btnName);
}

/* ----------------------------- EVENT LISTENERS ---------------------------- */

Object.keys(elem.buttons).forEach(key => {
  if (handlers[key]) elem.buttons[key].addEventListener('click', handlers[key]);
})

/* ---------------------------------- INIT ---------------------------------- */

initContent('menu');