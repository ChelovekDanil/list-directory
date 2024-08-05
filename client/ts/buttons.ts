import { currentRootElement, refreshTable } from "./refresh";

const buttonRoot = document.getElementById("button-root") as HTMLButtonElement;
const buttonSort = document.getElementById("button-sort") as HTMLButtonElement;
const buttonStatistics = document.getElementById("button-statistics") as HTMLButtonElement;

const ascSort: string = "asc";
const descSort: string = "desc";
const urlApacheServer = "http://localhost:80/getStab.php";

let sortFlag: string = "asc";
let root: string = "";

// Возврат к предыдущему пути
const backRoot = () => {
    if (root === "/") {
        refreshTable();
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

// Открывает страницу cо статистикой
const getStatistics = () => {
    window.location.href = urlApacheServer;
}

// Для изменения значение root
const setRoot = (newRoot: string) => {
    root = newRoot;
}

export {backRoot, setSort, getStatistics, buttonRoot, buttonSort, buttonStatistics, root, sortFlag, setRoot};