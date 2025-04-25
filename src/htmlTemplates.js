export default {
  getPopUpHeader(popUpTitle, popUpID) {
    return `
    <dialog class="popup popup__task" id="${popUpID}">
      <div class="popup__header">
        <h2 class="popup__title">${popUpTitle}</h2>
        <div class="popup__exit">x</div>
      </div>

      <hr class="divider">
    `;
  },

  getPopUpTaskForm() {
    return `
        <form action="#" class="popup__form" autocomplete="off">
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
      </dialog>
    `;
  },

  getTask(index, title, description, date, isImportant, isCompleted, editIcon, deleteIcon) {
    return `
      <li data-index="${index}" class="main__item${isImportant ? ' main__item--important' : ''}${isCompleted ? ' completed' : ''}">
        <div class="main__item-checkbox"></div>
        <div class="main__item-duedate">${date}</div>
        <div class="main__item-name">${title}</div>
        <div class="main__item-description">${description}</div>
        <div class="main__item-setting main__item-edit">${editIcon}</div>
        <div class="main__item-setting main__item-delete">${deleteIcon}</div>
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
      <h1 class="main__title">${title}</h1>
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
      <li class="nav__item" id="${title}">
        <div class="nav__item-icon">${icon}</div>
        <div class="nav__item-name">${title}</div>
        ${taskCounterHTML}
        ${navElementSettingsHTML}
      </li>
    `;
  }

}