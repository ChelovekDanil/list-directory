import { root, setRoot, sortFlag } from "./buttons";

// Класс представляет собой ответ на запрос к серверу /fs
class Response {
    error_code: number; // Обозначает статус ошибки (0 если нет ошибок, если есть 1)
    error_message: string; // Сообщение ошибки
    data: FileInfo[]; // Массив данный о файлай
    root: string; // путь по умолчанию

    constructor(Error_code: number, Error_message: string, Data: FileInfo[], Root: string) {
        this.error_code = Error_code;
        this.error_message = Error_message;
        this.data = Data;
        this.root = Root;
    }
}

// Класс представляет собой информацию о файле
class FileInfo {
    type: string; // Тип файла (файл или директрия)
    name: string; // Имя файла
    size_in_unit: string; // Размер в единицах измерения 
    size_in_bytes: number; // Размер в байтах

    constructor(Type: string, Name: string, Size_in_unit: string, Size_in_bytes: number) {
        this.type = Type;
        this.name = Name;
        this.size_in_unit = Size_in_unit;
        this.size_in_bytes = Size_in_bytes;
    }
}

const badErrorCode = 1;

// Получение информации о файлах
const getFilesInfo = async (): Promise<Response> => {
    console.log(root);
    
    const urlRequest: string = `fs?root=${root}&sort=${sortFlag}`;
    let result: Response = new Response(0, "", [], "");

    await fetch(urlRequest)
    .then((response) => {
        return response.json()
    })
    .then((data: Response) => {
        if (data.error_code === badErrorCode) {
            alert(data.error_message);
        }
        if (root === "") {
            setRoot(data.root);
        }
        result = data;
    });

    return result;
}

export {getFilesInfo, FileInfo};