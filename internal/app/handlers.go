package app

import (
	"html/template"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (s *Server) handleGetHome(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	log.Println(ps)
	data := map[string]string{"name": "trung", "age": "30"}
	tmpl := template.Must(template.ParseFiles("templates/pages/home/home.html", "templates/pages/index/index.html"))
	tmpl.Execute(w, data)
}

func (s *Server) handler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	log.Println(ps)
	tmpl := template.Must(template.ParseFiles("templates/pages/home/home.html", "templates/pages/index/index.html"))
	tmpl.Execute(w, nil)
}
