import templates from './htmlTemplates.js';
import { projects } from './globals.js';

class PopUp {
  constructor(name, headerContent) {
    this.name = name;
    this.headerContent = headerContent;
    this.DOMElement = null;
    this.currentData = null;
    // this.elementID = `popup-${title.toLowerCase().replace(' ', '-')}`;
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

  waitForUserInput(defaultProject = null) {
    const form = this.DOMElement.querySelector('form');
    form.reset()

    // Set default project
    const select = this.DOMElement.querySelector('select');
    if (defaultProject) {
      const isValid = [...select.options].some(option => option.value === defaultProject);
      select.value = isValid ? defaultProject : Object.keys(projects)[0];
    }
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