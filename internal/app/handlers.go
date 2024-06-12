package app

import (
	"context"
	"dannyroman2015/phoebe/internal/models"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/julienschmidt/httprouter"
	"github.com/xuri/excelize/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// //////////////////////////////////////////////////////////
// / - Get index page
// //////////////////////////////////////////////////////////
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

// //////////////////////////////////////////////////////////
// /home - Get
// //////////////////////////////////////////////////////////
func (s *Server) home(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/home/home.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// //////////////////////////////////////////////////////////
// /login - Get
// //////////////////////////////////////////////////////////
func (s *Server) serveLogin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	data := map[string]string{
		"msg": "Login with your account. If you do not have account, click Request",
	}

	template.Must(template.ParseFiles("templates/pages/login/login.html")).Execute(w, data)
}

// //////////////////////////////////////////////////////////
// /login - Post
// //////////////////////////////////////////////////////////
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

// //////////////////////////////////////////////////////////
// /logout
// //////////////////////////////////////////////////////////
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

// //////////////////////////////////////////////////////////
// /admin
// //////////////////////////////////////////////////////////
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

// //////////////////////////////////////////////////////////
// /dashboard
// //////////////////////////////////////////////////////////
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

// //////////////////////////////////////////////////////////
// /request
// //////////////////////////////////////////////////////////
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

// ///////////////////////////////////////////////////////////////////////////////
// /sections/cutting/overview - get page overview of Cutting
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) sc_overview(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
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

// //////////////////////////////////////////////////////////
// /incentive/evaluate/searchstaff
// //////////////////////////////////////////////////////////
func (s *Server) searchstaff(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var filter bson.M
	staffsearch := r.FormValue("staffsearch")
	searchRegex := ".*" + staffsearch + ".*"

	_, err := strconv.Atoi(staffsearch)
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
		log.Println("error at /incentive/evaluate/searchstaff", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to access character collection"))
		return
	}
	defer cur.Close(context.Background())

	var empResults []struct {
		Id      string `bson:"id"`
		Name    string `bson:"name"`
		Section string `bson:"section"`
	}
	err = cur.All(context.Background(), &empResults)
	if err != nil {
		log.Println("error at /incentive/evaluate/searchstaff", err)
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

	template.Must(template.ParseFiles("templates/pages/incentive/evaluate/stafftable.html")).Execute(w, data)
}

// //////////////////////////////////////////////////////////
// /incentive/evaluate/searchcriterion
// //////////////////////////////////////////////////////////
func (s *Server) searchcriterion(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	criterionsearch := r.FormValue("criterionsearch")
	searchRegex := ".*" + criterionsearch + ".*"

	filter := bson.M{"$or": bson.A{
		bson.M{"id": bson.M{"$regex": searchRegex}},
		bson.M{"description": bson.M{"$regex": searchRegex, "$options": "i"}},
		bson.M{"kind": bson.M{"$regex": searchRegex, "$options": "i"}},
	}}

	cur, err := s.mgdb.Collection("criterion").Find(context.Background(), filter)
	if err != nil {
		log.Println("searchcriterion: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Truy xuất dữ liệu thất bại"))
		return
	}
	defer cur.Close(context.TODO())

	var critResults []struct {
		Id          string `bson:"id"`
		Description string `bson:"description"`
		Point       int    `bson:"point"`
		Kind        string `bson:"kind"`
	}
	err = cur.All(context.Background(), &critResults)
	if err != nil {
		log.Println("searchcriterion: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Decode thất bại"))
		return
	}

	var data = map[string]interface{}{
		"critResults": critResults,
	}

	template.Must(template.ParseFiles("templates/pages/incentive/evaluate/criteriontable.html")).Execute(w, data)
}

