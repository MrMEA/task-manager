let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function save(){localStorage.setItem("tasks",JSON.stringify(tasks));}

function showView(v){
document.getElementById("tasksView").classList.add("hidden");
document.getElementById("calendarView").classList.add("hidden");
document.getElementById("statsView").classList.add("hidden");

document.getElementById(v+"View").classList.remove("hidden");
if(v==="calendar") renderCalendar();
if(v==="stats") renderChart();
}

function addTask(){
let text=document.getElementById("taskInput").value;
let date=document.getElementById("deadline").value;

tasks.push({text,date});
save();
renderTasks();
}

function renderTasks(){
let list=document.getElementById("taskList");
list.innerHTML="";

tasks.forEach((t,i)=>{
let div=document.createElement("div");
div.className="task";
div.draggable=true;

div.ondragstart=e=>e.dataTransfer.setData("i",i);

div.innerText=t.text+" ("+(t.date||"")+")";

list.appendChild(div);
});
}

function renderCalendar(){
let cal=document.getElementById("calendar");
cal.innerHTML="";

for(let d=1;d<=30;d++){
let day=document.createElement("div");
day.className="day";
day.innerText=d;

day.ondragover=e=>e.preventDefault();

day.ondrop=e=>{
let i=e.dataTransfer.getData("i");
tasks[i].date="2026-03-"+String(d).padStart(2,"0");
save();
renderCalendar();
};

tasks.forEach(t=>{
if(t.date && t.date.endsWith("-"+String(d).padStart(2,"0"))){
let el=document.createElement("div");
el.innerText=t.text;
day.appendChild(el);
}
});

cal.appendChild(day);
}
}

function renderChart(){
let c=document.getElementById("chart");
let ctx=c.getContext("2d");

let total=tasks.length;
let done=0;

ctx.clearRect(0,0,300,300);

ctx.fillStyle="white";
ctx.fillText("Tasks: "+total,10,20);
ctx.fillText("Done: "+done,10,40);
}

renderTasks();
