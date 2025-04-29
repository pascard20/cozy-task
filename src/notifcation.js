import templates from "./htmlTemplates";
import { elem } from "./globals";

const notifications = []
const parent = elem.notifications;

class Notification {
  constructor(message, type = 'info', duration = 4000) {
    this.message = message;
    this.type = type;
    this.duration = duration;
    this.element = null;
  }

  returnHTML() {
    templates.getNotification(this.message);
  }

  timeout() {
    setTimeout(() => this.hide(), this.duration);
  }

  show(parent) {
    parent.insertAdjacentHTML('beforeend', this.returnHTML());
    if (!this.element) {
      const divs = parent.querySelectorAll('div');
      this.element = divs[divs.length - 1];
      this.element.classList.add('show');
      this.element.querySelector('.notification__exit')?.addEventListener('click', this.hide());
      notifications.push(this);
    }
  }

  delete() {
    for (let key in this) {
      delete this[key];
    }
  }

  hide() {
    if (this.element) {
      clearTimeout(this.timeout());
      this.element.classList.remove('show');
      this.element.addEventListener('transitionend', () => {
        const index = notifications.indexOf(this);
        if (index !== -1) notifications.splice(index, 1);
        this.delete();
      });
      refreshNotifications();
    }
  }
}

export const createNotification = message => {
  (new Notification(message)).show(parent);
  refreshNotifications(parent);
}

export const refreshNotifications = () => {
  parent.innerHTML = '';
  notifications.forEach(notification => {
    notification.show(parent);
  })
}