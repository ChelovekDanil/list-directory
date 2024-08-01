import { backRoot, root, setRoot } from "./buttons";
import { FileInfo, getFilesInfo } from "./fileInfo";
import { freeze, refreshing } from "./ui";

const currentRootElement = document.getElementById("current-root") as HTMLParagraphElement;
const table = document.getElementById("table") as HTMLTableElement;

// Обновление таблицы
const refreshTable = async () => {
    freeze(true);

    const filesInfo = await getFilesInfo();
    if (filesInfo.error_code === 1) {
        freeze(false);
        backRoot();
        return;
    }

    const tableBody = table!.querySelector("tbody") as HTMLTableSectionElement;

    tableBody!.remove();

    const newTableBody = document.createElement("tbody") as HTMLTableSectionElement;
    filesInfo!.data.forEach(fileInfo => {
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

export {refreshTable, currentRootElement};