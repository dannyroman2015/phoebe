package app

import (
	"context"
	"html/template"
	"net/http"
	"strings"
	"time"

	"github.com/julienschmidt/httprouter"
	"go.mongodb.org/mongo-driver/bson"
)

// ************** "/" - the default route *******************
func (s *Server) index(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	defaulturlToken, err := r.Cookie("defaulturl")
	if err != nil {
		http.Redirect(w, r, "/login", http.StatusSeeOther)
		return
	}
	if defaulturlToken.Value != "" {
		http.Redirect(w, r, defaulturlToken.Value, http.StatusSeeOther)
		return
	}

	usernameToken, err := r.Cookie("username") // check for username on cookie, not found, go to login page
	if err != nil {
		http.Redirect(w, r, "/login", http.StatusSeeOther)
		return
	}

	var user = User{} // if sessionToken found, check token with database, get the right page for that user
	if err = s.mgdb.Collection("user").FindOne(context.Background(), bson.M{"username": usernameToken.Value}).Decode(&user); err != nil {
		s.Logger.Println("Fail to decode defaulturl", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if user.Defaulturl == "" { // go to home page when default url is missing in database
		user.Defaulturl = "/home"
	}

	http.Redirect(w, r, user.Defaulturl, http.StatusSeeOther) // go to user's default page
}

// ************** "/home" - the home route *******************
func (s *Server) home(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/home/home.html")).Execute(w, nil)
}

// ************** "/login" - get login route *******************
func (s *Server) serveLogin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	data := map[string]string{
		"msg": "Login with your account. If you do not have account, click Register",
	}

	template.Must(template.ParseFiles("templates/pages/login/login.html")).Execute(w, data)
}

// ************** "/login" - post login request *******************
func (s *Server) requestLogin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	username := r.FormValue("username")
	password := r.FormValue("password")
	user := User{}

	if err := s.mgdb.Collection("user").FindOne(context.Background(), bson.M{"username": username}).Decode(&user); err != nil {
		data := map[string]string{
			"msg": "Username is incorrect, plaese check again. Do not have? click Register",
		}
		template.Must(template.ParseFiles("templates/pages/login/login.html")).Execute(w, data)
		return
	}

	if user.Password != password {
		data := map[string]string{
			"msg": "Password is incorrect, plaese check again. Forgot? Click Register",
		}
		template.Must(template.ParseFiles("templates/pages/login/login.html")).Execute(w, data)
		return
	}

	// when username and password are correct
	http.SetCookie(w, &http.Cookie{
		Name:    "username",
		Value:   user.Username,
		Expires: time.Now().Add(time.Minute),
		Path:    "/",
	})
	http.SetCookie(w, &http.Cookie{
		Name:    "defaulturl",
		Value:   user.Defaulturl,
		Expires: time.Now().Add(time.Minute),
		Path:    "/",
	})
	http.SetCookie(w, &http.Cookie{
		Name:    "permission",
		Value:   strings.Join(user.Permission, " "),
		Expires: time.Now().Add(time.Minute),
		Path:    "/",
	})
	http.Redirect(w, r, "/", http.StatusSeeOther)
}

// ************** "/login" - post login request *******************
func (s *Server) logout(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	data := map[string]string{
		"msg": "Logout successful! For more information, click Resgister and send a request to admin",
	}
	template.Must(template.ParseFiles("templates/pages/login/login.html")).Execute(w, data)
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
	template.Must(template.ParseFiles("templates/pages/test/test.html")).Execute(w, nil)
}
