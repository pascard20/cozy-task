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
    mainHeader: document.querySelector('.main__header'),
    mainTasks: document.querySelector('.main__tasks'),
    notifications: document.querySelector('.notifications'),

    get btnNewTask() {
      return document.querySelector('.main__add-task');
    },

    get btnNewProject() {
      return document.querySelector('.nav__add-project');
    }
  },

  icons: {
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
    dumbbell: `<i class="fa-solid fa-dumbbell"></i>`,
    briefcase: `<i class="fa-solid fa-briefcase"></i>`,
    game: `<i class="fa-solid fa-gamepad"></i>`
  }
}

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