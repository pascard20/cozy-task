import templates from "./htmlTemplates";
import global from "./globals";
import { sanitize } from "./utils";

const parent = global.elem.notifications;

class Notification {
  constructor(message, type = 'info', duration = 6000) {
    this.message = message;
    this.type = type;
    this.duration = duration;
    this.element = null;
    this.timeoutID = null;
  }

  returnHTML() {
    const baseHTML = templates.getNotification(this.message, this.type);
    return sanitize(baseHTML);
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
      }, 50);

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

export const createNotification = (message, type = 'info') => {
  (new Notification(message, type)).show();
}