package config

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

// GetEnvValue возвращает значение по ключу из .env файла
func GetEnvValue(key string) (string, error) {
	envFilePath, err := os.Getwd()
	if err != nil {
		return "", fmt.Errorf("ошибка при чтении текущей деректории: %s", err)
	}

	envFilePath += "/config/.env"

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
