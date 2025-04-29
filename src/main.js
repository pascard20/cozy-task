import './reset.css';
import './style.css';
import { addDays } from 'date-fns';
import { capitalizeString } from './utils.js';
import global from './globals.js';
import templates from './htmlTemplates.js';
import { TaskPopUp, ProjectPopUp, DeletePopUp } from './popup.js';
import { MainHeader, Project, TaskGroup } from './uiElements.js';
import { createNotification } from './notifcation.js';
import { returnAllTasks, findElement } from './helpers.js';

const app = (function () {

  /* ---------------------------- App functionality --------------------------- */

  const updateTaskGroups = (taskGroups, tasks) => {
    Object.values(taskGroups).forEach(taskGroup => {
      taskGroup.tasks = [];
    })

    tasks.forEach(task => {
      Object.values(taskGroups).forEach(taskGroup => {
        if (taskGroup.countRule(task)) taskGroup.tasks.push(task);
      })
    })
  }

  const addProject = (name, icon) => {
    if (!findElement(name)) {
      const newProject = new Project(name, icon);
      global.projects.push(newProject);
      updateNav();
      return newProject;
    } else {
      createNotification(`The title ${name} is already being used`, 'warning')
      console.warn('Project already exists!');
    }

  }

  const addTask = (title, description = null, date = null, isImportant = false, project = findElement('Uncategorized')) => {
    if (project) {
      const newTask = project.addTask(title, description, date, isImportant);
      refreshApp();
      return newTask;
    } else console.warn('This project does not exist!');
  }

  /* ------------------------------ Test content ------------------------------ */

  const generateRandomTasks = (project = findElement('Uncategorized')) => {
    const taskCount = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < taskCount; i++) {
      const isImportant = Math.random() < 1 / 4;
      const randomOffset = Math.floor(Math.random() * 8) - 2;
      const randomDate = addDays(new Date(), randomOffset);

      const titleLength = Math.floor(Math.random() * 3) + 2;
      const titleIndex = Math.floor(Math.random() * loremIpsumSplit.length);

      const haveDescription = Math.random() < 7 / 8;
      const descriptionLength = haveDescription ? Math.floor(Math.random() * 10) + 10 : 0;
      const descriptionIndex = Math.floor(Math.random() * loremIpsumSplit.length);

      const lorem = [...loremIpsumSplit, ...loremIpsumSplit];
      const taskTitle = capitalizeString(lorem.slice(titleIndex, titleIndex + titleLength).join(' '));
      const taskDescription = capitalizeString(lorem.slice(descriptionIndex, descriptionIndex + descriptionLength).join(' '));


      addTask(
        taskTitle,
        taskDescription,
        randomDate,
        isImportant,
        project
      );
    }
  }

  const testContent = () => {
    generateRandomTasks();

    for (const [name, icon] of [['Work', 'briefcase'], ['House', 'house'], ['Hobby', 'game']]) {
      addProject(name, global.icons[icon]);
      generateRandomTasks(findElement(name));
    }

    generateRandomTasks(global.deleted);
  }

  /* ------------------------------- Update DOM ------------------------------- */

  const printElements = (section, elements, additionalHTML = '') => {
    section.innerHTML = "";
    elements.forEach(element => {
      section.insertAdjacentHTML('beforeend', element.returnHTML());
    })
    section.insertAdjacentHTML('beforeend', additionalHTML);
  }

  const printMain = () => {
    if (currentElement) {
      global.elem.mainHeader.innerHTML = mainHeader.returnHTML(currentElement);
      global.elem.mainTasks.innerHTML = '';
      if (currentElement) {
        currentElement.tasks.forEach(task => {
          global.elem.mainTasks.insertAdjacentHTML('beforeend', task.returnHTML());
        })
      }

      global.elem.btnNewTask?.addEventListener('click', handleNewTask);
    }
  }

  const updateNav = () => {
    updateTaskGroups(global.taskGroups, returnAllTasks());

    printElements(global.elem.navGroups, [...Object.values(global.taskGroups), global.deleted]);
    printElements(global.elem.navProjects, global.projects, templates.getNewProjectButton());

    global.elem.btnNewProject?.addEventListener('click', handleNewProject);
  }

  const refreshApp = () => {
    updateNav();
    printMain();
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
    Object.values(popups).forEach(popup => {
      updateProjectOptions(popup.DOMElement.querySelector('select'), global.projects.map(project => project.title));
    })
  }

  /* -------------------------------- Handlers -------------------------------- */

  const handleNavClick = event => {
    const projectElement = event.target.closest("li");
    const elementID = projectElement?.id;
    const clickedSetting = event.target.closest('.nav__item-setting');
    const tempElement = findElement(elementID)

    if (clickedSetting) {
      const editButton = projectElement.querySelector('.nav__item-edit');
      if (clickedSetting === editButton) {
        handleEditProject(tempElement);
        return;
      }

      const deleteButton = projectElement.querySelector('.nav__item-delete');
      if (clickedSetting === deleteButton) {
        return
      }
    }

    else {
      currentElement = tempElement;
      printMain();
    }
  }

  const handleNewProject = async () => {
    const newProject = await handleUserInput(popups.newProject, data => {
      return addProject(data.get('title'), global.icons[data.get('project-icon')]);
    })

    if (newProject) {
      currentElement = newProject;
      printMain();
    }

  }

  const handleNewTask = async () => {
    updatePopups();
    const newTask = await handleUserInput(popups.newTask, data => {
      return addTask(data.get('title'), data.get('description'), data.get('dueDate'), data.get('isImportant') ? true : false, findElement(data.get('project')));
    }, { '#project': currentElement?.title })
    if (newTask) createNotification('Task created');
    refreshApp();
  }

  const handleEditTask = async task => {
    updatePopups();
    const tempProjectTitle = task.project.title;
    const editedTask = await handleUserInput(popups.editTask, data => {
      return task.update(data.get('title'), data.get('description'), data.get('dueDate'), data.get('isImportant') ? true : false, findElement(data.get('project')))
    }, {
      '#title': task.title,
      '#description': task.description,
      '#dueDate': task.date,
      '#isImportant': task.isImportant,
      '#project': task.project.title
    })
    if (editedTask) {
      createNotification('Task edited');
      if (tempProjectTitle !== task.project.title) createNotification(`Task moved from ${tempProjectTitle} to ${task.project.title}`);
      refreshApp();
    }
  }

  const handleEditProject = async project => {
    const tempProjectTitle = project.title;
    const editedProject = await handleUserInput(popups.editProject, data => {
      if (!findElement(data.get('title')) || data.get('title') === tempProjectTitle) {
        return project.update(data.get('title'), global.icons[data.get('project-icon')]);
      } else {
        createNotification(`The title ${data.get('title')} is already being used`, 'warning')
        console.warn('This project/task group already exists!')
      };
    }, {
      '#title': project.title,
      '.icon__radio': project.icon
    })
    if (editedProject) {
      createNotification('Project edited')
      if (tempProjectTitle !== editedProject.title) createNotification(`Project renamed from ${tempProjectTitle} to ${editedProject.title}`);
      refreshApp();
    }
  }

  const handleUserInput = async (popup, createFunction, defaultValues = {}) => {
    try {
      const data = await popup.waitForUserInput(defaultValues);
      return createFunction(data);
    } catch (event) {
      return false;
    }
  }

  const handleUserConfirmation = async (popup, confirmFunction) => {
    try {
      const isConfirmed = await popup.waitForUserConfirmation();
      return isConfirmed ? confirmFunction(isConfirmed) : false;
    } catch (event) {
      return false;
    }
  }

  const handleTaskDelete = async task => {
    const isTaskDeleted = await handleUserConfirmation(popups.deleteTask, isConfirmed => {
      return isConfirmed ? task.delete() : false;
    });
    if (isTaskDeleted) {
      createNotification('Task deleted');
      refreshApp();
    }
  }

  const handleTaskClick = event => {
    const taskElement = event.target.closest('.main__item');
    const taskID = taskElement.dataset.index;
    const taskClicked = currentElement.tasks.find(task => task.id === taskID);

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
          if (currentElement.title === 'Deleted') {
            handleTaskDelete(taskClicked);
          } else {
            taskClicked.update(
              taskClicked.title,
              taskClicked.description,
              taskClicked.date,
              taskClicked.isImportant,
              findElement('Deleted')
            )
            createNotification('Task moved to Deleted');
          }
          refreshApp();
          return;
        }
      }

      taskClicked.isCompleted = !taskClicked.isCompleted;
      taskElement.classList.toggle('completed');
      refreshApp();
    } else console.warn('Task not found');
  }

  /* ------------------------- Initialize task groups ------------------------- */
  global.taskGroups = {
    All: new TaskGroup('All', global.icons.globe, task => !task.isCompleted),
    Today: new TaskGroup('Today', global.icons.day, task => {
      return task.getDaysLeft() === 0 && !task.isCompleted;
    }),
    'This Week': new TaskGroup('This Week', global.icons.week, task => {
      const days = task.getDaysLeft();
      return ((days >= 0) && (days <= 7)) && !task.isCompleted;
    }),
    Overdue: new TaskGroup('Overdue', global.icons.clock, task => {
      return task.getDaysLeft() < 0 && !task.isCompleted;
    }),
    Completed: new TaskGroup('Completed', global.icons.check, task => task.isCompleted, false)
  }
  global.deleted = new Project('Deleted', global.icons.trash, false, false);
  addProject('Uncategorized', global.icons.folder);

  const mainHeader = new MainHeader();

  /* ---------------------------- Initialize popups --------------------------- */
  const popups = {
    newTask: new TaskPopUp('newTask', 'New task'),
    editTask: new TaskPopUp('editTask', 'Edit task'),
    newProject: new ProjectPopUp('newProject', 'New project'),
    editProject: new ProjectPopUp('editProject', 'Edit project'),
    deleteTask: new DeletePopUp('deleteTask'),
    deleteProject: new DeletePopUp('deleteProject')
  }

  Object.values(popups).forEach(popup => {
    popup.initializeDOMElement();
  })

  /* -------------------------- Generate test content ------------------------- */
  const loremIpsum = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, eius cumque obcaecati sequi iusto vitae eveniet distinctio id voluptas officia quod odit voluptatem earum. Aliquid explicabo ipsa odio maiores. Tempore autem dolorem aspernatur officiis omnis distinctio quam aperiam. Quas eligendi id iure. Ipsa dolore qui modi ad nobis natus possimus soluta expedita accusantium non nihil excepturi dolorem mollitia adipisci aliquam, laborum, amet exercitationem cumque ipsum vero distinctio totam, omnis numquam. Autem distinctio natus possimus? Neque explicabo, animi totam eius, natus quae tempora est nulla quaerat nemo, architecto voluptatum accusamus asperiores! Hic aperiam perspiciatis dolores ea assumenda necessitatibus sint facilis enim.`;
  const loremIpsumSplit = loremIpsum.split(' ');

  let currentElement;
  testContent();
  currentElement = global.taskGroups.Today;

  /* ---------------------- Events and UI initialization ---------------------- */
  global.elem.nav.addEventListener('click', handleNavClick);
  global.elem.mainTasks.addEventListener('click', handleTaskClick);

  updatePopups();
  printMain();

})();