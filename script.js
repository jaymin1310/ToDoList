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
    setTimeout(() => {
      let tasks = getTasks().filter((t) => t.id !== taskObj.id);
      saveTasks(tasks);
      li.remove();
      updateCount();
    }, 200);
  });
  let edit = document.createElement("button");
  edit.innerText = "Edit";
  edit.className = "edit-btn";
  edit.addEventListener("click", () => {
    let input = document.createElement("input");
    input.type = "text";
    input.value = taskObj.text;
    li.replaceChild(input, span);
    input.focus();
    input.addEventListener("blur", () => {
      if (input.value.trim() !== "") {
        taskObj.text = input.value.trim();
        span.innerText = taskObj.text;
        const tasks = getTasks();
        const task = tasks.find((t) => t.id == taskObj.id); // use == in case of type mismatch
        if (task) task.text = taskObj.text;
        saveTasks(tasks);
      }
      li.replaceChild(span, input);
    });
  });
  let btnContainer = document.createElement("div");
  btnContainer.className = "task-buttons";
  btnContainer.appendChild(edit);
  btnContainer.appendChild(btn);
  li.appendChild(span);
  li.appendChild(btnContainer);
  list.appendChild(li);
  setTimeout(() => li.classList.add("show"), 10);
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
  const confirmed = confirm("Are you sure to delete all your task?");
  if (confirmed) {
    localStorage.removeItem("tasks");
    list.innerHTML = "";
    cnt1.innerText = "0";
    cnt2.innerText = "0";
  } else {
    console.log("Task not deleted");
  }
});
window.addEventListener("load", () => {
  const tasks = getTasks();
  tasks.forEach(createTask);
  updateCount();
  const savedMode = localStorage.getItem("mode");
  if (savedMode === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  const icon = document.querySelector("#dark i"); // the <i> icon
  const text = document.querySelector("#dark"); // the <p> text

  if (savedMode === "dark") {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
    text.childNodes[1].nodeValue = " Light";
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
    text.childNodes[1].nodeValue = " Dark";
  }
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
const dark = document.querySelector("#dark");
const modeBtn = dark.querySelector("i");

dark.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    modeBtn.classList.remove("fa-moon");
    modeBtn.classList.add("fa-sun");
    dark.childNodes[1].nodeValue = " Light";
    localStorage.setItem("mode", "dark");
  } else {
    modeBtn.classList.remove("fa-sun");
    modeBtn.classList.add("fa-moon");
    dark.childNodes[1].nodeValue = " Dark";
    localStorage.setItem("mode", "light");
  }
});
