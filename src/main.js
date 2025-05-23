import SimpleBar from 'simplebar';
import 'simplebar/dist/simplebar.css';
import './reset.css';
import './style.css';
import { addDays } from 'date-fns';
import { capitalizeString } from './utils.js';
import global from './globals.js';
import { TaskPopUp, ProjectPopUp, DeletePopUp } from './popup.js';
import { MainHeader, Project, TaskGroup } from './uiElements.js';
import { createNotification } from './notifcation.js';
import { hideNavBar, findElement, moveTask, updateTaskGroups, sortProjectTasks } from './helpers.js';
import appStorage from './appStorage.js';

(function () {

  global.elem.allNavSection.forEach(section => {
    section.classList.remove('loaded');
  })

  /* ---------------------------- App functionality --------------------------- */

  const addProject = (name, icon, isEditable = true) => {
    if (!findElement(name)) {
      const newProject = new Project(name, icon, true, isEditable);
      global.projects.push(newProject);
      refreshApp();
      return newProject;
    } else {
      createNotification(`The title "${name}" is already being used`, 'warning')
      console.warn('Project already exists!');
      return false;
    }
  }

  const addTask = (title, description = null, date = null, isImportant = false, project = findElement('Uncategorized')) => {
    if (project) {
      const newTask = project.addTask(title, description, date, isImportant);
      refreshApp();
      return newTask;
    } else console.warn('This project does not exist!');
  }

  /* ------------------------- Test content generation ------------------------ */

  const generateRandomTasks = (project = findElement('Uncategorized')) => {
    const taskCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < taskCount; i++) {
      const isImportant = Math.random() < 1 / 6;

      // Generate date
      const hasDate = Math.random() < 6 / 7;
      let randomDate;
      if (hasDate) {
        const randomOffset = Math.floor(Math.random() * 8) - 2;
        randomDate = addDays(new Date(), randomOffset);
      } else randomDate = null;

      // Decide whether the task is completed and generate completion date, if it is
      let randomCompletionDate, randomDeletionDate;
      const isCompleted = Math.random() < 1 / 5;
      if (isCompleted) {
        const randomCompletionOffset = Math.floor(Math.random() * 10) - 10;
        const randomHour = Math.floor(Math.random() * 24);
        const randomMinutes = Math.floor(Math.random() * 60);
        const randomSeconds = Math.floor(Math.random() * 60);
        randomCompletionDate = addDays(new Date(), randomCompletionOffset);
        randomCompletionDate.setHours(randomHour, randomMinutes, randomSeconds);
      }

      // Decide whether the task is deleted and generate deletion date, if it is
      if (project === findElement('Deleted')) {
        const randomDeletionOffset = Math.floor(Math.random() * 10) - 10;
        const randomHour = Math.floor(Math.random() * 24);
        const randomMinutes = Math.floor(Math.random() * 60);
        const randomSeconds = Math.floor(Math.random() * 60);
        randomDeletionDate = addDays(new Date(), randomDeletionOffset);
        randomDeletionDate.setHours(randomHour, randomMinutes, randomSeconds);
      }

      // Generate title
      const titleLength = Math.floor(Math.random() * 3) + 2;
      const titleIndex = Math.floor(Math.random() * global.loremIpsumSplit.length);

      // Decide wheter the task has a description and generate it, if it has
      const haveDescription = Math.random() < 1 / 2;
      const descriptionLength = haveDescription ? Math.floor(Math.random() * 10) + 10 : 0;
      const descriptionIndex = Math.floor(Math.random() * global.loremIpsumSplit.length);

      const lorem = [...global.loremIpsumSplit, ...global.loremIpsumSplit];
      const taskTitle = capitalizeString(lorem.slice(titleIndex, titleIndex + titleLength).join(' '));
      const taskDescription = capitalizeString(lorem.slice(descriptionIndex, descriptionIndex + descriptionLength).join(' '));

      const originalProject = project === findElement('Deleted') ? global.projects[Math.floor(Math.random() * global.projects.length)] : null;
      const newTask = addTask(
        taskTitle,
        taskDescription,
        randomDate,
        isImportant,
        project
      );
      newTask.originalProject = originalProject;
      newTask.isCompleted = isCompleted;
      newTask.demoContent = true;
      if (randomCompletionDate) newTask.completionDate = randomCompletionDate;
      if (randomDeletionDate) newTask.deletionDate = randomDeletionDate;
    }
    return taskCount;
  }

  const createDemoContent = () => {
    const createdCount = {
      projects: 0,
      tasks: 0
    }

    createdCount.tasks += generateRandomTasks();

    for (const [name, icon] of [['Work', 'briefcase'], ['House', 'house'], ['Hobby', 'game']]) {
      if (!findElement(name)) {
        const newProject = addProject(name, global.icons[icon]);
        newProject.demoContent = true;
        createdCount.projects += 1;
      };
      createdCount.tasks += generateRandomTasks(findElement(name));
    }

    createdCount.tasks += generateRandomTasks(findElement('Deleted'));
    if (createdCount.projects) createNotification(`${createdCount.projects} project${createdCount.projects ? 's' : ''} created`)
    if (createdCount.tasks) createNotification(`${createdCount.tasks} task${createdCount.tasks ? 's' : ''} created`)
  }

  const deleteDemoContent = async () => {
    return await handleUserConfirmation(global.popups.deleteDemo, isConfirmed => {
      return isConfirmed ? (() => {
        const deletedCount = {
          projects: 0,
          tasks: 0
        }

        // Collect all demo tasks that need to be deleted
        const tasksToDelete = [];
        [...global.projects, global.deleted].forEach(project => {
          project.tasks.forEach(task => {
            if (task.demoContent) {
              tasksToDelete.push(task);
            }
          });
        });

        // Delete all collected tasks
        tasksToDelete.forEach(task => {
          task.delete();
          deletedCount.tasks += 1;
        });

        // Handle projects after all tasks have been removed
        const projectsToDelete = global.projects.filter(
          project => project.demoContent && project.tasks.length === 0
        );

        projectsToDelete.forEach(project => {
          project.delete();
          deletedCount.projects += 1;
        });

        refreshApp();
        if (deletedCount.projects) createNotification(`${deletedCount.projects} project${deletedCount.projects !== 1 ? 's' : ''} deleted`);
        if (deletedCount.tasks) createNotification(`${deletedCount.tasks} task${deletedCount.tasks !== 1 ? 's' : ''} deleted`);
        if (!deletedCount.projects && !deletedCount.tasks) createNotification('No demo content found');
      })() : false;
    })
  };

  /* ------------------------------- Update DOM ------------------------------- */

  const mainHeader = new MainHeader();

  const printElements = (section, elements, additionalHTML = '') => {
    section.innerHTML = "";
    elements.forEach(element => {
      if (element.returnHTML) section.insertAdjacentHTML('beforeend', element.returnHTML());
    })
    section.insertAdjacentHTML('beforeend', additionalHTML);
  }

  const printMain = () => {
    if (global.currentElement) {
      sortProjectTasks(global.currentElement);
      global.elem.mainHeader.innerHTML = mainHeader.returnHTML(global.currentElement);
      global.elem.mainTasks.innerHTML = '';
      if (global.currentElement) {
        global.currentElement.tasks?.forEach(task => {
          global.elem.mainTasks.insertAdjacentHTML('beforeend', task.returnHTML());
        })
      }
      global.elem.btnNewTaskHeader?.addEventListener('click', handleNewTask);
      global.elem.btnEditProject?.addEventListener('click', () => {
        handleEditProject(global.currentElement);
      });
      global.elem.btnDeleteProject?.addEventListener('click', () => {
        handleDeleteProject(global.currentElement);
      });
    }
  }

  const updateNav = () => {
    updateTaskGroups();

    printElements(global.elem.navGroups, [...Object.values(global.taskGroups), global.deleted]);
    printElements(global.elem.navProjects, global.projects);

    global.elem.btnNewProject?.addEventListener('click', handleNewProject);
  }

  const refreshApp = () => {
    updateNav();
    printMain();
    appStorage.save();
  }

  const updateProjectOptions = (selectElement, projects) => {
    if (selectElement) {
      selectElement.innerHTML = '';
      projects.forEach(projectName => {
        const option = document.createElement('option');
        option.value = projectName;
        option.textContent = projectName;
        selectElement.appendChild(option);
      });
    }
  }

  const updatePopups = () => {
    Object.values(global.popups).forEach(popup => {
      updateProjectOptions(popup.DOMElement.querySelector('select'), global.projects.map(project => project.title));
    })
  }

  /* -------------------------------- Handlers -------------------------------- */

  const handleNavClick = event => {
    const projectElement = event.target.closest(".nav__element");
    const elementID = projectElement?.id;
    const clickedSetting = event.target.closest('.nav__item-setting');
    const tempElement = findElement(elementID);

    if (clickedSetting) {
      const editButton = projectElement.querySelector('.nav__item-edit');
      if (clickedSetting === editButton) {
        handleEditProject(tempElement);
        return;
      }

      const deleteButton = projectElement.querySelector('.nav__item-delete');
      if (clickedSetting === deleteButton) {
        handleDeleteProject(tempElement);
        return;
      }
    }

    else {
      if (tempElement) {
        global.currentElement = tempElement;
        hideNavBar();
      }
      refreshApp();
    }
  }

  const handleTaskClick = event => {
    const taskElement = event.target.closest('.main__item');
    const taskID = taskElement.dataset.index;
    const taskClicked = global.currentElement.tasks.find(task => task.id === taskID);

    if (taskClicked) {
      const clickedSetting = event.target.closest('.main__item-setting');

      if (clickedSetting) {

        // Edit task
        const editButton = taskElement.querySelector('.main__item-edit');
        if (clickedSetting === editButton) {
          handleEditTask(taskClicked);
          return;
        }

        // Delete task
        const deleteButton = taskElement.querySelector('.main__item-delete');
        if (clickedSetting === deleteButton) {
          if (global.currentElement.title === 'Deleted') {
            handleDeleteTask(taskClicked);
          } else {
            taskClicked.originalProject = taskClicked.project;
            taskClicked.deletionDate = new Date();
            moveTask(taskClicked, findElement('Deleted'));
            createNotification('Task moved to "Deleted"');
          }
          refreshApp();
          return;
        }

        // Revert task
        const revertButton = taskElement.querySelector('.main__item-revert');
        if (clickedSetting === revertButton) {
          moveTask(taskClicked, taskClicked.originalProject);
          taskClicked.deletionDate = null;
          taskClicked.originalProject = null;
          createNotification(`Task moved back to "${taskClicked.project.title}"`);
          refreshApp();
          return;
        }
      }

      taskClicked.isCompleted = !taskClicked.isCompleted;
      taskClicked.completionDate ? taskClicked.completionDate = null : taskClicked.completionDate = new Date();
      refreshApp();
    } else console.warn('Task not found');
  }

  const handleNewProject = async () => {
    const newProject = await handleUserInput(global.popups.newProject, data => {
      return addProject(data.get('mainTitle'), global.icons[data.get('project-icon')]);
    });

    if (newProject) {
      global.currentElement = newProject;
      hideNavBar();
      createNotification(`Project "${newProject.title}" created`);
      refreshApp();
    }
  }

  const handleNewTask = async () => {
    updatePopups();
    const newTask = await handleUserInput(global.popups.newTask, data => {
      return addTask(data.get('mainTitle'), data.get('description'), data.get('dueDate'), data.get('isImportant') ? true : false, findElement(data.get('project')));
    }, { '#project': global.currentElement?.title })
    if (newTask) createNotification(`Task added to "${newTask.project.title}"`);
    refreshApp();
  }

  const handleEditTask = async task => {
    updatePopups();
    const tempProjectTitle = task.project.title;
    try {
      const editedTask = await handleUserInput(global.popups.editTask, data => {
        const dueDate = data.get('dueDate') === '' ? null : data.get('dueDate');
        
        return task.update(data.get('mainTitle'), data.get('description'), dueDate, data.get('isImportant') ? true : false, findElement(data.get('project')))
      }, {
        '#mainTitle': task.title,
        '#description': task.description,
        '#dueDate': task.date,
        '#isImportant': task.isImportant,
        '#project': task.project.title
      })
      if (editedTask) {
        createNotification('Task edited');
        if (tempProjectTitle !== task.project.title) createNotification(`Task moved from "${tempProjectTitle}" to "${task.project.title}"`);
        editedTask.demoContent = false;
        refreshApp();
      }
    } catch (err) {
      console.warn('Task editing cancelled or failed:', err);
    }
  }

  const handleEditProject = async project => {
    const tempProjectTitle = project.title;

    const editedProject = await handleUserInput(global.popups.editProject, data => {
      if (!findElement(data.get('mainTitle')) || data.get('mainTitle') === tempProjectTitle) {
        return project.update(data.get('mainTitle'), global.icons[data.get('project-icon')]);
      } else {
        createNotification(`The title "${data.get('mainTitle')}" is already being used`, 'warning')
        console.warn('This project/task group already exists!')
      };
    }, {
      '#mainTitle': project.title,
      '.icon__radio': project.icon
    })
    if (editedProject) {
      createNotification('Project edited')
      if (tempProjectTitle !== editedProject.title) createNotification(`Project renamed from "${tempProjectTitle}" to "${editedProject.title}"`);
      editedProject.demoContent = false;
      refreshApp();
    }
  }

  const handleUserInput = async (popup, createFunction, defaultValues = {}) => {
    const data = await popup.waitForUserInput(defaultValues);

    // If data is null, it means the dialog was closed without submission
    if (!data) {
      return false;
    }
    return createFunction(data);
  }

  const handleUserConfirmation = async (popup, confirmFunction) => {
    try {
      const isConfirmed = await popup.waitForUserConfirmation();
      return isConfirmed ? confirmFunction(isConfirmed) : false;
    } catch (event) {
      return false;
    }
  }

  const handleDeleteTask = async task => {
    const isTaskDeleted = await handleUserConfirmation(global.popups.deleteTask, isConfirmed => {
      return isConfirmed ? task.delete() : false;
    });
    if (isTaskDeleted) {
      createNotification('Task deleted');
      refreshApp();
    }
  }

  const handleDeleteProject = async project => {
    const deletedProjectInfo = await handleUserConfirmation(global.popups.deleteProject, isConfirmed => {
      return isConfirmed ? project.delete() : false;
    })
    if (deletedProjectInfo) {
      createNotification(`Project "${deletedProjectInfo.title}" deleted`);
      if (deletedProjectInfo.deletedTaskCount) createNotification(`${deletedProjectInfo.deletedTaskCount} task${deletedProjectInfo.deletedTaskCount !== 1 ? 's' : ''} deleted`);
      refreshApp();
    }
  }

  const handleHamburgerClick = () => {
    global.elem.nav.classList.toggle('open');
    global.elem.hamburgerButton.classList.toggle('open');
  }

  /* ------------------------- Initialize task groups ------------------------- */

  global.taskGroups = {
    All: new TaskGroup('All', global.icons.globe, task => !task.isCompleted),
    Today: new TaskGroup('Today', global.icons.day, task => {
      return task.getDaysLeft() === 0 && !task.isCompleted;
    }),
    'This Week': new TaskGroup('This Week', global.icons.week, task => {
      const days = task.getDaysLeft();
      return days !== null && days !== undefined && days >= 0 && days <= 7 && !task.isCompleted;
    }),
    Overdue: new TaskGroup('Overdue', global.icons.clock, task => {
      return task.getDaysLeft() < 0 && !task.isCompleted;
    }),
    Completed: new TaskGroup('Completed', global.icons.check, task => task.isCompleted, false)
  }

  appStorage.load();
  if (!global.deleted || Object.keys(global.deleted).length === 0) global.deleted = new Project('Deleted', global.icons.trash, false, false);
  if (!findElement('Uncategorized')) addProject('Uncategorized', global.icons.folder, false);

  /* ---------------------------- Initialize popups --------------------------- */

  global.popups = {
    newTask: new TaskPopUp('newTask', 'New task'),
    editTask: new TaskPopUp('editTask', 'Edit task'),
    newProject: new ProjectPopUp('newProject', 'New project'),
    editProject: new ProjectPopUp('editProject', 'Edit project'),
    deleteTask: new DeletePopUp('deleteTask'),
    deleteProject: new DeletePopUp('deleteProject'),
    deleteDemo: new DeletePopUp('deleteDemo')
  }

  Object.values(global.popups).forEach(popup => {
    popup.initializeDOMElement();
  })

  /* -------------------------- Vital initializations ------------------------- */

  if (!global.currentElement) global.currentElement = global.taskGroups.All;
  appStorage.save();

  /* --------------------------------- Events --------------------------------- */

  global.elem.nav.addEventListener('click', handleNavClick);
  global.elem.mainTasks.addEventListener('click', handleTaskClick);
  global.elem.demoAddButton.addEventListener('click', createDemoContent);
  global.elem.demoAddButton.addEventListener('click', () => {
    createNotification('Feel free to click again for more tasks :)');
  }, { once: true });
  global.elem.demoDeleteButton.addEventListener('click', deleteDemoContent);
  global.elem.hamburgerButton.addEventListener('click', handleHamburgerClick);
  global.elem.navBackdrop.addEventListener('click', () => {
    global.elem.nav.classList.remove('open');
  })
  global.elem.btnNewTaskFixed.addEventListener('click', handleNewTask);


  /* ------------------------------ Initialize UI ----------------------------- */

  new SimpleBar(global.elem.mainTasksWrapper, {
    autoHide: false
  });
  new SimpleBar(global.elem.navSectionsWrapper, {
    autoHide: false
  });

  updatePopups();
  refreshApp();
  document.querySelectorAll('.app-section').forEach(section => {
    section.classList.add('loaded');
  });
  document.querySelector('.hamburger-button').classList.add('loaded');
})();