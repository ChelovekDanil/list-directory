import { root, setRoot, sortFlag } from "./buttons";

class Response {
    error_code: number;
    error_message: string;
    data: FileInfo[];
    root: string;

    constructor(Error_code: number, Error_message: string, Data: FileInfo[], Root: string) {
        this.error_code = Error_code;
        this.error_message = Error_message;
        this.data = Data;
        this.root = Root;
    }
}

class FileInfo {
    type: string;
    name: string;
    size_in_unit: string;
    size_in_bytes: number;

    constructor(Type: string, Name: string, Size_in_unit: string, Size_in_bytes: number) {
        this.type = Type;
        this.name = Name;
        this.size_in_unit = Size_in_unit;
        this.size_in_bytes = Size_in_bytes;
    }
}

// Получение информации о файлах
const getFilesInfo = async (): Promise<Response> => {
    const urlRequest: string = `fs?root=${root}&sort=${sortFlag}`;
    let result: Response = new Response(0, "", [], "");

    await fetch(urlRequest)
    .then((response) => {
        return response.json()
    })
    .then((data: Response) => {
        if (data.error_code === 1) {
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