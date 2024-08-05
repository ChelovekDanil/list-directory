<?php
// Подключается к бд и возвращает соединение с ней
function connectToDb() {
    $host = 'localhost';
    $user = 'root';
    $password_db = '1234567890';
    $name_db = 'user_statistics';

    try {
        $conn = new mysqli($host, $user, $password_db, $name_db);
        if ($conn->connect_error) {
            throw new Exception("Ошибка при подключении к базе данных: " . $conn->connect_error);
        }
        return $conn;
    } catch (Exception $e) {
        throw new Exception("Ошибка подключения к базе данных: " . $e->getMessage());
        return null;
    }
}
?>