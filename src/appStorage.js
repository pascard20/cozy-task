import global from './globals.js';
import { Project } from './uiElements.js';
import { Task } from './task.js';
import { findElement, clearProjects } from './helpers.js';

const applyOriginalProjects = projectData => {
  for (const project of projectData) {
    for (const task of project.tasks) {
      if (task._originalProjectTitle) {
        const matchedProject = findElement(task._originalProjectTitle);
        if (matchedProject) task.originalProject = matchedProject;
      }
      delete task._originalProjectTitle;
    }
  }
}

export default {
  save() {
    const { currentElement, appStorage } = global;

    const currentTitle = currentElement?.title || '';
    localStorage.setItem('currentElement', JSON.stringify(currentTitle));

    if (!Array.isArray(appStorage) || appStorage.length === 0) return; // Check whether appStorage is a non-empty array

    const plainData = appStorage
      .filter(project => project && Object.keys(project).length > 0)
      .map(project => ({
        title: project.title,
        icon: project.icon,
        isCounting: project.isCounting,
        isEditable: project.isEditable,
        tasks: project.tasks.map(task => ({
          id: task.id,
          title: task.title,
          date: task.date,
          description: task.description,
          isImportant: task.isImportant,
          isCompleted: task.isCompleted,
          completionDate: task.completionDate,
          deletionDate: task.deletionDate,
          originalProject: task.originalProject ? task.originalProject.title : null

        }))
      })
      );
    localStorage.setItem('appData', JSON.stringify(plainData));
  },

  read() {
    const result = {};

    // Ensure there are no errors connected to the JSON.parse()
    try {
      const currentTitle = JSON.parse(localStorage.getItem('currentElement'));
      result.currentElement = currentTitle;
    } catch {
      result.currentElement = '';
    }

    const rawData = localStorage.getItem('appData');
    if (!rawData) {
      result.appData = [];
      return result;
    };

    const parsedData = JSON.parse(rawData);

    const convertedData = parsedData.map(projectData => {
      const project = new Project(
        projectData.title,
        projectData.icon,
        projectData.isCounting,
        projectData.isEditable
      );

      project.tasks = projectData.tasks.map(taskData => {
        const task = new Task(
          taskData.title,
          taskData.description,
          taskData.date ? new Date(taskData.date) : null,
          taskData.isImportant
        );
        task.id = taskData.id;
        task.isCompleted = taskData.isCompleted;
        task._originalProjectTitle = taskData.originalProject; // It stores originalProject's title for now. Need to link the actual object afterwards.
        task.completionDate = taskData.completionDate ? new Date(taskData.completionDate) : null;
        task.deletionDate = taskData.deletionDate ? new Date(taskData.deletionDate) : null;
        return task;
      });

      return project;
    });



    result.appData = convertedData;
    return result;
  },

  load() {
    const data = this.read();
    if (!data) return;

    const { currentElement, appData } = data;
    clearProjects();

    for (const project of appData) {
      project.title === 'Deleted' ? global.deleted = project : global.projects.push(project);
    }

    global.currentElement = findElement(currentElement);
    applyOriginalProjects(appData);
  }
}