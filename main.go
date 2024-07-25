package main

import (
	"flag"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"sync"
	"time"
)

// fileInfo - представляет собой параметры файла
type fileInfo struct {
	Type string // Тип файла (файл или деректория)
	Name string // Название файла
	Size int64  // Размер файла
}

func main() {
	start := time.Now()

	rootFlagPtr, sortFlagPtr, err := addFlag()
	if err != nil {
		fmt.Println(err)
		return
	}

	fileInfoSlice, err := getFileInfoSlice(*rootFlagPtr)
	if err != nil {
		fmt.Println(err)
		return
	}

	sortFileInfo(fileInfoSlice, *sortFlagPtr)
	printFileInfo(fileInfoSlice)

	timeFinish := time.Since(start)
	fmt.Printf("Время завершение программы: %s\n", fmt.Sprintf("%d.%dms", timeFinish.Milliseconds(), timeFinish.Microseconds()/10000))
}

// addFlag - добавляет флаги
func addFlag() (*string, *string, error) {
	defaultSortFlag := "asc"

	rootFlagPtr := flag.String("root", "", "путь к каталогу с файлами")
	sortFlagPtr := flag.String("sort", "", "сортировка")

	flag.Parse()

	if *rootFlagPtr == "" || *sortFlagPtr == "" {
		flag.PrintDefaults()
	}

	if *rootFlagPtr == "" {
		currentDir, err := os.Getwd()
		if err != nil {
			return nil, nil, fmt.Errorf("ошибка при чтении корневого каталога: %s", err)
		}
		rootFlagPtr = &currentDir
		fmt.Printf("Должен быть установлен флаг --root, который отвечает за путь к каталогу\n.Значение по умолчанию: %s\n\n", currentDir)
	}

	if *sortFlagPtr == "" {
		sortFlagPtr = &defaultSortFlag
		fmt.Printf("Должен быть установлен флаг --sort, который отвечает за сортировка (asc, desc)\n.Значение по умолчанию asc\n\n")
	}

	return rootFlagPtr, sortFlagPtr, nil
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
		go func(index int, file fs.DirEntry, pathRootDir string, fileInfoSlice []fileInfo, wg *sync.WaitGroup) {
			defer wg.Done()
			fileInfo, err := getFileInfo(pathRootDir, file)
			if err != nil {
				fmt.Println(err)
				return
			}
			fileInfoSlice[index] = fileInfo
		}(index, file, pathRootDir, fileInfoSlice, &wg)
	}
	wg.Wait()

	return fileInfoSlice, nil
}

// getFileInfo - возвращает информацию о файле
func getFileInfo(pathRootDir string, file os.DirEntry) (fileInfo, error) {
	fileDirInfo, err := file.Info()
	if err != nil {
		return fileInfo{}, fmt.Errorf("ошибка при чтении информации о файле: %s", err)
	}

	fileType := "Файл"
	fileSize := fileDirInfo.Size()
	fileName := fileDirInfo.Name()

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

// printFileInfo - выводит информацию из среза типа fileInfo
func printFileInfo(fileInfoSlice []fileInfo) {
	biggestName := getBiggestNameInFileInfoSlice(fileInfoSlice)

	fmt.Printf("%-6s %-*s %s\n", "Тип", biggestName+2, "Имя", "Размер")
	for _, fileInfo := range fileInfoSlice {
		if fileInfo.Name == "" || fileInfo.Size == 0 || fileInfo.Type == "" {
			continue
		}
		size := convertToOptimalSize(fileInfo.Size)
		fmt.Printf("%-6s %-*s %s\n", fileInfo.Type, biggestName+2, fileInfo.Name, size)
	}
}

// getBiggestNameInFileInfoSlice - возвращает размер самого большого имени в срезе типа fileInfo
func getBiggestNameInFileInfoSlice(fileInfoSlice []fileInfo) int {
	biggestName := 0

	for _, fileInfo := range fileInfoSlice {
		if len(fileInfo.Name) > biggestName {
			biggestName = len(fileInfo.Name)
		}
	}

	return biggestName
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

// sortFileInfo - сортирует срез типа fileInfo
func sortFileInfo(fileInfoSlice []fileInfo, sortFlag string) {
	sort.Slice(fileInfoSlice, func(i, j int) bool {
		if sortFlag == "desc" {
			return fileInfoSlice[i].Size > fileInfoSlice[j].Size
		}
		return fileInfoSlice[i].Size < fileInfoSlice[j].Size
	})
}
