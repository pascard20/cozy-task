import templates from './htmlTemplates.js';
import { differenceInCalendarDays, format } from 'date-fns';
import { generateID, sanitize } from './utils.js';
import global from './globals.js';
import { formatDistanceToNow } from 'date-fns';
import { findElement } from './helpers.js';
import { escapeHTML } from './utils.js';

export class Task {
  constructor(title, description = null, date = null, isImportant = false) {
    this.id = generateID();
    this.title = escapeHTML(title);
    this.description = escapeHTML(description);
    this.date = date;
    this.completionDate = null;
    this.deletionDate = null;
    this.isImportant = isImportant;
    this.isCompleted = false;
    this.originalProject = null;
  }

  get project() {
    return [...global.projects, global.deleted].find(project => {
      return project.tasks.some(task => task.id === this.id);
    });
  }

  update(title, description = null, date = null, isImportant = false, project) {
    this.title = escapeHTML(title);
    if (description) this.description = escapeHTML(description);
    if (date) this.date = escapeHTML(date);
    this.isImportant = isImportant;
    this.changeProject(project);
    return this;
  }

  delete() {
    const currentProject = this.project;
    if (!currentProject) return;

    const index = currentProject.tasks.findIndex(task => task.id === this.id);
    if (index !== -1) currentProject.tasks.splice(index, 1);

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

  getDateInfo() {
    let dateObj = null, isCompleted = false, isDeleted = false;
    if (this.project === findElement('Deleted') && this.deletionDate) {
      dateObj = this.deletionDate;
      isDeleted = true;
    } else if (global.currentElement === findElement('Completed') && (this.isCompleted && this.completionDate)) {
      dateObj = this.completionDate
      isCompleted = true;
    } else if (this.date) dateObj = this.date;
    return { dateObj, isCompleted, isDeleted };
  }

  formatDueDate() {

    const { dateObj, isCompleted, isDeleted } = this.getDateInfo();
    if (!dateObj) return '';

    const isPending = (!isDeleted && !isCompleted);
    const formatString = isPending ? "PPP" : "MMMM do, yyyy 'at' HH:mm";
    const dateStr = format(dateObj, formatString);
    const daysLeft = this.getDaysLeft(dateObj);

    let label = '';
    if (daysLeft === -1) label = 'Yesterday';
    else if (daysLeft === 0) label = 'Today';
    else if (daysLeft === 1) label = 'Tomorrow';
    else label = formatDistanceToNow(dateObj, { addSuffix: true });

    const prefix = isDeleted ? 'Deleted on ' : isCompleted ? 'Completed on ' : '';
    return `${prefix}${dateStr}${isPending ? " – " + label : ""}`
  }

  returnHTML() {
    const baseHTML = templates.getTask(this);
    return sanitize(baseHTML);
  }

  getDaysLeft(date = this.date) {
    return date ? differenceInCalendarDays(new Date(date), new Date()) : null;
  }
}