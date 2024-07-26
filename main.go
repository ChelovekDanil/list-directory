package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
)

// fileInfoResponse - представляет собой структу ответа
type fileInfoResponse struct {
	Type string `json:"type"` // Тип файла (файл или деректория)
	Name string `json:"name"` // Название файла
	Size string `json:"size"` // Размер файла
}

// fileInfo - представляет собой параметры файла
type fileInfo struct {
	Type string // Тип файла (файл или деректория)
	Name string // Название файла
	Size int64  // Размер файла
}

func main() {
	http.HandleFunc("/fs", fsHandler)

	currentDir, err := os.Getwd()
	if err != nil {
		log.Fatalf("ошибка при чтении текущей деректории: %s", err)
	}

	port, err := getEnvValue(currentDir+"/.env", "SERVER_PORT")
	if err != nil {
		log.Fatalf("ошибка при чтении env")
	}

	fmt.Println("port: ", port)

	fmt.Printf("сервер стартовал на порту: %s\n", port)
	err = http.ListenAndServe(port, nil)
	if err != nil {
		log.Fatalf("ошибка при запуске сервера: %s", err)
	}
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

	resultFileInfo, err := getFilesInfoResponse(pathRoot, sortFlag)
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
	const defaultSortFlag = "asc"

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

// getFilesInfoResponse - возвращает срез структур filesInfoResponse
func getFilesInfoResponse(pathRoot string, sortFlag string) ([]fileInfoResponse, error) {
	filesInfo, err := getFilesInfo(pathRoot)
	if err != nil {
		fmt.Println(err)
		return nil, fmt.Errorf("ошибка при считывании файлов из деректории: %s", err)
	}

	sortFilesInfo(filesInfo, sortFlag)
	fileInfoResponseSlice := convertToFilesInfoResponse(filesInfo)

	return fileInfoResponseSlice, nil
}

// getFilesInfo - возвращает срез типа fileInfo из определенной директории
func getFilesInfo(pathRootDir string) ([]fileInfo, error) {
	rootDir, err := os.Open(pathRootDir)
	if err != nil {
		return nil, fmt.Errorf("ошибка при открытии деректории: %s", err)
	}
	defer rootDir.Close()

	filesInRootDir, err := rootDir.ReadDir(-1)
	if err != nil {
		return nil, fmt.Errorf("ошибка при чтении файлов в деректории: %s", err)
	}

	filesInfo := make([]fileInfo, len(filesInRootDir))
	var wg sync.WaitGroup

	// заполнения среза fileInfoSlice информацией о файлах в директории
	for index, file := range filesInRootDir {
		wg.Add(1)

		go func(index int, file fs.DirEntry, pathRootDir string, wg *sync.WaitGroup) {
			defer wg.Done()

			flInfo, err := getFileInfo(pathRootDir, file)
			if err != nil {
				fmt.Println(err)

				fileType := "Файл"
				fileName := file.Name()
				fileSize := int64(4096)

				if file.IsDir() {
					fileType = "Дир"
				}

				flInfo = fileInfo{Type: fileType, Name: fileName, Size: fileSize}
			}

			filesInfo[index] = flInfo
		}(index, file, pathRootDir, &wg)

		wg.Wait()
	}

	return filesInfo, nil
}

// getFileInfo - возвращает информацию о файле
func getFileInfo(pathRootDir string, file os.DirEntry) (fileInfo, error) {
	fileDirInfo, err := file.Info()
	if err != nil {
		return fileInfo{}, fmt.Errorf("ошибка при чтении информации о файле: %s", err)
	}

	fileType := "Файл"
	fileName := fileDirInfo.Name()
	fileSize := fileDirInfo.Size()

	if fileDirInfo.IsDir() {
		fileType = "Дир"
		fileSize, err = getSizeDirectory(fmt.Sprintf("%s/%s", pathRootDir, file.Name()))

		if err != nil {
			return fileInfo{}, fmt.Errorf("ошибка при чтении файла: %s", err)
		}
	}

	fileInfoRes := fileInfo{Type: fileType, Name: fileName, Size: fileSize}
	return fileInfoRes, nil
}

// getSizeDirectory - возвращяет размер каталога проходя по нему рекурсивно
func getSizeDirectory(pathDir string) (int64, error) {
	var size int64

	err := filepath.Walk(pathDir, func(pathFile string, info os.FileInfo, err error) error {
		if err != nil {
			return fmt.Errorf("неудалось получить информацию о файле: %s", err)
		}

		size += info.Size()
		return nil
	})
	if err != nil {
		return 0, fmt.Errorf("не удалось пройтись по дериктории: %s", err)
	}

	return size, nil
}

// sortFilesInfo - сортирует срез типа fileInfo
func sortFilesInfo(filesInfo []fileInfo, sortFlag string) {
	sort.Slice(filesInfo, func(i, j int) bool {
		if sortFlag == "desc" {
			return filesInfo[i].Size > filesInfo[j].Size
		}
		return filesInfo[i].Size < filesInfo[j].Size
	})
}

// convertToFilesInfoResponse - конвертирует fileInfo в fileInfoResponse
func convertToFilesInfoResponse(filesInfo []fileInfo) []fileInfoResponse {
	filesInfoResponse := make([]fileInfoResponse, len(filesInfo))

	for index, fl := range filesInfo {
		fileType := fl.Type
		fileName := fl.Name
		fileSize := convertToOptimalSize(fl.Size)

		fileInfoResponseTmp := fileInfoResponse{Type: fileType, Name: fileName, Size: fileSize}

		filesInfoResponse[index] = fileInfoResponseTmp
	}

	return filesInfoResponse
}

// convertToOptimalSize - возврает преобразованные байты в оптимальные единицы измерения
func convertToOptimalSize(fileSize int64) string {
	const bytes = 1000
	const kiloByte = bytes
	const megaByte = bytes * kiloByte
	const gigaByte = bytes * megaByte
	const teraByte = bytes * gigaByte

	fileSizeFloat := float64(fileSize)

	if fileSize > teraByte {
		return fmt.Sprintf("%0.2f tb", fileSizeFloat/teraByte)
	}
	if fileSize > gigaByte {
		return fmt.Sprintf("%0.2f gb", fileSizeFloat/gigaByte)
	}
	if fileSize > megaByte {
		return fmt.Sprintf("%0.2f mb", fileSizeFloat/megaByte)
	}
	if fileSize > kiloByte {
		return fmt.Sprintf("%0.2f kb", fileSizeFloat/kiloByte)
	}

	return fmt.Sprintf("%d bytes", fileSize)
}
