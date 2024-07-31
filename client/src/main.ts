import {backRoot, setSort, buttonRoot, buttonSort} from './buttons';
import { updatePage } from './update';

// ждет когда страница полностью загрузится 
document.addEventListener('DOMContentLoaded', function () {
    // Запуск обновления страницы
    updatePage();

    // привязка обработчиков событий
    buttonRoot!.addEventListener("click", backRoot);
    buttonSort!.addEventListener("click", setSort);  
});