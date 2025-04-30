const global = {

  projects: [],

  deleted: {},

  taskGroups: {},

  popups: {},

  currentElement: null,

  elem: {
    nav: document.querySelector('.nav'),
    navGroups: document.querySelector('.nav__groups'),
    navProjects: document.querySelector('.nav__projects'),
    navProjectsWrapper: document.querySelector('.nav__projects-wrapper'),
    mainHeader: document.querySelector('.main__header'),
    mainTasks: document.querySelector('.main__tasks'),
    mainTasksWrapper: document.querySelector('.main__tasks-wrapper'),
    notifications: document.querySelector('.notifications'),
    allNavSection: document.querySelectorAll('.nav__section'),
    demoAddButton: document.querySelector('.demo-add'),
    demoDeleteButton: document.querySelector('.demo-delete'),

    get btnNewTask() {
      return document.querySelector('.main__add-task');
    },

    get btnNewProject() {
      return document.querySelector('.nav__add-project');
    }
  },

  icons: {
    add: `<i class="fa-solid fa-plus"></i>`,
    briefcase: `<i class="fa-solid fa-briefcase"></i>`,
    check: `<i class="fa-solid fa-check"></i>`,
    clock: `<i class="fa-solid fa-clock"></i>`,
    day: `<i class="fa-solid fa-calendar-day"></i>`,
    dumbbell: `<i class="fa-solid fa-dumbbell"></i>`,
    edit: `<i class="fa-solid fa-pen-to-square"></i>`,
    folder: `<i class="fa-solid fa-folder"></i>`,
    game: `<i class="fa-solid fa-gamepad"></i>`,
    globe: `<i class="fa-solid fa-globe"></i>`,
    house: `<i class="fa-solid fa-house"></i>`,
    info: `<i class="fa-solid fa-circle-info"></i>`,
    people: `<i class="fa-solid fa-people-group"></i>`,
    revert: `<i class="fa-solid fa-rotate-left"></i>`,
    trash: `<i class="fa-solid fa-trash"></i>`,
    warning: `<i class="fa-solid fa-triangle-exclamation"></i>`,
    week: `<i class="fa-solid fa-calendar-week"></i>`
  }
}

Object.defineProperty(global, 'appStorage', {
  get() {
    return [...global.projects, global.deleted];
  },
  enumerable: true
});

const projectIconKeys = [
  'folder',
  'people',
  'house',
  'dumbbell',
  'briefcase',
  'game'
]

global.icons.projectChoice = Object.fromEntries(
  projectIconKeys.map(key => [key, global.icons[key]])
);

export default global;