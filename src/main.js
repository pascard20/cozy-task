import './reset.css';
import './style.css';
import { addDays, differenceInCalendarDays } from 'date-fns';

const elem = {
  navGroups: document.querySelector('.nav__groups'),
  navProjects: document.querySelector('.nav__projects'),
  mainHeader: document.querySelector('.main__header'),
  mainTasks: document.querySelector('.main__tasks')
}

const icons = {
  folder: `<i class="fa-solid fa-folder"></i>`,
  trash: `<i class="fa-solid fa-trash"></i>`,
  day: `<i class="fa-solid fa-calendar-day"></i>`,
  week: `<i class="fa-solid fa-calendar-week"></i>`,
  edit: `<i class="fa-solid fa-pen-to-square"></i>`,
  clock: `<i class="fa-solid fa-clock"></i>`,
  check: `<i class="fa-solid fa-circle-check"></i>`,
  globe: `<i class="fa-solid fa-globe"></i>`,
  people: `<i class="fa-solid fa-people-group"></i>`,
  house: `<i class="fa-solid fa-house"></i>`,
  building: `<i class="fa-solid fa-building"></i>`,
  dumbbell: `<i class="fa-solid fa-dumbbell"></i>`,
  briefcase: `<i class="fa-solid fa-briefcase"></i>`,
  game: `<i class="fa-solid fa-gamepad"></i>`
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

  returnHTML() {
    return `
    <li class="main__item${this.isImportant ? ' main__item--important' : ''}">
      <div class="main__item-checkbox"></div>
      <div class="main__item-duedate">Tomorrow</div>
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
    <li class="nav__item">
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
    taskGroups.forEach(taskGroup => {
      taskGroup.tasks = [];
    })

    tasks.forEach(task => {
      taskGroups.forEach(taskGroup => {
        if (taskGroup.countRule(task)) taskGroup.tasks.push(task);
      })
    })
  }

  const addProject = (name, icon) => {
    projects.push(new Project(name, icon))
    updateNav();
  }

  const addTask = (title, description = null, date = null, isImportant = false, project = projects[0]) => {
    project.addTask(title, description, date, isImportant);
    updateNav();
  }

  const generateRandomTasks = project => {
    const taskCount = Math.floor(Math.random() * 16) + 5; // Random number between 5 and 20
    for (let i = 0; i < taskCount; i++) {
      const isImportant = Math.random() < 1 / 3; // ~33% chance
      const randomOffset = Math.floor(Math.random() * 21) - 2;
      const randomDate = addDays(new Date(), randomOffset);
      addTask(
        'Lorem ipsum',
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perspiciatis, rerum! Doloremque ipsa odit molestias veritatis voluptate odio debitis nisi consectetur?',
        randomDate,
        isImportant,
        project
      );
    }
  }

  const testContent = () => {
    generateRandomTasks(projects[projects.length - 1]);
    addProject('Work', icons.briefcase);
    generateRandomTasks(projects[projects.length - 1]);
    addProject('House', icons.house);
    generateRandomTasks(projects[projects.length - 1]);
    addProject('Hobby', icons.game);
    generateRandomTasks(projects[projects.length - 1]);
    generateRandomTasks(deleted);
  }

  const printElements = (section, elements, additionalHTML = '') => {
    section.innerHTML = "";
    elements.forEach(element => {
      section.insertAdjacentHTML('beforeend', element.returnHTML());
    })
    section.insertAdjacentHTML('beforeend', additionalHTML);
  }

  const printMain = () => {
    elem.mainHeader.innerHTML = mainHeader.returnHTML(currentElement);
    elem.mainTasks.innerHTML = '';
    if (currentElement) {
      currentElement.tasks.forEach(task => {
        elem.mainTasks.insertAdjacentHTML('beforeend', task.returnHTML())
      })
    }
  }

  const updateNav = () => {
    updateTaskGroups(taskGroups, returnAllTasks());
    printElements(elem.navGroups, [...taskGroups, deleted]);
    printElements(elem.navProjects, projects, `<li class="nav__item nav__add-project">+ New project</li>`);
  }

  const returnAllTasks = () => {
    const tasks = [];
    projects.forEach(project => {
      tasks.push(...project.tasks);
    });
    return tasks;
  }

  let currentElement;

  const projects = [];
  const taskGroups = [
    new TaskGroup('All', icons.globe, () => true),
    new TaskGroup('Today', icons.day, task => task.getDaysLeft() === 0),
    new TaskGroup('This Week', icons.week, task => {
      const days = task.getDaysLeft();
      return (days >= 0) && (days <= 7);
    }),
    new TaskGroup('Overdue', icons.clock, task => task.getDaysLeft() < 0),
    new TaskGroup('Completed', icons.check, task => task.isCompleted, false)
  ]
  const deleted = new Project('Deleted', icons.trash, false, false);
  addProject('Uncategorized', icons.folder);

  testContent();
  const mainHeader = new MainHeader();
  currentElement = taskGroups[1];

  printMain();

})();