// //////////////////////////////////////////////////////////
// /incentive/evaluate/sendevaluate
// //////////////////////////////////////////////////////////
func (s *Server) sendevaluate(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id_des_p_kind := strings.Split(r.FormValue("criterionsearch"), " * ")
	id_name_section := strings.Split(r.FormValue("staffsearch"), " * ")

	if len(id_des_p_kind) != 4 || len(id_name_section) != 3 {
		w.Write([]byte("Thông tin cung cấp không đúng định dạng"))
		return
	}

	rawOccurDate := r.FormValue("occurdate")
	occurdate, _ := time.Parse("2006-01-02", rawOccurDate)
	point, _ := strconv.Atoi(id_des_p_kind[2])

	_, err := s.mgdb.Collection("evaluation").InsertOne(context.Background(), bson.M{
		"employee":  bson.M{"id": id_name_section[0], "name": id_name_section[1], "section": id_name_section[2]},
		"criterion": bson.M{"id": id_des_p_kind[0], "description": id_des_p_kind[1], "point": point, "kind": id_des_p_kind[3]},
		"occurdate": primitive.NewDateTimeFromTime(occurdate),
	})
	if err != nil {
		log.Println("sendevaluate: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Tạo đánh giá thất bại"))
		return
	}

	//get recent evaluating history
	cur, err := s.mgdb.Collection("evaluation").Find(context.Background(),
		bson.M{"employee.id": id_name_section[0]}, options.Find().SetSort(bson.M{"occurdate": -1}).SetLimit(10))
	if err != nil {
		log.Println("sendevaluate: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Truy xuất lịch sử thất bại"))
		return
	}
	defer cur.Close(context.Background())

	var evalsByiD []struct {
		Employee struct {
			Id      string `bson:"id"`
			Name    string `bson:"name"`
			Section string `bson:"section"`
		} `bson:"employee"`
		Criterion struct {
			Id          string `bson:"id"`
			Description string `bson:"description"`
			Point       int    `bson:"point"`
			Kind        string `bson:"kind"`
		} `bson:"criterion"`
		OccurDate    time.Time `bson:"occurdate"`
		StrOccurDate string
	}

	if err = cur.All(context.Background(), &evalsByiD); err != nil {
		log.Println("sendevaluate: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Decode thất bại"))
		return
	}

	for i := 0; i < len(evalsByiD); i++ {
		evalsByiD[i].StrOccurDate = evalsByiD[i].OccurDate.Format("02-01-2006")
	}

	var data = map[string]interface{}{
		"evalsByiD": evalsByiD,
	}
	template.Must(template.ParseFiles("templates/pages/incentive/evaluate/historytable.html")).Execute(w, data)
}

// //////////////////////////////////////////////////////////
// "/incentive/admin/
// //////////////////////////////////////////////////////////
func (s *Server) iadmin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/incentive/admin/admin.html",
		"templates/pages/incentive/admin/criteria.html",
		"templates/pages/incentive/admin/evaluate.html",
		"templates/shared/navbar.html")).Execute(w, nil)
}

