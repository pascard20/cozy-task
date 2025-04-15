import menuPancakes from './img/menu_pancakes.jpg'
import menuSpaghetti from './img/menu_spaghetti.jpg'
import menuWings from './img/menu_wings.jpg'
import menuBreakfast from './img/menu_breakfast.jpg'
import menuPizza from './img/menu_pizza.jpg'
import menuBurger from './img/menu_burger.jpg'

const menuImages = [
  [menuPancakes, 'Pancakes'],
  [menuSpaghetti, 'Spaghetti'],
  [menuWings, 'Chicken Wings'],
  [menuBreakfast, 'Breakfast Set'],
  [menuPizza, 'Pizza'],
  [menuBurger, 'Burger']
]

const loadImage = (imageID) => {
  return `<img src=${menuImages[imageID][0]} alt=${menuImages[imageID][1]}>`
}

export default `
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
`