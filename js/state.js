import { addTodo, clearCompleted, deleteTodo, editTodo, toggleTodo } from "./todo-logic.js";

export function createState(savedState = {}) {
    return {
        todos: Array.isArray(savedState.todos) ? savedState.todos : [],
        filter: ["all", "active", "completed"].includes(savedState.filter)
            ? savedState.filter
            : "all"
    };
}

export function addTask(state, text, id) {
    const cleanText = text.trim();
    if (cleanText.length === 0) return state;
    return { ...state, todos: addTodo(state.todos, { id, text: cleanText, completed: false }) };
}

export function toggleTask(state, id) {
    return { ...state, todos: toggleTodo(state.todos, id) };
}

export function deleteTask(state, id) {
    return { ...state, todos: deleteTodo(state.todos, id) };
}

export function editTask(state, id, text) {
    return { ...state, todos: editTodo(state.todos, id, text) };
}

export function setFilter(state, filter) {
    if (!["all", "active", "completed"].includes(filter)) return state;
    return { ...state, filter };
}

export function removeCompleted(state) {
    return { ...state, todos: clearCompleted(state.todos) };
}