// //////////////////////////////////////////////////////////
// "/incentive/admin/loadcrittable
// access collection criteria get criteria data
// then load to criteria table
// //////////////////////////////////////////////////////////
func (s *Server) loadcrittable(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("criterion").Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{"id": -1}))
	if err != nil {
		log.Println("loi truy xuat database", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to access database"))
		return
	}
	defer cur.Close(context.Background())

	var criteria []Criterion
	if err = cur.All(context.Background(), &criteria); err != nil {
		log.Println("loi decode criteria", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to decode criteria"))
		return
	}

	var data = map[string]interface{}{
		"criteria": criteria,
	}
	template.Must(template.ParseFiles("templates/pages/incentive/admin/crit_table.html")).Execute(w, data)
}

// //////////////////////////////////////////////////////////
// "/incentive/admin/loadevaltable
// access collection evaluation to get evaluate data
// then load to evaluate table
// //////////////////////////////////////////////////////////
func (s *Server) loadevaltable(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("evaluation").Find(context.Background(), bson.M{})
	if err != nil {
		log.Println("loadevaltable: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to access evaluate collection"))
		return
	}
	defer cur.Close(context.Background())

	var evalResults []struct {
		Employee struct {
			Id      string `bson:"id"`
			Name    string `bson:"name"`
			Section string `bson:"section"`
		} `bson:"employee"`
		Criterion struct {
			Id          string `bson:"id"`
			Description string `bson:"description"`
			Point       int    `bson:"point"`
			Kind        string `bson:"kind"`
		} `bson:"criterion"`
		OccurDate    time.Time `bson:"occurdate"`
		StrOccurDate string
		Id           string `bson:"_id"`
	}

	if err = cur.All(context.Background(), &evalResults); err != nil {
		log.Println("loadevaltable: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Decode thất bại"))
		return
	}

	for i := 0; i < len(evalResults); i++ {
		evalResults[i].StrOccurDate = evalResults[i].OccurDate.Format("02-01-2006")
	}

	var data = map[string]interface{}{
		"evalResults": evalResults,
	}

	template.Must(template.ParseFiles("templates/pages/incentive/admin/eval_table.html")).Execute(w, data)
}

// //////////////////////////////////////////////////
// /incentive/admin/caupsertcriteria
// upsert a criteria
// then reload criteria table
// //////////////////////////////////////////////////
func (s *Server) caupsertcriteria(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	criteriaid := r.FormValue("criteriaid")
	description := r.FormValue("description")
	criteriaKind := r.FormValue("critype")
	rawpoint := r.FormValue("point")
	point, _ := strconv.ParseInt(rawpoint, 10, 64)

	_, err := s.mgdb.Collection("criterion").UpdateOne(context.Background(),
		bson.M{"id": criteriaid},
		bson.M{"$set": bson.M{
			"description": description,
			"point":       point,
			"kind":        criteriaKind,
		}},
		options.Update().SetUpsert(true),
	)
	if err != nil {
		log.Println("caupsertcriteria: ", err)
		w.Write([]byte("Failed to access database"))
		return
	}

	http.Redirect(w, r, "/incentive/admin/loadcrittable", http.StatusSeeOther)
}

// //////////////////////////////////////////////////
// /incentive/admin/deletecriteria
// delete a criteria by id when click on delete icon
// return nothing
// //////////////////////////////////////////////////
func (s *Server) deletecriteria(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	criteriaid := ps.ByName("criteriaid")

	_, err := s.mgdb.Collection("criterion").DeleteOne(context.Background(), bson.M{"id": criteriaid})
	if err != nil {
		log.Println("deletecriteria: ", err)
		w.Write([]byte("Failed to access database"))
		return
	}
}

// //////////////////////////////////////////////////
// /incentive/admin/deleteevaluate
// delete a evaluate by id when click on delete icon
// return nothing
// //////////////////////////////////////////////////
func (s *Server) deleteevaluate(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	rawevaluateid := ps.ByName("evaluateid")
	evaluateid, _ := primitive.ObjectIDFromHex(rawevaluateid)

	_, err := s.mgdb.Collection("evaluation").DeleteOne(context.Background(), bson.M{"_id": evaluateid})
	if err != nil {
		log.Println("deleteevaluate: ", err)
		w.Write([]byte("Failed to access database"))
		return
	}
}

