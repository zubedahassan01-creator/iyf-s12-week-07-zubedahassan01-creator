"use strict";

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const itemsLeft = document.querySelector("#items-left");
const filterGroup = document.querySelector(".filters");
const clearCompletedButton = document.querySelector("#clear-completed");
const emptyState = document.querySelector("#empty-state");
const emptyTitle = emptyState.querySelector(".empty-title");
const emptyCopy = emptyState.querySelector(".empty-copy");
const formMessage = document.querySelector("#form-message");
const dateBadge = document.querySelector("#today-date");

const todos = [];
let currentFilter = "all";

dateBadge.textContent = new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric"
}).format(new Date());

function createId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getVisibleTodos() {
    if (currentFilter === "active") {
        return todos.filter((todo) => !todo.completed);
    }
    if (currentFilter === "completed") {
        return todos.filter((todo) => todo.completed);
    }
    return todos;
}

function createDeleteIcon() {
    const namespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(namespace, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    const lid = document.createElementNS(namespace, "path");
    lid.setAttribute("d", "M4 7h16M10 11v6m4-6v6M5 7l1 13h12l1-13M9 7V4h6v3");
    svg.append(lid);
    return svg;
}

function createTodoElement(todo) {
    const item = document.createElement("li");
    item.classList.add("todo-item");
    item.classList.toggle("is-completed", todo.completed);
    item.dataset.id = todo.id;

    const toggleButton = document.createElement("button");
    toggleButton.classList.add("todo-toggle");
    toggleButton.type = "button";
    toggleButton.dataset.action = "toggle";
    toggleButton.setAttribute("aria-pressed", String(todo.completed));
    toggleButton.setAttribute("aria-label", `${todo.completed ? "Mark active" : "Complete"}: ${todo.text}`);

    const checkMark = document.createElement("span");
    checkMark.classList.add("todo-check");
    checkMark.setAttribute("aria-hidden", "true");
    checkMark.textContent = "✓";

    const text = document.createElement("span");
    text.classList.add("todo-text");
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";
    deleteButton.setAttribute("aria-label", `Delete task: ${todo.text}`);
    deleteButton.append(createDeleteIcon());

    toggleButton.append(checkMark, text);
    item.append(toggleButton, deleteButton);
    return item;
}

function updateEmptyState(visibleTodos) {
    const isEmpty = visibleTodos.length === 0;
    emptyState.classList.toggle("is-hidden", !isEmpty);
    if (!isEmpty) return;

    if (todos.length === 0) {
        emptyTitle.textContent = "A fresh page.";
        emptyCopy.textContent = "Add a task above and give your day a gentle starting point.";
    } else if (currentFilter === "active") {
        emptyTitle.textContent = "All caught up.";
        emptyCopy.textContent = "There are no active tasks in this view.";
    } else if (currentFilter === "completed") {
        emptyTitle.textContent = "Nothing completed yet.";
        emptyCopy.textContent = "Finished tasks will show up here.";
    }
}

function updateStats() {
    const remainingCount = todos.filter((todo) => !todo.completed).length;
    itemsLeft.textContent = `${remainingCount} ${remainingCount === 1 ? "item" : "items"} left`;
    clearCompletedButton.disabled = !todos.some((todo) => todo.completed);
}

function renderTodos() {
    const visibleTodos = getVisibleTodos();
    const elements = visibleTodos.map(createTodoElement);
    todoList.replaceChildren(...elements);
    updateEmptyState(visibleTodos);
    updateStats();
}

function addTodo(text) {
    const cleanText = text.trim();
    if (cleanText.length === 0) {
        formMessage.textContent = "Add a few words first, then try again.";
        todoInput.focus();
        return false;
    }

    todos.push({ id: createId(), text: cleanText, completed: false });
    formMessage.textContent = "Task added to your list.";
    renderTodos();
    return true;
}

function findTodo(id) {
    return todos.find((todo) => todo.id === id);
}

function toggleTodo(id) {
    const todo = findTodo(id);
    if (todo === undefined) return;
    todo.completed = !todo.completed;
    renderTodos();
}

function deleteTodo(id) {
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) return;
    todos.splice(todoIndex, 1);
    renderTodos();
}

function filterTodos(filter) {
    if (!["all", "active", "completed"].includes(filter)) return;
    currentFilter = filter;
    filterGroup.querySelectorAll("[data-filter]").forEach((button) => {
        const isActive = button.dataset.filter === currentFilter;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
    renderTodos();
}

function beginEditing(todoItem) {
    const todo = findTodo(todoItem.dataset.id);
    const text = todoItem.querySelector(".todo-text");
    if (todo === undefined || text === null || todoItem.querySelector(".todo-edit-input") !== null) return;

    const editInput = document.createElement("input");
    editInput.classList.add("todo-edit-input");
    editInput.type = "text";
    editInput.maxLength = 160;
    editInput.value = todo.text;
    editInput.setAttribute("aria-label", `Edit task: ${todo.text}`);
    text.replaceWith(editInput);
    editInput.focus();
    editInput.select();
}

function finishEditing(editInput, saveChanges) {
    const todoItem = editInput.closest(".todo-item");
    const todo = todoItem === null ? undefined : findTodo(todoItem.dataset.id);
    if (todo === undefined) return;

    const updatedText = editInput.value.trim();
    if (saveChanges && updatedText.length > 0) {
        todo.text = updatedText;
        formMessage.textContent = "Task updated.";
    } else if (saveChanges && updatedText.length === 0) {
        formMessage.textContent = "A task needs at least one character; the original text was kept.";
    }
    renderTodos();
}

todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (addTodo(todoInput.value)) {
        todoInput.value = "";
        todoInput.focus();
    }
});

todoInput.addEventListener("input", () => {
    if (formMessage.textContent !== "") formMessage.textContent = "";
});

// One click listener handles every task, including tasks added after page load.
todoList.addEventListener("click", (event) => {
    const actionButton = event.target.closest("button[data-action]");
    if (actionButton === null || !todoList.contains(actionButton)) return;

    const todoItem = actionButton.closest(".todo-item");
    if (todoItem === null) return;

    if (actionButton.dataset.action === "delete") {
        deleteTodo(todoItem.dataset.id);
    } else if (actionButton.dataset.action === "toggle") {
        toggleTodo(todoItem.dataset.id);
    }
});

todoList.addEventListener("dblclick", (event) => {
    const text = event.target.closest(".todo-text");
    if (text === null || !todoList.contains(text)) return;
    const todoItem = text.closest(".todo-item");
    if (todoItem !== null) beginEditing(todoItem);
});

todoList.addEventListener("keydown", (event) => {
    const editInput = event.target.closest(".todo-edit-input");
    if (editInput === null) return;

    if (event.key === "Enter") {
        event.preventDefault();
        finishEditing(editInput, true);
    } else if (event.key === "Escape") {
        event.preventDefault();
        finishEditing(editInput, false);
    }
});

filterGroup.addEventListener("click", (event) => {
    const filterButton = event.target.closest("button[data-filter]");
    if (filterButton !== null && filterGroup.contains(filterButton)) {
        filterTodos(filterButton.dataset.filter);
    }
});

clearCompletedButton.addEventListener("click", () => {
    for (let index = todos.length - 1; index >= 0; index -= 1) {
        if (todos[index].completed) todos.splice(index, 1);
    }
    renderTodos();
});

renderTodos();
