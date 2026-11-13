const STORAGE_KEY = "week7-challenge-theme";
const toggleButton = document.querySelector("#theme-toggle");

function readTheme() {
    try {
        return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
    } catch {
        return "light";
    }
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    toggleButton.textContent = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
    toggleButton.setAttribute("aria-pressed", String(theme === "dark"));
}

toggleButton.addEventListener("click", () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        toggleButton.title = "Storage is unavailable, so this choice will not persist.";
    }
});

applyTheme(readTheme());
