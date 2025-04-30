import templates from './htmlTemplates.js';
import global from './globals.js';
import { Task } from './task.js';
import { findElement } from './helpers.js';

class Counter {
  returnCounterHTML(htmlClass, isEditable, importantTasksCount, defaultTasksCount) {
    return templates.getTaskCounter(htmlClass, isEditable, importantTasksCount, defaultTasksCount)
  }
}

export class MainHeader extends Counter {
  returnCounterHTML(currentElement) {
    let defaultTaskCount = 0;
    let importantTaskCount = 0;

    const isCounterHidden = currentElement === global.deleted || currentElement === findElement('Completed');
    if (!isCounterHidden) ({ defaultTaskCount, importantTaskCount } = currentElement.countPendingTasks());

    return super.returnCounterHTML('main__count', false, importantTaskCount, defaultTaskCount);
  }

  returnHTML(currentElement) {
    return currentElement ? templates.getMainHeader(currentElement.title, this.returnCounterHTML(currentElement)) : '';
  }
}

export class NavElement extends Counter {
  constructor(title, icon, isCounting = true, isEditable = true, tasks = []) {
    super();
    this.title = title;
    this.icon = icon;
    this.isCounting = isCounting;
    this.tasks = tasks;
    this.isEditable = isEditable;
  }

  update(title = null, icon = null) {
    if (title) this.title = title;
    if (icon) this.icon = icon;
    return this;
  }

  delete() {
    const index = global.projects.findIndex(project => project.title === this.title);
    if (global.currentElement === this) global.currentElement = global.projects[index - 1];
    if (index !== -1) global.projects.splice(index, 1);

    const deletedProjectInfo = {
      title: this.title,
      deletedTaskCount: this.tasks.length
    }

    Object.keys(this).forEach(key => {
      this[key] = null;
    });

    return deletedProjectInfo;
  }

  countImportantTasks() {
    return this.tasks.reduce((count, item) => item.isImportant ? count + 1 : count, 0)
  }

  countPendingTasks() {
    const taskCount = {
      defaultTaskCount: 0,
      importantTaskCount: 0
    }
    this.tasks.forEach(task => {
      if (!task.isCompleted) {
        if (task.isImportant) {
          taskCount.importantTaskCount += 1;
        } else taskCount.defaultTaskCount += 1;
      }
    })
    return taskCount;
  }

  returnCounterHTML() {
    const { defaultTaskCount, importantTaskCount } = this.countPendingTasks();
    return this.isCounting ? super.returnCounterHTML(
      'nav__count',
      this.isEditable,
      importantTaskCount,
      defaultTaskCount
    ) : '';
  }

  returnSettingsHTML() {
    return this.isEditable ? templates.getNavElementSettings(global.icons.edit, global.icons.trash) : '';
  }

  returnHTML() {
    return templates.getNavElement(this.title, this.icon, this.returnCounterHTML(), this.returnSettingsHTML());
  }
}

export class TaskGroup extends NavElement {
  constructor(name, icon, countRule, isCounting = true, tasks = []) {
    super(name, icon, isCounting, false, tasks);
    this.countRule = countRule;
    // The count rule is a function that takes a task as an argument and returns true or false
    // i.e. task => task.getDaysLeft() > 0
  }
}

export class Project extends NavElement {
  addTask(title, description = null, date = null, isImportant = false) {
    const newTask = new Task(title, description, date, isImportant);
    this.tasks.push(newTask);
    return newTask;
  }
}