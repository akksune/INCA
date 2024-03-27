document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("task");
  const priorityInput = document.getElementById("priority");
  const deadlineInput = document.getElementById("deadline");
  const addTaskButton = document.getElementById("add-task");
  let taskList = document.getElementById("task-list"); // Declaring taskList outside the scope of event listeners

  // Function to load tasks from localStorage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
      const taskItem = createTaskElement(task);
      taskList.appendChild(taskItem);
    });
  }

  // Function to create a task element
  function createTaskElement(task) {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task");
    taskItem.innerHTML = `
        <p>${task.task}</p>
        <p>Priority: ${task.priority}</p>
        <p>Deadline: ${task.deadline}</p>
        <button class="mark-done">${task.done ? "Undo" : "Mark Done"}</button>
      `;
    if (task.done) {
      taskItem.classList.add("done");
    }
    return taskItem;
  }

  // Function to save tasks to localStorage
  function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll(".task").forEach((taskItem) => {
      const task = {
        task: taskItem.querySelector("p").textContent,
        priority: taskItem
          .querySelector("p:nth-child(2)")
          .textContent.split(": ")[1],
        deadline: taskItem
          .querySelector("p:nth-child(3)")
          .textContent.split(": ")[1],
        done: taskItem.classList.contains("done"),
      };
      tasks.push(task);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Load tasks when the page loads
  loadTasks();

  addTaskButton.addEventListener("click", () => {
    const task = taskInput.value;
    const priority = priorityInput.value;
    const deadline = deadlineInput.value;

    if (task.trim() === "") {
      alert("Please enter a task");
      return; // Exit the event listener if there are empty fields
    }
    if (deadline === "") {
      alert("Please select an upcoming date for the deadline.");
      return; // Exit the event listener if there are empty fields
    }
    const selectedDate = new Date(deadline);
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      alert("Please select an upcoming date for the deadline.");
      return; // Exit the event listener if the deadline is not in the future
    }

    const taskItem = createTaskElement({
      task: task,
      priority: priority,
      deadline: deadline,
      done: false,
    });

    taskList.appendChild(taskItem);

    // Save tasks after adding a new task
    saveTasks();

    // Clear input fields after adding task
    taskInput.value = "";
    priorityInput.value = "top";
    deadlineInput.value = "";
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("mark-done")) {
      const taskItem = target.parentElement;
      taskItem.classList.toggle("done");
      if (taskItem.classList.contains("done")) {
        target.textContent = "Undo";
      } else {
        target.textContent = "Mark Done";
      }
      // Move completed tasks to the bottom
      if (taskItem.classList.contains("done")) {
        taskList.appendChild(taskItem);
      } else {
        taskList.insertBefore(taskItem, taskList.childNodes[0]);
      }
      // Save tasks after marking a task as done/undone
      saveTasks();
    }
  });
});
