# Day 5 · Code review practice

Review target: Week 6 Weather Dashboard in this portfolio. This is a self-review checklist, not a substitute for the required inline review of the assigned partner's pull request.

## Review notes

- **Error handling:** the weather request checks `response.ok`, distinguishes an unknown city from a network failure, and keeps loading feedback visible. Consider adding a retry action for temporary service errors.
- **State and persistence:** successful recent searches persist in localStorage. A malformed or inaccessible stored value should keep falling back to an empty list so the page remains usable.
- **Structure:** the current dashboard puts the UI and request flow in one entry file. For a larger app, separate API access, recent-search storage, and rendering into small modules.
- **Accessibility:** the search form supports Enter and exposes status text to assistive technology. Verify that icon alt text stays descriptive and that keyboard focus is visible.
- **Security:** text from the city input should remain text content; never inject it with `innerHTML`. The public browser key should be restricted in the provider dashboard.
- **Maintenance:** keep units and formatting consistent, name the storage key once, and avoid repeating API URL construction.

## Suggested next improvements

1. Add a retry button for network and service errors.
2. Extract weather formatting helpers and cover them with unit tests.
3. Add a keyboard-only pass for focus order and visible focus styles.
