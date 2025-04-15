/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/

;// ./src/img/menu_pancakes.jpg
const menu_pancakes_namespaceObject = __webpack_require__.p + "e535b620daeddecba58e.jpg";
;// ./src/img/menu_spaghetti.jpg
const menu_spaghetti_namespaceObject = __webpack_require__.p + "fee04aa9cade04be8fe4.jpg";
;// ./src/img/menu_wings.jpg
const menu_wings_namespaceObject = __webpack_require__.p + "b66414ba2a5345f54766.jpg";
;// ./src/img/menu_breakfast.jpg
const menu_breakfast_namespaceObject = __webpack_require__.p + "46c78b1a28d5aa796535.jpg";
;// ./src/img/menu_pizza.jpg
const menu_pizza_namespaceObject = __webpack_require__.p + "6b697b629cccff9dffd3.jpg";
;// ./src/img/menu_burger.jpg
const menu_burger_namespaceObject = __webpack_require__.p + "e1efdda18488cbe15f1d.jpg";
;// ./src/menu.js







const menuImages = [
  [menu_pancakes_namespaceObject, 'Pancakes'],
  [menu_spaghetti_namespaceObject, 'Spaghetti'],
  [menu_wings_namespaceObject, 'Chicken Wings'],
  [menu_breakfast_namespaceObject, 'Breakfast Set'],
  [menu_pizza_namespaceObject, 'Pizza'],
  [menu_burger_namespaceObject, 'Burger']
]

const loadImage = (imageID) => {
  return `<img src=${menuImages[imageID][0]} alt=${menuImages[imageID][1]}>`
}

/* harmony default export */ const menu = (`
<div class="menu">
  <h2 class="menu__title bottom__title">Our signature dishes</h2>
  <p class="menu__description bottom__description">Lorem ipsum dolor sit amet consectetur adipisicing elit.
    Voluptas quisquam
    doloribus
    dolores numquam, eaque
    nesciunt? Quod commodi ea modi quos!</p>
  <div class="menu__wrapper">
    <div class="img__wrapper">${loadImage(3)}</div>
    <div class="img__wrapper">${loadImage(0)}</div>
    <div class="img__wrapper">${loadImage(1)}</div>
    <div class="img__wrapper">${loadImage(2)}</div>
    <div class="img__wrapper">${loadImage(4)}</div>
    <div class="img__wrapper">${loadImage(5)}</div>
  </div>
  <button class="menu__btn btn">Make an order</button>
</div>
`);
;// ./src/img/about_crew.jpg
const about_crew_namespaceObject = __webpack_require__.p + "b65468374a2d97632b63.jpg";
;// ./src/about.js


/* harmony default export */ const about = (`
<div class="about">
  <h2 class="about__title bottom__title">Meet our crew</h2>
  <p class="about__description bottom__description">Donec vitae elit ac mauris dignissim interdum at sed dui. Mauris facilisis elementum auctor. Ut pulvinar turpis in ullamcorper interdum. Quisque sit amet.</p>
  <div class="about__img-wrapper"><img src="${about_crew_namespaceObject}">
    <ul class="about__crew-names">
      <li>
        <div class="about__crew-names--title">Head Chef</div>Daniel Reyes
      </li>
      <li>
        <div class="about__crew-names--title">Kitchen Assistant</div>Julian Carter
      </li>
      <li>
        <div class="about__crew-names--title">Front of House Manager</div>Hannah Lee
      </li>
    </ul>
  </div>
  <p class="about__description--bottom bottom__description">Lorem ipsum dolor sit amet, consectetur adipisicing
    elit. Molestiae atque suscipit magnam nam, ipsa quos impedit debitis esse velit eaque placeat autem.</p>
  <button class="btn about__btn">Check our menu</button>
</div>
`);
;// ./src/contact.js
/* harmony default export */ const contact = (`
<div class="contact">
  <h2 class="contact__title bottom__title">Contact Us</h1>
  <div class="contact__left">
    <div class="contact__address">
      <h3 class="contact__subtitle">Our Address</h3>
      <p>The Generic Restaurant</p>
      <p>123 Main Street</p>
      <p>Austin, TX 73301</p>
      <p>Phone: 123 456 789</p>
      <p>Email: contact@restaurant.com</p>
    </div>

    <div class="contact__hours">
      <h3 class="contact__subtitle">Opening Hours</h3>
      <ul class="contact__opening-times">
        <li>Mon - Fri: 08:00 - 22:30</li>
        <li>Sat: 09:00 - 23:00</li>
        <li>Sun: 10:00 - 20:00</li>
      </ul>
    </div>
  </div>

  <div class="contact__form">
    <h3 class="contact__subtitle">Contact Form</h3>
    <form>
      <label class="contact__label" for="name">Name:</label>
      <input class="contact__input" type="text" id="name" name="name" required>

      <label class="contact__label" for="email">Email:</label>
      <input class="contact__input" type="email" id="email" name="email" required>

      <label class="contact__label" for="message">Message:</label>
      <textarea class="contact__input" id="message" name="message" rows="5" required></textarea>

      <button class="btn contact__btn" type="submit">Send Message</button>
      </form>
    </div>
</div>
`);
;// ./src/index.js




/* harmony default export */ const src = ({ menu: menu, about: about, contact: contact });
;// ./src/main.js



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
  elem.containerBottom.innerHTML = src[sectionName];
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
/******/ })()
;
//# sourceMappingURL=main.js.map