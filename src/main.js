import './reset.css';
import './style.css';
import { addDays } from 'date-fns';
import { capitalizeString } from './utils.js';
import { projects, elem, icons } from './globals.js';
import templates from './htmlTemplates.js';
import { TaskPopUp, ProjectPopUp } from './popup.js';
import { MainHeader, Project, TaskGroup } from './uiElements.js';

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
    if (!projects[name]) {
      const newProject = new Project(name, icon);
      projects[name] = newProject;
      updateNav();
      return newProject;
    } else console.warn('Project already exists!');

  }

  const addTask = (title, description = null, date = null, isImportant = false, project = projects.Uncategorized) => {
    if (project) {
      const newTask = project.addTask(title, description, date, isImportant);
      refreshApp();
      return newTask;
    } else console.warn('This project does not exist!');
  }

  /* ------------------------------ Test content ------------------------------ */

  const generateRandomTasks = (project = projects.Uncategorized) => {
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
      addProject(name, icons[icon]);
      generateRandomTasks(projects[name]);
    }

    generateRandomTasks(deleted);
  }

  /* --------------------------------- Helpers -------------------------------- */

  const returnAllTasks = () => {
    const tasks = [];
    Object.values(projects).forEach(project => {
      tasks.push(...project.tasks);
    });
    return tasks;
  }

  const findElement = elementID => {
    const lookup = {
      ...projects,
      ...taskGroups,
      [deleted.name]: deleted
    }
    return lookup[elementID];
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
      // elem.btnNewTask?.removeEventListener('click', handleCreateTask);

      elem.mainHeader.innerHTML = mainHeader.returnHTML(currentElement);
      elem.mainTasks.innerHTML = '';
      if (currentElement) {
        currentElement.tasks.forEach(task => {
          elem.mainTasks.insertAdjacentHTML('beforeend', task.returnHTML());
        })
      }

      elem.btnNewTask?.addEventListener('click', handleNewTask);
    }
  }

  const updateNav = () => {
    updateTaskGroups(taskGroups, returnAllTasks());

    // elem.btnNewProject?.removeEventListener('click', handleCreateProject);

    printElements(elem.navGroups, [...Object.values(taskGroups), deleted]);
    printElements(elem.navProjects, Object.values(projects), templates.getNewProjectButton());

    elem.btnNewProject?.addEventListener('click', handleNewProject);
  }

  const refreshApp = () => {
    updateNav();
    printMain();
  }

  const updateProjectOptions = (selectElement, projects) => {
    if (selectElement) {
      selectElement.innerHTML = '';
      for (const projectName in projects) {
        const option = document.createElement('option');
        option.value = projectName;
        option.textContent = projectName;
        selectElement.appendChild(option);
      }
    }
  }

  const updatePopups = () => {
    Object.values(popups).forEach(popup => {
      updateProjectOptions(popup.DOMElement.querySelector('select'), projects);
    })
  }

  /* -------------------------------- Handlers -------------------------------- */

  const handleNavClick = event => {
    const elementID = event.target.closest("li")?.id;
    currentElement = findElement(elementID);
    printMain();
  }

  async function handleNewProject() {
    const newProject = await handleNewFromInput(popups.newProject, data => {
      return addProject(data.get('title'), icons[data.get('project-icon')]);
    })

    if (newProject) currentElement = newProject;
    printMain();

  }

  function handleNewTask() {
    updatePopups();
    handleNewFromInput(popups.newTask, data => {
      return addTask(data.get('title'), data.get('description'), data.get('dueDate'), data.get('isImportant') ? true : false, projects[data.get('project')]);
    }, currentElement.name)
    refreshApp();
  }

  async function handleNewFromInput(popup, createFunction, defaultProject = null) {
    try {
      const data = await popup.waitForUserInput(defaultProject);
      console.log('User submitted:', data);
      return createFunction(data);
    } catch (event) {
      console.log('User canceled:', event);
    }
  }

  const handleTaskClick = event => {
    const taskElement = event.target.closest('.main__item');
    const taskID = taskElement.dataset.index;
    const taskClicked = currentElement.tasks.find(task => task.id === taskID);

    if (taskClicked) {
      taskClicked.isCompleted = !taskClicked.isCompleted;
      taskElement.classList.toggle('completed');
      refreshApp();
    } else console.warn('Task not found');
  }

  /* ------------------------- Initialize task groups ------------------------- */
  const taskGroups = {
    All: new TaskGroup('All', icons.globe, task => !task.isCompleted),
    Today: new TaskGroup('Today', icons.day, task => {
      return task.getDaysLeft() === 0 && !task.isCompleted;
    }),
    'This Week': new TaskGroup('This Week', icons.week, task => {
      const days = task.getDaysLeft();
      return ((days >= 0) && (days <= 7)) && !task.isCompleted;
    }),
    Overdue: new TaskGroup('Overdue', icons.clock, task => {
      return task.getDaysLeft() < 0 && !task.isCompleted;
    }),
    Completed: new TaskGroup('Completed', icons.check, task => task.isCompleted, false)
  }
  const deleted = new Project('Deleted', icons.trash, false, false);
  addProject('Uncategorized', icons.folder);

  const mainHeader = new MainHeader();

  /* ---------------------------- Initialize popups --------------------------- */
  const popups = {
    newTask: new TaskPopUp('newTask', 'New task'),
    editTask: new TaskPopUp('editTask', 'Edit task'),
    newProject: new ProjectPopUp('newProject', 'New project')
  }

  Object.values(popups).forEach(popup => {
    popup.initializeDOMElement();
  })

  /* -------------------------- Generate test content ------------------------- */
  const loremIpsum = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, eius cumque obcaecati sequi iusto vitae eveniet distinctio id voluptas officia quod odit voluptatem earum. Aliquid explicabo ipsa odio maiores. Tempore autem dolorem aspernatur officiis omnis distinctio quam aperiam. Quas eligendi id iure. Ipsa dolore qui modi ad nobis natus possimus soluta expedita accusantium non nihil excepturi dolorem mollitia adipisci aliquam, laborum, amet exercitationem cumque ipsum vero distinctio totam, omnis numquam. Autem distinctio natus possimus? Neque explicabo, animi totam eius, natus quae tempora est nulla quaerat nemo, architecto voluptatum accusamus asperiores! Hic aperiam perspiciatis dolores ea assumenda necessitatibus sint facilis enim.`;
  const loremIpsumSplit = loremIpsum.split(' ');

  let currentElement;
  testContent();
  currentElement = taskGroups.Today;

  /* ---------------------- Events and UI initialization ---------------------- */
  elem.nav.addEventListener('click', handleNavClick);
  elem.mainTasks.addEventListener('click', handleTaskClick);

  updatePopups();
  printMain();

})();