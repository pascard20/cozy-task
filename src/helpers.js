import global from "./globals.js";

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