// //////////////////////////////////////////////////
// /incentive/evaluate
// get page evaluate
// //////////////////////////////////////////////////
func (s *Server) evaluate(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/incentive/evaluate/evaluate.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// //////////////////////////////////////////////////
// /incentive/admin/searchcriterion - post
// search criteria in admin page
// //////////////////////////////////////////////////
func (s *Server) ia_searchcriterion(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	criterionsearch := r.FormValue("criterionSearch")
	searchRegex := ".*" + criterionsearch + ".*"
	criterionsearchInt, _ := strconv.Atoi(criterionsearch)

	filter := bson.M{"$or": bson.A{
		bson.M{"id": bson.M{"$regex": searchRegex}},
		bson.M{"description": bson.M{"$regex": searchRegex, "$options": "i"}},
		bson.M{"kind": bson.M{"$regex": searchRegex, "$options": "i"}},
		bson.M{"point": criterionsearchInt},
	}}

	cur, err := s.mgdb.Collection("criterion").Find(context.Background(), filter)

	if err != nil {
		log.Println("ia_searchcriterion: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Truy xuất dữ liệu thất bại"))
		return
	}
	defer cur.Close(context.Background())

	var critResults []struct {
		Id          string `bson:"id"`
		Description string `bson:"description"`
		Point       int    `bson:"point"`
		Kind        string `bson:"kind"`
	}
	err = cur.All(context.Background(), &critResults)
	if err != nil {
		log.Println("ia_searchcriterion: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Decode thất bại"))
		return
	}

	var data = map[string]interface{}{
		"criteria": critResults,
	}
	template.Must(template.ParseFiles("templates/pages/incentive/admin/crit_table.html")).Execute(w, data)
}

// //////////////////////////////////////////////////
// /incentive/admin/searchevaluate - post
// search evaluate in admin page
// //////////////////////////////////////////////////
func (s *Server) ia_searchevaluate(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	evaluateSearch := r.FormValue("evaluateSearch")
	searchRegex := ".*" + evaluateSearch + ".*"
	evaluateSearchInt, _ := strconv.Atoi(evaluateSearch)
	evaluateSearchTime, err := time.Parse("02-01-2006", evaluateSearch)
	var evaluateSearchDate primitive.DateTime
	if err == nil {
		evaluateSearchDate = primitive.NewDateTimeFromTime(evaluateSearchTime)
	}

	filter := bson.M{"$or": bson.A{
		bson.M{"criterion.id": bson.M{"$regex": searchRegex}},
		bson.M{"criterion.description": bson.M{"$regex": searchRegex, "$options": "i"}},
		bson.M{"criterion.kind": bson.M{"$regex": searchRegex, "$options": "i"}},
		bson.M{"criterion.point": evaluateSearchInt},
		bson.M{"employee.id": bson.M{"$regex": searchRegex}},
		bson.M{"employee.name": bson.M{"$regex": searchRegex, "$options": "i"}},
		bson.M{"employee.section": bson.M{"$regex": searchRegex, "$options": "i"}},
		bson.M{"occurdate": evaluateSearchDate},
	}}

	cur, err := s.mgdb.Collection("evaluation").Find(context.Background(), filter, options.Find().SetSort(bson.M{"occurdate": -1}))
	if err != nil {
		log.Println("ia_searchevaluate: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Truy xuất dữ liệu thất bại"))
		return
	}
	defer cur.Close(context.Background())

	var evalResults []struct {
		Employee struct {
			Id      string `bson:"id"`
			Name    string `bson:"name"`
			Section string `bson:"section"`
		} `bson:"employee"`
		Criterion struct {
			Id          string `bson:"id"`
			Description string `bson:"description"`
			Point       int    `bson:"point"`
			Kind        string `bson:"kind"`
		} `bson:"criterion"`
		OccurDate    time.Time `bson:"occurdate"`
		StrOccurDate string
		Id           string `bson:"_id"`
	}

	err = cur.All(context.Background(), &evalResults)
	if err != nil {
		log.Println("ia_searchevaluate: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Decode thất bại"))
		return
	}

	for i := 0; i < len(evalResults); i++ {
		evalResults[i].StrOccurDate = evalResults[i].OccurDate.Format("02-01-2006")
	}

	var data = map[string]interface{}{
		"evalResults": evalResults,
	}
	template.Must(template.ParseFiles("templates/pages/incentive/admin/eval_table.html")).Execute(w, data)
}

