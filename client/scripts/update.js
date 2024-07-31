import { root } from "./buttons.js";
import { currentRootElement, refreshTable } from "./refresh.js";

// Обновление страницы
const updatePage = async () => {
    await refreshTable();
    currentRootElement.textContent = root;
}

export {updatePage};