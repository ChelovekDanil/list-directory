package main

import (
	"flag"
	"fmt"
	"io/fs"
	"os"
	"sort"
	"sync"
)

type fileInfo struct {
	Type string
	Name string
	Size int64
}

func main() {
	rootFlagPtr, sortFlagPtr, err := addFlag()
	if err != nil {
		fmt.Println(err)
		return
	}

	err = checkDirectory(*rootFlagPtr, *sortFlagPtr)
	if err != nil {
		fmt.Println(err)
		return
	}
}

// addFlag - добавляет флаги
func addFlag() (*string, *string, error) {
	defaultRootFlag := ""
	defaultSortFlag := "asc"

	rootFlagPtr := flag.String("root", "", "путь к каталогу с файлами")
	sortFlagPtr := flag.String("sort", "", "сортировка")

	flag.Parse()

	if *rootFlagPtr == "" {
		currentDir, err := os.Getwd()
		if err != nil {
			return nil, nil, fmt.Errorf("ошибка при чтении корневого каталога: %s", err)
		}
		defaultRootFlag = currentDir
		rootFlagPtr = &defaultRootFlag
		fmt.Printf("Должен быть установлен флаг --root, который отвечает за путь к каталогу\n.Значение по умолчанию: %s\n\n", currentDir)
	}

	if *sortFlagPtr == "" {
		sortFlagPtr = &defaultSortFlag
		fmt.Printf("Должен быть установлен флаг --sort, который отвечает за сортировка (asc, desc)\n.Значение по умолчанию asc\n\n")
	}

	return rootFlagPtr, sortFlagPtr, nil
}

// listDirectory - выводит список файлов
func checkDirectory(pathRootDir string, sort string) error {
	rootDir, err := os.Open(pathRootDir)
	if err != nil {
		return fmt.Errorf("ошибка при открытии деректории: %s", err)
	}
	defer rootDir.Close()

	filesInRootDir, err := rootDir.ReadDir(-1)
	if err != nil {
		return fmt.Errorf("ошибка при чтении файлов в деректории: %s", err)
	}

	fileInfoSlice := make([]fileInfo, len(filesInRootDir))
	var wg sync.WaitGroup

	for index, file := range filesInRootDir {
		wg.Add(1)
		go func(index int, file fs.DirEntry, fileInfoSlice []fileInfo, wg *sync.WaitGroup) {
			defer wg.Done()

			fileInfo, err := getFileInfo(file)
			if err != nil {
				fmt.Println(err)
				return
			}
			fileInfoSlice[index] = fileInfo
		}(index, file, fileInfoSlice, &wg)
	}
	wg.Wait()

	sortFileInfo(fileInfoSlice, sort)
	printFileInfo(fileInfoSlice)

	return nil
}

// getFileInfo - возвращает информацию о файле
func getFileInfo(file os.DirEntry) (fileInfo, error) {
	fileDirInfo, err := file.Info()
	if err != nil {
		return fileInfo{}, fmt.Errorf("ошибка при чтении информации о файле: %s", err)
	}

	fileType := "Файл"

	if fileDirInfo.IsDir() {
		fileType = "Дир"
	}

	fileInfoRes := fileInfo{Type: fileType, Name: fileDirInfo.Name(), Size: fileDirInfo.Size()}
	return fileInfoRes, nil
}

// printFileInfo - выводит информацию из среза типа fileInfo
func printFileInfo(fileInfoSlice []fileInfo) {
	biggestName := getBiggestNameInFileInfoSlice(fileInfoSlice)

	fmt.Printf("%-6s %-*s %s\n", "Тип", biggestName+2, "Имя", "Размер")
	for _, fileInfo := range fileInfoSlice {
		size, unit := convertToOptimalUnit(fileInfo.Size)
		fmt.Printf("%-6s %-*s %.02f %s\n", fileInfo.Type, biggestName+2, fileInfo.Name, size, unit)
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
func convertToOptimalUnit(fileSize int64) (float64, string) {
	resFileSize := float64(fileSize)
	units := []string{"Байт", "Килобайт", "Мегабайт", "Гигабайт", "Петабайт"}
	countUnit := 0

	for resFileSize >= 1000 {
		if resFileSize == 1000 {
			return 1, units[countUnit]
		}
		resFileSize /= 1000
		countUnit++
	}

	return resFileSize, units[countUnit]
}

// sortFileInfo - сортирует срез типа fileInfo
func sortFileInfo(fileInfoSlice []fileInfo, sortFlag string) {
	sort.Slice(fileInfoSlice, func(i, j int) bool {
		if sortFlag == "desc" {
			return fileInfoSlice[i].Size < fileInfoSlice[j].Size
		}
		return fileInfoSlice[i].Size > fileInfoSlice[j].Size
	})
}
