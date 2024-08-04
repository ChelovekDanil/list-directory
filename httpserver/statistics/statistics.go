package statistics

import (
	"bytes"
	"encoding/json"
	"fmt"
	"list-directory/httpserver/fileSystem"
	"net/http"
	"time"
)

const (
	urlApacheServer      = "http://localhost:80/setStab.php"
	defaultSizeDirectory = int64(4096)
)

// statisticsRequest - представляет собой структуру запроса на apache
type statisticsRequest struct {
	Path        string `json:"path"`         // путь к директории
	Size        int64  `json:"size"`         // размер директории в байтах
	LoadTime    string `json:"load_time"`    // время вополения запроса
	RequestTime string `json:"request_time"` // дата и время когда был сделан запрос
}

// SaveStatistics - отправляет запрос на apache для сохранения статистики в базу данных
func SaveStatistics(loadTime string, path string, filesInfo []fileSystem.FileInfo) error {
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

	jsonData, err := json.Marshal(request)
	if err != nil {
		return fmt.Errorf("ошибка при преобразовании ответа в json: %s", err)
	}

	resp, err := http.Post(urlApacheServer, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("ошибка при отпрвке запроса на apache сервер: %s", err)
	}
	defer resp.Body.Close()

	return nil
}
