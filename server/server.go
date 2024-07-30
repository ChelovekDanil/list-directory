package server

import (
	"context"
	"encoding/json"
	"fmt"
	"list-directory/config"
	filesystem "list-directory/fileSystem"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"
)

type rootReponse struct {
	Root string `json:"root"`
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
	serverMux.Handle("/getRoot", http.HandlerFunc(getRootHandler))
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

// getRootHandler - возвращает root в виде json
func getRootHandler(w http.ResponseWriter, r *http.Request) {
	root, err := config.GetEnvValue(rootEnv)
	if err != nil {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "%s", err)
		return
	}

	response := rootReponse{Root: root}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// fsHandler - возвращает информацию о файлах в виде json
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

	w.Header().Set("Content-Type", "application/json")
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
