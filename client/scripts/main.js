import {backRoot, setSort, buttonRoot, buttonSort} from './buttons.js';
import { updatePage } from './update.js';

// ждет когда страница полностью загрузится 
document.addEventListener('DOMContentLoaded', function () {
    // Запуск обновления страницы
    updatePage();

    // привязка обработчиков событий
    buttonRoot.addEventListener("click", backRoot);
    buttonSort.addEventListener("click", setSort);  
});