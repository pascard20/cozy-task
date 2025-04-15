export default `
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
`