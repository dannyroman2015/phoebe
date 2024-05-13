package app

import (
	"html/template"
	"log"
	"net/http"
	"time"

	"github.com/julienschmidt/httprouter"
)

// "/" - the default route
func (s *Server) index(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	sessionToken, err := r.Cookie("username")
	if err != nil {
		http.Redirect(w, r, "/login", http.StatusSeeOther)
	}
	// if sessionToken found, check token with database, get the right page for that user
	log.Println(sessionToken)
	template.Must(template.ParseFiles("templates/pages/index/index.html")).Execute(w, nil)
}

// "/login" - Get login page
func (s *Server) serveLogin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/login/login.html")).Execute(w, nil)
}

// "/login" - Post login page
func (s *Server) requestLogin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	log.Println("Post Login")
	log.Println(r.FormValue("username"))
	log.Println(r.FormValue("password"))

	http.SetCookie(w, &http.Cookie{
		Name:    "username",
		Value:   "trung",
		Expires: time.Now().Add(time.Minute),
		Path:    "/",
	})
	w.Write([]byte("POST Login success"))
}

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
