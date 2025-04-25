import templates from './htmlTemplates.js';

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

  returnHTML(popUpType, popUpClass) {
    return templates.getPopUp(popUpType, popUpClass = null, this.headerContent, this.name);
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

  waitForUserInput(defaultValues = {}) {
    const form = this.DOMElement.querySelector('form');
    form.reset()

    Object.entries(defaultValues).forEach(([selector, value]) => {
      const inputs = form.querySelectorAll(selector);
      inputs.forEach(input => {
        const type = input.type.toLowerCase();
        if (type === 'radio') {
          input.checked = input.value === value;
        } else if (type === 'checkbox') {
          input.checked = !!value;
        } else {
          input.value = value;
        }
      })
    })

    this.DOMElement.showModal();

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        this.DOMElement.removeEventListener('submit', onSubmit);
        this.DOMElement.removeEventListener('close', onClose);
      };

      const onSubmit = () => {
        console.log('Exporting')
        cleanup();
        resolve(this.currentData);
      };

      const onClose = () => {
        cleanup();
        reject('Popup closed without submitting');
      };

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