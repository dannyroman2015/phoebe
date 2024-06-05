package app

import (
	"context"
	"html/template"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/julienschmidt/httprouter"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// /////////////////////////////////////////////////////////////////////
//
//	"/" - the default route
//
// /////////////////////////////////////////////////////////////////////
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

// /////////////////////////////////////////////////////////////////////
//
//	"/home" - the home route
//
// /////////////////////////////////////////////////////////////////////
func (s *Server) home(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/home/home.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// /////////////////////////////////////////////////////////////////////
//
//	"/login" - get login route
//
// /////////////////////////////////////////////////////////////////////
func (s *Server) serveLogin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	data := map[string]string{
		"msg": "Login with your account. If you do not have account, click Request",
	}

	template.Must(template.ParseFiles("templates/pages/login/login.html")).Execute(w, data)
}

// /////////////////////////////////////////////////////////////////////
//
//	"/login" - post login request
//
// /////////////////////////////////////////////////////////////////////
func (s *Server) requestLogin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	username := r.FormValue("username")
	password := r.FormValue("password")
	user := User{}

	if err := s.mgdb.Collection("user").FindOne(context.Background(), bson.M{"username": username}).Decode(&user); err != nil {
		log.Println(err)
		data := map[string]string{
			"msg": "Username is incorrect, plaese check again. Do not have? click Request",
		}
		template.Must(template.ParseFiles("templates/pages/login/login.html")).Execute(w, data)
		return
	}

	if user.Password != password {
		data := map[string]string{
			"msg": "Password is incorrect, plaese check again. Forgot? Click Request",
		}
		template.Must(template.ParseFiles("templates/pages/login/login.html")).Execute(w, data)
		return
	}

	// when username and password are correct
	http.SetCookie(w, &http.Cookie{
		Name:    "username",
		Value:   user.Username,
		Expires: time.Now().Add(2 * time.Hour),
		Path:    "/",
	})
	http.SetCookie(w, &http.Cookie{
		Name:    "defaulturl",
		Value:   user.Defaulturl,
		Expires: time.Now().Add(2 * time.Hour),
		Path:    "/",
	})
	http.SetCookie(w, &http.Cookie{
		Name:    "authurls",
		Value:   strings.Join(user.Authurls, " "),
		Expires: time.Now().Add(2 * time.Hour),
		Path:    "/",
	})
	http.Redirect(w, r, "/", http.StatusSeeOther)
}

// /////////////////////////////////////////////////////////////////////
//
//	"/login" - post logout request
//
// /////////////////////////////////////////////////////////////////////
func (s *Server) logout(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	http.SetCookie(w, &http.Cookie{
		Name:    "username",
		Value:   "",
		Expires: time.Now(),
		Path:    "/",
	})
	http.SetCookie(w, &http.Cookie{
		Name:    "defaulturl",
		Value:   "",
		Expires: time.Now(),
		Path:    "/",
	})
	http.SetCookie(w, &http.Cookie{
		Name:    "permission",
		Value:   "",
		Expires: time.Now(),
		Path:    "/",
	})

	data := map[string]string{
		"msg": "Logout successful! For more information, click Request and send a request to admin",
	}
	template.Must(template.ParseFiles("templates/pages/login/login.html")).Execute(w, data)
}

// /////////////////////////////////////////////////////////////////////
//
//	"/admin" - get admin page
//
// /////////////////////////////////////////////////////////////////////
func (s *Server) admin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("user").Find(context.Background(), bson.M{})
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cur.Close(context.Background())

	var users []User
	for cur.Next(context.Background()) {
		var user User
		if err = cur.Decode(&user); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}

	data := map[string]interface{}{
		"users": users,
	}

	template.Must(template.ParseFiles(
		"templates/pages/admin/admin.html",
		"templates/pages/admin/usertbl.html",
		"templates/pages/admin/reqtbl.html",
		"templates/shared/navbar.html",
	)).Execute(w, data)
}

