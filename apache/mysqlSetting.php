<?php
// Подключается к бд и возвращает соединение с ней
function connectToDb() {
    $host = 'localhost';
    $user = 'root';
    $password_db = '1234567890';
    $name_db = 'user_statistics';

    $conn = new mysqli($host, $user, $password_db, $name_db);
    if ($conn->connect_error) {
        exit("Ошибка при подключении к базе данных: " . $conn->connect_error);
    }

    return $conn;
}
?>