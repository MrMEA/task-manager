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

    tasks.push({
        text: taskText,
        done: false
    });

    saveTasks();
    renderTasks();

    input.value = "";
}

function renderTasks() {

    let list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {

        let li = document.createElement("li");

        // Text
        let span = document.createElement("span");
        span.textContent = task.text;

        if (task.done) {
            span.style.textDecoration = "line-through";
        }

        // Toggle erledigt
        span.onclick = function () {
            task.done = !task.done;
            saveTasks();
            renderTasks();
        };

        // Delete Button
        let btn = document.createElement("button");
        btn.textContent = "X";

        btn.onclick = function (e) {
            e.stopPropagation();
            deleteTask(index);
        };

        li.appendChild(span);
        li.appendChild(btn);

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