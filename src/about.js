import imageCrew from './img/about_crew.jpg';

export default `
<div class="about">
  <h2 class="about__title bottom__title">Meet our crew</h2>
  <p class="about__description bottom__description">Donec vitae elit ac mauris dignissim interdum at sed dui. Mauris facilisis elementum auctor. Ut pulvinar turpis in ullamcorper interdum. Quisque sit amet.</p>
  <div class="about__img-wrapper"><img src="${imageCrew}">
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
`