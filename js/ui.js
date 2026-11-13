import { countActive, filterTodos } from "./todo-logic.js";

const TODO_LIST = document.querySelector("#todo-list");
const ITEMS_LEFT = document.querySelector("#items-left");
const FILTER_GROUP = document.querySelector(".filters");
const CLEAR_BUTTON = document.querySelector("#clear-completed");
const EMPTY_STATE = document.querySelector("#empty-state");
const EMPTY_TITLE = EMPTY_STATE.querySelector(".empty-title");
const EMPTY_COPY = EMPTY_STATE.querySelector(".empty-copy");

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
    item.dataset.id = String(todo.id);

    const toggleButton = document.createElement("button");
    toggleButton.classList.add("todo-toggle");
    toggleButton.type = "button";
    toggleButton.dataset.action = "toggle";
    toggleButton.setAttribute("aria-pressed", String(todo.completed));
    toggleButton.setAttribute(
        "aria-label",
        `${todo.completed ? "Mark active" : "Complete"}: ${todo.text}`
    );

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

function updateEmptyState(state, visibleTodos) {
    const isEmpty = visibleTodos.length === 0;
    EMPTY_STATE.classList.toggle("is-hidden", !isEmpty);
    if (!isEmpty) return;

    if (state.todos.length === 0) {
        EMPTY_TITLE.textContent = "A fresh page.";
        EMPTY_COPY.textContent = "Add a task above and give your day a gentle starting point.";
    } else if (state.filter === "active") {
        EMPTY_TITLE.textContent = "All caught up.";
        EMPTY_COPY.textContent = "There are no active tasks in this view.";
    } else if (state.filter === "completed") {
        EMPTY_TITLE.textContent = "Nothing completed yet.";
        EMPTY_COPY.textContent = "Finished tasks will show up here.";
    }
}

export function renderTodos(state) {
    const visibleTodos = filterTodos(state.todos, state.filter);
    TODO_LIST.replaceChildren(...visibleTodos.map(createTodoElement));
    updateEmptyState(state, visibleTodos);

    const activeCount = countActive(state.todos);
    ITEMS_LEFT.textContent = `${activeCount} ${activeCount === 1 ? "item" : "items"} left`;
    CLEAR_BUTTON.disabled = !state.todos.some((todo) => todo.completed);

    FILTER_GROUP.querySelectorAll("[data-filter]").forEach((button) => {
        const isActive = button.dataset.filter === state.filter;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

export function showMessage(message) {
    document.querySelector("#form-message").textContent = message;
}

export function focusTodoInput() {
    document.querySelector("#todo-input").focus();
}

export function clearTodoInput() {
    document.querySelector("#todo-input").value = "";
}

export function getTodoInputValue() {
    return document.querySelector("#todo-input").value;
}

export function updateDateBadge() {
    document.querySelector("#today-date").textContent = new Intl.DateTimeFormat("en", {
        weekday: "short",
        month: "short",
        day: "numeric"
    }).format(new Date());
}

export function beginEditing(todoItem, todo) {
    const text = todoItem.querySelector(".todo-text");
    if (!todo || !text || todoItem.querySelector(".todo-edit-input")) return null;

    const editInput = document.createElement("input");
    editInput.classList.add("todo-edit-input");
    editInput.type = "text";
    editInput.maxLength = 160;
    editInput.value = todo.text;
    editInput.setAttribute("aria-label", `Edit task: ${todo.text}`);
    text.replaceWith(editInput);
    editInput.focus();
    editInput.select();
    return editInput;
}
