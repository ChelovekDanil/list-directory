package statistics

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"list-directory/httpserver/config"
	"list-directory/httpserver/fileSystem"
	"log"
	"net/http"
	"time"
)

const (
	urlApacheServer      = "APACHE_URL"
	urlSetStab           = "setStab.php"
	defaultSizeDirectory = int64(4096)
)

// statisticsRequest - представляет собой структуру запроса на apache
type statisticsRequest struct {
	Path        string  `json:"path"`         // путь к директории
	Size        int64   `json:"size"`         // размер директории в байтах
	LoadTime    float64 `json:"load_time"`    // время вополения запроса
	RequestTime string  `json:"request_time"` // дата и время когда был сделан запрос
}

// SaveStatistics - отправляет запрос на apache для сохранения статистики в базу данных
func SaveStatistics(loadTime float64, path string, filesInfo []fileSystem.FileInfo) error {
	sizeDir := defaultSizeDirectory
	for _, fileInfo := range filesInfo {
		sizeDir += fileInfo.SizeInBytes
	}

	request := statisticsRequest{
		Path:        path,
		Size:        sizeDir,
		LoadTime:    loadTime,
		RequestTime: time.Now().Format("2006-01-02 15:04:05"),
	}

	url, err := config.GetEnvValue(urlApacheServer)
	if err != nil {
		return fmt.Errorf("ошибка при чтении адреса apache из .env файла")
	}

	jsonData, err := json.Marshal(request)
	if err != nil {
		return fmt.Errorf("ошибка при преобразовании ответа в json: %s", err)
	}

	resp, err := http.Post(url+urlSetStab, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("ошибка при отправке запроса на apache сервер: %s", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == 201 {
		return nil
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("ошибка при чтении ответа: %s", err)
	}

	log.Printf("ошибка на сервере php\nкод запроса: %d\nсообщение ошибки: %s", resp.StatusCode, string(body))

	return fmt.Errorf("ошибка на сервере php")
}
