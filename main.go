package main

import (
	"context"
	"list-directory/httpserver/server"
	"log"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, syscall.SIGINT, syscall.SIGTSTP, syscall.SIGQUIT)

	ctx, cancel := context.WithCancel(context.Background())

	go func() {
		sysCall := <-signalChan
		log.Printf("вызван системный вызов: %+v", sysCall)
		cancel()
	}()

	if err := server.Start(ctx); err != nil {
		log.Printf("ошибка при запуске сервера:+%v\n", err)
	}
}
