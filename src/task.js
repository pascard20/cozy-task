import templates from './htmlTemplates.js';
import { differenceInCalendarDays, format } from 'date-fns';
import { generateID } from './utils.js';
import global from './globals.js';

export class Task {
  constructor(title, description = null, date = null, isImportant = false) {
    this.id = generateID();
    this.title = title;
    this.description = description;
    this.date = date;
    this.isImportant = isImportant;
    this.isCompleted = false;
  }

  get project() {
    return [...global.projects, global.deleted].find(project => {
      return project.tasks.some(task => task.id === this.id);
    });
  }

  update(title, description = null, date = null, isImportant = false, project) {
    this.title = title;
    if (description) this.description = description;
    if (date) this.date = date;
    this.isImportant = isImportant;
    this.changeProject(project);
    return this;
  }

  delete() {
    const currentProject = this.project;
    console.log(this.project)
    if (!currentProject) return;

    console.log(currentProject.tasks)

    const index = currentProject.tasks.findIndex(task => task.id === this.id);
    if (index !== -1) currentProject.tasks.splice(index, 1);

    console.log(currentProject.tasks)

    Object.keys(this).forEach(key => {
      this[key] = null;
    });

    return true;
  }

  changeProject(newProject) {
    const index = this.project.tasks.indexOf(this);
    if (index > -1) {
      this.project.tasks.splice(index, 1);
    }
    newProject.tasks.push(this);
  }

  formatDueDate() {
    switch (this.getDaysLeft()) {
      case null:
        return '';
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
    return templates.getTask(this.id, this.title, this.description, this.formatDueDate(), this.isImportant, this.isCompleted, global.icons.edit, global.icons.trash);
  }

  getDaysLeft() {
    return this.date ? differenceInCalendarDays(new Date(this.date), new Date()) : null;
  }
}