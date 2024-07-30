const serverUrl = "http://localhost:8080";

let sortFlag = "asc";
let root = "";

// refreshTable - обновляет таблицу
const refreshTable = async () => {
    const filesInfo = await getFilesInfo();
    
    const table = document.getElementsByTagName("table")[0];
    const tableBody = document.getElementsByTagName("tbody")[0];
    const newTableBody = document.createElement("tbody");

    if (tableBody !== undefined) {
        tableBody.remove()
    }

    filesInfo.forEach(fileInfo => {  
        newTableBody.appendChild(createLine(fileInfo));    
    });

    table.appendChild(newTableBody);
}

// createLine - создает строку для таблицы
const createLine = (fileInfo) => {
    const line = document.createElement("tr");

    if (fileInfo.type === "Дир") {
        line.classList.add("directory")
        line.addEventListener('click', () => {
            root += `/${fileInfo.name}`
            document.getElementById("current-root").textContent = root;
            refreshTable()
        })
    } else {
        line.classList.add("file")
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

    return line
}

// getFilesInfo - запращивает информацию о файлах
const getFilesInfo = async () => {
    const urlRequest = `${serverUrl}/fs?root=${root}&sort=${sortFlag}`;

    const response = await fetch(urlRequest);
    if (!response.ok) {
        console.error("ошибка при запросе");
        return
    }
    const filesInfo = await response.json();

    return filesInfo;
}

// backRoot() - обрезает root на одну директорию
const backRoot = () => {
        // обрезание последней директории
    const resultRoot =  root.split('/').slice(0, -1).join('/');

    if (resultRoot === "") {
        root = "/";
        document.getElementById("current-root").textContent = "/";
        refreshTable();
        return;
    }

    document.getElementById("current-root").textContent = resultRoot;
    root = resultRoot;
    refreshTable();
}

// setSort() - обновляет флаг сортировки 
const setSort = () => {
    if (sortFlag === "desc") {
        sortFlag = "asc";
        document.getElementById("button-sort").textContent = "asc";
    } else if (sortFlag === "asc") {
        sortFlag = "desc";
        document.getElementById("button-sort").textContent = "desc";
    }

    refreshTable()
}

// updatePage() - обновляет данные страницы
const updatePage = async () => {
    await getRoot();
    document.getElementById("current-root").textContent = root;
    getFilesInfo();
    refreshTable();
}

// getRoot() - устанавливает root по умолчанию
const getRoot = async () => {
    const rootResponse = await fetch(`${serverUrl}/getRoot`);
    if (rootResponse.ok) {
        const json = await rootResponse.json();
        root = json.root;
    }
}

document.getElementById("button-root").addEventListener("click", backRoot);
document.getElementById("button-sort").addEventListener("click", setSort);

updatePage();