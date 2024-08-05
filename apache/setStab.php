<?php
include "mysqlSetting.php";

ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo "Ожидается POST запрос";
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo "Ошибка декодирования JSON: " . json_last_error_msg();
    exit();
}

try {
    insertInDb($data);
    http_response_code(201);
} catch (Exception $e) {
    http_response_code(500);
    echo "Ошибка при записи в базу данных: " . $e->getMessage();
    exit();
}

// Записывает данные в БД
function insertInDb($data) {
    $path = $data["path"];
    $size = $data["size"];
    $loadTime = $data["load_time"];
    $requestTime = $data["request_time"];

    if (!(isset($path) && isset($size) && isset($loadTime) && isset($requestTime))) {
        http_response_code(400);
        echo "Не все данные были отпралены";
        exit();
    }

    $conn = connectToDb();

    try {
        $sql_query = $conn->prepare("INSERT INTO statistics (path, size, load_time, request_time) VALUES (?, ?, ?, ?)");
        if ($sql_query === false) {
            throw new Exception("Ошибка подготовки запроса: " . $conn->error);
        }

        $sql_query->bind_param("siss", $path, $size, $loadTime, $requestTime);
        if (!$sql_query->execute()) {
            throw new Exception("Ошибка выполнения запроса: " . $sql_query->error);
        }
    } catch (Exception $e) {
        throw $e;
    } finally {
        $sql_query->close();
        $conn->close();
    }
}
?>