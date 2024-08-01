import { root, setRoot, sortFlag } from "./buttons.js";

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
            setRoot(data.root);
        }
        result = data.data;
        console.log(urlRequest);
    });

    return result;
}

export {getFilesInfo};