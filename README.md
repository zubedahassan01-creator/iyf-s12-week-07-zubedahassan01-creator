# Week 7: JavaScript Best Practices — Little List

## Author

- **Name:** Zubeda Hassan
- **GitHub:** [@zubedahassan01-creator](https://github.com/zubedahassan01-creator)
- **Date:** November 13, 2026

## Project Description

Little List is the Week 5 to-do app refactored into JavaScript modules. It saves tasks and the selected filter in localStorage, handles missing or invalid saved data safely, and keeps data transformations separate from browser APIs so they can be tested.

## Technologies Used

- HTML5 and CSS3
- JavaScript ES modules
- Node.js 24 and Node's built-in test runner
- ESLint 9 and Prettier

## Features

- Add, complete, edit, delete, filter, and clear completed tasks.
- Keep task data and the selected filter after refresh.
- Fall back safely when browser storage is unavailable or contains invalid data.
- Keep pure operations in `js/todo-logic.js` for direct unit testing.
- Include a separate persistent shopping cart and five Week 7 daily challenges.

## How to Run

1. Clone this repository.
2. Run `npm install`.
3. Run `npm test` and `npm run lint`.
4. Run `npm start` and open the shown URL. Browser modules need HTTP; don't open the page as `file://`.
5. Open `cart/index.html` for the Lesson 13 shopping cart.

## Lessons Learned

Persisting state in one place makes it easier to keep the UI and storage in sync. Pure functions are easier to test because they don't rely on the DOM or browser storage.

## Challenges Faced

The important boundary was separating data transformations from DOM rendering and localStorage. Invalid or blocked storage is handled with safe defaults so it cannot stop the app from starting.

## Collaboration

- **Assigned partner:** The Classroom assignment page does not identify the assigned reviewer; fill in their Week 7 pairing from the class post.
- **PR I opened:** Add the `refactor/modules` pull request link after creating it.
- **PR I reviewed:** Add the partner PR link and a link to one of the three inline comments after reviewing it.

## Live Demo

[View Little List on GitHub Pages](https://zubedahassan01-creator.github.io/iyf-s12-week-07-zubedahassan01-creator/)

## Daily Challenges

- Day 1: `daily-challenges/day-1-theme.html` — persistent light/dark theme.
- Day 2: `daily-challenges/day-2-recent-searches.html` — last five searches, saved history, and click to search again.
- Day 3: `daily-challenges/day-3-form-autosave.html` — recover a five-second auto-saved form draft and clear it on submit.
- Day 4: `daily-challenges/day-4-refactor.html` — validated, named, non-mutating order summary function.
- Day 5: `daily-challenges/day-5-code-review.md` — review notes and actionable improvements for the Weather Dashboard.
