<?php
include "mysqlSetting.php";

ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(400);
    echo "Ожидается GET запрос";
    exit();
}

try {
    $statistics = getStatistics();
} catch (Exception $e) {
    echo "Ошибка при получении статистики: " . $e->getMessage();
    exit();
}

try {
    $json_statistics = getJsonStatistics($statistics);
} catch (Exception $e) {
    echo "Ошибка при сериализации статистики в json" . $e->getMessage();
    exit();
}

echo '
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<title>Статистика</title>

<div class="header">
    <button onClick=history.back()>Назад</button>
    <h1>Статистика</h1>
</div>
<div>
    <canvas id="myChart"></canvas>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    const data = ' . $json_statistics . ';
    const sizes = data.map(item => item.size);

    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: sizes,
            datasets: [{
                label: "Соотношение времени выполнения и размера директорий",
                data: data.map(item => ({ x: item.size, y: parseFloat(item.load_time) })),
                backgroundColor: "blue",
                borderColor: "white",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: "white",
                        font: {
                            size: 14
                        }
                    },
                    title: {
                        display: true,
                        text: "Размер файла",
                        color: "white",
                        font: {
                            size: 14 
                        }
                    },
                    grid: {
                        color: "rgb(100, 100, 100)"
                    }
                },
                y: {
                    type: "logarithmic",
                    ticks: {
                        color: "white",
                        font: {
                            size: 14
                        }
                    },
                    title: {
                        display: true,
                        text: "Время выполнения в секундах",
                        color: "white",
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        color: "rgb(100, 100, 100)"
                    }
                }
            }, 
            plugins: {
                legend: {
                    labels: {
                        color: "white",
                        font: {
                            size: 16 
                        }
                    }
                }
            }     
        }
    });
</script>
<table>
    <tr>
        <th>Путь</th>
        <th>Размер</th>
        <th>Время выполнения</th>
        <th>Дата запроса</th>
    </tr>
    '. createRowsForTable($statistics) .'    
</table>';

// Сортирует и сериализует данные в json
function getJsonStatistics($statistics) {
    usort($statistics, function($first, $last){
        return ($first['size'] - $last['size']);
    });

    $statistics = array_map(function($item) {
        $item['size'] = ConvertToOptimalSize($item['size']);
        return $item;
      }, $statistics);

    $json_statistics = json_encode($statistics);

    return $json_statistics;
}

// Достает из базы данных информацию о запросах
function getStatistics() {
    try {
        $conn = connectToDb();
    } catch(Exception $e) {
        throw new Exception("Error Processing Request" . $e->getMessage());
    }
    
    $sql_query = "SELECT path, size, load_time, request_time FROM statistics";

    $result_query = $conn->query($sql_query);
    if (!$result_query) {
        throw new Exception("Ошибка при выполнении запроса к БД: " . $conn->error);
    }

    $conn->close();

    $statistics = [];

    while($element = $result_query->fetch_assoc()) {
        array_push($statistics, $element);
    }
    
    return $statistics;
}

// Создает ряды в таблице
function createRowsForTable($statistics) {
    $rows = "";

    foreach($statistics as $row)    {
        $rows .= sprintf(
            "<tr>
                <td class='paths'>%s</td>
                <td class='size'>%s</td>
                <td class='load_time'>%0.5f сек</td>
                <td class='request_time'>%s</td>
            </tr>",
            $row['path'],
            ConvertToOptimalSize($row['size']),
            $row['load_time'],
            $row['request_time']
        );
    } 

    return $rows;
}

// Возврает преобразованные байты в оптимальные единицы измерения
function ConvertToOptimalSize($bytes) {
    $kiloByte = 1000;
	$megaByte = $kiloByte * $kiloByte;
	$gigaByte = $kiloByte * $megaByte;
	$teraByte = $kiloByte * $gigaByte;

    if ($bytes > $teraByte) {
		return sprintf("%0.2f tb", $bytes/$teraByte);
	}
	if ($bytes > $gigaByte) {
		return sprintf("%0.2f gb", $bytes/$gigaByte);
	}
	if ($bytes > $megaByte) {
		return sprintf("%0.2f mb", $bytes/$megaByte);
	}
	if ($bytes > $kiloByte) {
		return sprintf("%0.2f kb", $bytes/$kiloByte);
	}

	return sprintf("%d bytes", $bytes);
}
?>