// //////////////////////////////////////////////////
// /incentive/overview - get page incentive overview
// //////////////////////////////////////////////////
func (s *Server) ioverview(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	monthStart := primitive.NewDateTimeFromTime(time.Date(time.Now().Year(), time.Now().Month()-1, 1, 0, 0, 0, 0, time.Local))
	monthEnd := primitive.NewDateTimeFromTime(time.Date(time.Now().Year(), time.Now().Month(), 1, 0, 0, 0, 0, time.Local))

	pipeline := mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"occurdate": bson.M{"$gte": monthStart}}, bson.M{"occurdate": bson.M{"$lt": monthEnd}}}}}},
		{{"$group", bson.M{"_id": "$employee.id", "empname": bson.M{"$first": "$employee.name"}, "empsection": bson.M{"$first": "$employee.section"}, "point_total": bson.M{"$sum": "$criterion.point"}}}},
		{{"$sort", bson.M{"point_total": -1}}},
		{{"$set", bson.M{"empid": "$_id"}}},
		{{"$unset", "_id"}},
	}
	cur, err := s.mgdb.Collection("evaluation").Aggregate(context.Background(), pipeline)
	if err != nil {
		log.Println("ioverview: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to access evaluation"))
		return
	}
	defer cur.Close(context.Background())

	var lastMonthScores []Score
	if err = cur.All(context.Background(), &lastMonthScores); err != nil {
		log.Println("ioverview: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to decode"))
	}

	data := map[string]interface{}{
		"lastMonthScores": lastMonthScores,
		"highest":         lastMonthScores[0],
		"lowest":          lastMonthScores[len(lastMonthScores)-1],
	}

	template.Must(template.ParseFiles("templates/pages/incentive/overview/overview.html", "templates/shared/blnavbar.html")).Execute(w, data)
}

// ///////////////////////////////////////////////////////////////////////
// /incentive/overview/getscorecard - load page incentive overview
// ///////////////////////////////////////////////////////////////////////
func (s *Server) io_loadscores(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pipeline := mongo.Pipeline{
		{{"$group", bson.M{"_id": "$employee.id", "empname": bson.M{"$first": "$employee.name"}, "point_total": bson.M{"$sum": "$criterion.point"}}}},
		{{"$sort", bson.M{"empname": -1}}},
		{{"$set", bson.M{"empid": "$_id"}}},
		{{"$unset", "_id"}},
	}
	cur, err := s.mgdb.Collection("evaluation").Aggregate(context.Background(), pipeline)
	if err != nil {
		log.Println("io_getscorecard: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to access evaluation"))
		return
	}
	defer cur.Close(context.Background())

	var results []struct {
		EmpId      string `bson:"empid"`
		EmpName    string `bson:"empname"`
		PointTotal int    `bson:"point_total"`
	}
	if err = cur.All(context.Background(), &results); err != nil {
		log.Println("io_getscorecard: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to decode"))
	}

	template.Must(template.ParseFiles("templates/pages/incentive/overview/score_card.html")).Execute(w, results)
}

// ///////////////////////////////////////////////////////////////////////
// /incentive/overview/scoresearch - load point tbody when search
// ///////////////////////////////////////////////////////////////////////
func (s *Server) io_scoresearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	scoreSearch := r.FormValue("scoreSearch")
	searchRegex := ".*" + scoreSearch + ".*"

	pipeline := mongo.Pipeline{
		{{"$match", bson.M{"$or": bson.A{bson.M{"employee.name": bson.M{"$regex": searchRegex, "$options": "i"}}, bson.M{"employee.id": bson.M{"$regex": searchRegex, "$options": "i"}}}}}},
		{{"$group", bson.M{"_id": "$employee.id", "empname": bson.M{"$first": "$employee.name"}, "point_total": bson.M{"$sum": "$criterion.point"}}}},
		{{"$sort", bson.M{"empname": -1}}},
		{{"$set", bson.M{"empid": "$_id"}}},
		{{"$unset", "_id"}},
	}
	cur, err := s.mgdb.Collection("evaluation").Aggregate(context.Background(), pipeline)
	if err != nil {
		log.Println("io_scoresearch: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to access evaluation"))
		return
	}
	defer cur.Close(context.Background())

	var results []struct {
		EmpId      string `bson:"empid"`
		EmpName    string `bson:"empname"`
		PointTotal int    `bson:"point_total"`
	}
	if err = cur.All(context.Background(), &results); err != nil {
		log.Println("io_scoresearch: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to decode"))
	}

	template.Must(template.ParseFiles("templates/pages/incentive/overview/point_tbody.html")).Execute(w, results)
}

