import { currentRootElement, refreshTable } from "./refresh.js";

const buttonRoot = document.getElementById("button-root");
const buttonSort = document.getElementById("button-sort");

let sortFlag = "asc";
let root = "";

const ascSort = "asc";
const descSort = "desc";

// Возврат к предыдущему пути
const backRoot = () => {
    if (root === "/") {
        alert("Это конечная директория");
        return;
    }

    const resultRoot = root.split('/').slice(0, -1).join('/');

    if (resultRoot === "") {
        root = "/";
        currentRootElement.textContent = "/";
        refreshTable();
        return;
    }

    currentRootElement.textContent = resultRoot;
    root = resultRoot;
    refreshTable();
}

// Изменение сортировки
const setSort = () => {
    if (sortFlag === descSort) {
        sortFlag = ascSort;
        buttonSort.textContent = "по убыванию";
    } else if (sortFlag === ascSort) {
        sortFlag = descSort;
        buttonSort.textContent = "по возрастанию";
    }

    refreshTable();
}

// Для изменения значение root
const setRoot = (newRoot) => {
    root = newRoot;
}

export {backRoot, setSort, buttonRoot, buttonSort, root, sortFlag, setRoot};