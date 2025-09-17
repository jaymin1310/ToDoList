// function saveTasks() {
//   localStorage.setItem("tasksHTML", list.innerHTML);
//   localStorage.setItem("pendingCount", cnt.innerText);
// }
const taskin = document.querySelector("#taskInput");
const add = document.querySelector("#addTaskBtn");
const list = document.querySelector("#taskList");
const cnt1 = document.querySelector("#pendingCount");
const cnt2 = document.querySelector("#completedCount");
const clear = document.querySelector("#clear");
const filter = document.querySelector("#filter-select");
const pendText = document.querySelector("#pendCnt");
const compText = document.querySelector("#compCnt");
function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}
function updateCount() {
  const pending = getTasks().filter((t) => !t.completed).length;
  const completed = getTasks().filter((t) => t.completed).length;
  cnt1.innerText = pending;
  cnt2.innerText = completed;
}

// function updateEventListeners() {
//   const spans = document.querySelectorAll(".task-text");
//   const buttons = document.querySelectorAll(".delete-btn");

//   spans.forEach((span) => {
//     span.addEventListener("click", () => {
//       if (span.classList.contains("completed")) {
//         updateCount(+1);
//       } else {
//         updateCount(-1);
//       }
//       span.classList.toggle("completed");
//       saveTasks();
//     });
//   });

//   buttons.forEach((btn) => {
//     btn.addEventListener("click", () => {
//       const li = btn.parentElement;
//       const span = li.querySelector(".task-text");

//       li.remove();
//       if (!span.classList.contains("completed")) {
//         updateCount(-1);
//       }
//       saveTasks();
//     });
//   });
// }

// function loadTasks() {
//   const savedHTML = localStorage.getItem("tasksHTML");
//   const savedCount = localStorage.getItem("pendingCount");
//   if (savedHTML) {
//     list.innerHTML = savedHTML;
//   }
//   if (savedCount) {
//     cnt.innerText = savedCount;
//   }
//   updateEventListeners();
// }

function createTask(taskObj) {
  let li = document.createElement("li");
  li.className = "task-item";

  let span = document.createElement("span");
  span.innerText = taskObj.text;
  span.className = "task-text";
  if (taskObj.completed) span.classList.add("completed");
  span.addEventListener("click", () => {
    const tasks = getTasks();
    const task = tasks.find((t) => t.id === taskObj.id);
    task.completed = !task.completed;
    span.classList.toggle("completed");
    saveTasks(tasks);
    updateCount();
  });
  let btn = document.createElement("button");
  btn.innerText = "Delete";
  btn.className = "delete-btn";
  btn.addEventListener("click", () => {
    let tasks = getTasks().filter((t) => t.id !== taskObj.id);
    saveTasks(tasks);
    li.remove();
    updateCount();
  });
  let edit = document.createElement("button");
  edit.innerText = "Edit";
  edit.className = "edit-btn";
  let btnContainer = document.createElement("div");
  btnContainer.className = "task-buttons";
  btnContainer.appendChild(edit);
  btnContainer.appendChild(btn);
  li.appendChild(span);
  li.appendChild(btnContainer);
  list.appendChild(li);
}

add.addEventListener("click", () => {
  if (taskin.value.trim() !== "") {
    let text = taskin.value;
    const taskObj = { id: Date.now(), text: text, completed: false };
    const tasks = getTasks();
    tasks.push(taskObj);
    saveTasks(tasks);
    createTask(taskObj);
    updateCount();
    taskin.value = "";
  }
});
clear.addEventListener("click", () => {
  localStorage.removeItem("tasks");
  list.innerHTML = "";
  cnt1.innerText = "0";
  cnt2.innerText = "0";
});
window.addEventListener("load", () => {
  const tasks = getTasks();
  tasks.forEach(createTask);
  updateCount();
});
const loadVal = (newVal) => {
  if (newVal == "all") {
    list.innerHTML = "";
    const all = getTasks();
    all.forEach(createTask);
    compText.style.display = "block";
    pendText.style.display = "block";
    taskin.style.display = "";
    add.style.display = "";
  } else if (newVal == "completed") {
    list.innerHTML = "";
    const completed = getTasks().filter((t) => t.completed);
    completed.forEach(createTask);
    compText.style.display = "block";
    pendText.style.display = "none";
    taskin.style.display = "none";
    add.style.display = "none";
  } else {
    list.innerHTML = "";
    const pending = getTasks().filter((t) => !t.completed);
    pending.forEach(createTask);
    compText.style.display = "none";
    pendText.style.display = "block";
    taskin.style.display = "none";
    add.style.display = "none";
  }
};
filter.addEventListener("change", () => {
  const newVal = filter.value;
  loadVal(newVal);
});
