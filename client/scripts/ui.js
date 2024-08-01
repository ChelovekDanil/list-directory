import { buttonRoot, buttonSort } from "./buttons.js";

let refreshing = false;

// Замараживает кнопки и выводит loader
const freeze = (isBlock) => {
    // разблокировка
    if (!isBlock) {
        document.getElementById("loader").remove();
        
        buttonRoot.disabled = false;
        buttonSort.disabled = false;
        
        refreshing = false;
        return;
    }
    
    // блокировка
    refreshing = true;

    buttonRoot.disabled = true;
    buttonSort.disabled = true;

    const rootBlock = document.getElementById("root");
    const currentRoot = document.getElementById("current-root");
    const loader = document.createElement("div");

    loader.id = "loader";
    rootBlock.insertBefore(loader, currentRoot);
}

export {freeze, refreshing};