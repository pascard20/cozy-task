import global from "./globals";
import { findElement } from "./helpers";

const getIconSelector = (value, iconHTML) => {
  return `
    <label class="icon-selector">
      <input type="radio" class="icon__radio" name="project-icon" value="${value}" ${value === Object.keys(global.icons.projectChoice)[0] ? ' checked' : ''} required/>
      ${iconHTML}
    </label>
  `
}

const popUpProjectForm = `
  <form action="#" class="popup__form" autocomplete="off">
    <div class="popup__input-title popup__input-area">
      <input class="popup__input" type="text" id="mainTitle" name="mainTitle" placeholder="" maxlength="28" required >
      <label for="mainTitle"><span>Title</span></label>
    </div>
    <div class="popup__input-icon popup__input-area">
      <p><span>Icon</span></p>
      <div class="icon-options">
      ${Object.entries(global.icons.projectChoice).map(([value, iconHTML]) => getIconSelector(value, iconHTML)).join('')}
      </div>
    </div>
    <button class="popup__btn btn" type="submit">Save project</button>
  </form>`;

/* <label class="icon-selector">
          <input type="radio" class="icon__radio" name="project-icon" value="folder" checked />
          <i class="fa-solid fa-folder"></i>
        </label>

        <label class="icon-selector">
          <input type="radio" class="icon__radio" name="project-icon" value="folder" />
          <i class="fa-solid fa-folder"></i>
        </label>

        <label class="icon-selector">
          <input type="radio" class="icon__radio" name="project-icon" value="folder" />
          <i class="fa-solid fa-folder"></i>
        </label>

        <label class="icon-selector">
          <input type="radio" class="icon__radio" name="project-icon" value="folder" />
          <i class="fa-solid fa-folder"></i>
        </label>

        <label class="icon-selector">
          <input type="radio" class="icon__radio" name="project-icon" value="folder" />
          <i class="fa-solid fa-folder"></i>
        </label>

        <label class="icon-selector">
          <input type="radio" class="icon__radio" name="project-icon" value="folder" />
          <i class="fa-solid fa-folder"></i>
        </label>

        <label class="icon-selector">
          <input type="radio" class="icon__radio" name="project-icon" value="folder" />
          <i class="fa-solid fa-folder"></i>
        </label> */

const popUpTaskForm = `
  <form action="#" class="popup__form" autocomplete="off">
    <div class="popup__input-title popup__input-area">
      <input class="popup__input" type="text" id="mainTitle" name="mainTitle" placeholder="" required>
      <label for="mainTitle"><span>Title</span></label>
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
  </form>`;

const popUpDeleteSettings = {
  task: 'This action will <span class="bold">remove this task permanently.</span>',
  project: 'This action will <span class="bold">remove this project and all its tasks permanently.</span>',
  demo: `All demo projects and tasks <span class="bold">will be removed</span>, except those you've edited.`
}

const getPopUpDeleteBody = (popUpType, popUpHeaderText) => {
  return `
    <div class="popup__body">
      <p class="popup__info-upper">Do you really want to <span class="bold">delete</span> ${popUpHeaderText}?</p>
      <p class="popup__info-lower">${popUpDeleteSettings[popUpType]}</p>
      <div class="popup__buttons">
        <button class="popup__btn btn btn--light btn--reject" type="button">Cancel</button>
        <button class="popup__btn btn btn--confirm" type="button">Delete task</button>
      </div>
    </div>
  `;
}

const popUpSettings = {
  task: popUpTaskForm,
  project: popUpProjectForm,
  deleteTask: getPopUpDeleteBody('task', 'this task'),
  deleteProject: getPopUpDeleteBody('project', 'this project'),
  deleteDemo: getPopUpDeleteBody('demo', 'all demo content')
}

/* --------------------------------- EXPORTS -------------------------------- */

export default {
  getPopUp(popUpType, popUpClass, popUpTitle, popUpID) {
    if (!popUpClass) popUpClass = popUpType;
    return `
    <dialog class="popup popup__${popUpClass}" id="${popUpID}">
      <div class="popup__header">
        <h2 class="popup__title">${popUpTitle}</h2>
        <div class="popup__exit">x</div>
      </div>
      <hr class="divider">
      ${popUpSettings[popUpType]}
    </dialog>
    `;
  },

  getTask(task) {
    const hasOriginalProject = findElement(task.originalProject?.title);
    const editButtonHTML = `<div class="main__item-setting main__item-edit">${global.icons.edit}</div>`;
    const revertButtonHTML = hasOriginalProject ? `<div class="main__item-setting main__item-revert">${global.icons.revert}</div>` : '';
    let projectDisplayHTML = '';
    if (task.project === findElement('Deleted')) {
      projectDisplayHTML = hasOriginalProject ? ' | ' + task.originalProject.title : '';
    } else if (task.isCompleted && global.currentElement === findElement('Completed')) {
      projectDisplayHTML = ' | ' + task.project.title;
    }
    return `
      <li data-index="${task.id}" class="main__item${task.isImportant ? ' main__item--important' : ''}${task.isCompleted ? ' completed' : ''}">
        <div class="main__item-checkbox"></div>
        <div class="main__item-duedate ellipsis">${task.formatDueDate()}${projectDisplayHTML}</div>
        <div class="main__item-name">${task.title}</div>
        <div class="main__item-description">${task.description}</div>
        ${global.currentElement.title === 'Deleted' ? revertButtonHTML : editButtonHTML}
        <div class="main__item-setting main__item-delete">${global.icons.trash}</div>
      </li>
    `;
  },

  getTaskCounter(htmlClass, isEditable, importantTasksCount, defaultTasksCount) {
    return `
      <div class="${htmlClass} count${isEditable ? '' : ' ignore'}">
        ${importantTasksCount ? `<div class="count--important">${importantTasksCount}</div>` : ''}
        ${defaultTasksCount ? `<div class="count--default">${defaultTasksCount}</div>` : ''}
      </div>
    `;
  },

  getMainHeader(title, counterHTML) {
    return `
      <h1 class="main__title ellipsis">${title}</h1>
      ${counterHTML}
      <div class="main__add-task">+ New task</div>
    `;
  },

  getNavElementSettings(editIcon, deleteIcon) {
    return `
      <div class="nav__item-settings">
        <div class="nav__item-setting nav__item-edit">${editIcon}</div>
        <div class="nav__item-setting nav__item-delete">${deleteIcon}</div>
      </div>
    `;
  },

  getNewProjectButton() {
    return `<li class="nav__item nav__add-project">+ New project</li>`;
  },

  getNavElement(title, icon, taskCounterHTML, navElementSettingsHTML) {
    return `
      <li class="nav__item nav__element" id="${title}">
        <div class="nav__item-icon">${icon}</div>
        <div class="nav__item-name ellipsis">${title}</div>
        ${taskCounterHTML}
        ${navElementSettingsHTML}
      </li>
    `;
  },

  getNotification(message, type = 'info') {
    const icon = global.icons[type];
    return `
      <div class="notification">
        <div class="notification__icon">${icon}</div>
        <div class="notification__content">${message}</div>
        <div class="notification__exit">x</div>
      </div>
    `;
  }
}