// /////////////////////////////////////////////////////////////////////
//
//	"/dashboard" - get dashboard request
//
// /////////////////////////////////////////////////////////////////////
func (s *Server) dashboard(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var data = map[string]interface{}{}

	// get data for provalchart
	var pacRecords = []PackingRecord{}
	cur, err := s.mgdb.Collection("packing").Find(context.Background(), bson.M{})
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cur.Close(context.Background())

	if err := cur.All(context.Background(), &pacRecords); err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	template.Must(template.ParseFiles(
		"templates/pages/dashboard/dashboard.html",
		"templates/pages/dashboard/provalcht.html",
		"templates/shared/navbar.html",
	)).Execute(w, data)
}

// /////////////////////////////////////////////////////////////////////
//
//	"/request" - post request
//
// /////////////////////////////////////////////////////////////////////
func (s *Server) sendRequest(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	info := r.FormValue("info")
	reason := r.FormValue("reason")

	_, err := s.mgdb.Collection("request").InsertOne(context.Background(), bson.M{
		"sender":      info,
		"message":     reason,
		"createdDate": primitive.NewDateTimeFromTime(time.Now()),
		"status":      "unread",
	})
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to send request to admin. Please try again later"))
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Successful!!! Request sent to admin. Please wait for the response"))
}

// /////////////////////////////////////////////////////////////////////
//
//	"/sections/cutting" - get cutting page
//
// /////////////////////////////////////////////////////////////////////
func (s *Server) cuttingSection(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("cutting").Find(context.Background(), bson.M{})
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cur.Close(context.Background())

	var records []CuttingRecord

	if err := cur.All(context.Background(), &records); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var data = map[string]interface{}{
		"records": records,
	}

	template.Must(template.ParseFiles(
		"templates/pages/sections/cutting/cutting.html",
		"templates/pages/sections/cutting/reptbl.html",
		"templates/shared/navbar.html",
	)).Execute(w, data)
}

