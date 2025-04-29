import templates from "./htmlTemplates";
import { elem } from "./globals";

const parent = elem.notifications;

class Notification {
  constructor(message, type = 'info', duration = 4000) {
    this.message = message;
    this.type = type;
    this.duration = duration;
    this.element = null;
    this.timeoutID = null;
  }

  returnHTML() {
    return templates.getNotification(this.message);
  }

  timeout() {
    this.timeoutID = setTimeout(() => this.hide(), this.duration);
  }

  show() {

    parent.insertAdjacentHTML('beforeend', this.returnHTML());

    if (!this.element) {
      const allNotifications = parent.querySelectorAll('.notification');
      this.element = allNotifications[allNotifications.length - 1];

      setTimeout(() => {
        this.element.classList.add('show');
      }, 10);

      this.element.querySelector('.notification__exit')?.addEventListener('click', () => this.hide());
      this.timeout();
    }
  }

  delete() {
    for (let key in this) {
      delete this[key];
    }
  }

  hide() {
    if (this.element) {
      clearTimeout(this.timeoutID);
      this.element.classList.remove('show');

      const onTransitionEnd = (event) => {
        if (event.propertyName === 'transform') {
          this.element.remove();
          this.element.removeEventListener('transitionend', onTransitionEnd);
          this.delete();
        }
      };
      this.element.addEventListener('transitionend', onTransitionEnd);
    }
  }
}

export const createNotification = message => {
  (new Notification(message)).show();
}