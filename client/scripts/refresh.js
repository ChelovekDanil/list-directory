import { root, setRoot } from "./buttons.js";
import { getFilesInfo } from "./fileInfo.js";
import { freeze } from "./ui.js";

const currentRootElement = document.getElementById("current-root");
const table = document.getElementById("table");

let refreshing = false;

// Обновление таблицы
const refreshTable = async () => {
    freeze(true);

    const filesInfo = await getFilesInfo();
    const tableBody = table.querySelector("tbody");

    tableBody.remove();

    const newTableBody = document.createElement("tbody");
    filesInfo.forEach(fileInfo => {
        newTableBody.appendChild(createLine(fileInfo));
    });

    table.appendChild(newTableBody);

    freeze(false);
}

// Создание строки таблицы
const createLine = (fileInfo) => {
    const line = document.createElement("tr");

    if (fileInfo.type === "Дир") {
        line.classList.add("directory");
        line.addEventListener('click', () => {
            if (refreshing) {
                return;
            }

            setRoot(`${root}/${fileInfo.name}`);
            currentRootElement.textContent = root;
            refreshTable();
        });
    } else {
        line.classList.add("file");
    }

    const columnType = document.createElement("th");
    const columnName = document.createElement("th");
    const columnSize = document.createElement("th");

    columnType.innerText = fileInfo.type;
    columnName.innerText = fileInfo.name;
    columnSize.innerText = fileInfo.size_in_unit;

    line.appendChild(columnType);
    line.appendChild(columnName);
    line.appendChild(columnSize);

    return line;
}

const setRefreshing = (newRefreshing) => {
    refreshing = newRefreshing;
}

export {refreshTable, refreshing, setRefreshing, currentRootElement};