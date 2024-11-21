package app

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"time"

	_ "github.com/lib/pq"
)

func (s *Server) writeJSON(w http.ResponseWriter, data interface{}, status int) error {
	js, err := json.Marshal(data)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(js)

	return nil
}

func (s *Server) readJSON(w http.ResponseWriter, r *http.Request, dst interface{}) error {
	r.Body = http.MaxBytesReader(w, r.Body, 1048576)

	dec := json.NewDecoder(r.Body)
	if err := dec.Decode(dst); err != nil {
		return err
	}
	if err := dec.Decode(&struct{}{}); err != io.EOF {
		return errors.New("body must only contain a single JSON value")
	}

	return nil
}

func OpenPgDB(conStr string) (*sql.DB, error) {
	db, err := sql.Open("postgres", conStr)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err = db.PingContext(ctx); err != nil {
		return nil, err
	}

	return db, nil
}

type GNHHAUTH struct {
	OnlyLeaves     bool
	Actions        []string
	Levels         []int
	InStartList    []string
	NotInStartList []string
}

var GNHHAUTHTABLE = map[string]GNHHAUTH{
	"trung-production admin": {
		OnlyLeaves:     false,
		Actions:        []string{"Hoàn thành", "Hoàn thành và Giao", "Hoàn thành cho toàn bộ MO", "Hoàn thành và Giao cho toàn bộ MO", "Làm được", "Giao được", "Xác nhận Nhận hàng", "Cảnh báo", "Tắt cảnh báo", "Phân công người làm", "Đặt lịch hoàn thành", "Cập nhật giá sản phẩm"},
		Levels:         []int{0, 1, 2, 3, 4, 5, 6, 7},
		InStartList:    []string{},
		NotInStartList: []string{},
	},
}
