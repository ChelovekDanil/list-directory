import { buttonRoot, buttonSort } from "./buttons";
import { setRefreshing } from "./refresh";

// Замараживает кнопки и выводит loader
const freeze = (isBlock: boolean) => {
    // разблокировка
    if (!isBlock) {
        document.getElementById("loader")!.remove();
        
        buttonRoot!.disabled = false;
        buttonSort!.disabled = false;
        
        setRefreshing(false);
        return;
    }
    
    // блокировка
    setRefreshing(true);

    buttonRoot.disabled = true;
    buttonSort.disabled = true;

    const rootBlock = document.getElementById("root") as HTMLDivElement;
    const currentRoot = document.getElementById("current-root") as HTMLParagraphElement;
    const loader: HTMLDivElement = document.createElement("div");

    loader.id = "loader";
    rootBlock!.insertBefore(loader, currentRoot);
}

export {freeze};