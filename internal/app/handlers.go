package app

import (
	"html/template"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (s *Server) handleGetHome(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	data := map[string]string{"name": "trung", "age": "30"}
	tmpl := template.Must(template.ParseFiles("templates/pages/home/home.html", "templates/pages/index/index.html"))
	tmpl.Execute(w, data)
}

func (s *Server) handler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	tmpl := template.Must(template.ParseFiles("templates/pages/home/home.html", "templates/pages/index/index.html"))
	tmpl.Execute(w, nil)
}

func (s *Server) handleGetSend(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	tmpl := template.Must(template.ParseFiles("templates/pages/home/footer.html"))
	tmpl.Execute(w, nil)
}

func (s *Server) handleGetTest(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/home/test.html")).Execute(w, nil)
}
