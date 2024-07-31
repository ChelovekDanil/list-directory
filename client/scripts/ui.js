import { buttonRoot, buttonSort } from "./buttons.js";
import { setRefreshing } from "./refresh.js";

// Замараживает кнопки и выводит loader
const freeze = (isBlock) => {
    // разблокировка
    if (!isBlock) {
        document.getElementById("loader").remove();
        
        buttonRoot.disabled = false;
        buttonSort.disabled = false;
        
        setRefreshing(false);
        return;
    }
    
    // блокировка
    setRefreshing(true);

    buttonRoot.disabled = true;
    buttonSort.disabled = true;

    const rootBlock = document.getElementById("root");
    const currentRoot = document.getElementById("current-root");
    const loader = document.createElement("div");

    loader.id = "loader";
    rootBlock.insertBefore(loader, currentRoot);
}

export {freeze};