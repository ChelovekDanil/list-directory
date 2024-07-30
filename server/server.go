package server

import (
	"context"
	"encoding/json"
	"fmt"
	"list-directory/config"
	"list-directory/fileSystem"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"
)

// fsResponse - струкрута отвера на запрос к fs
type fsResponse struct {
	ErrorCode    int                   `json:"error_code"`    // 0 если есть ошибки, 1 если ошибок нет
	ErrorMessage string                `json:"error_message"` // сообщение ошибки
	Data         []fileSystem.FileInfo `json:"data"`          // информация о файлах
	Root         string                `json:"root"`          // корневая директория
}

const (
	defaultSortFlag = "asc"
	serverPortEnv   = "SERVER_PORT"
	rootEnv         = "ROOT"
)

// Start - запускает сервер
func Start(ctx context.Context) error {
	serverMux := http.NewServeMux()
	serverMux.Handle("/fs", http.HandlerFunc(fsHandler))
	serverMux.Handle("/", http.FileServer(http.Dir("client")))

	port, err := config.GetEnvValue("SERVER_PORT")
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

	ctxShutDown, cancel := context.WithTimeout(context.Background(), 5*time.Second)
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
	queryValues := r.URL.Query()

	root, err := config.GetEnvValue("ROOT")
	if err != nil {
		response := fsResponse{
			ErrorCode:    1,
			ErrorMessage: err.Error(),
			Data:         []fileSystem.FileInfo{},
			Root:         root,
		}

		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.WriteHeader(http.StatusBadRequest)

		json.NewEncoder(w).Encode(response)
		return
	}

	pathRoot, sortFlag, err := checkArgumentsInQuary(queryValues)
	if err != nil {
		response := fsResponse{
			ErrorCode:    1,
			ErrorMessage: err.Error(),
			Data:         []fileSystem.FileInfo{},
			Root:         root,
		}

		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.WriteHeader(http.StatusBadRequest)

		json.NewEncoder(w).Encode(response)
		return
	}

	filesInfo, err := fileSystem.GetFilesInfo(pathRoot, sortFlag)
	if err != nil {
		response := fsResponse{
			ErrorCode:    1,
			ErrorMessage: err.Error(),
			Data:         []fileSystem.FileInfo{},
			Root:         root,
		}

		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.WriteHeader(http.StatusBadRequest)

		json.NewEncoder(w).Encode(response)
		return
	}

	response := fsResponse{
		ErrorCode:    0,
		ErrorMessage: "",
		Data:         filesInfo,
		Root:         root,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(response)
}

// checkArgumentsInQuary - проверяет коректность введенных аргументов запроса
func checkArgumentsInQuary(queryValues url.Values) (string, string, error) {
	pathRoot := queryValues.Get("root")
	sortFlag := queryValues.Get("sort")

	if pathRoot == "" {
		currentDir, err := os.Getwd()
		if err != nil {
			return "", "", fmt.Errorf("ошибка при чтении корневого каталога: %s", err)
		}
		pathRoot = currentDir
	}

	if sortFlag == "" {
		sortFlag = defaultSortFlag
	}

	_, err := os.Open(pathRoot)
	if err != nil {
		return "", "", fmt.Errorf("директории: %s не сущестует: %s", pathRoot, err)
	}

	if sortFlag != "asc" && sortFlag != "desc" {
		return "", "", fmt.Errorf("неверно указан аргумент sort должен принимать asc или desc")
	}

	return pathRoot, sortFlag, nil
}
