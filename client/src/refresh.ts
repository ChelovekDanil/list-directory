import { backRoot, root, setRoot } from "./buttons";
import { FileInfo, getFilesInfo } from "./fileInfo";
import { freeze } from "./ui";

const currentRootElement = document.getElementById("current-root") as HTMLParagraphElement;
const table = document.getElementById("table") as HTMLTableElement;

let refreshing: boolean = false;

// Обновление таблицы
const refreshTable = async () => {
    freeze(true);

    const filesInfo: FileInfo[] = await getFilesInfo();
    if (filesInfo.length < 1) {
        freeze(false);
        backRoot();
        return;
    }

    const tableBody = table!.querySelector("tbody") as HTMLTableSectionElement;

    tableBody!.remove();

    const newTableBody = document.createElement("tbody") as HTMLTableSectionElement;
    filesInfo!.forEach(fileInfo => {
        newTableBody.appendChild(createLine(fileInfo));
      });

    table!.appendChild(newTableBody);

    freeze(false);
}

// Создание строки таблицы
const createLine = (fileInfo: FileInfo) => {
    const line = document.createElement("tr") as HTMLTableRowElement;

    if (fileInfo.type === "Дир") {
        line.classList.add("directory");
        line.addEventListener('click', () => {
            if (refreshing) {
                return;
            }

            setRoot(`${root}/${fileInfo.name}`);
            currentRootElement!.textContent = root;
            refreshTable();
        });
    } else {
        line.classList.add("file");
    }

    const columnType = document.createElement("th") as HTMLTableCellElement;
    const columnName = document.createElement("th") as HTMLTableCellElement;
    const columnSize = document.createElement("th") as HTMLTableCellElement;

    columnType.innerText = fileInfo.type;
    columnName.innerText = fileInfo.name;
    columnSize.innerText = fileInfo.size_in_unit;

    line.appendChild(columnType);
    line.appendChild(columnName);
    line.appendChild(columnSize);

    return line;
}

// Изменяет значение у refreshing
const setRefreshing = (newRefreshing: boolean) => {
    refreshing = newRefreshing;
}

export {refreshTable, refreshing, setRefreshing, currentRootElement};