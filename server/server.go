package server

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	filesystem "list-directory/fileSystem"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

const (
	defaultSortFlag = "asc"
)

// Start - запускает сервер
func Start(ctx context.Context) error {
	serverMux := http.NewServeMux()
	serverMux.Handle("/fs", http.HandlerFunc(fsHandler))

	currentDir, err := os.Getwd()
	if err != nil {
		return fmt.Errorf("ошибка при чтении текущей деректории: %s", err)
	}

	port, err := getEnvValue(currentDir+"/config/.env", "SERVER_PORT")
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

	if err == http.ErrServerClosed {
		return nil
	}

	return nil
}

// getEnvValue возвращает значение по ключу из .env файла
func getEnvValue(envFilePath, key string) (string, error) {
	file, err := os.Open(envFilePath)
	if err != nil {
		return "", fmt.Errorf("ошибка открытия файла: %w", err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 && strings.TrimSpace(parts[0]) == key {
			return strings.TrimSpace(parts[1]), nil
		}
	}

	if err := scanner.Err(); err != nil {
		return "", fmt.Errorf("ошибка сканирования файла: %w", err)
	}

	return "", fmt.Errorf("ключ '%s' не найден в файле '%s'", key, envFilePath)
}

// fsHandler - функция, которая будет обрабатывать url путь /fs
func fsHandler(w http.ResponseWriter, r *http.Request) {
	queryValues := r.URL.Query()

	pathRoot, sortFlag, err := checkArgumentsInQuary(queryValues)
	if err != nil {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "%s", err)
		return
	}

	resultFileInfo, err := filesystem.GetFilesInfo(pathRoot, sortFlag)
	if err != nil {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "%s", err)
		return
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(resultFileInfo)
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
