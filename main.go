package main

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"sync"

	"github.com/joho/godotenv"
)

// fileInfoResponse - представляет собой структу ответа
type fileInfoResponse struct {
	Type string `json:"type"`
	Name string `json:"name"`
	Size string `json:"size"`
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

	err = godotenv.Load(fmt.Sprintf("%s/%s", currentDir, ".ENV"))
	if err != nil {
		log.Fatalf("ошибка при загрузке .env файла: %s", err)
	}

	port := os.Getenv("SERVER_PORT")

	fmt.Println("сервер стартовал на порту 8080")
	err = http.ListenAndServe(port, nil)
	if err != nil {
		log.Fatalf("ошибка при запуске сервера: %s", err)
	}
}

// fsHandler - функция, которая будет обрабатывать url /fs
func fsHandler(w http.ResponseWriter, r *http.Request) {
	queryValues := r.URL.Query()
	pathRoot := queryValues.Get("root")
	sortFlag := queryValues.Get("sort")

	resultFileInfo, err := getResultFileInfo(pathRoot, sortFlag)
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

// getResultFileInfo - возвращает готовый срез структур
func getResultFileInfo(pathRoot string, sortFlag string) ([]fileInfoResponse, error) {
	err := checkArguments(&pathRoot, &sortFlag)
	if err != nil {
		return nil, fmt.Errorf("ошибка при чтении агрументов: %s", err)
	}

	fileInfoSlice, err := getFileInfoSlice(pathRoot)
	if err != nil {
		fmt.Println(err)
		return nil, fmt.Errorf("ошибка при считывании файлов из деректории: %s", err)
	}

	sortFileInfo(fileInfoSlice, sortFlag)
	fileInfoResponseSlice := convertToFileInfoResponse(fileInfoSlice)

	return fileInfoResponseSlice, nil
}

// checkArguments - проверяет коректность введенных аргументов запроса
func checkArguments(pathRoot *string, sortFlag *string) error {
	defaultSortFlag := "asc"

	if *pathRoot == "" {
		currentDir, err := os.Getwd()
		if err != nil {
			return fmt.Errorf("ошибка при чтении корневого каталога: %s", err)
		}
		*pathRoot = currentDir
	}

	if *sortFlag == "" {
		*sortFlag = defaultSortFlag
		return nil
	}

	if *sortFlag != "asc" && *sortFlag != "desc" {
		return fmt.Errorf("неверно указаны агрументы")
	}

	return nil
}

// getFileInfoSlice - возвращает срез типа fileInfo из определенной директории
func getFileInfoSlice(pathRootDir string) ([]fileInfo, error) {
	rootDir, err := os.Open(pathRootDir)
	if err != nil {
		return nil, fmt.Errorf("ошибка при открытии деректории: %s", err)
	}
	defer rootDir.Close()

	filesInRootDir, err := rootDir.ReadDir(-1)
	if err != nil {
		return nil, fmt.Errorf("ошибка при чтении файлов в деректории: %s", err)
	}

	fileInfoSlice := make([]fileInfo, len(filesInRootDir))
	var wg sync.WaitGroup

	// заполнения среза fileInfoSlice информацией о файла в директории
	for index, file := range filesInRootDir {
		wg.Add(1)

		go func(index int, file fs.DirEntry, wg *sync.WaitGroup) {
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

			fileInfoSlice[index] = flInfo
		}(index, file, &wg)

		wg.Wait()
	}

	return fileInfoSlice, nil
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
		fileSize, err = getSizeFilesRecursion(fmt.Sprintf("%s/%s", pathRootDir, file.Name()))

		if err != nil {
			return fileInfo{}, fmt.Errorf("ошибка при чтении файла: %s", err)
		}
	}

	fileInfoRes := fileInfo{Type: fileType, Name: fileName, Size: fileSize}
	return fileInfoRes, nil
}

// getSizeFilesRecursion - возвращяет размер каталога проходя по нему рекурсивно
func getSizeFilesRecursion(pathDir string) (int64, error) {
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

// sortFileInfo - сортирует срез типа fileInfo
func sortFileInfo(fileInfoSlice []fileInfo, sortFlag string) {
	sort.Slice(fileInfoSlice, func(i, j int) bool {
		if sortFlag == "desc" {
			return fileInfoSlice[i].Size > fileInfoSlice[j].Size
		}
		return fileInfoSlice[i].Size < fileInfoSlice[j].Size
	})
}

func convertToFileInfoResponse(fileInfoSlice []fileInfo) []fileInfoResponse {
	fileInfoResponseSlice := make([]fileInfoResponse, len(fileInfoSlice))

	for index, fl := range fileInfoSlice {
		fileType := fl.Type
		fileName := fl.Name
		fileSize := convertToOptimalSize(fl.Size)

		fileInfoResponseTmp := fileInfoResponse{Type: fileType, Name: fileName, Size: fileSize}

		fileInfoResponseSlice[index] = fileInfoResponseTmp
	}

	return fileInfoResponseSlice
}

// convertToOptimalUnit - возврает преобразованные байты в оптимальные единицы измерения
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
