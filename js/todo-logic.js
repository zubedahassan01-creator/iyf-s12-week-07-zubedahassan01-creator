const VALID_FILTERS = new Set(["all", "active", "completed"]);

export function addTodo(todos, todo) {
    return [...todos, { ...todo }];
}

export function toggleTodo(todos, id) {
    return todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
}

export function deleteTodo(todos, id) {
    return todos.filter((todo) => todo.id !== id);
}

export function editTodo(todos, id, text) {
    const cleanText = text.trim();
    if (cleanText.length === 0) return todos;
    return todos.map((todo) => (todo.id === id ? { ...todo, text: cleanText } : todo));
}

export function clearCompleted(todos) {
    return todos.filter((todo) => !todo.completed);
}

export function filterTodos(todos, filter = "all") {
    if (!VALID_FILTERS.has(filter) || filter === "all") return [...todos];
    return todos.filter((todo) => (filter === "active" ? !todo.completed : todo.completed));
}

export function countActive(todos) {
    return todos.filter((todo) => !todo.completed).length;
}
