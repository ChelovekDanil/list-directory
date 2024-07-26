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
	Size int64  // Размер файла с байтах
}

func main() {
	start := time.Now()

	rootFlagPtr, sortFlagPtr, err := addFlag()
	if err != nil {
		fmt.Println(err)
		return
	}

	filesInfo, err := getFilesInfo(rootFlagPtr)
	if err != nil {
		fmt.Println(err)
		return
	}

	sortFilesInfo(filesInfo, sortFlagPtr)
	printFilesInfo(filesInfo)

	timeFinish := time.Since(start)
	fmt.Printf("\nВремя завершение программы: %s\n", fmt.Sprintf("%d.%dms", timeFinish.Milliseconds(), timeFinish.Microseconds()/10000))
}

// addFlag - добавляет флаги
func addFlag() (string, string, error) {
	const defaultSortFlag = "asc"

	rootFlagPtr := flag.String("root", "", "путь к каталогу с файлами")
	sortFlagPtr := flag.String("sort", "", "сортировка (desc, asc)")

	flag.Parse()

	if *rootFlagPtr == "" || *sortFlagPtr == "" {
		flag.PrintDefaults()
	}

	if *rootFlagPtr == "" {
		currentDir, err := os.Getwd()
		if err != nil {
			return "", "", fmt.Errorf("ошибка при чтении корневого каталога: %s", err)
		}
		rootFlagPtr = &currentDir
		fmt.Printf("Должен быть установлен флаг --root, который отвечает за путь к каталогу\n.Значение по умолчанию: %s\n\n", currentDir)
	}

	if *sortFlagPtr == "" {
		*sortFlagPtr = defaultSortFlag
		fmt.Printf("Должен быть установлен флаг --sort, который отвечает за сортировка (asc, desc)\n.Значение по умолчанию asc\n\n")
	}

	if *sortFlagPtr != "asc" && *sortFlagPtr != "desc" {
		flag.PrintDefaults()
		return "", "", fmt.Errorf("неверно заданы флаги")
	}

	return *rootFlagPtr, *sortFlagPtr, nil
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

	// заполнения среза filesInfo информацией о файла в директории
	for index, file := range filesInRootDir {
		wg.Add(1)

		go func(index int, file fs.DirEntry, pathRootDir string, wg *sync.WaitGroup) {
			defer wg.Done()

			flInfo, err := getFileInfo(pathRootDir, file)
			if err != nil {
				fmt.Println(err)

				fileType := "Файл"
				fileName := file.Name()
				fileSize := 4096

				if file.IsDir() {
					fileType = "Дир"
				}

				flInfo = fileInfo{Type: fileType, Name: fileName, Size: int64(fileSize)}
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

// sortFilesInfo - сортирует срез типа fileInfo
func sortFilesInfo(filesInfo []fileInfo, sortFlag string) {
	sort.Slice(filesInfo, func(i, j int) bool {
		if sortFlag == "desc" {
			return filesInfo[i].Size > filesInfo[j].Size
		}
		return filesInfo[i].Size < filesInfo[j].Size
	})
}

// printFilesInfo - выводит информацию из среза типа fileInfo
func printFilesInfo(filesInfo []fileInfo) {
	biggestName := getLengthLargestNameInFilesInfo(filesInfo)

	fmt.Printf("%-6s %-*s %s\n", "Тип", biggestName+2, "Имя", "Размер")
	for _, fileInfo := range filesInfo {
		if fileInfo.Name == "" || fileInfo.Size == 0 || fileInfo.Type == "" {
			continue
		}
		size := convertToOptimalSize(fileInfo.Size)
		fmt.Printf("%-6s %-*s %s\n", fileInfo.Type, biggestName+2, fileInfo.Name, size)
	}
}

// getLengthLargestNameInFilesInfo - возвращает размер самого большого имени в срезе типа fileInfo
func getLengthLargestNameInFilesInfo(filesInfo []fileInfo) int {
	biggestName := 0

	for _, fileInfo := range filesInfo {
		if len(fileInfo.Name) > biggestName {
			biggestName = len(fileInfo.Name)
		}
	}

	return biggestName
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
