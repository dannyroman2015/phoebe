package app

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
)

type Server struct {
	Addr   string
	Logger *log.Logger
	pgdb   *sql.DB
	mgdb   *mongo.Database
}

func NewServer(addr string, mgdb *mongo.Database) *Server {
	logger := log.New(os.Stdout, "Logger: ", log.LstdFlags)

	return &Server{
		Addr:   addr,
		Logger: logger,
		mgdb:   mgdb,
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
