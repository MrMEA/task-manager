let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("taskList");
const form = document.getElementById("taskForm");

document.getElementById("newTaskBtn").onclick = () => {
  form.classList.toggle("hidden");
};

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = document.getElementById("taskInput").value;
  const priority = document.getElementById("priority").value;
  const deadline = document.getElementById("deadline").value;

  if (!text) return;

  tasks.push({
    text,
    priority,
    deadline,
    done: false,
    created: new Date().toISOString()
  });

  document.getElementById("taskInput").value = "";
  saveTasks();
  renderTasks();
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;

  if (tasks[index].done) {
    new Notification("Task erledigt: " + tasks[index].text);
  }

  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function updateProgress() {
  const done = tasks.filter(t => t.done).length;
  const total = tasks.length || 1;
  const percent = (done / total) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

function renderTasks() {
  const filter = document.getElementById("filter").value;
  taskList.innerHTML = "";

  let filtered = tasks;

  if (filter === "done") filtered = tasks.filter(t => t.done);
  if (filter === "open") filtered = tasks.filter(t => !t.done);

  filtered.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = `task ${task.priority} ${task.done ? "done" : ""}`;

    div.innerHTML = `
      <div onclick="toggleDone(${index})">
        <strong>${task.text}</strong><br>
        <small>${task.deadline || ""}</small>
      </div>
      <button onclick="deleteTask(${index})">❌</button>
    `;

    taskList.appendChild(div);
  });

  updateProgress();
}

if ("Notification" in window) {
  Notification.requestPermission();
}

renderTasks();
