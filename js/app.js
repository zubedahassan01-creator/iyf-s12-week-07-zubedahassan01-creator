import { loadState, saveState } from "./storage.js";
import {
    addTask,
    createState,
    deleteTask,
    editTask,
    removeCompleted,
    setFilter,
    toggleTask
} from "./state.js";
import {
    beginEditing,
    clearTodoInput,
    focusTodoInput,
    getTodoInputValue,
    renderTodos,
    showMessage,
    updateDateBadge
} from "./ui.js";

const TODO_FORM = document.querySelector("#todo-form");
const TODO_LIST = document.querySelector("#todo-list");
const FILTER_GROUP = document.querySelector(".filters");
const CLEAR_BUTTON = document.querySelector("#clear-completed");
const TODO_INPUT = document.querySelector("#todo-input");
let state = createState(loadState());

function createId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function commit(nextState) {
    state = nextState;
    saveState(state);
    renderTodos(state);
}

function findTodo(id) {
    return state.todos.find((todo) => String(todo.id) === id);
}

function finishEditing(editInput, saveChanges) {
    const todoItem = editInput.closest(".todo-item");
    const todo = todoItem ? findTodo(todoItem.dataset.id) : undefined;
    if (!todo) return;

    const updatedText = editInput.value.trim();
    if (saveChanges && updatedText.length > 0) {
        commit(editTask(state, todo.id, updatedText));
        showMessage("Task updated.");
    } else {
        if (saveChanges)
            showMessage("A task needs at least one character; the original text was kept.");
        renderTodos(state);
    }
}

TODO_FORM.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = getTodoInputValue();
    if (text.trim().length === 0) {
        showMessage("Add a few words first, then try again.");
        focusTodoInput();
        return;
    }

    commit(addTask(state, text, createId()));
    clearTodoInput();
    showMessage("Task added to your list.");
    focusTodoInput();
});

TODO_INPUT.addEventListener("input", () => showMessage(""));

TODO_LIST.addEventListener("click", (event) => {
    const actionButton = event.target.closest("button[data-action]");
    if (!actionButton || !TODO_LIST.contains(actionButton)) return;
    const todoItem = actionButton.closest(".todo-item");
    if (!todoItem) return;

    const id = todoItem.dataset.id;
    if (actionButton.dataset.action === "delete") commit(deleteTask(state, findTodo(id)?.id));
    if (actionButton.dataset.action === "toggle") commit(toggleTask(state, findTodo(id)?.id));
});

TODO_LIST.addEventListener("dblclick", (event) => {
    const text = event.target.closest(".todo-text");
    if (!text || !TODO_LIST.contains(text)) return;
    const todoItem = text.closest(".todo-item");
    if (todoItem) beginEditing(todoItem, findTodo(todoItem.dataset.id));
});

TODO_LIST.addEventListener("keydown", (event) => {
    const editInput = event.target.closest(".todo-edit-input");
    if (!editInput) return;
    if (event.key === "Enter") {
        event.preventDefault();
        finishEditing(editInput, true);
    } else if (event.key === "Escape") {
        event.preventDefault();
        finishEditing(editInput, false);
    }
});

TODO_LIST.addEventListener("focusout", (event) => {
    const editInput = event.target.closest(".todo-edit-input");
    if (editInput) finishEditing(editInput, true);
});

FILTER_GROUP.addEventListener("click", (event) => {
    const filterButton = event.target.closest("button[data-filter]");
    if (!filterButton || !FILTER_GROUP.contains(filterButton)) return;
    commit(setFilter(state, filterButton.dataset.filter));
});

CLEAR_BUTTON.addEventListener("click", () => commit(removeCompleted(state)));

updateDateBadge();
renderTodos(state);
