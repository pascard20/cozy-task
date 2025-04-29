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

export const updateTaskGroups = (taskGroups, tasks) => {
  Object.values(taskGroups).forEach(taskGroup => {
    taskGroup.tasks = [];
  })

  tasks.forEach(task => {
    Object.values(taskGroups).forEach(taskGroup => {
      if (taskGroup.countRule(task)) taskGroup.tasks.push(task);
    })
  })
}

export const addProject = (name, icon, isEditable = true) => {
  if (!findElement(name)) {
    const newProject = new Project(name, icon, true, isEditable);
    global.projects.push(newProject);
    updateNav();
    return newProject;
  } else {
    createNotification(`The title "${name}" is already being used`, 'warning')
    console.warn('Project already exists!');
  }

}

export const addTask = (title, description = null, date = null, isImportant = false, project = findElement('Uncategorized')) => {
  if (project) {
    console.log(project.addTask)
    const newTask = project.addTask(title, description, date, isImportant);
    refreshApp();
    return newTask;
  } else console.warn('This project does not exist!');
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