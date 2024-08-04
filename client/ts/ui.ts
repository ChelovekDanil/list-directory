import { buttonRoot, buttonSort, buttonStatistics } from "./buttons";

let refreshing: boolean = false;

// Замораживает кнопки и выводит loader
const freeze = (isBlock: boolean) => {
    // разблокировка
    if (!isBlock) {
        document.getElementById("loader")!.remove();
        
        buttonRoot.disabled = false;
        buttonSort.disabled = false;
        buttonStatistics.disabled = false;
        
        refreshing = false;
        return;
    }
    
    // блокировка
    refreshing = true;

    buttonRoot.disabled = true;
    buttonSort.disabled = true;
    buttonStatistics.disabled = true;

    const rootBlock = document.getElementById("root") as HTMLDivElement;
    const currentRoot = document.getElementById("current-root") as HTMLParagraphElement;
    const loader: HTMLDivElement = document.createElement("div");

    loader.id = "loader";
    rootBlock!.insertBefore(loader, currentRoot);
}

export {freeze, refreshing};