import global from "./globals.js";
import { escapeHTML } from "./utils.js";

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
  return lookup[escapeHTML(elementID)];
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
  if (!project || !project.tasks || !Array.isArray(project.tasks)) {
    console.warn("Cannot sort tasks: project or tasks array is invalid", project);
    return project;
  }

  project.tasks.sort((a, b) => {
    const aDateInfo = a.getDateInfo();
    const bDateInfo = b.getDateInfo();

    const aDate = aDateInfo?.dateObj;
    const bDate = bDateInfo?.dateObj;

    const isDefaultTask = dateInfo => {
      return (!dateInfo.isCompleted && !dateInfo.isDeleted);
    }

    // 1. Tasks without a date come first
    if (!aDate && bDate) return -1;
    if (aDate && !bDate) return 1;

    // 2. For default tasks compare only date, for others include time as well
    try {
      const aDateObj = parseDateSafely(aDate);
      const bDateObj = parseDateSafely(bDate);

      const aDateForSorting = isDefaultTask(aDateInfo)
        ? new Date(aDateObj.getFullYear(), aDateObj.getMonth(), aDateObj.getDate())
        : aDateObj;

      const bDateForSorting = isDefaultTask(bDateInfo)
        ? new Date(bDateObj.getFullYear(), bDateObj.getMonth(), bDateObj.getDate())
        : bDateObj;

      const dateDiff = aDateForSorting - bDateForSorting;
      if (dateDiff !== 0) return dateDiff;
    } catch (e) {
      console.warn("Error comparing dates:", e, { aDate, bDate });
    }

    // 3. If dates are the same (or both null), compare by importance
    if (a.isImportant !== b.isImportant) {
      return a.isImportant ? -1 : 1; // Important tasks (true) come first
    }

    // 4. If both have the same importance, sort by title
    return (a.title || "").localeCompare(b.title || "");
  });

  return project;
};

function parseDateSafely(date) {
  if (!date) return null;

  if (date instanceof Date) return date;

  try {
    // Handle string date in simple format (YYYY-MM-DD)
    if (typeof date === 'string') {
      if (date.length === 10 && date.includes('-')) {
        const [year, month, day] = date.split('-').map(num => parseInt(num, 10));
        return new Date(year, month - 1, day);
      }
      // Handle ISO string format
      return new Date(date);
    }

    // Handle any other format
    return new Date(date);
  } catch (e) {
    console.warn("Failed to parse date:", date);
    return null;
  }
}

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