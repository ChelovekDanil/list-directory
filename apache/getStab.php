<?php
include "mysqlSetting.php";

ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(400);
    echo "Ожидается GET запрос";
    exit();
}

$statistics = getStatistics();

$referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'localhost:8080';

echo '
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<title>Статистика</title>

<div class="header">
    <a href=' . $referer . '>Назад</a>
    <h1>Статистика</h1>
</div>
<table>
    <tr>
        <th>Путь</th>
        <th>Размер</th>
        <th>Время выполнения</th>
        <th>Дата запроса</th>
    </tr>
    '. createRowsForTable($statistics) .'    
</table>';

function goback() {
    header("Location: http://localhost:8080/");
    exit();
}

// Достает из базы данных информацию о запросах
function getStatistics() {
    $conn = connectToDb();
    
    $sql_query = "SELECT path, size, load_time, request_time FROM statistics";

    $result = $conn->query($sql_query);
    if (!$result) {
        die("Ошибка при выполнении запроса к БД: " . $conn->error);
    }

    $conn->close();
    
    return $result;
}

// Создает ряды в таблице
function createRowsForTable($statistics) {
    $rows = "";

    while ($row = $statistics->fetch_assoc()) {
        $rows .= sprintf(
            "<tr>
                <td class='paths'>%s</td>
                <td class='size'>%s</td>
                <td class='load_time'>%s сек</td>
                <td class='request_time'>%s</td>
            </tr>",
            $row['path'],
            convertBytesToUnit($row['size']),
            $row['load_time'],
            $row['request_time']
        );
    } 

    return $rows;
}

// Конвертирует байты в оптимальные единицы измерения
function convertBytesToUnit($bytes) {
    $kiloByte = 1000;
    $megaByte = $kiloByte * $kiloByte;
    $gigaByte = $kiloByte * $megaByte;
    $teraByte = $kiloByte * $gigaByte;

	if ($bytes > $teraByte) {
		return sprintf("%.2f tb", $bytes/$teraByte);
	}
	if ($bytes > $gigaByte) {
		return sprintf("%.2f gb", $bytes/$gigaByte);
	}
	if ($bytes > $megaByte) {
		return sprintf("%.2f mb", $bytes/$megaByte);
	}
	if ($bytes > $kiloByte) {
		return sprintf("%.2f kb", $bytes/$kiloByte);
	}

	return sprintf("%d bytes", $bytes);
}
?>