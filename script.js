let tasks = [];
let calendar;
let currentView = "list";

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  initCalendar();
  setupDragAndDrop();
});

/* CREATE */
function createTask() {
  const task = {
    id: Date.now(),
    title: document.getElementById("title").value,
    dueDate: document.getElementById("dueDate").value,
    priority: document.getElementById("priority").value,
    status: "todo"
  };

  tasks.push(task);
  closeModal();
  render();
}

/* RENDER */
function render() {

  ["todo", "in_progress", "done"].forEach(status => {
    document.getElementById(status).innerHTML = "";
  });

  tasks.forEach(task => {

    const div = document.createElement("div");
    div.className = "task glass " + task.priority;
    div.draggable = true;

    div.setAttribute("data-priority", task.priority);

    div.innerHTML = `
      <strong>${task.title}</strong>
      <small>${task.dueDate || ""}</small>
    `;

    /* DRAG */
    div.addEventListener("dragstart", e => {
      div.classList.add("dragging");
      e.dataTransfer.setData("id", task.id);
    });

    div.addEventListener("dragend", () => {
      div.classList.remove("dragging");
    });

    document.getElementById(task.status).appendChild(div);

    animateTask(div);
  });
}

/* DRAG DROP */
function setupDragAndDrop() {

  document.querySelectorAll(".dropzone").forEach(zone => {

    zone.addEventListener("dragover", e => {
      e.preventDefault();
      zone.classList.add("active");
    });

    zone.addEventListener("dragleave", () => {
      zone.classList.remove("active");
    });

    zone.addEventListener("drop", e => {
      zone.classList.remove("active");

      const id = e.dataTransfer.getData("id");
      const task = tasks.find(t => t.id == id);

      task.status = zone.parentElement.dataset.status;

      render();
    });

  });

}

/* ANIMATION */
function animateTask(el) {
  el.style.opacity = 0;
  el.style.transform = "translateY(10px)";

  requestAnimationFrame(() => {
    el.style.transition = "all 0.3s ease";
    el.style.opacity = 1;
    el.style.transform = "translateY(0)";
  });
}

/* CALENDAR */
function initCalendar() {
  const calendarEl = document.getElementById("calendar");

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth"
  });

  calendar.render();
}

function updateCalendar() {
  calendar.removeAllEvents();

  tasks.forEach(task => {
    if (task.dueDate) {
      calendar.addEvent({
        title: task.title,
        date: task.dueDate
      });
    }
  });
}

/* VIEW */
function setView(view, event) {

  currentView = view;

  document.querySelectorAll(".sidebar button")
    .forEach(btn => btn.classList.remove("active"));

  event.target.classList.add("active");

  document.getElementById("listView").classList.add("hidden");
  document.getElementById("calendarView").classList.add("hidden");

  if (view === "list") {
    document.getElementById("listView").classList.remove("hidden");
  }

  if (view === "calendar") {
    document.getElementById("calendarView").classList.remove("hidden");
    updateCalendar();
  }
}

/* MODAL */
function openTaskModal() {
  document.getElementById("taskModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("taskModal").classList.add("hidden");
}