import './reset.css';
import './style.css';
import { addDays, differenceInCalendarDays } from 'date-fns';

const elem = {
  navGroups: document.querySelector('.nav__groups'),
  navProjects: document.querySelector('.nav__projects')
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
      <div class="main__item-icon main__item-edit"></div>
      <div class="main__item-icon main__item-delete"></div>
    </li>`
  }

  getDaysLeft() {
    return differenceInCalendarDays(new Date(this.date), new Date());
  }
}

class NavElement {
  constructor(name, icon, isCounting = true, tasks = []) {
    this.name = name;
    this.icon = icon;
    this.isCounting = isCounting;
    this.tasks = tasks;
  }

  update(name = null, icon = null) {
    if (name) this.name = name;
    if (icon) this.icon = icon;
  }

  countImportant() {
    return this.tasks.reduce((count, item) => item.isImportant ? count + 1 : count, 0)
  }

  formatCount(count) {
    return count ? count : '';
  }

  returnCounterHTML() {
    return this.isCounting ? `
    <div class="nav__count count">
      <div class="count--important">${this.formatCount(this.countImportant())}</div>
      <div class="count--default">${this.formatCount(this.tasks.length)}</div>
    </div>` : '';
  }

  returnHTML() {
    return `
    <li class="nav__item">
      <div class="nav__item-icon">${this.icon}</div>
      <div class="nav__item-name">${this.name}</div>
      ${this.returnCounterHTML()}
    </li>`
  }

}

class TaskGroup extends NavElement {
  constructor(name, icon, countRule, isCounting = true, tasks = []) {
    super(name, icon, isCounting, tasks);
    this.countRule = countRule;
    // The count rule is a function that takes a task as an argument and returns true or false
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
    addProject('Uncategorized', icons.folder);
    generateRandomTasks(projects[projects.length - 1]);
    addProject('Work', icons.folder);
    generateRandomTasks(projects[projects.length - 1]);
    addProject('House', icons.folder);
    generateRandomTasks(projects[projects.length - 1]);
    addProject('Hobby', icons.folder);
    generateRandomTasks(projects[projects.length - 1]);
    generateRandomTasks(deleted);
  }

  const printNavElements = (section, elements, additionalHTML = '') => {
    section.innerHTML = "";
    elements.forEach(element => {
      section.insertAdjacentHTML('beforeend', element.returnHTML());
    })
    section.insertAdjacentHTML('beforeend', additionalHTML);
  }

  const updateNav = () => {
    updateTaskGroups(taskGroups, returnAllTasks());
    printNavElements(elem.navGroups, [...taskGroups, deleted]);
    printNavElements(elem.navProjects, projects);
  }

  const returnAllTasks = () => {
    const tasks = [];
    projects.forEach(project => {
      tasks.push(...project.tasks);
    });
    return tasks;
  }

  const icons = {
    'folder': `<i class="fa-solid fa-folder"></i>`
  }

  const projects = [];
  const deleted = new Project('Deleted', icons.folder, false);
  const taskGroups = [
    new TaskGroup('All', icons.folder, () => true),
    new TaskGroup('Today', icons.folder, task => task.getDaysLeft() === 0),
    new TaskGroup('This Week', icons.folder, task => {
      const days = task.getDaysLeft();
      return (days >= 0) && (days <= 7);
    }),
    new TaskGroup('Overdue', icons.folder, task => task.getDaysLeft() < 0),
    new TaskGroup('Completed', icons.folder, task => task.isCompleted, false)
  ]

  testContent();

})();