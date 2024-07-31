import { currentRootElement, refreshTable } from "./refresh";

const buttonRoot = document.getElementById("button-root") as HTMLButtonElement;
const buttonSort = document.getElementById("button-sort") as HTMLButtonElement;

let sortFlag: string = "asc";
let root: string = "";

const ascSort: string = "asc";
const descSort: string = "desc";

// Возврат к предыдущему пути
const backRoot = () => {
    if (root === "/") {
        return;
    }

    const resultRoot: string = root.split('/').slice(0, -1).join('/');

    if (resultRoot === "") {
        root = "/";

        currentRootElement!.textContent = "/";
        refreshTable();
        return;
    }

    currentRootElement!.textContent = resultRoot;
    root = resultRoot;
    refreshTable();
}

// Изменение сортировки
const setSort = () => {
    if (sortFlag === descSort) {
        sortFlag = ascSort;
        buttonSort!.textContent = "по убыванию";
    } else if (sortFlag === ascSort) {
        sortFlag = descSort;
        buttonSort!.textContent = "по возрастанию";
    }

    refreshTable();
}

// Для изменения значение root
const setRoot = (newRoot: string) => {
    root = newRoot;
}

export {backRoot, setSort, buttonRoot, buttonSort, root, sortFlag, setRoot};