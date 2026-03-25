/* =======================
   STATE
======================= */
let tasks = [];
let calendar = null;
let currentView = "list";


/* =======================
   INIT
======================= */
document.addEventListener("DOMContentLoaded", () => {
  setupEvents();
  initCalendar();
  render();
});


/* =======================
   EVENTS
======================= */
function setupEvents() {

  document.querySelectorAll(".nav-btn").forEach(btn =>
    btn.addEventListener("click", () =>
      setView(btn.dataset.view, btn)
    )
  );

  const newBtn = document.getElementById("newTaskBtn");
  const closeBtn = document.getElementById("closeModalBtn");
  const createBtn = document.getElementById("createTaskBtn");

  if (newBtn) newBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (createBtn) createBtn.addEventListener("click", createTask);

  setupDragZones();
}


/* =======================
   MODAL
======================= */
function openModal() {
  const modal = document.getElementById("taskModal");

  if (!modal) {
    console.error("Modal fehlt!");
    return;
  }

  modal.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("taskModal").classList.add("hidden");
  document.getElementById("title").value = "";
  document.getElementById("dueDate").value = "";
}


/* =======================
   TASKS
======================= */
function createTask() {

  const title = document.getElementById("title").value;
  if (!title) return;

  tasks.push({
    id: Date.now(),
    title,
    dueDate: document.getElementById("dueDate").value,
    priority: document.getElementById("priority").value,
    status: "todo"
  });

  closeModal();
  render();
}


/* =======================
   RENDER
======================= */
function render() {

  ["todo","in_progress","done"].forEach(s =>
    document.getElementById(s).innerHTML = ""
  );

  tasks.forEach(task => {

    const el = document.createElement("div");
    el.className = "task glass " + task.priority;
    el.draggable = true;

    el.innerHTML = `
      <strong>${task.title}</strong>
      <small>${task.dueDate || ""}</small>
    `;

    el.addEventListener("dragstart", e => {
      el.classList.add("dragging");
      e.dataTransfer.setData("id", task.id);
    });

    el.addEventListener("dragend", () =>
      el.classList.remove("dragging")
    );

    document.getElementById(task.status).appendChild(el);

    animate(el);
  });

  updateCalendar();
}


/* =======================
   DRAG & DROP
======================= */
function setupDragZones() {

  document.querySelectorAll(".dropzone").forEach(zone => {

    zone.addEventListener("dragover", e => {
      e.preventDefault();
      zone.classList.add("active");
    });

    zone.addEventListener("dragleave", () =>
      zone.classList.remove("active")
    );

    zone.addEventListener("drop", e => {

      zone.classList.remove("active");

      const id = e.dataTransfer.getData("id");
      const task = tasks.find(t => t.id == id);

      if (!task) return;

      task.status = zone.parentElement.dataset.status;

      render();
    });
  });
}


/* =======================
   VIEW
======================= */
function setView(view, btn) {

  currentView = view;

  document.querySelectorAll(".nav-btn")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");

  document.getElementById("listView").classList.add("hidden");
  document.getElementById("calendarView").classList.add("hidden");

  document.getElementById(view + "View")
    .classList.remove("hidden");

  if (view === "calendar") updateCalendar();
}


/* =======================
   CALENDAR
======================= */
function initCalendar() {

  calendar = new FullCalendar.Calendar(
    document.getElementById("calendar"),
    {
      initialView: "dayGridMonth",
      height: "auto"
    }
  );

  calendar.render();
}

function updateCalendar() {

  if (!calendar) return;

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


/* =======================
   ANIMATION
======================= */
function animate(el) {

  el.style.opacity = 0;
  el.style.transform = "translateY(10px)";

  requestAnimationFrame(() => {
    el.style.transition = "0.3s";
    el.style.opacity = 1;
    el.style.transform = "translateY(0)";
  });
}