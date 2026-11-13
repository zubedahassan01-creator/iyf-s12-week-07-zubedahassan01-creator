import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default {
    base: "/iyf-s12-week-07-zubedahassan01-creator/",
    build: {
        rollupOptions: {
            input: {
                main: resolve(projectRoot, "index.html"),
                cart: resolve(projectRoot, "cart/index.html"),
                theme: resolve(projectRoot, "daily-challenges/day-1-theme.html"),
                recentSearches: resolve(projectRoot, "daily-challenges/day-2-recent-searches.html"),
                formAutosave: resolve(projectRoot, "daily-challenges/day-3-form-autosave.html"),
                refactor: resolve(projectRoot, "daily-challenges/day-4-refactor.html")
            }
        }
    }
};
