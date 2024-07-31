import { root } from "./buttons";
import { currentRootElement, refreshTable } from "./refresh";

// Обновление страницы
const updatePage = async () => {
    await refreshTable();
    currentRootElement!.textContent = root;
}

export {updatePage};