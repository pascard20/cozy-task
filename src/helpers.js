import global from "./globals.js";
import { createNotification } from './notifcation.js';

export const returnAllTasks = () => {
  const tasks = [];
  global.projects.forEach(project => {
    tasks.push(...project.tasks);
  });
  return tasks;
}

export const findElement = elementID => {
  const lookup = {
    ...global.projects.reduce((acc, project) => {
      acc[project.title] = project;
      return acc;
    }, {}),
    ...global.taskGroups,
    [global.deleted.title]: global.deleted
  }
  return lookup[elementID];
}

export const updateTaskGroups = () => {
  const taskGroups = global.taskGroups;
  const tasks = returnAllTasks();
  Object.values(taskGroups).forEach(taskGroup => {
    taskGroup.tasks = [];
  })

  tasks.forEach(task => {
    Object.values(taskGroups).forEach(taskGroup => {
      if (taskGroup.countRule(task)) taskGroup.tasks.push(task);
    })
  })
}

export const sortProjectTasks = project => {
  project.tasks.sort((a, b) => {
    const bDateInfo = b.getDateInfo();
    const bDate = bDateInfo.dateObj;
    const aDateInfo = a.getDateInfo();
    const aDate = aDateInfo.dateObj;

    const isDefaultTask = dateInfo => {
      return (!dateInfo.isCompleted && !dateInfo.isDeleted);
    }

    // 1. Tasks without a date come first
    if (!aDate && bDate) return -1;
    if (aDate && !bDate) return 1;

    // 2. For default tasks compare only date, for others include time as well
    if (aDate && bDate) {
      const aDateForSorting = isDefaultTask(aDateInfo) ? new Date(aDate.getFullYear(), aDate.getMonth(), aDate.getDate()) : new Date(aDateInfo.dateObj);
      const bDateForSorting = isDefaultTask(bDateInfo) ? new Date(bDate.getFullYear(), bDate.getMonth(), bDate.getDate()) : new Date(bDateInfo.dateObj);

      const dateDiff = aDateForSorting - bDateForSorting;
      if (dateDiff !== 0) return dateDiff; // If dates are different, return the difference
    }

    // 3. If dates are the same (or both null), compare by importance
    if (a.isImportant !== b.isImportant) {
      return a.isImportant ? -1 : 1; // Important tasks (true) come first
    }

    // 4. If both have the same importance, sort by title
    return a.title.localeCompare(b.title);
  });
};

export const moveTask = (task, destination) => {
  task.update(
    task.title,
    task.description,
    task.date,
    task.isImportant,
    destination
  );
}

export const clearProjects = () => {
  global.projects = [];
  global.deleted = {};
}

export const hideNavBar = () => {
  setTimeout(() => global.elem.nav.classList.remove('open'), 10);
}