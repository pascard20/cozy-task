import templates from './htmlTemplates.js';
import global from "./globals.js";

class PopUp {
  constructor(name, headerContent) {
    this.name = name;
    this.headerContent = headerContent;
    this.DOMElement = null;
    this.currentData = null;
    this.eventListeners = [
      { selector: '.popup__exit', event: 'click', handler: this.handleExit.bind(this) },
      { selector: '.popup__form', event: 'submit', handler: this.handleSubmit.bind(this) },
    ];
  }

  handleExit() {
    this.DOMElement.close();
  }

  handleSubmit(event) {
    event.preventDefault();
    this.currentData = new FormData(event.target);
    this.handleExit()
  }

  returnHTML(popUpType, popUpClass = null) {
    return templates.getPopUp(popUpType, popUpClass, this.headerContent, this.name);
  }

  createDOMElement() {
    if (!this.DOMElement) {
      document.body.insertAdjacentHTML('beforeend', this.returnHTML());
      this.DOMElement = document.querySelector(`#${this.name}`);
    }
  }

  attachEventListeners() {
    this.eventListeners.forEach(({ selector, event, handler }) => {
      this.DOMElement.querySelector(selector)?.addEventListener(event, handler);
    })
  }

  initializeDOMElement() {
    this.createDOMElement();
    this.attachEventListeners();
  }

  formatDateForInput(date) {
    // Valid Date object
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }

    // String in YYYY-MM-DD format
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    return '';
  }

  waitForUserInput(defaultValues = {}) {
    // Reset form
    const form = this.DOMElement.querySelector('form');
    form.reset();

    // Set default values
    Object.entries(defaultValues).forEach(([selector, value]) => {
      const inputs = form.querySelectorAll(selector);
      inputs.forEach(input => {
        if (selector === '#dueDate') value = this.formatDateForInput(value);
        const type = input.type.toLowerCase();
        if (type === 'radio') {
          input.checked = global.icons[input.value] === value;
        } else if (type === 'checkbox') {
          input.checked = !!value;
        } else if (type === 'select-one') {
          const optionExists = Array.from(input.options).some(option => option.value === value);
          input.value = optionExists ? value : 'Uncategorized';
        } else {
          input.value = value;
        }
      });
    });

    // Ensure dialog is closed
    if (this.DOMElement.open) {
      this.DOMElement.close();
    }

    return new Promise(resolve => {
      try {
        this.DOMElement.showModal();
      } catch (e) {
        console.error('Dialog failed to open:', e);
        return resolve(null);
      }

      const onSubmit = () => {
        cleanup();
        resolve(this.currentData);
      };

      const onClose = () => {
        cleanup();
        resolve(null);
      };

      const cleanup = () => {
        this.DOMElement.removeEventListener('submit', onSubmit);
        this.DOMElement.removeEventListener('close', onClose);
      };

      // Clean up any existing listeners and attach new ones
      cleanup();
      this.DOMElement.addEventListener('submit', onSubmit, { once: true });
      this.DOMElement.addEventListener('close', onClose, { once: true });
    });
  }
}

export class TaskPopUp extends PopUp {
  returnHTML() {
    return super.returnHTML('task');
  }
}

export class ProjectPopUp extends PopUp {
  returnHTML() {
    return super.returnHTML('project');
  }
}

export class DeletePopUp extends PopUp {
  constructor(name, headerContent = "Are you sure?") {
    super(name, headerContent);
  }

  waitForUserConfirmation() {
    this.DOMElement.showModal();
    document.activeElement.blur();

    return new Promise((resolve, reject) => {
      const confirmButton = this.DOMElement.querySelector('.btn--confirm');
      const rejectButton = this.DOMElement.querySelector('.btn--reject');

      const cleanup = () => {
        confirmButton.removeEventListener('click', onConfirm);
        rejectButton.removeEventListener('click', onReject);
        this.DOMElement.removeEventListener('close', onExit);
      };

      const onConfirm = () => {
        cleanup();
        resolve(true);
        this.DOMElement.close();
      }

      const onReject = () => {
        cleanup();
        reject(new Error('Action rejected by the user'));
        this.DOMElement.close();
      }

      const onExit = () => {
        cleanup();
        this.DOMElement.close();
        reject(new Error('User closed the popup'));
      }

      confirmButton.addEventListener('click', onConfirm, { once: true });
      rejectButton.addEventListener('click', onReject, { once: true });
      this.DOMElement.addEventListener('close', onExit, { once: true });
    });
  }

  returnHTML() {
    return super.returnHTML(this.name, 'delete');
  }
}