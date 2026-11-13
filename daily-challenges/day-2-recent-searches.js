const STORAGE_KEY = "week7-challenge-recent-searches";
const form = document.querySelector("#search-form");
const input = document.querySelector("#search-input");
const historyList = document.querySelector("#recent-searches");
const result = document.querySelector("#search-result");

function loadHistory() {
    try {
        const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
        return Array.isArray(value)
            ? value.filter((entry) => typeof entry === "string").slice(0, 5)
            : [];
    } catch {
        return [];
    }
}

let recentSearches = loadHistory();

function saveHistory() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
    } catch {
        result.textContent = "Search works, but browser storage is unavailable.";
    }
}

function search(term) {
    const cleanTerm = term.trim();
    if (!cleanTerm) return;
    recentSearches = [
        cleanTerm,
        ...recentSearches.filter((entry) => entry.toLowerCase() !== cleanTerm.toLowerCase())
    ].slice(0, 5);
    input.value = cleanTerm;
    result.textContent = `Showing a local demo result for “${cleanTerm}”.`;
    saveHistory();
    renderHistory();
}

function renderHistory() {
    historyList.replaceChildren(
        ...recentSearches.map((term) => {
            const item = document.createElement("li");
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = term;
            button.addEventListener("click", () => search(term));
            item.append(button);
            return item;
        })
    );
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    search(input.value);
});

renderHistory();
