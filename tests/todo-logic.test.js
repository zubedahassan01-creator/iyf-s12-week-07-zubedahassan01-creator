import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { loadState } from "../js/storage.js";
import {
    addTodo,
    clearCompleted,
    countActive,
    deleteTodo,
    editTodo,
    filterTodos,
    toggleTodo
} from "../js/todo-logic.js";

const sampleTodos = [
    { id: "one", text: "Read a chapter", completed: false },
    { id: "two", text: "Water plants", completed: true }
];

describe("todo logic", () => {
    it("adds an item without changing the original array", () => {
        const original = [...sampleTodos];
        const updated = addTodo(original, { id: "three", text: "Take a walk", completed: false });

        assert.equal(updated.length, 3);
        assert.deepEqual(original, sampleTodos);
        assert.notEqual(updated, original);
    });

    it("toggles only the selected todo and preserves the input", () => {
        const updated = toggleTodo(sampleTodos, "one");

        assert.equal(updated[0].completed, true);
        assert.equal(updated[1].completed, true);
        assert.equal(sampleTodos[0].completed, false);
    });

    it("deletes the matching item and leaves others intact", () => {
        assert.deepEqual(deleteTodo(sampleTodos, "one"), [sampleTodos[1]]);
    });

    it("returns no completed items after clearing completed tasks", () => {
        assert.deepEqual(clearCompleted(sampleTodos), [sampleTodos[0]]);
    });

    it("filters active and completed tasks", () => {
        assert.deepEqual(filterTodos(sampleTodos, "active"), [sampleTodos[0]]);
        assert.deepEqual(filterTodos(sampleTodos, "completed"), [sampleTodos[1]]);
    });

    it("treats an unknown filter as all tasks", () => {
        assert.deepEqual(filterTodos(sampleTodos, "later"), sampleTodos);
    });

    it("does not replace task text with an empty edit", () => {
        assert.equal(editTodo(sampleTodos, "one", "   "), sampleTodos);
    });

    it("counts active tasks", () => {
        assert.equal(countActive(sampleTodos), 1);
    });
});

describe("saved state", () => {
    it("falls back safely when saved JSON is broken", () => {
        const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
        Object.defineProperty(globalThis, "localStorage", {
            configurable: true,
            value: { getItem: () => "{broken", setItem: () => {} }
        });

        try {
            assert.deepEqual(loadState(), { todos: [], filter: "all" });
        } finally {
            if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
            else delete globalThis.localStorage;
        }
    });

    it("drops invalid tasks and restores a valid saved filter", () => {
        const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
        const serializedState = JSON.stringify({
            todos: [sampleTodos[0], { id: "bad", text: "", completed: false }],
            filter: "completed"
        });
        Object.defineProperty(globalThis, "localStorage", {
            configurable: true,
            value: { getItem: () => serializedState, setItem: () => {} }
        });

        try {
            assert.deepEqual(loadState(), { todos: [sampleTodos[0]], filter: "completed" });
        } finally {
            if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
            else delete globalThis.localStorage;
        }
    });
});
