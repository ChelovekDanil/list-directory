package server

import (
	"context"
	"encoding/json"
	"fmt"
	"list-directory/httpserver/config"
	"list-directory/httpserver/fileSystem"
	"list-directory/httpserver/statistics"
	"log"
	"net/http"
	"net/url"
	"time"
)

// fsResponse - структура ответа на запрос к fs
type fsResponse struct {
	ErrorCode    int                   `json:"error_code"`    // 1 если есть ошибки, 0 если ошибок нет
	ErrorMessage string                `json:"error_message"` // сообщение ошибки
	Data         []fileSystem.FileInfo `json:"data"`          // информация о файлах
	Root         string                `json:"root"`          // корневая директория
}

const (
	ascFlag           = "asc"
	descFlag          = "desc"
	serverPortEnv     = "SERVER_PORT"
	rootEnv           = "ROOT"
	startPath         = "/"
	timeCancelContext = 5
)

// Start - запускает сервер
func Start(ctx context.Context) error {
	serverMux := http.NewServeMux()
	serverMux.Handle("/fs", http.HandlerFunc(fsHandler))
	serverMux.Handle("/", http.FileServer(http.Dir("./client/dist")))

	port, err := config.GetEnvValue(serverPortEnv)
	if err != nil {
		return fmt.Errorf("ошибка при чтении env: %s", err)
	}

	server := &http.Server{
		Addr:    port,
		Handler: serverMux,
	}

	go func() {
		err = server.ListenAndServe()
		if err != nil && err != http.ErrServerClosed {
			log.Fatalf("ошибка при запуске сервера: %+s\n", err)
		}
	}()

	log.Printf("сервер запущен на порте: %s", port)

	<-ctx.Done()

	log.Printf("сервер остановлен")

	ctxShutDown, cancel := context.WithTimeout(context.Background(), timeCancelContext*time.Second)
	defer func() {
		cancel()
	}()

	err = server.Shutdown(ctxShutDown)
	if err != nil {
		log.Fatalf("ошибка при завершении работы сервера: %+s", err)
	}

	log.Printf("сервер завершился коректно")

	return nil
}

// fsHandler - возвращает информацию о файлах в виде json
func fsHandler(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()

	queryValues := r.URL.Query()

	root, err := config.GetEnvValue(rootEnv)
	if err != nil {
		response := createBadResponse(err.Error(), root, &w)
		json.NewEncoder(w).Encode(response)
		return
	}

	pathRoot, sortFlag, err := readArgumentsInQuary(queryValues)
	if err != nil {
		response := createBadResponse(err.Error(), startPath, &w)
		json.NewEncoder(w).Encode(response)
		return
	}

	filesInfo, err := fileSystem.GetFilesInfo(pathRoot, sortFlag)
	if err != nil {
		response := createBadResponse(err.Error(), root, &w)
		json.NewEncoder(w).Encode(response)
		return
	}

	finishTime := fmt.Sprintf("%.5f", time.Since(startTime).Seconds())

	err = statistics.SaveStatistics(finishTime, pathRoot, filesInfo)
	if err != nil {
		response := createBadResponse(err.Error(), root, &w)
		json.NewEncoder(w).Encode(response)
		return
	}

	response := createGoodResponse(filesInfo, root, &w)
	json.NewEncoder(w).Encode(response)
}

// readArgumentsInQuary - проверяет коректность введенных аргументов запроса
func readArgumentsInQuary(queryValues url.Values) (string, string, error) {
	pathRoot := queryValues.Get("root")
	sortFlag := queryValues.Get("sort")

	if pathRoot == "" {
		currentRoot, err := config.GetEnvValue(rootEnv)
		if err != nil {
			return "", "", fmt.Errorf("ошибка при чтении конфига файла, %s", err)
		}

		pathRoot = currentRoot
	}

	if sortFlag == "" {
		sortFlag = ascFlag
	}

	if sortFlag != ascFlag && sortFlag != descFlag {
		return "", "", fmt.Errorf("неверно указан аргумент sort должен принимать asc или desc")
	}

	return pathRoot, sortFlag, nil
}

// createBadResponse - создает ответ с ошибкой
func createBadResponse(errorMessage string, root string, w *http.ResponseWriter) fsResponse {
	(*w).Header().Set("Content-Type", "text/plain; charset=utf-8")
	(*w).WriteHeader(http.StatusBadRequest)

	return fsResponse{ErrorCode: 1, ErrorMessage: errorMessage, Data: []fileSystem.FileInfo{}, Root: root}
}

// createGoodResponse - создает хороший ответ
func createGoodResponse(data []fileSystem.FileInfo, root string, w *http.ResponseWriter) fsResponse {
	(*w).Header().Set("Content-Type", "application/json")
	(*w).WriteHeader(http.StatusOK)

	return fsResponse{ErrorCode: 0, ErrorMessage: "", Data: data, Root: root}
}
