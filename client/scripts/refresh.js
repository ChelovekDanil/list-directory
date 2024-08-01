import { backRoot, root, setRoot } from "./buttons.js";
import { getFilesInfo } from "./fileInfo.js";
import { freeze, refreshing } from "./ui.js";

const currentRootElement = document.getElementById("current-root");
const table = document.getElementById("table");

// Обновление таблицы
const refreshTable = async () => {
    freeze(true);

    const filesInfo = await getFilesInfo();
    if (filesInfo.error_code === 1) {
        freeze(false);
        backRoot();
        return;
    }

    const tableBody = table.querySelector("tbody");

    tableBody.remove();

    const newTableBody = document.createElement("tbody");
    filesInfo.data.forEach(fileInfo => {
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

export {refreshTable, currentRootElement};