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

insertInDb($data);

// Записывает данные в БД
function insertInDb($data) {
    $path = $data["path"];
    $size = $data["size"];
    $loadTime = $data["load_time"];
    $requestTime = $data["request_time"];

    $conn = connectToDb();

    $sql_query = $conn->prepare("INSERT INTO statistics (path, size, load_time, request_time) VALUES (?, ?, ?, ?)");
    if ($sql_query === false) {
        http_response_code(500);
        echo "Ошибка подготовки запроса: " . $conn->error;
        $conn->close();
        exit();
    }

    $sql_query->bind_param("siss", $path, $size, $loadTime, $requestTime);
    if (!$sql_query->execute()) {
        http_response_code(500);
        echo "Ошибка выполнения запроса: " . $sql_query->error;
    }

    $sql_query->close();
    $conn->close();
}
?>
