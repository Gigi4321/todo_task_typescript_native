//? state
let tasks = [];
let editingTaskId = null;
//? DOM elements
const modal = document.getElementById("modal-overlay");
const addBtn = document.getElementById("add-task-btn");
const closeBtn = document.querySelector(".close-btn");
const cancelBtn = document.getElementById("cancel-task-button");
const submitBtn = document.getElementById("submit-task-btn");
const titleInput = document.getElementById("title-input");
const descriptionInput = document.getElementById("description-input");
const priorityInput = document.getElementById("priority-input");
const dueDateInput = document.getElementById("due-date-input");
const todoGrid = document.querySelector(".todo-tasks-grid");
const progressGrid = document.querySelector(".in-progress-tasks-grid");
const completedGrid = document.querySelector(".completed-tasks-grid");
const todoCounter = document.querySelector(".todo-tasks-counter");
const progressCounter = document.querySelector(".in-progress-tasks-counter");
const completedCounter = document.querySelector(".completed-tasks-counter");
// ================= LOCAL STORAGE =================
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
    const stored = localStorage.getItem("tasks");
    if (stored) {
        tasks = JSON.parse(stored);
    }
}
// ================= RENDER =================
function renderTasks() {
    todoGrid.innerHTML = "";
    progressGrid.innerHTML = "";
    completedGrid.innerHTML = "";
    const todoTasks = tasks.filter((t) => t.status === "todo");
    const progressTasks = tasks.filter((t) => t.status === "in-progress");
    const completedTasks = tasks.filter((t) => t.status === "completed");
    todoCounter.textContent = todoTasks.length + " tasks";
    progressCounter.textContent = progressTasks.length + " tasks";
    completedCounter.textContent = completedTasks.length + " tasks";
    todoTasks.forEach((t) => createCard(t, todoGrid));
    progressTasks.forEach((t) => createCard(t, progressGrid));
    completedTasks.forEach((t) => createCard(t, completedGrid));
}
// ================= CREATE CARD =================
// ================= CREATE CARD =================
function createCard(task, container) {
    var _a, _b;
    const card = document.createElement("div");
    card.className = "bg-slate-50 p-4 rounded-xl border border-slate-200 mb-3 shadow-sm";
    let priorityText = "";
    if (task.priority === 0)
        priorityText = "Low";
    if (task.priority === 1)
        priorityText = "Medium";
    if (task.priority === 2)
        priorityText = "High";
    // هنا بنحدد الأزرار حسب الحالة
    let moveButtons = "";
    if (task.status === "todo") {
        moveButtons = `
      <button class="move-btn bg-green-200 rounded-md px-2 py-1 text-xs" data-status="in-progress">Progress</button>
      <button class="move-btn bg-blue-200 rounded-md px-2 py-1 text-xs" data-status="completed">Complete</button>
    `;
    }
    if (task.status === "in-progress") {
        moveButtons = `
      <button class="move-btn bg-gray-200 rounded-md px-2 py-1 text-xs" data-status="todo">To Do</button>
      <button class="move-btn bg-blue-200 rounded-md px-2 py-1 text-xs" data-status="completed">Complete</button>
    `;
    }
    if (task.status === "completed") {
        moveButtons = `
      <button class="move-btn bg-gray-200 rounded-md px-2 py-1 text-xs" data-status="todo">To Do</button>
      <button class="move-btn bg-green-200 rounded-md px-2 py-1 text-xs" data-status="in-progress">Progress</button>
    `;
    }
    card.innerHTML = `
    <div class="flex justify-between">
      <h3 class="font-semibold ${task.status === "completed" ? "line-through text-slate-400" : ""}">${task.title}</h3>
      <div class="flex gap-2">
        <button class="edit-btn text-indigo-500 text-sm">Edit</button>
        <button class="delete-btn text-red-500 text-sm">Delete</button>
      </div>
    </div>
    <p class="text-sm text-slate-500 my-2">${task.description}</p>
    <div class="flex justify-between text-xs mb-2">
      <span>${priorityText}</span>
      <span>${task.dueDate || ""}</span>
    </div>
    <div class="flex gap-2">
      ${moveButtons}
    </div>
  `;
    // delete
    (_a = card.querySelector(".delete-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        if (confirm("Delete this task?")) {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        }
    });
    // edit
    (_b = card.querySelector(".edit-btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        editingTaskId = task.id;
        titleInput.value = task.title;
        descriptionInput.value = task.description;
        priorityInput.value = String(task.priority);
        dueDateInput.value = task.dueDate;
        submitBtn.textContent = "Update Task";
        modal.classList.remove("invisible", "opacity-0");
    });
    // move
    card.querySelectorAll(".move-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const newStatus = btn.dataset.status;
            task.status = newStatus;
            saveTasks();
            renderTasks();
        });
    });
    container.appendChild(card);
}
// ================= VALIDATION =================
function isValid() {
    if (titleInput.value.trim().length < 3) {
        alert("Title must be at least 3 characters");
        return false;
    }
    if (descriptionInput.value.length > 500) {
        alert("Max 500 characters");
        return false;
    }
    if (dueDateInput.value) {
        const selectedDate = new Date(dueDateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            alert("Date cannot be in past");
            return false;
        }
    }
    return true;
}
// ================= EVENTS =================
addBtn.addEventListener("click", () => {
    modal.classList.remove("invisible", "opacity-0");
});
[closeBtn, cancelBtn].forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.add("invisible", "opacity-0");
    });
});
submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!isValid())
        return;
    if (editingTaskId) {
        const task = tasks.find((t) => t.id === editingTaskId);
        if (task) {
            task.title = titleInput.value.trim();
            task.description = descriptionInput.value.trim();
            task.priority = Number(priorityInput.value);
            task.dueDate = dueDateInput.value;
        }
        editingTaskId = null;
        submitBtn.textContent = "Add Task";
    }
    else {
        const newTask = {
            id: crypto.randomUUID(),
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            priority: Number(priorityInput.value),
            dueDate: dueDateInput.value,
            status: "todo",
            createdAt: Date.now(),
        };
        tasks.push(newTask);
    }
    saveTasks();
    renderTasks();
    modal.classList.add("invisible", "opacity-0");
    titleInput.value = "";
    descriptionInput.value = "";
    dueDateInput.value = "";
    priorityInput.value = "0";
});
// ================= INIT =================
loadTasks();
renderTasks();
