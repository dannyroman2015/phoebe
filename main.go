package main

import (
	"dannyroman2015/phoebe/internal/app"
	"log"
	"os"
)

func main() {
	pgdb, err := app.OpenPgDB(`postgresql://postgres:kbEviyUjJecPLMxXRNweNyvIobFzCZAQ@monorail.proxy.rlwy.net:27572/railway`)
	if err != nil {
		log.Println("Failed to connect postgres database")
	}
	defer pgdb.Close()

	port := os.Getenv("PORT")
	if port == "" {
		port = ":3000"
	} else {
		port = ":" + port
	}

	server := app.NewServer(port, pgdb)
	server.Start()
}