// ///////////////////////////////////////////////////////////////////////
// /hr/admin - load page admin of HR
// ///////////////////////////////////////////////////////////////////////
func (s *Server) hradmin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// get list data for employee table
	cur, err := s.mgdb.Collection("employee").Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{"name": -1}))
	if err != nil {
		log.Println("hradmin: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to access database"))
		return
	}
	defer cur.Close(context.Background())

	var employees = []Employee{}
	if err = cur.All(context.Background(), &employees); err != nil {
		log.Println("hradmin: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to decode"))
		return
	}

	data := map[string]interface{}{
		"employees":      employees[:10],
		"numberOfMember": len(employees),
		"currentPage":    1,
		"numberOfPages":  len(employees)/10 + 1,
	}

	template.Must(template.ParseFiles(
		"templates/pages/hr/admin/admin.html",
		"templates/pages/hr/admin/employee.html",
		"templates/shared/navbar.html")).Execute(w, data)
}

// ///////////////////////////////////////////////////////////////////////
// /hr/admin/searchemployee - search employee in hr admin page
// ///////////////////////////////////////////////////////////////////////
func (s *Server) ha_searchemployee(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	empSearch := r.FormValue("empSearch")
	searchRegex := ".*" + empSearch + ".*"

	filter := bson.M{"$or": bson.A{
		bson.M{"id": bson.M{"$regex": searchRegex, "$options": "i"}},
		bson.M{"name": bson.M{"$regex": searchRegex, "$options": "i"}},
		bson.M{"section": bson.M{"$regex": searchRegex, "$options": "i"}},
	}}

	cur, err := s.mgdb.Collection("employee").Find(context.Background(), filter, options.Find().SetSort(bson.M{"name": -1}))
	if err != nil {
		log.Println("ha_searchemployee: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to access database"))
		return
	}
	defer cur.Close(context.Background())

	var employees = []Employee{}
	if err = cur.All(context.Background(), &employees); err != nil {
		log.Println("ha_searchemployee: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to decode"))
		return
	}
	var femployees []Employee
	if len(employees) >= 10 {
		femployees = employees[:10]
	} else {
		femployees = employees
	}

	data := map[string]interface{}{
		"employees":     femployees,
		"currentPage":   1,
		"numberOfPages": len(employees)/10 + 1,
	}
	template.Must(template.ParseFiles("templates/pages/hr/admin/emp_table.html")).Execute(w, data)
}

// ///////////////////////////////////////////////////////////////////////
// /hr/admin/upsertemployee - update or insert employee into database
// ///////////////////////////////////////////////////////////////////////
func (s *Server) ha_upsertemployee(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	empId := r.FormValue("empId")
	empName := r.FormValue("empName")
	empSection := r.FormValue("empSection")

	_, err := s.mgdb.Collection("employee").UpdateOne(context.Background(),
		bson.M{"id": empId},
		bson.M{"$set": bson.M{
			"name":    empName,
			"section": empSection,
		}},
		options.Update().SetUpsert(true),
	)
	if err != nil {
		log.Println("ha_upsertemployee: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to access database"))
		return
	}

	cur, err := s.mgdb.Collection("employee").Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{"name": -1}))
	if err != nil {
		log.Println("ha_upsertemployee: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to access database"))
		return
	}
	defer cur.Close(context.Background())

	var employees = []Employee{}
	if err = cur.All(context.Background(), &employees); err != nil {
		log.Println("ha_upsertemployee: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to decode"))
		return
	}

	data := map[string]interface{}{
		"employees": employees,
	}
	template.Must(template.ParseFiles("templates/pages/hr/admin/emp_tbody.html")).Execute(w, data)
}

