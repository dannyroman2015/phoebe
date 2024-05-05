package main

import (
	"dannyroman2015/phoebe/internal/app"
	"os"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = ":3000"
	} else {
		port = ":" + port
	}

	server := app.NewServer(port)
	server.Start()
}
