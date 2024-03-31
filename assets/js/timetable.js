document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("task");
  const priorityInput = document.getElementById("priority");
  const deadlineDateInput = document.getElementById("deadline-date");
  const deadlineTimeInput = document.getElementById("deadline-time");
  const addTaskButton = document.getElementById("add-task");
  let pendingTaskList = document.getElementById("pending-task-list");
  let doneTaskList = document.getElementById("done-task-list");

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
      const taskItem = createTaskElement(task);
      if (task.done) {
        doneTaskList.appendChild(taskItem);
      } else {
        pendingTaskList.appendChild(taskItem);
      }
    });
  }

  function createTaskElement(task) {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task");
    
    const deadlineDate = new Date(task.deadline);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = deadlineDate.toLocaleDateString(undefined, options);
    const formattedTime = deadlineDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    taskItem.innerHTML = `
      <p>${task.task}</p>
      <p>Priority: ${task.priority}</p>
      <p>Deadline: ${formattedDate} Time: ${formattedTime}</p>
      <button class="mark-done">${task.done ? "Undo" : "Mark Done"}</button>
    `;
    if (task.done) {
      taskItem.classList.add("done");
    }
    return taskItem;
  }

  function saveTasks() {
    const pendingTasks = [];
    const doneTasks = [];
    document.querySelectorAll(".task").forEach((taskItem) => {
      const task = {
        task: taskItem.querySelector("p").textContent,
        priority: taskItem.querySelector("p:nth-child(2)").textContent.split(": ")[1],
        deadline: taskItem.querySelector("p:nth-child(3)").textContent.split("Time: ")[0].trim(), // Extracting only the date portion
        done: taskItem.classList.contains("done"),
      };
      if (task.done) {
        doneTasks.push(task);
      } else {
        pendingTasks.push(task);
      }
    });
    localStorage.setItem("tasks", JSON.stringify(pendingTasks.concat(doneTasks)));
  }

  loadTasks();

  addTaskButton.addEventListener("click", () => {
    const task = taskInput.value;
    const priority = priorityInput.value;
    const deadlineDate = deadlineDateInput.value;
    const deadlineTime = deadlineTimeInput.value;

    if (task.trim() === "" || deadlineDate === "" || deadlineTime === "") {
      alert("Please fill in all fields.");
      return;
    }

    const selectedDateTime = new Date(`${deadlineDate}T${deadlineTime}:00`);
    const currentDate = new Date();

    if (selectedDateTime <= currentDate) {
      alert("Please select a future date for the deadline.");
      return;
    }

    const taskItem = createTaskElement({
      task: task,
      priority: priority,
      deadline: selectedDateTime.toISOString(), // Keep the date in ISO format for storage
      done: false,
    });

    pendingTaskList.appendChild(taskItem);

    saveTasks();

    taskInput.value = "";
    priorityInput.value = "top";
    deadlineDateInput.value = "";
    deadlineTimeInput.value = "";
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("mark-done")) {
      const taskItem = target.parentElement;
      taskItem.classList.toggle("done");
      if (taskItem.classList.contains("done")) {
        target.textContent = "Undo";
        doneTaskList.appendChild(taskItem);
      } else {
        target.textContent = "Mark Done";
        pendingTaskList.appendChild(taskItem);
      }
      saveTasks();
    }
  });
});