// ///////////////////////////////////////////////////////////////////////
// /hr/admin/ha_exportempexcel - create employee list excel file
// ///////////////////////////////////////////////////////////////////////
func (s *Server) ha_exportempexcel(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	f := excelize.NewFile()
	defer func() {
		if err := f.Close(); err != nil {
			log.Println(err)
		}
	}()

	cur, err := s.mgdb.Collection("employee").Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{"name": 1}))
	if err != nil {
		log.Println("ha_exportempexcel: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to access employee database"))
		return
	}

	var employees []Employee
	if err = cur.All(context.Background(), &employees); err != nil {
		log.Println("ha_exportempexcel: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to decode"))
		return
	}

	//set header
	// val := reflect.ValueOf(&Employee{}).Elem()
	// for i := 0; i < val.NumField(); i++ {
	// 	log.Println(val.Type().Field(i).Name)
	// }
	f.NewSheet("Employees")
	f.SetCellValue("Employees", "A2", "ID")
	f.SetCellValue("Employees", "B2", "Name")
	f.SetCellValue("Employees", "C2", "Section")
	for i := 0; i < len(employees); i++ {
		f.SetCellValue("Employees", fmt.Sprintf("A%d", i+2), employees[i].Id)
		f.SetCellValue("Employees", fmt.Sprintf("B%d", i+2), employees[i].Name)
		f.SetCellValue("Employees", fmt.Sprintf("C%d", i+2), employees[i].Section)
	}

	if err := f.SaveAs("./static/uploads/employeelist.xlsx"); err != nil {
		fmt.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/hr/admin/download_btn.html")).Execute(w, nil)
	// http.Redirect(w, r, "/static/uploads/employeelist.xlsx", http.StatusSeeOther)
	// http.ServeFile(w, r, "/static/uploads/employeelist.xlsx")
}

// ///////////////////////////////////////////////////////////////////////
// /hr/admin/prevnext - get employee list when click previous, next page
// ///////////////////////////////////////////////////////////////////////
func (s *Server) ha_prevnext(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	log.Println("dfgdg")
	rawCurrentPage := ps.ByName("currentPage")
	prevnext := ps.ByName("prevnext")
	currentPage, _ := strconv.ParseInt(rawCurrentPage, 10, 64)
	var targetPage int64
	if prevnext == "previous" {
		targetPage = currentPage - 1
		log.Println(targetPage)
	} else {
		targetPage = currentPage + 1
		log.Println(targetPage)
	}
	nSkip := (targetPage - 1) * 10

	empSearch := r.FormValue("empSearch")
	filter := bson.M{}
	if empSearch != "" {
		searchRegex := ".*" + empSearch + ".*"
		filter = bson.M{"$or": bson.A{
			bson.M{"id": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"name": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"section": bson.M{"$regex": searchRegex, "$options": "i"}},
		}}
	}

	cur, err := s.mgdb.Collection("employee").Find(context.Background(), filter, options.Find().SetSort(bson.M{"name": -1}).SetSkip(nSkip).SetLimit(10))
	if err != nil {
		log.Println("ha_prevnext: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to access database"))
		return
	}
	defer cur.Close(context.Background())

	var employees = []Employee{}
	if err = cur.All(context.Background(), &employees); err != nil {
		log.Println("ha_prevnext: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to decode"))
		return
	}
	var femployees []Employee
	if len(employees) >= 10 {
		femployees = employees[:10]
	} else {
		femployees = employees
	}

	data := map[string]interface{}{
		"employees":     femployees,
		"currentPage":   targetPage,
		"numberOfPages": r.URL.Query().Get("numberOfPages"),
	}
	template.Must(template.ParseFiles("templates/pages/hr/admin/emp_table.html")).Execute(w, data)
}

