import global from './globals.js';

export const saveProjects = () => {
  const plainProjects = global.projects.map(project => {
    return {
      title: project.title,
      icon: project.icon,
      isCounting: project.isCounting,
      isEditable: project.isEditable,
      tasks: project.tasks.map(task => {
        return {
          id: task.id,
          title: task.title,
          date: task.date,
          description: task.description,
          isImportant: task.isImportant,
          isCompleted: task.isCompleted,
          originalProject: task.originalProject ? task.originalProject.title : null
        }
      })
    }
  });
  localStorage.setItem('projects', JSON.stringify(plainProjects));
}