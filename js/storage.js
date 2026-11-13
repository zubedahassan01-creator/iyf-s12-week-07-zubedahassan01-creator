const STORAGE_KEY = "little-list-state-v1";
const VALID_FILTERS = new Set(["all", "active", "completed"]);

function getStorage() {
    try {
        return globalThis.localStorage;
    } catch {
        return null;
    }
}

function isValidTodo(todo) {
    return (
        todo !== null &&
        typeof todo === "object" &&
        (typeof todo.id === "string" || typeof todo.id === "number") &&
        typeof todo.text === "string" &&
        todo.text.trim().length > 0 &&
        todo.text.length <= 160 &&
        typeof todo.completed === "boolean"
    );
}

export function loadState() {
    const storage = getStorage();
    if (!storage) return { todos: [], filter: "all" };

    try {
        const savedValue = storage.getItem(STORAGE_KEY);
        if (savedValue === null) return { todos: [], filter: "all" };

        const parsedState = JSON.parse(savedValue);
        if (parsedState === null || typeof parsedState !== "object") {
            return { todos: [], filter: "all" };
        }

        return {
            todos: Array.isArray(parsedState.todos) ? parsedState.todos.filter(isValidTodo) : [],
            filter: VALID_FILTERS.has(parsedState.filter) ? parsedState.filter : "all"
        };
    } catch {
        return { todos: [], filter: "all" };
    }
}

export function saveState(state) {
    const storage = getStorage();
    if (!storage) return false;

    try {
        storage.setItem(STORAGE_KEY, JSON.stringify({ todos: state.todos, filter: state.filter }));
        return true;
    } catch {
        return false;
    }
}
