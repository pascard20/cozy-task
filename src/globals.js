export const projects = {};

export const elem = {
  nav: document.querySelector('.nav'),
  navGroups: document.querySelector('.nav__groups'),
  navProjects: document.querySelector('.nav__projects'),
  mainHeader: document.querySelector('.main__header'),
  mainTasks: document.querySelector('.main__tasks'),

  get btnNewTask() {
    return document.querySelector('.main__add-task')
  }
}

export const icons = {
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

icons.forProjects = [
  icons.folder,
  icons.people,
  icons.house,
  icons.dumbbell,
  icons.briefcase,
  icons.game
]