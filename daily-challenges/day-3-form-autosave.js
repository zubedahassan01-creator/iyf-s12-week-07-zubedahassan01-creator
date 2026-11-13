const STORAGE_KEY = "week7-challenge-form-draft";
const form = document.querySelector("#contact-form");
const status = document.querySelector("#save-status");

function readDraft() {
    try {
        const draft = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
        return draft !== null && typeof draft === "object" ? draft : {};
    } catch {
        return {};
    }
}

function saveDraft() {
    const values = Object.fromEntries(new FormData(form).entries());
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        status.textContent = `Draft saved at ${new Date().toLocaleTimeString()}.`;
    } catch {
        status.textContent = "Draft could not be saved in this browser.";
    }
}

const draft = readDraft();
for (const field of form.elements) {
    if (field.name && typeof draft[field.name] === "string") field.value = draft[field.name];
}

const autosaveTimer = window.setInterval(saveDraft, 5000);

form.addEventListener("submit", (event) => {
    event.preventDefault();
    window.clearInterval(autosaveTimer);
    try {
        localStorage.removeItem(STORAGE_KEY);
        status.textContent = "Thanks! The draft was submitted and cleared.";
    } catch {
        status.textContent = "Submitted, but the saved draft could not be removed.";
    }
    form.reset();
});