// /////////////////////////////////////////////////////////////////////
//
//	"/character/score" - get character score page
//
// /////////////////////////////////////////////////////////////////////
func (s *Server) cscore(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/score/score.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// /////////////////////////////////////////////////////////////////////
//
//	"/character/score/search" - search worker for character score page
//
// /////////////////////////////////////////////////////////////////////
func (s *Server) cscore_ap(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var filter bson.M
	searchWord := r.FormValue("searchemp")
	searchRegex := ".*" + searchWord + ".*"

	_, err := strconv.Atoi(searchWord)
	if err == nil {
		filter = bson.M{"id": bson.M{"$regex": searchRegex}}
	} else {
		filter = bson.M{"$or": bson.A{
			bson.M{"name": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"section": bson.M{"$regex": searchRegex, "$options": "i"}},
		}}
	}

	cur, err := s.mgdb.Collection("employee").Find(context.Background(), filter)
	if err != nil {
		log.Println("error at /character/score/search", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to access character collection"))
		return
	}

	var empResults []struct {
		Id      string `bson:"id"`
		Name    string `bson:"name"`
		Section string `bson:"section"`
	}
	err = cur.All(context.Background(), &empResults)
	if err != nil {
		log.Println("error at /character/score/search", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to decode results"))
		return
	}

	if len(empResults) == 0 {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Không tìm thấy. Vui lòng nhập lại"))
		return
	}

	var data = map[string]interface{}{
		"employees": empResults,
	}

	template.Must(template.ParseFiles("templates/pages/score/score1.html")).Execute(w, data)
}

// /////////////////////////////////////////////////////////////////////
//
//	"/character/score/employee/:id"
//	when click on a row of worker for character score page
//
// /////////////////////////////////////////////////////////////////////
func (s *Server) cscore_b(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	empId := ps.ByName("id")
	filter := bson.M{"type": "1", "employee.id": empId}

	cur, err := s.mgdb.Collection("character").Find(context.Background(), filter)
	if err != nil {
		log.Println("Failed to access database")
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Truy xuất dữ liệu thất bại"))
	}

	var recEvals []struct {
		IssDate  time.Time `bson:"issdate"`
		Criteria struct {
			Descr string `bson:"descr"`
		}
	}
	err = cur.All(context.Background(), &recEvals)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Decode thất bại"))
	}

	if len(recEvals) == 0 {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Không tìm thấy. Vui lòng nhập lại"))
		return
	}

	var data = map[string]interface{}{
		"empId":    empId,
		"recEvals": recEvals,
	}
	template.Must(template.ParseFiles("templates/pages/score/score2.html")).Execute(w, data)
}

// /////////////////////////////////////////////////////////////////////
//
//	"/character/score/criteria"
//	post when search criteria for character score page
//
// /////////////////////////////////////////////////////////////////////
func (s *Server) cscore_cp(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	crisearch := r.FormValue("crisearch")
	empId := ps.ByName("id")

	var filter bson.M
	searchRegex := ".*" + crisearch + ".*"

	filter = bson.M{"$or": bson.A{
		bson.M{"criteriaid": bson.M{"$regex": searchRegex}},
		bson.M{"descr": bson.M{"$regex": searchRegex, "$options": "i"}},
		bson.M{"critype": bson.M{"$regex": searchRegex, "$options": "i"}},
	}}

	cur, err := s.mgdb.Collection("character").Find(context.Background(), filter)
	if err != nil {
		log.Println("Failed to access database")
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Truy xuất dữ liệu thất bại"))
	}

	var critResults []struct {
		Criteriaid string `bson:"criteriaid"`
		Descr      string `bson:"descr"`
		Point      int    `bson:"point"`
		Critype    string `bson:"critype"`
	}
	err = cur.All(context.Background(), &critResults)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Decode thất bại"))
	}

	if len(critResults) == 0 {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Không tìm thấy. Vui lòng nhập lại"))
		return
	}

	var data = map[string]interface{}{
		"empId":       empId,
		"critResults": critResults,
	}

	template.Must(template.ParseFiles("templates/pages/score/score3.html")).Execute(w, data)
}

// /////////////////////////////////////////////////////////////////////
//
//	"/character/score/evaluate/:id"
//	post when evaluate criteria for character score page
//
// /////////////////////////////////////////////////////////////////////
func (s *Server) cscore_dp(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	empid := r.FormValue("empid")
	name := r.FormValue("name")
	section := r.FormValue("section")
	criteriaid := r.FormValue("criteriaid")
	descr := r.FormValue("descr")
	point := r.FormValue("point")
	critype := r.FormValue("critype")
	issdate := r.FormValue("issdate")
	t, _ := strconv.ParseInt(issdate, 10, 64)
	t = t / 1000
	ti := time.Unix(t, 0)
	log.Println(ti)

	s.mgdb.Collection("character").InsertOne(context.Background(), bson.M{
		"type":     "1",
		"employee": bson.M{"id": empid, "name": name, "section": section},
		"criteria": bson.M{"code": criteriaid, "descr": descr, "point": point, "criptype": critype},
		"issdate":  issdate,
	})

	template.Must(template.ParseFiles("templates/pages/score/score4.html")).Execute(w, nil)
}

// /////
func (s *Server) handleGetTest(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/test/test.html", "templates/shared/navbar.html")).Execute(w, nil)
}

func (s *Server) handleAlpine(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/test/testalpine.html")).Execute(w, nil)
}

func (s *Server) footer(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/test/footer.html", "templates/shared/navbar.html")).Execute(w, nil)
}

func (s *Server) handletestgojs(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/test/testgojs.html", "templates/shared/navbar.html")).Execute(w, nil)
}

func (s *Server) handletest3(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/test/test3.html")).Execute(w, nil)
}