// ///////////////////////////////////////////////////////////////////////
// /sections/cutting/entry - get entry page
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sc_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	data := map[string]interface{}{
		"showSuccessDialog": false,
	}
	template.Must(template.ParseFiles(
		"templates/pages/sections/cutting/entry/entry.html",
		"templates/shared/navbar.html",
	)).Execute(w, data)
}

// ///////////////////////////////////////////////////////////////////////
// /sections/cutting/sendentry - post entry to database
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sc_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	stroccurdate := r.FormValue("occurdate")
	occurdate, _ := time.Parse("2006-01-02", stroccurdate)
	woodtype := r.FormValue("woodtype")
	qty, _ := strconv.ParseFloat(r.FormValue("qty"), 64)
	thickness, _ := strconv.ParseFloat(r.FormValue("thickness"), 64)
	wrnote := r.FormValue("wrnote")
	usernameToken, err := r.Cookie("username")
	if err != nil {
		log.Println(err)
		http.Redirect(w, r, "/login", http.StatusUnauthorized)
		return
	}

	if qty == 0 || thickness == 0 || wrnote == "" {
		template.Must(template.ParseFiles("templates/pages/sections/cutting/entry/entry.html", "templates/shared/navbar.html")).Execute(w, map[string]interface{}{
			"showSuccessDialog": false,
			"showMissingDialog": true,
		})
		return
	}

	report := models.CuttingReport{
		Date:             occurdate,
		WoodType:         woodtype,
		Qtycbm:           qty,
		Thickness:        thickness,
		WoodRecievedNote: wrnote,
		Reporter:         usernameToken.Value,
		CreatedDate:      time.Now(),
		LastModified:     time.Now(),
	}

	if err := models.NewCuttingModel(s.mgdb).InsertOne(report); err != nil {
		log.Println("sc_sendentry: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("failed to create new report"))
		return
	}

	template.Must(template.ParseFiles("templates/pages/sections/cutting/entry/entry.html", "templates/shared/navbar.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"showMissingDialog": false,
	})
}

// ///////////////////////////////////////////////////////////////////////
// /sections/cutting/admin - get page admin of cutting section
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sc_admin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	model := models.NewCuttingModel(s.mgdb)
	cuttingReports, err := model.FindAllReportsSortDateDesc()
	if err != nil {
		log.Println("sc_admin: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("failed to access cutting database"))
		return
	}

	// chỗ này sao này làm next prev sửa lại sau
	var n int
	if len(cuttingReports) > 20 {
		n = 20
	} else {
		n = len(cuttingReports)
	}

	template.Must(template.ParseFiles("templates/pages/sections/cutting/admin/admin.html", "templates/shared/navbar.html")).Execute(w, map[string]interface{}{
		"cuttingReports":  cuttingReports[:n],
		"numberOfReports": len(cuttingReports),
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/cutting/admin/deletereport/:reportid - delete a report on page admin of cutting section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sca_deletereport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	rawreportid := ps.ByName("reportid")
	reportid, _ := primitive.ObjectIDFromHex(rawreportid)

	_, err := s.mgdb.Collection("cutting").DeleteOne(context.Background(), bson.M{"_id": reportid})
	if err != nil {
		log.Println("sca_deletereport: ", err)
		w.Write([]byte("Failed to access database"))
		return
	}
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/cutting/admin/searchreport - search reports on page admin of cutting section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sca_searchreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	results := models.NewCuttingModel(s.mgdb).Search(r.FormValue("reportSearch"))
	// chỗ này sao này làm next prev sửa lại sau
	var n int
	if len(results) > 20 {
		n = 20
	} else {
		n = len(results)
	}
	template.Must(template.ParseFiles("templates/pages/sections/cutting/admin/report_tbody.html")).Execute(w, results[:n])
}

// ////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////
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
