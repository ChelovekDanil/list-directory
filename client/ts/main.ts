import '../style.css';
import {backRoot, setSort, buttonRoot, buttonSort, buttonStatistics, getStatistics} from './buttons';
import { updatePage } from './update';

// ждет когда страница полностью загрузится 
document.addEventListener('DOMContentLoaded', function () {
    // Запуск обновления страницы
    updatePage();

    // привязка обработчиков событий
    buttonRoot.addEventListener("click", backRoot);
    buttonSort.addEventListener("click", setSort);  
    buttonStatistics.addEventListener("click", getStatistics);
});