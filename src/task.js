import templates from './htmlTemplates.js';
import { differenceInCalendarDays, format } from 'date-fns';
import { generateID, sanitize } from './utils.js';
import global from './globals.js';
import { findElement } from './helpers.js';
import { escapeHTML, capitalizeString } from './utils.js';

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
    if (date) this.date = date;
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

  // formatDueDate() {

  //   const { dateObj, isCompleted, isDeleted } = this.getDateInfo();
  //   if (!dateObj) return '';

  //   const isPending = (!isDeleted && !isCompleted);
  //   const formatString = isPending ? "PPP" : "MMMM do, yyyy 'at' HH:mm";
  //   const dateStr = format(dateObj, formatString);
  //   const daysLeft = this.getDaysLeft(dateObj);

  //   let label = '';
  //   if (daysLeft === -1) label = 'Yesterday';
  //   else if (daysLeft === 0) label = 'Today';
  //   else if (daysLeft === 1) label = 'Tomorrow';
  //   else label = formatDistanceToNow(dateObj, { addSuffix: true });

  //   const prefix = isDeleted ? 'Deleted on ' : isCompleted ? 'Completed on ' : '';
  //   return `${prefix}${dateStr}${isPending ? " – " + label : ""}`
  // }

  formatDueDate() {
    const { dateObj, isCompleted, isDeleted } = this.getDateInfo();
    if (!dateObj) return '';

    const isPending = (!isDeleted && !isCompleted);
    const formatString = isPending ? "PPP" : "MMMM do, yyyy 'at' HH:mm";
    const dateStr = format(dateObj, formatString);

    const daysLeft = this.getDaysLeft(dateObj);

    let label = '';

    // Handle special cases
    if (daysLeft === -1) label = 'Yesterday';
    else if (daysLeft === 0) label = 'Today';
    else if (daysLeft === 1) label = 'Tomorrow';
    else {
      // Handle more complex time differences
      const absDays = Math.abs(daysLeft);
      const isFuture = daysLeft > 0;

      if (absDays >= 365) {
        const years = Math.floor(absDays / 365);
        label = `${years} ${years === 1 ? 'year' : 'years'}`;
      } else if (absDays >= 180) {
        label = "half a year";
      } else if (absDays >= 30) {
        const months = Math.floor(absDays / 30);
        label = `${months} ${months === 1 ? 'month' : 'months'}`;
      } else if (absDays >= 7) {
        const weeks = Math.floor(absDays / 7);
        label = `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
      } else {
        label = `${absDays} ${absDays === 1 ? 'day' : 'days'}`;
      }

      label = isFuture ? `In ${label}` : `${capitalizeString(label)} ago`;
    }

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