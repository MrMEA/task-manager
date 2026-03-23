
let tasks = [];

// Laden beim Start
window.onload = function () {
    let saved = localStorage.getItem("tasks");

    if (saved) {
        tasks = JSON.parse(saved);
        renderTasks();
    }
};

function addTask() {

    let input = document.getElementById("taskInput");
    let taskText = input.value;

    if (taskText === "") return;

    tasks.push(taskText);

    saveTasks();
    renderTasks();

    input.value = "";
}

function renderTasks() {

    let list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {

        let li = document.createElement("li");
        li.textContent = task;

        li.onclick = function () {
            deleteTask(index);
        };

        list.appendChild(li);
    });
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}