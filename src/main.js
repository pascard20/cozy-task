import './reset.css';
import './style.css';
import { addDays, differenceInCalendarDays, format } from 'date-fns';
import { capitalizeString } from './utils.js';
import { elem, icons } from './globals.js'

const projects = {};

class PopUp {
  constructor(title) {
    this.title = title;
    this.DOMElement = null;
    this.currentData = null;
    this.elementID = `popup-${title.toLowerCase().replace(' ', '-')}`;
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

  returnHTML() {
    return `
    <dialog class="popup popup__task" id="${this.elementID}">
      <div class="popup__header">
        <h2 class="popup__title">${this.title}</h2>
        <div class="popup__exit">x</div>
      </div>

      <hr class="divider">
    `;
  }

  createDOMElement() {
    if (!this.DOMElement) {
      document.body.insertAdjacentHTML('beforeend', this.returnHTML());
      this.DOMElement = document.querySelector(`#${this.elementID}`);
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

class TaskPopUp extends PopUp {
  returnHTML() {
    return `
    ${super.returnHTML()}
      <form action="#" class="popup__form">
        <div class="popup__input-title popup__input-area">
          <input class="popup__input" type="text" id="title" name="title" placeholder="" required>
          <label for="title"><span>Title</span></label>
        </div>

        <div class="popup__input-description popup__input-area">
          <textarea class="popup__input" id="description" name="description" placeholder=""></textarea>
          <label for="description"><span>Description</span></label>
        </div>

        <div class="popup__input-area popup__input-project">
          <select class="popup__input" id="project" name="project">
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="hobby">Hobby</option>
          </select>
          <label for="project"><span>Project</span></label>
        </div>

        <div class="popup__input-area popup__input-date">
          <input class="popup__input" type="date" id="dueDate" name="dueDate">
          <label for="dueDate"><span>Date</span></label>
        </div>

        <div class="popup__input-area popup__input-isImportant">
          <label class="isImportant-label" for="isImportant">Important</label>
          <label class="switch">
            <input id="isImportant" name="isImportant" type="checkbox">
            <span class="slider"></span>
          </label>
        </div>

        <button class="popup__btn btn" type="submit">Save task</button>
      </form>
    </dialog>`;
  }
}

class ProjectPopUP extends PopUp {

}

class Task {
  constructor(title, description = null, date = null, isImportant = false) {
    this.title = title;
    this.description = description;
    this.date = date;
    this.isImportant = isImportant;
    this.isCompleted = false;
  }

  update(title = null, description = null, date = null, isImportant = false) {
    if (title) this.title = title;
    if (description) this.description = description;
    if (date) this.date = date;
    if (isImportant) this.isImportant = isImportant;
  }

  formatDueDate() {
    switch (this.getDaysLeft()) {
      case -1:
        return 'Yesterday';
      case 0:
        return 'Today';
      case 1:
        return 'Tomorrow';
      default:
        return format(this.date, 'PPP');
    }
  }

  returnHTML() {
    return `
    <li class="main__item${this.isImportant ? ' main__item--important' : ''}">
      <div class="main__item-checkbox"></div>
      <div class="main__item-duedate">${this.formatDueDate()}</div>
      <div class="main__item-name">${this.title}</div>
      <div class="main__item-description">${this.description}</div>
      <div class="main__item-setting main__item-edit">${icons.edit}</div>
      <div class="main__item-setting main__item-delete">${icons.trash}</div>
    </li>`
  }

  getDaysLeft() {
    return differenceInCalendarDays(new Date(this.date), new Date());
  }
}

class Counter {
  returnCounterHTML(htmlClass, isEditable, importantTasksCount, defaultTasksCount) {
    return `<div class="${htmlClass} count${isEditable ? '' : ' ignore'}">
      ${importantTasksCount ? `<div class="count--important">${importantTasksCount}</div>` : ''}
      ${defaultTasksCount ? `<div class="count--default">${defaultTasksCount}</div>` : ''}
    </div>`;
  }
}

class MainHeader extends Counter {
  returnCounterHTML(currentElement) {
    const importantTasks = currentElement.countImportantTasks();
    const allTasks = currentElement.tasks.length;
    return super.returnCounterHTML('main__count', false, importantTasks, allTasks - importantTasks);
  }

  returnHTML(currentElement) {
    return currentElement ? `
    <h1 class="main__title">${currentElement.name}</h1>
    ${this.returnCounterHTML(currentElement)}
    <div class="main__add-task">+ New task</div>` : '';
  }
}

class NavElement extends Counter {
  constructor(name, icon, isCounting = true, isEditable = true, tasks = []) {
    super();
    this.name = name;
    this.icon = icon;
    this.isCounting = isCounting;
    this.tasks = tasks;
    this.isEditable = isEditable;
  }

  update(name = null, icon = null) {
    if (name) this.name = name;
    if (icon) this.icon = icon;
  }

  countImportantTasks() {
    return this.tasks.reduce((count, item) => item.isImportant ? count + 1 : count, 0)
  }

  returnCounterHTML() {
    return this.isCounting ? super.returnCounterHTML(
      'nav__count',
      this.isEditable,
      this.countImportantTasks(),
      this.tasks.length - this.countImportantTasks()
    ) : '';
  }

  returnSettingsHTML() {
    return this.isEditable ? `
    <div class="nav__item-settings">
      <div class="nav__item-setting nav__item-edit">${icons.edit}</div>
      <div class="nav__item-setting nav__item-delete">${icons.trash}</div>
    </div>` : '';
  }

  returnHTML() {
    return `
    <li class="nav__item" id="${this.name}">
      <div class="nav__item-icon">${this.icon}</div>
      <div class="nav__item-name">${this.name}</div>
      ${this.returnCounterHTML()}
      ${this.returnSettingsHTML()}
    </li>`
  }

}

class TaskGroup extends NavElement {
  constructor(name, icon, countRule, isCounting = true, tasks = []) {
    super(name, icon, isCounting, false, tasks);
    this.countRule = countRule;
    // The count rule is a function that takes a task as an argument and returns true or false
    // i.e. task => task.getDaysLeft() > 0
  }
}

class Project extends NavElement {
  addTask(title, description = null, date = null, isImportant = false) {
    this.tasks.push(new Task(title, description, date, isImportant))
  }

  // moveTask(task, destination) {
  //   destination.addTask(task.title, task.description, task.date, task.isImportant);
  // }
}

const app = (function () {

  const updateTaskGroups = (taskGroups, tasks) => {
    Object.values(taskGroups).forEach(taskGroup => {
      taskGroup.tasks = [];
    })

    tasks.forEach(task => {
      Object.values(taskGroups).forEach(taskGroup => {
        if (taskGroup.countRule(task)) taskGroup.tasks.push(task);
      })
    })
  }

  const addProject = (name, icon) => {
    if (!projects[name]) {
      projects[name] = new Project(name, icon)
      updateNav();
    } else console.warn('Project already exists!');

  }

  const addTask = (title, description = null, date = null, isImportant = false, project = projects.Uncategorized) => {
    if (project) {
      project.addTask(title, description, date, isImportant);
      updateNav();
    } else console.warn('This project does not exist!');
  }

  const generateRandomTasks = (project = projects.Uncategorized) => {
    const taskCount = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < taskCount; i++) {
      const isImportant = Math.random() < 1 / 4;
      const randomOffset = Math.floor(Math.random() * 8) - 2;
      const randomDate = addDays(new Date(), randomOffset);

      const titleLength = Math.floor(Math.random() * 3) + 2;
      const titleIndex = Math.floor(Math.random() * loremIpsumSplit.length);

      const haveDescription = Math.random() < 7 / 8;
      const descriptionLength = haveDescription ? Math.floor(Math.random() * 10) + 10 : 0;
      const descriptionIndex = Math.floor(Math.random() * loremIpsumSplit.length);

      const lorem = [...loremIpsumSplit, ...loremIpsumSplit];
      const taskTitle = capitalizeString(lorem.slice(titleIndex, titleIndex + titleLength).join(' '));
      const taskDescription = capitalizeString(lorem.slice(descriptionIndex, descriptionIndex + descriptionLength).join(' '));


      addTask(
        taskTitle,
        taskDescription,
        randomDate,
        isImportant,
        project
      );
    }
  }

  const testContent = () => {
    generateRandomTasks();

    for (const [name, icon] of [['Work', 'briefcase'], ['House', 'house'], ['Hobby', 'game']]) {
      addProject(name, icons[icon]);
      generateRandomTasks(projects[name]);
    }

    generateRandomTasks(deleted);
  }

  const printElements = (section, elements, additionalHTML = '') => {
    section.innerHTML = "";
    elements.forEach(element => {
      section.insertAdjacentHTML('beforeend', element.returnHTML());
    })
    section.insertAdjacentHTML('beforeend', additionalHTML);
  }

  const handleCreateTask = () => {
    updatePopups();
    handleNewTask();
  }

  const printMain = () => {
    if (currentElement) {
      elem.btnNewTask?.removeEventListener('click', handleCreateTask);

      elem.mainHeader.innerHTML = mainHeader.returnHTML(currentElement);
      elem.mainTasks.innerHTML = '';
      if (currentElement) {
        currentElement.tasks.forEach(task => {
          elem.mainTasks.insertAdjacentHTML('beforeend', task.returnHTML())
        })
      }

      elem.btnNewTask?.addEventListener('click', handleCreateTask);
    }
  }

  const updateNav = () => {
    updateTaskGroups(taskGroups, returnAllTasks());
    printElements(elem.navGroups, [...Object.values(taskGroups), deleted]);
    printElements(elem.navProjects, Object.values(projects), `<li class="nav__item nav__add-project">+ New project</li>`);
  }

  const returnAllTasks = () => {
    const tasks = [];
    Object.values(projects).forEach(project => {
      tasks.push(...project.tasks);
    });
    return tasks;
  }

  const findElement = elementID => {
    const lookup = {
      ...projects,
      ...taskGroups,
      [deleted.name]: deleted
    }
    return lookup[elementID];
  }

  const handleNavClick = event => {
    const elementID = event.target.closest("li")?.id;
    currentElement = findElement(elementID);
    printMain();
  }

  const updateProjectOptions = (selectElement, projects) => {
    selectElement.innerHTML = '';
    for (const projectName in projects) {
      const option = document.createElement('option');
      option.value = projectName;
      option.textContent = projectName;
      selectElement.appendChild(option);
    }
  }

  const updatePopups = () => {
    Object.values(popups).forEach(popup => {
      updateProjectOptions(popup.DOMElement.querySelector('select'), projects);
    })
  }

  async function handleNewTask() {
    const popup = popups.newTask;

    try {
      const data = await popup.waitForUserInput(currentElement.name);
      console.log('User submitted:', data);
      // addTask()
    } catch (e) {
      console.log('User canceled:', e);
    }
  }

  /* ------------------------- Initialize task groups ------------------------- */
  const taskGroups = {
    All: new TaskGroup('All', icons.globe, task => !task.isCompleted),
    Today: new TaskGroup('Today', icons.day, task => task.getDaysLeft() === 0),
    'This Week': new TaskGroup('This Week', icons.week, task => {
      const days = task.getDaysLeft();
      return (days >= 0) && (days <= 7);
    }),
    Overdue: new TaskGroup('Overdue', icons.clock, task => task.getDaysLeft() < 0),
    Completed: new TaskGroup('Completed', icons.check, task => task.isCompleted, false)
  }
  const deleted = new Project('Deleted', icons.trash, false, false);
  addProject('Uncategorized', icons.folder);

  const mainHeader = new MainHeader();

  /* ---------------------------- Initialize popups --------------------------- */
  const popups = {
    newTask: new TaskPopUp('New task'),
    editTask: new TaskPopUp('Edit task')
  }

  Object.values(popups).forEach(popup => {
    popup.initializeDOMElement();
  })

  /* ------------------------- Initialize test content ------------------------ */
  const loremIpsum = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, eius cumque obcaecati sequi iusto vitae eveniet distinctio id voluptas officia quod odit voluptatem earum. Aliquid explicabo ipsa odio maiores. Tempore autem dolorem aspernatur officiis omnis distinctio quam aperiam. Quas eligendi id iure. Ipsa dolore qui modi ad nobis natus possimus soluta expedita accusantium non nihil excepturi dolorem mollitia adipisci aliquam, laborum, amet exercitationem cumque ipsum vero distinctio totam, omnis numquam. Autem distinctio natus possimus? Neque explicabo, animi totam eius, natus quae tempora est nulla quaerat nemo, architecto voluptatum accusamus asperiores! Hic aperiam perspiciatis dolores ea assumenda necessitatibus sint facilis enim.`;
  const loremIpsumSplit = loremIpsum.split(' ');

  testContent();
  let currentElement = taskGroups.Today;

  /* ---------------------- Events and UI initialization ---------------------- */
  elem.nav.addEventListener('click', handleNavClick);

  updatePopups();
  printMain();

})();