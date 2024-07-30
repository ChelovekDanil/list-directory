let sortFlag = "asc";
let root = "";
let refreshing = false;

const currentRootElement = document.getElementById("current-root");
const buttonRoot = document.getElementById("button-root");
const buttonSort = document.getElementById("button-sort");
const table = document.getElementById("table");
const ascSort = "asc";
const descSort = "desc";


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

            root += `/${fileInfo.name}`;
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

// Получение информации о файлах
const getFilesInfo = async () => {
    const urlRequest = `fs?root=${root}&sort=${sortFlag}`;
    let result;

    await fetch(urlRequest)
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        if (data.error_code === 1) {
            alert(data.error_message);
        }
        if (root === "") {
            root = data.root;
        }
        result = data.data;
    });

    return result;
}

// Возврат к предыдущему пути
const backRoot = () => {
    if (root === "/") {
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

// Обновление страницы
const updatePage = async () => {
    await refreshTable();
    currentRootElement.textContent = root;
}

// Замараживает кнопки и выводит loader
const freeze = (isBlock) => {
    // разблокировка
    if (!isBlock) {
        document.getElementById("loader").remove();
        
        buttonRoot.disabled = false;
        buttonSort.disabled = false;
        
        refreshing = false;
        return;
    }
    
    // блокировка
    refreshing = true;

    buttonRoot.disabled = true;
    buttonSort.disabled = true;

    const rootBlock = document.getElementById("root");
    const currentRoot = document.getElementById("current-root");
    const loader = document.createElement("div");

    loader.id = "loader";
    rootBlock.insertBefore(loader, currentRoot);
}

// ждет когда страница полностью загрузится 
document.addEventListener('DOMContentLoaded', function () {
    // Запуск обновления страницы
    updatePage();

    // привязка обработчиков событий
    buttonRoot.addEventListener("click", backRoot);
    buttonSort.addEventListener("click", setSort);  
})