import templates from './htmlTemplates.js';
import { icons } from './globals.js';
import { Task } from './task.js';

class Counter {
  returnCounterHTML(htmlClass, isEditable, importantTasksCount, defaultTasksCount) {
    return templates.getTaskCounter(htmlClass, isEditable, importantTasksCount, defaultTasksCount)
  }
}

export class MainHeader extends Counter {
  returnCounterHTML(currentElement) {
    const importantTasks = currentElement.countImportantTasks();
    const allTasks = currentElement.tasks.length;
    return super.returnCounterHTML('main__count', false, importantTasks, allTasks - importantTasks);
  }

  returnHTML(currentElement) {
    return currentElement ? templates.getMainHeader(currentElement.name, this.returnCounterHTML(currentElement)) : '';
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
    return this.isEditable ? templates.getNavElementSettings(icons.edit, icons.trash) : '';
  }

  returnHTML() {
    return templates.getNavElement(this.name, this.icon, this.returnCounterHTML(), this.returnSettingsHTML());
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
    this.tasks.push(new Task(title, description, date, isImportant))
  }

  // moveTask(task, destination) {
  //   destination.addTask(task.title, task.description, task.date, task.isImportant);
  // }
}