package app

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"time"
)

type Server struct {
	Addr   string
	Logger *log.Logger
	db     *sql.DB
	models Models
}

func NewServer(addr string, db *sql.DB) *Server {
	logger := log.New(os.Stdout, "Logger: ", log.LstdFlags)

	return &Server{
		Addr:   addr,
		Logger: logger,
		db:     db,
	}
}

func (s *Server) Start() {
	log.Printf("Starting server on %s", s.Addr)

	srv := &http.Server{
		Addr:         s.Addr,
		Handler:      s.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  20 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	err := srv.ListenAndServe()
	log.Fatal(err)
}
