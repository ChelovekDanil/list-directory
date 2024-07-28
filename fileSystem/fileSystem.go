package filesystem

import (
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"sync"
)

// fileInfo - представляет собой параметры файла
type fileInfo struct {
	Type        string `json:"type"`          // Тип файла (файл или деректория)
	Name        string `json:"name"`          // Название файла
	SizeInUnit  string `json:"size-in-unit"`  // Размер файла в единице измерения
	SizeInBytes int64  `json:"size-in-bytes"` // Размер файла в байтах
}

const (
	bytes    = 1000
	kiloByte = bytes
	megaByte = bytes * kiloByte
	gigaByte = bytes * megaByte
	teraByte = bytes * gigaByte
)

// GetFilesInfo - возвращает срез типа fileInfo из определенной директории
func GetFilesInfo(pathRootDir string, sortFlag string) ([]fileInfo, error) {
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
				fileSizeInUnit := "4.10 kb"
				fileSizeInBytes := int64(4096)

				if file.IsDir() {
					fileType = "Дир"
				}

				flInfo = fileInfo{Type: fileType, Name: fileName, SizeInUnit: fileSizeInUnit, SizeInBytes: fileSizeInBytes}
			}

			filesInfo[index] = flInfo
		}(index, file, pathRootDir, &wg)

		wg.Wait()
	}

	sortFilesInfo(filesInfo, sortFlag)

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
	fileSizeInBytes := fileDirInfo.Size()

	if fileDirInfo.IsDir() {
		fileType = "Дир"
		fileSizeInBytes, err = getSizeDirectory(fmt.Sprintf("%s/%s", pathRootDir, file.Name()))

		if err != nil {
			return fileInfo{}, fmt.Errorf("ошибка при чтении файла: %s", err)
		}
	}
	fileSizeInUnit := convertToOptimalSize(fileSizeInBytes)

	fileInfoRes := fileInfo{Type: fileType, Name: fileName, SizeInUnit: fileSizeInUnit, SizeInBytes: fileSizeInBytes}
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
			return filesInfo[i].SizeInBytes > filesInfo[j].SizeInBytes
		}
		return filesInfo[i].SizeInBytes < filesInfo[j].SizeInBytes
	})
}

// convertToOptimalSize - возврает преобразованные байты в оптимальные единицы измерения
func convertToOptimalSize(fileSize int64) string {
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
