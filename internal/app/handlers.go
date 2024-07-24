package app

import (
	"context"
	"dannyroman2015/phoebe/internal/models"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"math"
	"net/http"
	"slices"
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
		"msg": "Login as guest if you do not have account. Want an account, click Request",
	}

	template.Must(template.ParseFiles("templates/pages/login/login.html")).Execute(w, data)
}

// //////////////////////////////////////////////////////////
// /login - Post
// //////////////////////////////////////////////////////////
func (s *Server) requestLogin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	username := r.FormValue("username")
	password := r.FormValue("password")
	if username == "" && password == "" {
		username = "guest"
		password = "guest"
	}
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
		Expires: time.Now().Add(720 * time.Hour),
		Path:    "/",
	})
	http.SetCookie(w, &http.Cookie{
		Name:    "staffid",
		Value:   user.Info.StaffId,
		Expires: time.Now().Add(720 * time.Hour),
		Path:    "/",
	})
	http.SetCookie(w, &http.Cookie{
		Name:    "defaulturl",
		Value:   user.Defaulturl,
		Expires: time.Now().Add(720 * time.Hour),
		Path:    "/",
	})
	http.SetCookie(w, &http.Cookie{
		Name:    "authurls",
		Value:   strings.Join(user.Authurls, " "),
		Expires: time.Now().Add(720 * time.Hour),
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
	// get data for cutting chart
	pipeline := mongo.Pipeline{
		{{"$match", bson.M{"type": "report", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -20))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$addFields", bson.M{"is25": bson.M{"$eq": bson.A{"$thickness", 25}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "is25": "$is25"}, "qty": bson.M{"$sum": "$qtycbm"}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.is25", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "is25": "$_id.is25"}}},
		{{"$unset", "_id"}},
	}
	cur, err := s.mgdb.Collection("cutting").Aggregate(context.Background(), pipeline)
	if err != nil {
		log.Println(err)
		return
	}
	defer cur.Close(context.Background())
	var cuttingData []struct {
		Date string  `bson:"date" json:"date"`
		Is25 bool    `bson:"is25" json:"is25"`
		Qty  float64 `bson:"qty" json:"qty"`
	}
	if err = cur.All(context.Background(), &cuttingData); err != nil {
		log.Println(err)
		return
	}
	//get target data of cutting
	cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"name": "cutting total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -20))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$sort", bson.M{"date": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	var cuttingTarget []struct {
		Date  string  `bson:"date" json:"date"`
		Value float64 `bson:"value" json:"value"`
	}
	if err = cur.All(context.Background(), &cuttingTarget); err != nil {
		log.Println(err)
	}

	// get data for lamination
	cur, err = s.mgdb.Collection("lamination").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -20))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "prodtype": "$prodtype"}, "qty": bson.M{"$sum": "$qty"}}}},
		{{"$sort", bson.M{"_id.date": 1, "_id.prodtype": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "prodtype": "$_id.prodtype"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	var laminationChartData []struct {
		Date     string  `bson:"date" json:"date"`
		Prodtype string  `bson:"prodtype" json:"prodtype"`
		Qty      float64 `bson:"qty" json:"qty"`
	}
	if err := cur.All(context.Background(), &laminationChartData); err != nil {
		log.Println(err)
	}
	// get target of lamination
	cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"name": "lamination total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -20))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$sort", bson.M{"date": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	var laminationTarget []struct {
		Date  string  `bson:"date" json:"date"`
		Value float64 `bson:"value" json:"value"`
	}

	// get data for Packing Chart
	cur, err = s.mgdb.Collection("packchart").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"of": "packchart"}}},
		{{"$sort", bson.M{"date": -1}}},
		{{"$limit", 20}},
		{{"$sort", bson.M{"date": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println("failed to get data from packchart", err)
	}
	var packchartData []struct {
		Date   string  `bson:"date" json:"date"`
		Brand1 float64 `bson:"1-brand" json:"1-brand"`
		Brand2 float64 `bson:"2-brand" json:"2-brand"`
		Rh1    float64 `bson:"1-rh" json:"1-rh"`
		Rh2    float64 `bson:"2-rh" json:"2-rh"`
	}
	if err := cur.All(context.Background(), &packchartData); err != nil {
		log.Println("failed to decode", err)
	}

	template.Must(template.ParseFiles(
		"templates/pages/dashboard/dashboard.html",
		"templates/pages/dashboard/cuttingchart.html",
		"templates/pages/dashboard/laminationchart.html",
		"templates/pages/dashboard/packingchart.html",
		"templates/pages/dashboard/provalcht.html",
		"templates/shared/navbar.html",
	)).Execute(w, map[string]interface{}{
		"cuttingData":         cuttingData,
		"cuttingTarget":       cuttingTarget,
		"laminationChartData": laminationChartData,
		"laminationTarget":    laminationTarget,
		"packingData":         packchartData,
	})
}

// //////////////////////////////////////////////////////////
// /dashboard/loadproduction - load production area in dashboard
// //////////////////////////////////////////////////////////
func (s *Server) d_loadproduction(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pvPipeline := mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -12))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "factory": "$factory", "prodtype": "$prodtype", "item": "$item"}, "value": bson.M{"$sum": "$value"}}}},
		{{"$sort", bson.M{"_id.date": -1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "factory": "$_id.factory", "type": "$_id.prodtype", "item": "$_id.item"}}},
		{{"$unset", "_id"}},
	}
	cur, err := s.mgdb.Collection("prodvalue").Aggregate(context.Background(), pvPipeline)
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	type ProdValue struct {
		Date    string  `json:"date"`
		Factory string  `json:"factory"`
		Type    string  `json:"prodtype"`
		Item    string  `json:"item"`
		Value   float64 `json:"value"`
	}
	var productiondata []ProdValue

	if err := cur.All(context.Background(), &productiondata); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/dashboard/productionchart.html")).Execute(w, map[string]interface{}{
		"productiondata": productiondata,
	})
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/production/getchart - change chart of production area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) dpr_getchart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pickedChart := r.FormValue("productioncharttype")
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("productionFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("productionToDate"))

	switch pickedChart {
	case "value":
		pvPipeline := mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "factory": "$factory", "prodtype": "$prodtype", "item": "$item"}, "value": bson.M{"$sum": "$value"}}}},
			{{"$sort", bson.M{"_id.date": -1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "factory": "$_id.factory", "type": "$_id.prodtype", "item": "$_id.item"}}},
			{{"$unset", "_id"}},
		}
		cur, err := s.mgdb.Collection("prodvalue").Aggregate(context.Background(), pvPipeline)
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		type ProdValue struct {
			Date    string  `json:"date"`
			Factory string  `json:"factory"`
			Type    string  `json:"prodtype"`
			Item    string  `json:"item"`
			Value   float64 `json:"value"`
		}
		var productiondata []ProdValue

		if err := cur.All(context.Background(), &productiondata); err != nil {
			log.Println(err)
		}

		template.Must(template.ParseFiles("templates/pages/dashboard/prod_value.html")).Execute(w, map[string]interface{}{
			"productiondata": productiondata,
		})

	case "mtd":
		mtds, _ := strconv.Atoi(r.FormValue("numberOfMTDs"))
		mtdFromDate := time.Date(time.Now().Year(), time.Now().Month()-time.Month(mtds), 1, 0, 0, 0, 0, time.Now().Location())
		cur, err := s.mgdb.Collection("prodvalue").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(mtdFromDate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"$month": "$date"}, "value": bson.M{"$push": "$value"}}}},
			{{"$set", bson.M{"month": "$_id"}}},
			{{"$unset", "_id"}},
			{{"$sort", bson.M{"month": 1}}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var resu []struct {
			Month int       `bson:"month" json:"month"`
			Value []float64 `bson:"value" json:"value"`
		}
		if err := cur.All(context.Background(), &resu); err != nil {
			log.Println(err)
		}

		type PP struct {
			Month string `json:"month"`
			Data  []struct {
				Days     int     `json:"days"`
				AccValue float64 `json:"value"`
			} `json:"dat"`
		}

		var kk []PP
		for _, re := range resu {
			var a PP
			a.Month = time.Month(re.Month).String()
			for i := 0; i < len(re.Value); i++ {
				if i == 0 {
					a.Data = append(a.Data, struct {
						Days     int     `json:"days"`
						AccValue float64 `json:"value"`
					}{Days: i + 1, AccValue: re.Value[i]})
				} else {
					a.Data = append(a.Data, struct {
						Days     int     `json:"days"`
						AccValue float64 `json:"value"`
					}{Days: i + 1, AccValue: a.Data[i-1].AccValue + re.Value[i]})
				}
			}
			kk = append(kk, a)
		}

		template.Must(template.ParseFiles("templates/pages/dashboard/prod_mtd.html")).Execute(w, map[string]interface{}{
			"productiondata": kk,
		})
	}
}

// /////////////////////////////////////////////////////////////
// /dashboard/loadreededline - load reededline area in dashboard
// /////////////////////////////////////////////////////////////
func (s *Server) d_loadreededline(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("reededline").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -15))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "tone": "$tone"}, "qty": bson.M{"$sum": "$qty"}}}},
		{{"$sort", bson.M{"_id.date": 1, "_id.tone": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "tone": "$_id.tone"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var reededlinedata []struct {
		Date string  `bson:"date" json:"date"`
		Tone string  `bson:"tone" json:"tone"`
		Qty  float64 `bson:"qty" json:"qty"`
	}
	if err := cur.All(context.Background(), &reededlinedata); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/dashboard/reededline.html")).Execute(w, map[string]interface{}{
		"reededlinedata": reededlinedata,
	})
}

// //////////////////////////////////////////////////////////
// /dashboard/loadpanelcnc - load panelcnc area in dashboard
// //////////////////////////////////////////////////////////
func (s *Server) d_loadpanelcnc(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pipeline := mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -100))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, 1))}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}, "qty": bson.M{"$sum": "$qty"}}}},
		{{"$sort", bson.M{"_id.date": 1}}},
		{{"$set", bson.M{"date": "$_id.date"}}},
		{{"$unset", "_id"}},
	}
	cur, err := s.mgdb.Collection("panelcnc").Aggregate(context.Background(), pipeline)
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var panelChartData []struct {
		Date string  `bson:"date" json:"date"`
		Qty  float64 `bson:"qty" json:"qty"`
	}

	if err := cur.All(context.Background(), &panelChartData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/dashboard/panelcncchart.html")).Execute(w, map[string]interface{}{
		"panelChartData": panelChartData,
	})
}

// //////////////////////////////////////////////////////////
// /dashboard/loadveneer - load veneer area in dashboard
// //////////////////////////////////////////////////////////
func (s *Server) d_loadveneer(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("veneer").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -15))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "type": "$type"}, "qty": bson.M{"$sum": "$qty"}}}},
		{{"$sort", bson.M{"_id.date": 1, "_id.type": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": "$_id.type"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var veneerChartData []struct {
		Date string  `bson:"date" json:"date"`
		Type string  `bson:"type" json:"type"`
		Qty  float64 `bson:"qty" json:"qty"`
	}
	if err := cur.All(context.Background(), &veneerChartData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/dashboard/veneer.html")).Execute(w, map[string]interface{}{
		"veneerChartData": veneerChartData,
	})
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/loadassembly - load assembly area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) d_loadassembly(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("assembly").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"itemtype": "whole"}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -15))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "factory": "$factory", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": bson.M{"$concat": bson.A{"X", "$_id.factory", "-", "$_id.prodtype"}}}}},
		{{"$sort", bson.D{{"type", 1}, {"date", 1}}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var assemblyChartData []struct {
		Date  string  `bson:"date" json:"date"`
		Type  string  `bson:"type" json:"type"`
		Value float64 `bson:"value" json:"value"`
	}
	if err := cur.All(context.Background(), &assemblyChartData); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/dashboard/assembly.html")).Execute(w, map[string]interface{}{
		"assemblyChartData": assemblyChartData,
	})
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/loadwoodfinish - load woodfinish area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) d_loadwoodfinish(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("woodfinish").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"itemtype": "whole"}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -15))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "factory": "$factory", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": bson.M{"$concat": bson.A{"X", "$_id.factory", "-", "$_id.prodtype"}}}}},
		{{"$sort", bson.D{{"type", 1}, {"date", 1}}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var woodfinishChartData []struct {
		Date  string  `bson:"date" json:"date"`
		Type  string  `bson:"type" json:"type"`
		Value float64 `bson:"value" json:"value"`
	}
	if err := cur.All(context.Background(), &woodfinishChartData); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/dashboard/woodfinish.html")).Execute(w, map[string]interface{}{
		"woodfinishChartData": woodfinishChartData,
	})
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/loadpack - load pack area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) d_loadpack(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("pack").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"itemtype": "whole"}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -15))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "factory": "$factory", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": bson.M{"$concat": bson.A{"X", "$_id.factory", "-", "$_id.prodtype"}}}}},
		{{"$sort", bson.D{{"type", 1}, {"date", 1}}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var packChartData []struct {
		Date  string  `bson:"date" json:"date"`
		Type  string  `bson:"type" json:"type"`
		Value float64 `bson:"value" json:"value"`
	}
	if err := cur.All(context.Background(), &packChartData); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/dashboard/pack.html")).Execute(w, map[string]interface{}{
		"packChartData": packChartData,
	})
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/loadwoodrecovery - load woodrecovery area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) d_loadwoodrecovery(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("woodrecovery").Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{"date": 1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var woodrecoveryChartData []struct {
		Date     time.Time `bson:"date" json:"date"`
		Prodtype string    `bson:"prodtype" json:"prodtype"`
		Rate     float64   `bson:"rate" json:"rate"`
	}

	if err := cur.All(context.Background(), &woodrecoveryChartData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/dashboard/woodrecovery.html")).Execute(w, map[string]interface{}{
		"woodrecoveryChartData": woodrecoveryChartData,
	})
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/loadquality - load quality area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) d_loadquality(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("quality").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": time.Now().AddDate(0, 0, -10).Format("2006-01-02")}}, bson.M{"date": bson.M{"$lte": time.Now().Format("2006-01-02")}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "section": "$section"}, "checkedqty": bson.M{"$sum": "$checkedqty"}, "failedqty": bson.M{"$sum": "$failedqty"}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.section", 1}}}},
		{{"$set", bson.M{"date": "$_id.date", "section": "$_id.section"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var qualityChartData []struct {
		Date       string `bson:"date" json:"date"`
		Section    string `bson:"section" json:"section"`
		CheckedQty int    `bson:"checkedqty" json:"checkedqty"`
		FailedQty  int    `bson:"failedqty" json:"failedqty"`
	}
	if err := cur.All(context.Background(), &qualityChartData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/dashboard/quality.html")).Execute(w, map[string]interface{}{
		"qualityChartData": qualityChartData,
	})
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/loadsixs - load 6S area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) d_loadsixs(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fromdate := time.Now().AddDate(0, 0, -100).Format("2006-01-02")
	todate := time.Now().Format("2006-01-02")
	cur, err := s.mgdb.Collection("sixs").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"datestr": bson.M{"$gte": fromdate}}, bson.M{"datestr": bson.M{"$lte": todate}}}}}},
		{{"$sort", bson.M{"datestr": 1}}},
	})
	if err != nil {
		log.Println("dashboard: ", err)
	}

	type ScoreReport struct {
		Area  string `bson:"area"`
		Date  string `bson:"datestr"`
		Score int    `bson:"score"`
	}
	var s6Data []ScoreReport
	var s6areas []string
	var s6dates []string
	for cur.Next(context.Background()) {
		var a ScoreReport
		cur.Decode(&a)
		t, _ := time.Parse("2006-01-02", a.Date)
		a.Date = t.Format("2 Jan")
		if !slices.Contains(s6areas, a.Area) {
			s6areas = append(s6areas, a.Area)
		}
		if !slices.Contains(s6dates, a.Date) {
			s6dates = append(s6dates, a.Date)
		}
		s6Data = append(s6Data, a)
	}
	template.Must(template.ParseFiles("templates/pages/dashboard/sixs.html")).Execute(w, map[string]interface{}{
		"s6areas": s6areas,
		"s6dates": s6dates,
		"s6data":  s6Data,
	})
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/panelcnc/getchart - change chart of panelcnc area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) dpc_getchart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pickedChart := r.FormValue("panelcnccharttype")
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("panelcncFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("panelcncToDate"))

	switch pickedChart {
	case "machinechart":
		pipeline := mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate.AddDate(0, 0, 1))}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}, "machine": "$machine"}, "qty": bson.M{"$sum": "$qty"}}}},
			{{"$sort", bson.M{"_id.date": 1, "_id.machine": 1}}},
			{{"$set", bson.M{"date": "$_id.date", "machine": "$_id.machine"}}},
			{{"$unset", "_id"}},
		}
		cur, err := s.mgdb.Collection("panelcnc").Aggregate(context.Background(), pipeline)
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var panelChartData []struct {
			Date    string  `bson:"date" json:"date"`
			Machine string  `bson:"machine" json:"machine"`
			Qty     float64 `bson:"qty" json:"qty"`
		}
		if err := cur.All(context.Background(), &panelChartData); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/panelcnc_machinechart.html")).Execute(w, map[string]interface{}{
			"panelChartData": panelChartData,
		})

	case "totalchart":
		pipeline := mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate.AddDate(0, 0, 1))}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}, "qty": bson.M{"$sum": "$qty"}}}},
			{{"$sort", bson.M{"_id.date": 1}}},
			{{"$set", bson.M{"date": "$_id.date"}}},
			{{"$unset", "_id"}},
		}
		cur, err := s.mgdb.Collection("panelcnc").Aggregate(context.Background(), pipeline)
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var panelChartData []struct {
			Date string  `bson:"date" json:"date"`
			Qty  float64 `bson:"qty" json:"qty"`
		}

		if err := cur.All(context.Background(), &panelChartData); err != nil {
			log.Println(err)
		}

		template.Must(template.ParseFiles("templates/pages/dashboard/panelcnc_totalchart.html")).Execute(w, map[string]interface{}{
			"panelChartData": panelChartData,
		})
	}
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/assembly/getchart - change chart of assembly area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) da_getchart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pickedChart := r.FormValue("assemblycharttype")
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("assemblyFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("assemblyToDate"))

	switch pickedChart {
	case "general":
		cur, err := s.mgdb.Collection("assembly").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "itemtype": "$itemtype"}, "value": bson.M{"$sum": "$value"}}}},
			{{"$sort", bson.M{"_id.date": 1, "_id.itemtype": -1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": "$_id.itemtype"}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var assemblyChartData []struct {
			Date  string  `bson:"date" json:"date"`
			Type  string  `bson:"type" json:"type"`
			Value float64 `bson:"value" json:"value"`
		}
		if err := cur.All(context.Background(), &assemblyChartData); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/assembly_generalchart.html")).Execute(w, map[string]interface{}{
			"assemblyChartData": assemblyChartData,
		})

	case "detail":
		cur, err := s.mgdb.Collection("assembly").Aggregate(context.Background(), mongo.Pipeline{
			// {{"$match", bson.M{"itemtype": "whole"}}},
			{{"$match", bson.M{"$and": bson.A{bson.M{"itemtype": "whole"}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "factory": "$factory", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": bson.M{"$concat": bson.A{"X", "$_id.factory", "-", "$_id.prodtype"}}}}},
			{{"$sort", bson.D{{"type", 1}, {"date", 1}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var assemblyChartData []struct {
			Date  string  `bson:"date" json:"date"`
			Type  string  `bson:"type" json:"type"`
			Value float64 `bson:"value" json:"value"`
		}
		if err := cur.All(context.Background(), &assemblyChartData); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/assembly_detailchart.html")).Execute(w, map[string]interface{}{
			"assemblyChartData": assemblyChartData,
		})
	}
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/woodfinish/getchart - change chart of woodfinish area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) dw_getchart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pickedChart := r.FormValue("woodfinishcharttype")
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("woodfinishFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("woodfinishToDate"))

	switch pickedChart {
	case "general":
		cur, err := s.mgdb.Collection("woodfinish").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "itemtype": "$itemtype"}, "value": bson.M{"$sum": "$value"}}}},
			{{"$sort", bson.M{"_id.date": 1, "_id.itemtype": -1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": "$_id.itemtype"}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var woodfinishChartData []struct {
			Date  string  `bson:"date" json:"date"`
			Type  string  `bson:"type" json:"type"`
			Value float64 `bson:"value" json:"value"`
		}
		if err := cur.All(context.Background(), &woodfinishChartData); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/wf_generalchart.html")).Execute(w, map[string]interface{}{
			"woodfinishChartData": woodfinishChartData,
		})

	case "detail":
		cur, err := s.mgdb.Collection("woodfinish").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"itemtype": "whole"}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "factory": "$factory", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": bson.M{"$concat": bson.A{"X", "$_id.factory", "-", "$_id.prodtype"}}}}},
			{{"$sort", bson.D{{"type", 1}, {"date", 1}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var woodfinishChartData []struct {
			Date  string  `bson:"date" json:"date"`
			Type  string  `bson:"type" json:"type"`
			Value float64 `bson:"value" json:"value"`
		}
		if err := cur.All(context.Background(), &woodfinishChartData); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/wf_detailchart.html")).Execute(w, map[string]interface{}{
			"woodfinishChartData": woodfinishChartData,
		})
	}
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/cutting/getchart - change chart of cutting area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) dc_getchart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pickedChart := r.FormValue("cuttingcharttype")
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("cuttingFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("cuttingToDate"))

	switch pickedChart {
	case "general":
		pipeline := mongo.Pipeline{
			{{"$match", bson.M{"type": "report", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$addFields", bson.M{"is25": bson.M{"$eq": bson.A{"$thickness", 25}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "is25": "$is25"}, "qty": bson.M{"$sum": "$qtycbm"}}}},
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.is25", 1}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "is25": "$_id.is25"}}},
			{{"$unset", "_id"}},
		}
		cur, err := s.mgdb.Collection("cutting").Aggregate(context.Background(), pipeline, options.Aggregate())
		if err != nil {
			log.Println(err)
			return
		}
		defer cur.Close(context.Background())
		var cuttingData []struct {
			Date string  `bson:"date" json:"date"`
			Is25 bool    `bson:"is25" json:"is25"`
			Qty  float64 `bson:"qty" json:"qty"`
		}
		if err = cur.All(context.Background(), &cuttingData); err != nil {
			log.Println(err)
			return
		}

		cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"name": "cutting total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -20))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var cuttingTarget []struct {
			Date  string  `bson:"date" json:"date"`
			Value float64 `bson:"value" json:"value"`
		}
		if err = cur.All(context.Background(), &cuttingTarget); err != nil {
			log.Println(err)
		}

		template.Must(template.ParseFiles("templates/pages/dashboard/cutting_generalchart.html")).Execute(w, map[string]interface{}{
			"cuttingData":   cuttingData,
			"cuttingTarget": cuttingTarget,
		})

	case "woodtype":
		pipeline := mongo.Pipeline{
			{{"$match", bson.M{"type": "report", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": "$woodtype", "qty": bson.M{"$sum": "$qtycbm"}}}},
			{{"$sort", bson.M{"_id": 1}}},
			{{"$set", bson.M{"woodtype": "$_id"}}},
			{{"$unset", "_id"}},
		}
		cur, err := s.mgdb.Collection("cutting").Aggregate(context.Background(), pipeline, options.Aggregate())
		if err != nil {
			log.Println(err)
			return
		}
		defer cur.Close(context.Background())
		var cuttingData []struct {
			Woodtype string  `bson:"woodtype" json:"woodtype"`
			Qty      float64 `bson:"qty" json:"qty"`
		}
		if err = cur.All(context.Background(), &cuttingData); err != nil {
			log.Println(err)
			return
		}

		template.Must(template.ParseFiles("templates/pages/dashboard/cutting_woodtypechart.html")).Execute(w, map[string]interface{}{
			"cuttingData": cuttingData,
		})
	}
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/lamination/getchart - change chart of cutting area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) dl_getchart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pickedChart := r.FormValue("laminationcharttype")
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("laminationFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("laminationToDate"))

	switch pickedChart {
	case "general":
		cur, err := s.mgdb.Collection("lamination").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "prodtype": "$prodtype"}, "qty": bson.M{"$sum": "$qty"}}}},
			{{"$sort", bson.M{"_id.date": 1, "_id.prodtype": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "prodtype": "$_id.prodtype"}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		var laminationChartData []struct {
			Date     string  `bson:"date" json:"date"`
			Prodtype string  `bson:"prodtype" json:"prodtype"`
			Qty      float64 `bson:"qty" json:"qty"`
		}
		if err := cur.All(context.Background(), &laminationChartData); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/lamination_generalchart.html")).Execute(w, map[string]interface{}{
			"laminationChartData": laminationChartData,
		})
	}
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/lamination/getchart - change chart of cutting area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) dr_getchart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pickedChart := r.FormValue("reededlinecharttype")
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("reededlineFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("reededlineToDate"))

	switch pickedChart {
	case "general":
		cur, err := s.mgdb.Collection("reededline").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "tone": "$tone"}, "qty": bson.M{"$sum": "$qty"}}}},
			{{"$sort", bson.M{"_id.date": 1, "_id.tone": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "tone": "$_id.tone"}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var reededlinedata []struct {
			Date string  `bson:"date" json:"date"`
			Tone string  `bson:"tone" json:"tone"`
			Qty  float64 `bson:"qty" json:"qty"`
		}
		if err := cur.All(context.Background(), &reededlinedata); err != nil {
			log.Println(err)
		}

		template.Must(template.ParseFiles("templates/pages/dashboard/reededline_generalchart.html")).Execute(w, map[string]interface{}{
			"reededlinedata": reededlinedata,
		})
	}
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/lamination/getchart - change chart of cutting area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) dv_getchart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pickedChart := r.FormValue("veneercharttype")
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("veneerFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("veneerToDate"))

	switch pickedChart {
	case "general":
		cur, err := s.mgdb.Collection("veneer").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "type": "$type"}, "qty": bson.M{"$sum": "$qty"}}}},
			{{"$sort", bson.M{"_id.date": 1, "_id.type": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": "$_id.type"}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var veneerChartData []struct {
			Date string  `bson:"date" json:"date"`
			Type string  `bson:"type" json:"type"`
			Qty  float64 `bson:"qty" json:"qty"`
		}
		if err := cur.All(context.Background(), &veneerChartData); err != nil {
			log.Println(err)
		}

		template.Must(template.ParseFiles("templates/pages/dashboard/veneer_generalchart.html")).Execute(w, map[string]interface{}{
			"veneerChartData": veneerChartData,
		})
	}
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/pack/getchart - change chart of pack area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) dp_getchart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pickedChart := r.FormValue("packcharttype")
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("packFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("packToDate"))

	switch pickedChart {
	case "general":
		cur, err := s.mgdb.Collection("pack").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "itemtype": "$itemtype"}, "value": bson.M{"$sum": "$value"}}}},
			{{"$sort", bson.M{"_id.date": 1, "_id.itemtype": -1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": "$_id.itemtype"}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var packChartData []struct {
			Date  string  `bson:"date" json:"date"`
			Type  string  `bson:"type" json:"type"`
			Value float64 `bson:"value" json:"value"`
		}
		if err := cur.All(context.Background(), &packChartData); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/pack_generalchart.html")).Execute(w, map[string]interface{}{
			"packChartData": packChartData,
		})

	case "detail":
		cur, err := s.mgdb.Collection("pack").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"itemtype": "whole", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "factory": "$factory", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": bson.M{"$concat": bson.A{"X", "$_id.factory", "-", "$_id.prodtype"}}}}},
			{{"$sort", bson.D{{"type", 1}, {"date", 1}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var packChartData []struct {
			Date  string  `bson:"date" json:"date"`
			Type  string  `bson:"type" json:"type"`
			Value float64 `bson:"value" json:"value"`
		}
		if err := cur.All(context.Background(), &packChartData); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/pack_detailchart.html")).Execute(w, map[string]interface{}{
			"packChartData": packChartData,
		})
	}
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/pack/getchart - change chart of pack area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) ds_getchart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pickedChart := r.FormValue("sixscharttype")
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("sixsFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("sixsToDate"))

	switch pickedChart {
	case "general":
		cur, err := s.mgdb.Collection("sixs").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"datestr": bson.M{"$gte": fromdate.Format("2006-01-02")}}, bson.M{"datestr": bson.M{"$lte": todate.Format("2006-01-02")}}}}}},
			{{"$sort", bson.M{"datestr": 1}}},
		})
		if err != nil {
			log.Println("dashboard: ", err)
		}

		type ScoreReport struct {
			Area  string `bson:"area"`
			Date  string `bson:"datestr"`
			Score int    `bson:"score"`
		}
		var s6Data []ScoreReport
		var s6areas []string
		var s6dates []string
		for cur.Next(context.Background()) {
			var a ScoreReport
			cur.Decode(&a)
			t, _ := time.Parse("2006-01-02", a.Date)
			a.Date = t.Format("2 Jan")
			if !slices.Contains(s6areas, a.Area) {
				s6areas = append(s6areas, a.Area)
			}
			if !slices.Contains(s6dates, a.Date) {
				s6dates = append(s6dates, a.Date)
			}
			s6Data = append(s6Data, a)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/sixs_generalchart.html")).Execute(w, map[string]interface{}{
			"s6areas": s6areas,
			"s6dates": s6dates,
			"s6data":  s6Data,
		})
	}
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/quality/getchart - change chart of quality area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) dq_getchart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pickedChart := r.FormValue("qualitycharttype")
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("qualityFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("qualityToDate"))

	switch pickedChart {
	case "general":
		cur, err := s.mgdb.Collection("quality").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": fromdate.Format("2006-01-02")}}, bson.M{"date": bson.M{"$lte": todate.Format("2006-01-02")}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "section": "$section"}, "checkedqty": bson.M{"$sum": "$checkedqty"}, "failedqty": bson.M{"$sum": "$failedqty"}}}},
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.section", 1}}}},
			{{"$set", bson.M{"date": "$_id.date", "section": "$_id.section"}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var qualityChartData []struct {
			Date       string `bson:"date" json:"date"`
			Section    string `bson:"section" json:"section"`
			CheckedQty int    `bson:"checkedqty" json:"checkedqty"`
			FailedQty  int    `bson:"failedqty" json:"failedqty"`
		}
		if err := cur.All(context.Background(), &qualityChartData); err != nil {
			log.Println(err)
		}

		template.Must(template.ParseFiles("templates/pages/dashboard/quality_generalchart.html")).Execute(w, map[string]interface{}{
			"qualityChartData": qualityChartData,
		})
	}
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
	template.Must(template.ParseFiles(
		"templates/pages/sections/cutting/overview/overview.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/cutting/overview/loadwoodremain - get woodremain area of page overview of Cutting
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) sco_loadwoodremain(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("cutting").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"type": "wrnote", "wrremain": bson.M{"$gt": 0}}}},
		{{"$group", bson.M{"_id": "$thickness", "value": bson.M{"$sum": "$wrremain"}}}},
		{{"$sort", bson.M{"value": -1}}},
		{{"$set", bson.M{"name": "$_id"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var woodremainChartData []struct {
		Name  int     `bson:"name" json:"name"`
		Value float64 `bson:"value" json:"value"`
	}
	if err = cur.All(context.Background(), &woodremainChartData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/cutting/overview/woodremain.html")).Execute(w, map[string]interface{}{
		"woodremainChartData": woodremainChartData,
	})
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/cutting/overview/loadwrnote - load wrnote section of overview of Cutting
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) sco_loadwrnote(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("cutting").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"type": "wrnote"}}},
		{{"$sort", bson.M{"date": -1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var wrnotes []struct {
		WrnoteCode string  `bson:"wrnotecode"`
		WoodType   string  `bson:"woodtype"`
		Thickness  float64 `bson:"thickness"`
		Date       string  `bson:"date"`
		WrnoteQty  float64 `bson:"wrnoteqty"`
		WrRemain   float64 `bson:"wrremain"`
		ProdType   string  `bson:"prodtype"`
	}
	if err := cur.All(context.Background(), &wrnotes); err != nil {
		log.Println(err)
	}
	numberOfWrnotes := len(wrnotes)

	template.Must(template.ParseFiles("templates/pages/sections/cutting/overview/wrnote.html")).Execute(w, map[string]interface{}{
		"wrnotes":         wrnotes,
		"numberOfWrnotes": numberOfWrnotes,
	})
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/cutting/overview/loadreport - load report section of overview of Cutting
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) sco_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("cutting").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"type": "report"}}},
		{{"$sort", bson.M{"date": -1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var reports []struct {
		Wrnote    string  `bson:"wrnote"`
		Woodtype  string  `bson:"woodtype"`
		ProdType  string  `bson:"prodtype"`
		Thickness float64 `bson:"thickness"`
		Date      string  `bson:"date"`
		Qtycbm    float64 `bson:"qtycbm"`
		Reporter  string  `bson:"reporter"`
	}
	if err := cur.All(context.Background(), &reports); err != nil {
		log.Println(err)
	}
	numberOfReports := len(reports)

	template.Must(template.ParseFiles("templates/pages/sections/cutting/overview/report.html")).Execute(w, map[string]interface{}{
		"reports":         reports,
		"numberOfReports": numberOfReports,
	})
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/cutting/overview/wrnotesearch - search wrnote of overview of Cutting
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) sco_wrnotesearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	wrnoteseach := r.FormValue("wrnotesearch")
	regexWord := ".*" + wrnoteseach + ".*"
	searchFilter := r.FormValue("searchFilter")

	cur, err := s.mgdb.Collection("cutting").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"type": "wrnote", searchFilter: bson.M{"$regex": regexWord, "$options": "i"}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}}}},
	})

	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var wrnotes []struct {
		WrnoteCode string  `bson:"wrnotecode"`
		WoodType   string  `bson:"woodtype"`
		Thickness  float64 `bson:"thickness"`
		Date       string  `bson:"date"`
		WrnoteQty  float64 `bson:"wrnoteqty"`
		WrRemain   float64 `bson:"wrremain"`
	}
	if err = cur.All(context.Background(), &wrnotes); err != nil {
		log.Println(err)
	}

	numberOfWrnotes := len(wrnotes)

	template.Must(template.ParseFiles("templates/pages/sections/cutting/overview/wrnote_tbl.html")).Execute(w, map[string]interface{}{
		"wrnotes":         wrnotes,
		"numberOfWrnotes": numberOfWrnotes,
	})
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/cutting/overview/reportsearch - search report of overview of Cutting
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) sco_reportsearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportsearch := r.FormValue("reportsearch")
	regexWord := ".*" + reportsearch + ".*"
	searchFilter := r.FormValue("searchFilter")

	cur, err := s.mgdb.Collection("cutting").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"type": "report", searchFilter: bson.M{"$regex": regexWord, "$options": "i"}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var reports []struct {
		Wrnote    string  `bson:"wrnote"`
		Woodtype  string  `bson:"woodtype"`
		Thickness float64 `bson:"thickness"`
		Date      string  `bson:"date"`
		Qtycbm    float64 `bson:"qtycbm"`
		Reporter  string  `bson:"reporter"`
	}
	if err := cur.All(context.Background(), &reports); err != nil {
		log.Println(err)
	}
	numberOfReports := len(reports)

	template.Must(template.ParseFiles("templates/pages/sections/cutting/overview/report_tbl.html")).Execute(w, map[string]interface{}{
		"reports":         reports,
		"numberOfReports": numberOfReports,
	})
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

		template.Must(template.ParseFiles("templates/pages/incentive/evaluate/message.html")).Execute(w, map[string]interface{}{
			"showSuccessDialog": false,
			"showErrorDialog":   true,
			"dialogMessage":     "Thông tin cung cấp không đúng định dạng. Vui lòng kiểm tra lại.",
		})
		return
	}

	usernameToken, err := r.Cookie("username")
	if err != nil {
		log.Println(err)
	}
	username := usernameToken.Value
	rawOccurDate := r.FormValue("occurdate")
	occurdate, _ := time.Parse("Jan 02, 2006", rawOccurDate)
	point, _ := strconv.Atoi(id_des_p_kind[2])

	_, err = s.mgdb.Collection("evaluation").InsertOne(context.Background(), bson.M{
		"employee":  bson.M{"id": id_name_section[0], "name": id_name_section[1], "section": id_name_section[2]},
		"criterion": bson.M{"id": id_des_p_kind[0], "description": id_des_p_kind[1], "point": point, "kind": id_des_p_kind[3]},
		"occurdate": primitive.NewDateTimeFromTime(occurdate),
		"evaluator": username,
	})
	if err != nil {
		log.Println("sendevaluate: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		template.Must(template.ParseFiles("templates/pages/incentive/evaluate/message.html")).Execute(w, map[string]interface{}{
			"showSuccessDialog": false,
			"showErrorDialog":   true,
			"dialogMessage":     "Cập nhật đánh giá vào database thất bại. Vui lòng thử lại hoặc liên hệ Admin.",
		})
		return
	}

	//get recent evaluating history
	cur, err := s.mgdb.Collection("evaluation").Find(context.Background(),
		bson.M{"employee.id": id_name_section[0]}, options.Find().SetSort(bson.M{"occurdate": -1}).SetLimit(10))
	if err != nil {
		log.Println("sendevaluate: ", err)
		template.Must(template.ParseFiles("templates/pages/incentive/evaluate/message.html")).Execute(w, map[string]interface{}{
			"showSuccessDialog": false,
			"showErrorDialog":   true,
			"dialogMessage":     "Lấy dữ liệu từ database thất bại. Vui lòng báo cáo Admin.",
		})
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
		template.Must(template.ParseFiles("templates/pages/incentive/evaluate/message.html")).Execute(w, map[string]interface{}{
			"showSuccessDialog": false,
			"showErrorDialog":   true,
			"dialogMessage":     "Decode thất bại. Vui lòng báo cáo Admin.",
		})
		return
	}

	for i := 0; i < len(evalsByiD); i++ {
		evalsByiD[i].StrOccurDate = evalsByiD[i].OccurDate.Format("02-01-2006")
	}

	template.Must(template.ParseFiles("templates/pages/incentive/evaluate/historytable.html")).Execute(w, map[string]interface{}{
		"evalsByiD":         evalsByiD,
		"showSuccessDialog": true,
		"showErrorDialog":   false,
		"dialogMessage":     "Có thể tiếp tực đánh giá tiếp.",
	})
}

// //////////////////////////////////////////////////////////
// "/incentive/admin/
// //////////////////////////////////////////////////////////
func (s *Server) iadmin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/incentive/admin/admin.html",
		"templates/pages/incentive/admin/criteria.html",
		"templates/pages/incentive/admin/evaluate.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// //////////////////////////////////////////////////////////
// "/incentive/admin/loadcrittable
// access collection criteria get criteria data
// then load to criteria table
// //////////////////////////////////////////////////////////
func (s *Server) loadcrittable(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var criteria []models.Criterion
	criteria, err := models.NewCriterionModel(s.mgdb).Find()
	if err != nil {
		log.Println("loadcrittable: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("failed to access criterion collection"))
		return
	}

	template.Must(template.ParseFiles("templates/pages/incentive/admin/crit_table.html")).Execute(w, map[string]interface{}{
		"criteria": criteria,
	})
}

// //////////////////////////////////////////////////////////
// "/incentive/admin/loadevaltable
// access collection evaluation to get evaluate data
// then load to evaluate table
// //////////////////////////////////////////////////////////
func (s *Server) loadevaltable(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("evaluation").Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{"occurdate": -1}))
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
		Evaluator    string `bson:"evaluator"`
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
	point, _ := strconv.ParseInt(r.FormValue("point"), 10, 64)
	applyon := r.FormValue("applyon")
	authPositions := strings.Fields(r.FormValue("manager") + " " + r.FormValue("teamleader") + " " + r.FormValue("bod"))
	evaluatedPositions := strings.Fields(r.FormValue("skilledworker") + " " + r.FormValue("unskilledworker") + " " + r.FormValue("supervisor"))

	_, err := s.mgdb.Collection("criterion").UpdateOne(context.Background(),
		bson.M{"id": criteriaid},
		bson.M{"$set": bson.M{
			"description": description,
			"point":       point,
			"kind":        criteriaKind,
			"applyon":     applyon,
			"authpos":     authPositions,
			"evalpos":     evaluatedPositions,
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
	criteria, err := models.NewCriterionModel(s.mgdb).Search(r.FormValue("criterionSearch"))
	if err != nil {
		log.Println("ia_searchcriterion: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("fail to access criterion collection"))
		return
	}

	template.Must(template.ParseFiles("templates/pages/incentive/admin/crit_table.html")).Execute(w, map[string]interface{}{
		"criteria": criteria,
	})
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
	start := primitive.NewDateTimeFromTime(time.Date(time.Now().Year(), time.Now().Month(), 1, 0, 0, 0, 0, time.Local))
	end := primitive.NewDateTimeFromTime(time.Now())

	pipeline := mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"occurdate": bson.M{"$gte": start}}, bson.M{"occurdate": bson.M{"$lt": end}}}}}},
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

	var scores []Score
	if err = cur.All(context.Background(), &scores); err != nil {
		log.Println("ioverview: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to decode"))
		return
	}

	var top5Scores []Score
	if len(scores) >= 5 {
		top5Scores = scores[0:5]
	} else {
		top5Scores = scores
	}

	template.Must(template.ParseFiles(
		"templates/pages/incentive/overview/overview.html",
		"templates/shared/navbar.html")).Execute(w, map[string]interface{}{
		"top5Scores": top5Scores,
		// "highest":    highest,
		// "lowest":     scores[len(scores)-1],
	})
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
	selectedMonth, _ := strconv.Atoi(r.FormValue("selectedMonth"))
	start := primitive.NewDateTimeFromTime(time.Date(time.Now().Year(), time.Month(selectedMonth), 1, 0, 0, 0, 0, time.Local))
	end := primitive.NewDateTimeFromTime(time.Date(time.Now().Year(), time.Month(selectedMonth)+1, 1, 0, 0, 0, 0, time.Local))
	scoreSearch := r.FormValue("scoreSearch")
	searchRegex := ".*" + scoreSearch + ".*"

	pipeline := mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"occurdate": bson.M{"$gte": start}}, bson.M{"occurdate": bson.M{"$lt": end}}}}}},
		{{"$match", bson.M{"$or": bson.A{bson.M{"employee.name": bson.M{"$regex": searchRegex, "$options": "i"}}, bson.M{"employee.id": bson.M{"$regex": searchRegex, "$options": "i"}}, bson.M{"employee.section": bson.M{"$regex": searchRegex, "$options": "i"}}}}}},
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
// /incentive/overview/io_evalsearch - load evaluations tbody when search
// ///////////////////////////////////////////////////////////////////////
func (s *Server) io_evalsearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	selectedMonth, _ := strconv.Atoi(r.FormValue("evalSelectedMonth"))
	start := primitive.NewDateTimeFromTime(time.Date(time.Now().Year(), time.Month(selectedMonth), 1, 0, 0, 0, 0, time.Local))
	end := primitive.NewDateTimeFromTime(time.Date(time.Now().Year(), time.Month(selectedMonth)+1, 1, 0, 0, 0, 0, time.Local))
	evalSearch := r.FormValue("evalSearch")
	searchRegex := ".*" + evalSearch + ".*"

	pipeline := mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"occurdate": bson.M{"$gte": start}}, bson.M{"occurdate": bson.M{"$lt": end}}}}}},
		{{"$match", bson.M{"$or": bson.A{bson.M{"employee.id": bson.M{"$regex": searchRegex, "$options": "i"}}, bson.M{"employee.name": bson.M{"$regex": searchRegex, "$options": "i"}}, bson.M{"employee.section": bson.M{"$regex": searchRegex, "$options": "i"}}}}}},
		{{"$sort", bson.M{"occurdate": -1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$occurdate"}}}}},
	}

	cur, err := s.mgdb.Collection("evaluation").Aggregate(context.Background(), pipeline)
	if err != nil {
		log.Println("io_evalsearch: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to access evaluation"))
		return
	}
	defer cur.Close(context.Background())

	var results []struct {
		Date      string `bson:"date"`
		Criterion struct {
			Description string `bson:"description"`
			Point       int    `bson:"point"`
			Kind        string `bson:"kind"`
		} `bson:"criterion"`
		Employee struct {
			Id      string `bson:"id"`
			Name    string `bson:"name"`
			Section string `bson:"section"`
		} `bson:"employee"`
		Evaluator string `bson:"evaluator"`
	}

	if err = cur.All(context.Background(), &results); err != nil {
		log.Println("io_evalsearch: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to decode"))
	}

	template.Must(template.ParseFiles("templates/pages/incentive/overview/eval_tbody.html")).Execute(w, results)
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
// /hr/entry - get entry page of HR
// ///////////////////////////////////////////////////////////////////////
func (s *Server) hr_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/hr/entry/entry.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////
// /hr/entry - post to multibly upsert employee list
// ///////////////////////////////////////////////////////////////////////
func (s *Server) hr_insertemplist(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	const MAX = 32 << 20
	r.ParseMultipartForm(MAX)
	file, _, err := r.FormFile("inputfile")
	if err != nil {
		log.Println(err)
	}
	defer file.Close()
	f, err := excelize.OpenReader(file)
	if err != nil {
		log.Println(err)
	}
	defer f.Close()

	rows, _ := f.Rows("Sheet1")

	var jsonStr = `[`
	for rows.Next() {
		row, _ := rows.Columns()
		jsonStr += `{
		"id":"` + row[0] + `", 
		"name":"` + row[1] + `",
		"section":"` + row[2] + `",
		"subsection":"` + row[3] + `",
		"position":"` + row[4] + `",
		"facno":"` + row[5] + `",
		"status":"` + row[6] + `"
		},`

	}
	jsonStr = jsonStr[:len(jsonStr)-1] + `]`

	model := models.NewEmployeeModel(s.mgdb)
	if err := model.InsertMany(jsonStr); err != nil {
		log.Println("success")
		return
	}

	// template.Must(template.ParseFiles("templates/pages/6s/entry/entry.html", "templates/shared/navbar.html")).Execute(w, map[string]interface{}{
	// 	"showSuccessDialog": true,
	// 	"showErrorDialog":   false,
	// })
}

// ///////////////////////////////////////////////////////////////////////
// /sections/cutting/entry - get entry page
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sc_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("cutting").Find(context.Background(), bson.M{"type": "wrnote", "wrremain": bson.M{"$gt": 0}}, options.Find().SetSort(bson.M{"createat": -1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var wrnotes []struct {
		WrnoteCode string  `bson:"wrnotecode"`
		WrnoteQty  float64 `bson:"wrnoteqty"`
	}
	if err = cur.All(context.Background(), &wrnotes); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/cutting/entry/entry.html", "templates/shared/navbar.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": false,
		"wrnotes":           wrnotes,
	})
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/cutting/entry/wrnoteinfo - get wrnote info when select wrnote code
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) sc_wrnoteinfo(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	sresult := s.mgdb.Collection("cutting").FindOne(context.Background(), bson.M{"type": "wrnote", "wrnotecode": r.FormValue("wrnote")})
	if sresult.Err() != nil {
		log.Println(sresult.Err())
	}

	var wrnoteinfo struct {
		WrnoteCode string  `bson:"wrnotecode"`
		ProdType   string  `bson:"prodtype"`
		WoodType   string  `bson:"woodtype"`
		WrnoteQty  float64 `bson:"wrnoteqty"`
		Thickness  float64 `bson:"thickness"`
		WrRemain   float64 `bson:"wrremain"`
	}

	if err := sresult.Decode(&wrnoteinfo); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/cutting/entry/wrnoteinfo.html")).Execute(w, map[string]interface{}{
		"wrnoteinfo": wrnoteinfo,
	})
}

func (s *Server) sc_newwrnote(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/cutting/entry/wrnoteinput.html")).Execute(w, nil)
}

func (s *Server) sc_createwrnote(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	wrnotedate, _ := time.Parse("2006-01-02", r.FormValue("occurdate"))
	prodtype := r.FormValue("prodtype")

	code := r.FormValue("wrnotecode")
	woodtype := r.FormValue("woodtype")
	thickness, _ := strconv.ParseFloat(r.FormValue("thickness"), 64)
	wrnoteqty, _ := strconv.ParseFloat(r.FormValue("wrnoteqty"), 64)
	if code == "" || woodtype == "" || prodtype == "" || thickness == 0 || wrnoteqty == 0 {
		template.Must(template.ParseFiles("templates/pages/sections/cutting/entry/wrnoteinput.html")).Execute(w, map[string]interface{}{
			"showSuccessDialog": false,
			"showMissingDialog": true,
		})
		return
	}
	_, err := s.mgdb.Collection("cutting").InsertOne(context.Background(), bson.M{
		"type": "wrnote", "wrnotecode": code, "prodtype": prodtype, "wrnoteqty": wrnoteqty, "wrremain": wrnoteqty, "woodtype": woodtype, "thickness": thickness, "date": primitive.NewDateTimeFromTime(wrnotedate), "createat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/sections/cutting/entry/wrnoteinput.html")).Execute(w, map[string]interface{}{
			"showSuccessDialog": false,
			"showMissingDialog": true,
		})
		return
	}

	cur, err := s.mgdb.Collection("cutting").Find(context.Background(), bson.M{"type": "wrnote", "wrremain": bson.M{"$gt": 0}}, options.Find().SetSort(bson.M{"wrnotecode": 1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var wrnotes []struct {
		WrnoteCode string  `bson:"wrnotecode"`
		WrnoteQty  float64 `bson:"wrnoteqty"`
		WrRemain   float64 `bson:"wrremain"`
	}

	if err = cur.All(context.Background(), &wrnotes); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/sections/cutting/entry/report_form.html")).Execute(w, map[string]interface{}{
		"wrnotes":           wrnotes,
		"showSuccessDialog": true,
	})
}

// ///////////////////////////////////////////////////////////////////////
// /sections/cutting/sendentry - post entry to database
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sc_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	remain, _ := strconv.ParseFloat(strings.Split(r.FormValue("wrnoteqty"), "/")[0], 64)
	qty, _ := strconv.ParseFloat(r.FormValue("qty"), 64)
	occurdate, _ := time.Parse("2006-01-02", r.FormValue("occurdate"))
	woodtype := r.FormValue("woodtype")
	prodtype := r.FormValue("prodtype")
	thickness, _ := strconv.ParseFloat(r.FormValue("thickness"), 64)
	wrnote := r.FormValue("wrnote")
	usernameToken, err := r.Cookie("username")
	if err != nil {
		log.Println(err)
		http.Redirect(w, r, "/login", http.StatusUnauthorized)
		return
	}

	if qty == 0 || thickness == 0 || wrnote == "" || qty > remain {
		w.Write([]byte("Sai thông tin nhập liệu"))
		return
	}

	_, err = s.mgdb.Collection("cutting").InsertOne(context.Background(), bson.M{
		"type": "report", "wrnote": wrnote, "woodtype": woodtype, "prodtype": prodtype, "qtycbm": qty, "thickness": thickness, "reporter": usernameToken.Value,
		"date": primitive.NewDateTimeFromTime(occurdate), "createddate": primitive.NewDateTimeFromTime(time.Now()), "lastmodified": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
	}

	// update remain qty of wrnote
	_, err = s.mgdb.Collection("cutting").UpdateOne(context.Background(), bson.M{"type": "wrnote", "wrnotecode": wrnote}, bson.M{"$inc": bson.M{"wrremain": -qty}})
	if err != nil {
		log.Println(err)
	}

	http.Redirect(w, r, "/sections/cutting/entry", http.StatusSeeOther)
}

// ///////////////////////////////////////////////////////////////////////
// /sections/cutting/admin - get page admin of cutting section
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sc_admin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/cutting/admin/admin.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////
// /sections/cutting/admin/loadreports - load report area on cutting admin page
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sc_loadreports(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("cutting").Find(context.Background(), bson.M{"type": "report"}, options.Find().SetSort(bson.M{"createddate": -1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var cuttingReports []struct {
		ReportId     string    `bson:"_id"`
		Date         time.Time `bson:"date"`
		Wrnote       string    `bson:"wrnote"`
		Woodtype     string    `bson:"woodtype"`
		Thickness    float64   `bson:"thickness"`
		Qty          float64   `bson:"qtycbm"`
		Type         string    `bson:"type"`
		Reporter     string    `bson:"reporter"`
		CreatedDate  time.Time `bson:"createddate"`
		LastModified time.Time `bson:"lastmodified"`
	}
	if err := cur.All(context.Background(), &cuttingReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/cutting/admin/reports.html")).Execute(w, map[string]interface{}{
		"cuttingReports":  cuttingReports,
		"numberOfReports": len(cuttingReports),
	})
}

// ///////////////////////////////////////////////////////////////////////
// /sections/cutting/admin/loadwrnote - load wrnote area on cutting admin page
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sc_loadwrnote(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("cutting").Find(context.Background(), bson.M{"type": "wrnote"}, options.Find().SetSort(bson.M{"createat": -1}))
	if err != nil {
		log.Println(err)
		return
	}
	defer cur.Close(context.Background())
	var cuttingWrnote []struct {
		WrnoteId    string    `bson:"_id"`
		WrnoteCode  string    `bson:"wrnotecode"`
		Woodtype    string    `bson:"woodtype"`
		Thickness   float64   `bson:"thickness"`
		Qty         float64   `bson:"wrnoteqty"`
		Remain      float64   `bson:"wrremain"`
		Date        time.Time `bson:"date"`
		CreatedDate time.Time `bson:"createat"`
	}
	if err := cur.All(context.Background(), &cuttingWrnote); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/sections/cutting/admin/wrnotes.html")).Execute(w, map[string]interface{}{
		"cuttingWrnotes":  cuttingWrnote,
		"numberOfWrnotes": len(cuttingWrnote),
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/cutting/admin/deletereport/:reportid - delete a report on page admin of cutting section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sca_deletereport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportid, _ := primitive.ObjectIDFromHex(ps.ByName("reportid"))

	deletedReport := s.mgdb.Collection("cutting").FindOneAndDelete(context.Background(), bson.M{"_id": reportid})
	if deletedReport.Err() != nil {
		log.Println(deletedReport.Err())
		return
	}
	var report struct {
		ReportId     string    `bson:"_id"`
		Date         time.Time `bson:"date"`
		Wrnote       string    `bson:"wrnote"`
		Woodtype     string    `bson:"woodtype"`
		Thickness    float64   `bson:"thickness"`
		Qty          float64   `bson:"qtycbm"`
		Type         string    `bson:"type"`
		Reporter     string    `bson:"reporter"`
		CreatedDate  time.Time `bson:"createddate"`
		LastModified time.Time `bson:"lastmodified"`
	}
	if err := deletedReport.Decode(&report); err != nil {
		log.Println(err)
		return
	}
	// return quantity for wrnote
	wrnote := s.mgdb.Collection("cutting").FindOneAndUpdate(context.Background(), bson.M{"type": "wrnote", "wrnotecode": report.Wrnote},
		bson.M{"$inc": bson.M{"wrremain": report.Qty}})
	if wrnote.Err() != nil {
		log.Println(wrnote.Err())
		return
	}
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/cutting/admin/deletereport/:reportid - delete a report on page admin of cutting section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sca_deletewrnote(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	wrnoteid, _ := primitive.ObjectIDFromHex(ps.ByName("wrnoteid"))

	_, err := s.mgdb.Collection("cutting").DeleteOne(context.Background(), bson.M{"_id": wrnoteid})
	if err != nil {
		log.Println(err)
		return
	}
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/cutting/admin/searchreport - search reports on page admin of cutting section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sca_searchreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cuttingReports := models.NewCuttingModel(s.mgdb).Search(r.FormValue("reportSearch"))
	template.Must(template.ParseFiles("templates/pages/sections/cutting/admin/report_tbody.html")).Execute(w, map[string]interface{}{
		"cuttingReports": cuttingReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/cutting/admin/earchwrnote - search wrnote on page admin of cutting section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sca_searchwrnote(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cuttingWrnotes := models.NewCuttingModel(s.mgdb).WrnoteSearch(r.FormValue("wrnoteSearch"))
	template.Must(template.ParseFiles("templates/pages/sections/cutting/admin/wrnote_tbody.html")).Execute(w, map[string]interface{}{
		"cuttingWrnotes": cuttingWrnotes,
	})
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/lamination/overview - get page overview of Lamination
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) sl_overview(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/lamination/overview/overview.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/lamination/overview/loadreport - load report table of page overview of Lamination
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) slo_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("lamination").Aggregate(context.Background(), mongo.Pipeline{
		{{"$sort", bson.M{"createdat": -1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}, "at": bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$createdat"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var laminationReports []struct {
		ReportId    string  `bson:"_id"`
		Date        string  `bson:"date"`
		Qty         float64 `bson:"qty"`
		ProdType    string  `bson:"prodtype"`
		Reporter    string  `bson:"reporter"`
		CreatedDate string  `bson:"at"`
	}
	if err := cur.All(context.Background(), &laminationReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/lamination/overview/report.html")).Execute(w, map[string]interface{}{
		"laminationReports": laminationReports,
		"numberOfReports":   len(laminationReports),
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/lamination/admin/searchreport - search reports on page admin of lamination section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) slo_reportsearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportsearch := r.FormValue("reportsearch")
	regexWord := ".*" + reportsearch + ".*"
	searchFilter := r.FormValue("searchFilter")

	cur, err := s.mgdb.Collection("lamination").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{searchFilter: bson.M{"$regex": regexWord, "$options": "i"}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var laminationReports []struct {
		Date     string  `bson:"date"`
		ProdType string  `bson:"prodtype"`
		Qty      float64 `bson:"qty"`
		Reporter string  `bson:"reporter"`
	}
	if err = cur.All(context.Background(), &laminationReports); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/sections/lamination/overview/report_tbl.html")).Execute(w, map[string]interface{}{
		"laminationReports": laminationReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/lamination/entry/entry - load page entry of lamination section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sl_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/lamination/entry/entry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/lamination/entry/loadform - load form of page entry of lamination section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sle_loadform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/lamination/entry/form.html")).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/lamination/entry/sendentry - post form of page entry of lamination section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sle_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, _ := r.Cookie("username")
	username := usernameToken.Value
	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))
	qty, _ := strconv.ParseFloat(r.FormValue("qty"), 64)
	prodtype := r.FormValue("prodtype")
	log.Println(qty)
	if r.FormValue("prodtype") == "" || r.FormValue("qty") == "" {
		template.Must(template.ParseFiles("templates/pages/sections/lamination/entry/form.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thông tin bị thiếu, vui lòng nhập lại.",
		})
		return
	}
	_, err := s.mgdb.Collection("lamination").InsertOne(context.Background(), bson.M{
		"date": primitive.NewDateTimeFromTime(date), "prodtype": prodtype, "qty": qty, "createdat": primitive.NewDateTimeFromTime(time.Now()), "reporter": username,
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/sections/lamination/entry/form.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Kết nối cơ sở dữ liệu thất bại, vui lòng nhập lại hoặc báo admin.",
		})
		return
	}
	template.Must(template.ParseFiles("templates/pages/sections/lamination/entry/form.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Gửi dữ liệu thành công.",
	})
}

// ///////////////////////////////////////////////////////////////////////
// /sections/lamination/admin - get page admin of lamination section
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sl_admin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/lamination/admin/admin.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////
// /sections/lamination/admin/loadreport - load report area on lamination admin page
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sla_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("lamination").Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{"createdat": -1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var laminationReports []struct {
		ReportId    string    `bson:"_id"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		ProdType    string    `bson:"prodtype"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}
	if err := cur.All(context.Background(), &laminationReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/lamination/admin/report.html")).Execute(w, map[string]interface{}{
		"laminationReports": laminationReports,
		"numberOfReports":   len(laminationReports),
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/lamination/admin/searchreport - search reports on page admin of lamination section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sla_searchreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	searchWord := r.FormValue("reportSearch")
	regexWord := ".*" + searchWord + ".*"
	dateSearch, err := time.Parse("2006-01-02", searchWord)
	var filter bson.M
	if err != nil {
		filter = bson.M{"$or": bson.A{
			bson.M{"reporter": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"prodtype": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"qty": bson.M{"$regex": regexWord, "$options": "i"}},
		},
		}
	} else {
		filter = bson.M{"date": primitive.NewDateTimeFromTime(dateSearch)}
	}
	cur, err := s.mgdb.Collection("lamination").Find(context.Background(), filter, options.Find().SetSort(bson.M{"date": -1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var laminationReports []struct {
		ReportId    string    `bson:"_id"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		ProdType    string    `bson:"prodtype"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}
	if err = cur.All(context.Background(), &laminationReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/lamination/admin/report_tbody.html")).Execute(w, map[string]interface{}{
		"laminationReports": laminationReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/lamination/admin/deletereport/:reportid - delete a report on page admin of lamination section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sla_deletereport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportid, _ := primitive.ObjectIDFromHex(ps.ByName("reportid"))

	_, err := s.mgdb.Collection("lamination").DeleteOne(context.Background(), bson.M{"_id": reportid})
	if err != nil {
		log.Println(err)
		return
	}
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/reededline/overview - get page overview of reededline
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) sr_overview(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/reededline/overview/overview.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/reededline/overview/loadreport - load report table of page overview of reededline
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) sro_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("reededline").Aggregate(context.Background(), mongo.Pipeline{
		{{"$sort", bson.M{"createdat": -1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}, "at": bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$createdat", "timezone": "Asia/Bangkok"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var reededlineReports []struct {
		ReportId    string  `bson:"_id"`
		Date        string  `bson:"date"`
		Qty         float64 `bson:"qty"`
		Tone        string  `bson:"tone"`
		Reporter    string  `bson:"reporter"`
		CreatedDate string  `bson:"at"`
	}
	if err := cur.All(context.Background(), &reededlineReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/reededline/overview/report.html")).Execute(w, map[string]interface{}{
		"reededlineReports": reededlineReports,
		"numberOfReports":   len(reededlineReports),
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/reededline/admin/searchreport - search reports on page admin of reededline section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sro_reportsearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportsearch := r.FormValue("reportsearch")
	regexWord := ".*" + reportsearch + ".*"
	searchFilter := r.FormValue("searchFilter")

	cur, err := s.mgdb.Collection("reededline").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{searchFilter: bson.M{"$regex": regexWord, "$options": "i"}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}, "at": bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$createdat", "timezone": "Asia/Bangkok"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var reededlineReports []struct {
		ReportId    string  `bson:"_id"`
		Date        string  `bson:"date"`
		Qty         float64 `bson:"qty"`
		Tone        string  `bson:"tone"`
		Reporter    string  `bson:"reporter"`
		CreatedDate string  `bson:"at"`
	}
	if err = cur.All(context.Background(), &reededlineReports); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/sections/reededline/overview/report_tbody.html")).Execute(w, map[string]interface{}{
		"reededlineReports": reededlineReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/reedeline/entry - load page entry of reededline section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sr_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/reededline/entry/entry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/reedeline/entry/loadform - load form of page entry of reededline section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sre_loadform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/reededline/entry/form.html")).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/reedeline/entry/sendentry - load form of page entry of reededline section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sre_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, _ := r.Cookie("username")
	username := usernameToken.Value
	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))
	qty, _ := strconv.ParseFloat(r.FormValue("qty"), 64)
	prodtype := r.FormValue("tone")
	if r.FormValue("tone") == "" || r.FormValue("qty") == "" {
		template.Must(template.ParseFiles("templates/pages/sections/reededline/entry/form.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thông tin bị thiếu, vui lòng nhập lại.",
		})
		return
	}
	_, err := s.mgdb.Collection("reededline").InsertOne(context.Background(), bson.M{
		"date": primitive.NewDateTimeFromTime(date), "tone": prodtype, "qty": qty, "createdat": primitive.NewDateTimeFromTime(time.Now()), "reporter": username,
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/sections/reededline/entry/form.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Kết nối cơ sở dữ liệu thất bại, vui lòng nhập lại hoặc báo admin.",
		})
		return
	}
	template.Must(template.ParseFiles("templates/pages/sections/reededline/entry/form.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Gửi dữ liệu thành công.",
	})
}

// ///////////////////////////////////////////////////////////////////////
// /sections/reededline/admin - get page admin of reededline section
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sr_admin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/reededline/admin/admin.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////
// /sections/reededline/admin/loadreport - load report area on reededline admin page
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sra_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("reededline").Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{"createdat": -1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var reededlineReports []struct {
		ReportId    string    `bson:"_id"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		Tone        string    `bson:"tone"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}
	if err := cur.All(context.Background(), &reededlineReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/reededline/admin/report.html")).Execute(w, map[string]interface{}{
		"reededlineReports": reededlineReports,
		"numberOfReports":   len(reededlineReports),
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/reededline/admin/searchreport - search reports on page admin of reededline section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sra_searchreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	searchWord := r.FormValue("reportSearch")
	regexWord := ".*" + searchWord + ".*"
	dateSearch, err := time.Parse("2006-01-02", searchWord)
	var filter bson.M
	if err != nil {
		filter = bson.M{"$or": bson.A{
			bson.M{"tone": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"reporter": bson.M{"$regex": regexWord, "$options": "i"}},
		},
		}
	} else {
		filter = bson.M{"date": primitive.NewDateTimeFromTime(dateSearch)}
	}
	cur, err := s.mgdb.Collection("reededline").Find(context.Background(), filter, options.Find().SetSort(bson.M{"date": -1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var reededlineReports []struct {
		ReportId    string    `bson:"_id"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		Tone        string    `bson:"tone"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}
	if err = cur.All(context.Background(), &reededlineReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/reededline/admin/report_tbody.html")).Execute(w, map[string]interface{}{
		"reededlineReports": reededlineReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/reededline/admin/deletereport/:reportid - delete a report on page admin of reededline section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sra_deletereport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportid, _ := primitive.ObjectIDFromHex(ps.ByName("reportid"))

	_, err := s.mgdb.Collection("reededline").DeleteOne(context.Background(), bson.M{"_id": reportid})
	if err != nil {
		log.Println(err)
		return
	}
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/veneer/overview - get page overview of veneer
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) sv_overview(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/veneer/overview/overview.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/veneer/overview/loadreport - load report table of page overview of veneer
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) svo_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("veneer").Aggregate(context.Background(), mongo.Pipeline{
		{{"$sort", bson.M{"createdat": -1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}, "createdat": bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$createdat", "timezone": "Asia/Bangkok"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var veneerReports []struct {
		ReportId    string  `bson:"_id"`
		Date        string  `bson:"date"`
		Qty         float64 `bson:"qty"`
		Type        string  `bson:"type"`
		Reporter    string  `bson:"reporter"`
		CreatedDate string  `bson:"createdat"`
	}
	if err := cur.All(context.Background(), &veneerReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/veneer/overview/report.html")).Execute(w, map[string]interface{}{
		"veneerReports":   veneerReports,
		"numberOfReports": len(veneerReports),
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/veneer/admin/searchreport - search reports on page admin of veneer section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) svo_reportsearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportsearch := r.FormValue("reportsearch")
	regexWord := ".*" + reportsearch + ".*"
	searchFilter := r.FormValue("searchFilter")

	cur, err := s.mgdb.Collection("veneer").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{searchFilter: bson.M{"$regex": regexWord, "$options": "i"}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}, "createdat": bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$createdat", "timezone": "Asia/Bangkok"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var veneerReports []struct {
		ReportId    string  `bson:"_id"`
		Date        string  `bson:"date"`
		Qty         float64 `bson:"qty"`
		Type        string  `bson:"type"`
		Reporter    string  `bson:"reporter"`
		CreatedDate string  `bson:"createdat"`
	}
	if err = cur.All(context.Background(), &veneerReports); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/sections/veneer/overview/report_tbody.html")).Execute(w, map[string]interface{}{
		"veneerReports": veneerReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/veneer/entry - load page entry of veneer section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sv_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/veneer/entry/entry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/veneer/entry/loadform - load form of page entry of veneer section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sve_loadform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/veneer/entry/form.html")).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/veneer/admin/searchreport - search reports on page admin of veneer section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sva_searchreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	searchWord := r.FormValue("reportSearch")
	regexWord := ".*" + searchWord + ".*"
	dateSearch, err := time.Parse("2006-01-02", searchWord)
	var filter bson.M
	if err != nil {
		filter = bson.M{"$or": bson.A{
			bson.M{"type": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"reporter": bson.M{"$regex": regexWord, "$options": "i"}},
		},
		}
	} else {
		filter = bson.M{"date": primitive.NewDateTimeFromTime(dateSearch)}
	}
	cur, err := s.mgdb.Collection("veneer").Find(context.Background(), filter, options.Find().SetSort(bson.M{"date": -1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var veneerReports []struct {
		ReportId    string    `bson:"_id"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		Type        string    `bson:"type"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}
	if err = cur.All(context.Background(), &veneerReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/veneer/admin/report_tbody.html")).Execute(w, map[string]interface{}{
		"veneerReports": veneerReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/veneer/entry/sendentry - load form of page entry of veneer section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sve_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, _ := r.Cookie("username")
	username := usernameToken.Value
	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))
	qty, _ := strconv.ParseFloat(r.FormValue("qty"), 64)
	veneertype := r.FormValue("type")
	if r.FormValue("type") == "" || r.FormValue("qty") == "" {
		template.Must(template.ParseFiles("templates/pages/sections/veneer/entry/form.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thông tin bị thiếu, vui lòng nhập lại.",
		})
		return
	}
	_, err := s.mgdb.Collection("veneer").InsertOne(context.Background(), bson.M{
		"date": primitive.NewDateTimeFromTime(date), "type": veneertype, "qty": qty, "createdat": primitive.NewDateTimeFromTime(time.Now()), "reporter": username,
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/sections/veneer/entry/form.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Kết nối cơ sở dữ liệu thất bại, vui lòng nhập lại hoặc báo admin.",
		})
		return
	}
	template.Must(template.ParseFiles("templates/pages/sections/veneer/entry/form.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Gửi dữ liệu thành công.",
	})
}

// ///////////////////////////////////////////////////////////////////////
// /sections/veneer/admin - get page admin of veneer section
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sv_admin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/veneer/admin/admin.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////
// /sections/veneer/admin/loadreport - load report area on veneer admin page
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sva_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("veneer").Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{"createdat": -1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var veneerReports []struct {
		ReportId    string    `bson:"_id"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		Type        string    `bson:"type"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}
	if err := cur.All(context.Background(), &veneerReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/veneer/admin/report.html")).Execute(w, map[string]interface{}{
		"veneerReports":   veneerReports,
		"numberOfReports": len(veneerReports),
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/veneer/admin/deletereport/:reportid - delete a report on page admin of veneer section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sva_deletereport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportid, _ := primitive.ObjectIDFromHex(ps.ByName("reportid"))

	_, err := s.mgdb.Collection("veneer").DeleteOne(context.Background(), bson.M{"_id": reportid})
	if err != nil {
		log.Println(err)
		return
	}
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/assembly/overview - get page overview of assembly
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) sa_overview(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/assembly/overview/overview.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/assembly/overview/loadreport - load report table of page overview of assembly
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) sao_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("assembly").Aggregate(context.Background(), mongo.Pipeline{
		{{"$sort", bson.M{"createdat": -1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}, "createdat": bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$createdat", "timezone": "Asia/Bangkok"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var assemblyReports []struct {
		ReportId    string  `bson:"_id"`
		Date        string  `bson:"date"`
		Qty         float64 `bson:"qty"`
		Value       float64 `bson:"value"`
		ProdType    string  `bson:"prodtype"`
		Itemcode    string  `bson:"itemcode"`
		ItemType    string  `bson:"itemtype"`
		Component   string  `bson:"component"`
		Factory     string  `bson:"factory"`
		Reporter    string  `bson:"reporter"`
		CreatedDate string  `bson:"createdat"`
	}
	if err := cur.All(context.Background(), &assemblyReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/assembly/overview/report.html")).Execute(w, map[string]interface{}{
		"assemblyReports": assemblyReports,
		"numberOfReports": len(assemblyReports),
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/assembly/admin/searchreport - search reports on page admin of assembly section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sao_reportsearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportsearch := r.FormValue("reportsearch")
	regexWord := ".*" + reportsearch + ".*"
	searchFilter := r.FormValue("searchFilter")

	cur, err := s.mgdb.Collection("assembly").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{searchFilter: bson.M{"$regex": regexWord, "$options": "i"}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}, "createdat": bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$createdat", "timezone": "Asia/Bangkok"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var assemblyReports []struct {
		ReportId    string  `bson:"_id"`
		Date        string  `bson:"date"`
		Qty         float64 `bson:"qty"`
		Value       float64 `bson:"value"`
		ProdType    string  `bson:"prodtype"`
		Itemcode    string  `bson:"itemcode"`
		ItemType    string  `bson:"itemtype"`
		Component   string  `bson:"component"`
		Factory     string  `bson:"factory"`
		Reporter    string  `bson:"reporter"`
		CreatedDate string  `bson:"createdat"`
	}
	if err = cur.All(context.Background(), &assemblyReports); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/sections/assembly/overview/report_tbody.html")).Execute(w, map[string]interface{}{
		"assemblyReports": assemblyReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/assembly/entry - load page entry of assembly section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sa_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/assembly/entry/entry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/assembly/loadform - load form of page entry of assembly section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sae_loadform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/assembly/entry/form.html")).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/assembly/sendentry - post form of page entry of assembly section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sae_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, _ := r.Cookie("username")
	username := usernameToken.Value
	itemtype := "whole"
	if r.FormValue("switch") != "" {
		itemtype = r.FormValue("switch")
	}
	itemcode := r.FormValue("itemcode")
	component := r.FormValue("component")
	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))
	factory := r.FormValue("factory")
	prodtype := r.FormValue("prodtype")
	qty, _ := strconv.Atoi(r.FormValue("qty"))
	value, _ := strconv.ParseFloat(r.FormValue("value"), 64)

	if factory == "" || prodtype == "" || qty == 0 {
		template.Must(template.ParseFiles("templates/pages/sections/assembly/entry/form.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thông tin bị thiếu, vui lòng nhập lại.",
		})
		return
	}
	_, err := s.mgdb.Collection("assembly").InsertOne(context.Background(), bson.M{
		"date": primitive.NewDateTimeFromTime(date), "itemcode": itemcode, "itemtype": itemtype, "component": component,
		"factory": factory, "prodtype": prodtype, "qty": qty, "value": value, "reporter": username, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/sections/assembly/entry/form.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Kết nối cơ sở dữ liệu thất bại, vui lòng nhập lại hoặc báo admin.",
		})
		return
	}
	template.Must(template.ParseFiles("templates/pages/sections/assembly/entry/form.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Gửi dữ liệu thành công.",
	})
}

// ///////////////////////////////////////////////////////////////////////
// /sections/assembly/admin - get page admin of assembly section
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sa_admin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/assembly/admin/admin.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////
// /sections/assembly/admin/loadreport - load report area on assembly admin page
// ///////////////////////////////////////////////////////////////////////
func (s *Server) saa_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("assembly").Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{"createdat": -1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var assemblyReports []struct {
		ReportId    string    `bson:"_id"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		Value       float64   `bson:"value"`
		ProdType    string    `bson:"prodtype"`
		Itemcode    string    `bson:"itemcode"`
		ItemType    string    `bson:"itemtype"`
		Component   string    `bson:"component"`
		Factory     string    `bson:"factory"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}
	if err := cur.All(context.Background(), &assemblyReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/assembly/admin/report.html")).Execute(w, map[string]interface{}{
		"assemblyReports": assemblyReports,
		"numberOfReports": len(assemblyReports),
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/assembly/admin/searchreport - search reports on page admin of assembly section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) saa_searchreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	searchWord := r.FormValue("reportSearch")
	regexWord := ".*" + searchWord + ".*"
	dateSearch, err := time.Parse("2006-01-02", searchWord)
	var filter bson.M
	if err != nil {
		filter = bson.M{"$or": bson.A{
			bson.M{"itemcode": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"component": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"prodtype": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"itemtype": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"factory": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"reporter": bson.M{"$regex": regexWord, "$options": "i"}},
		},
		}
	} else {
		filter = bson.M{"date": primitive.NewDateTimeFromTime(dateSearch)}
	}
	cur, err := s.mgdb.Collection("assembly").Find(context.Background(), filter, options.Find().SetSort(bson.M{"date": -1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var assemblyReports []struct {
		ReportId    string    `bson:"_id"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		Value       float64   `bson:"value"`
		ProdType    string    `bson:"prodtype"`
		Itemcode    string    `bson:"itemcode"`
		ItemType    string    `bson:"itemtype"`
		Component   string    `bson:"component"`
		Factory     string    `bson:"factory"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}
	if err = cur.All(context.Background(), &assemblyReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/assembly/admin/report_tbody.html")).Execute(w, map[string]interface{}{
		"assemblyReports": assemblyReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/veneer/admin/deletereport/:reportid - delete a report on page admin of veneer section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) saa_deletereport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportid, _ := primitive.ObjectIDFromHex(ps.ByName("reportid"))

	_, err := s.mgdb.Collection("assembly").DeleteOne(context.Background(), bson.M{"_id": reportid})
	if err != nil {
		log.Println(err)
		return
	}
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/woodfinish/overview - get page overview of assembly
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) sw_overview(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/woodfinish/overview/overview.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/woodfinish/overview/loadreport - load report table of page overview of woodfinish
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) swo_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("woodfinish").Aggregate(context.Background(), mongo.Pipeline{
		{{"$sort", bson.M{"createdat": -1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}, "createdat": bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$createdat", "timezone": "Asia/Bangkok"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var woodfinishReports []struct {
		ReportId    string  `bson:"_id"`
		Date        string  `bson:"date"`
		Qty         float64 `bson:"qty"`
		Value       float64 `bson:"value"`
		ProdType    string  `bson:"prodtype"`
		Itemcode    string  `bson:"itemcode"`
		ItemType    string  `bson:"itemtype"`
		Component   string  `bson:"component"`
		Factory     string  `bson:"factory"`
		Reporter    string  `bson:"reporter"`
		CreatedDate string  `bson:"createdat"`
	}
	if err := cur.All(context.Background(), &woodfinishReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/woodfinish/overview/report.html")).Execute(w, map[string]interface{}{
		"woodfinishReports": woodfinishReports,
		"numberOfReports":   len(woodfinishReports),
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/woodfinish/admin/searchreport - search reports on page admin of woodfinish section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) swo_reportsearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportsearch := r.FormValue("reportsearch")
	regexWord := ".*" + reportsearch + ".*"
	searchFilter := r.FormValue("searchFilter")

	cur, err := s.mgdb.Collection("woodfinish").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{searchFilter: bson.M{"$regex": regexWord, "$options": "i"}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}, "createdat": bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$createdat", "timezone": "Asia/Bangkok"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var woodfinishReports []struct {
		ReportId    string  `bson:"_id"`
		Date        string  `bson:"date"`
		Qty         float64 `bson:"qty"`
		Value       float64 `bson:"value"`
		ProdType    string  `bson:"prodtype"`
		Itemcode    string  `bson:"itemcode"`
		ItemType    string  `bson:"itemtype"`
		Component   string  `bson:"component"`
		Factory     string  `bson:"factory"`
		Reporter    string  `bson:"reporter"`
		CreatedDate string  `bson:"createdat"`
	}
	if err = cur.All(context.Background(), &woodfinishReports); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/sections/woodfinish/overview/report_tbody.html")).Execute(w, map[string]interface{}{
		"woodfinishReports": woodfinishReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/woodfinish/entry - load page entry of woodfinish section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sw_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/woodfinish/entry/entry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/woodfinish/loadform - load form of page entry of woodfinish section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) swe_loadform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/woodfinish/entry/form.html")).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/woodfinish/sendentry - post form of page entry of woodfinish section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) swe_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, _ := r.Cookie("username")
	username := usernameToken.Value
	itemtype := "whole"
	if r.FormValue("switch") != "" {
		itemtype = r.FormValue("switch")
	}
	itemcode := r.FormValue("itemcode")
	component := r.FormValue("component")
	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))
	factory := r.FormValue("factory")
	prodtype := r.FormValue("prodtype")
	qty, _ := strconv.Atoi(r.FormValue("qty"))
	value, _ := strconv.ParseFloat(r.FormValue("value"), 64)

	if factory == "" || prodtype == "" || qty == 0 {
		template.Must(template.ParseFiles("templates/pages/sections/woodfinish/entry/form.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thông tin bị thiếu, vui lòng nhập lại.",
		})
		return
	}
	_, err := s.mgdb.Collection("woodfinish").InsertOne(context.Background(), bson.M{
		"date": primitive.NewDateTimeFromTime(date), "itemcode": itemcode, "itemtype": itemtype, "component": component,
		"factory": factory, "prodtype": prodtype, "qty": qty, "value": value, "reporter": username, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/sections/woodfinish/entry/form.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Kết nối cơ sở dữ liệu thất bại, vui lòng nhập lại hoặc báo admin.",
		})
		return
	}
	template.Must(template.ParseFiles("templates/pages/sections/woodfinish/entry/form.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Gửi dữ liệu thành công.",
	})
}

// ///////////////////////////////////////////////////////////////////////
// /sections/woodfinish/admin - get page admin of woodfinish section
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sw_admin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/woodfinish/admin/admin.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////
// /sections/woodfinish/admin/loadreport - load report area on woodfinish admin page
// ///////////////////////////////////////////////////////////////////////
func (s *Server) swa_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("woodfinish").Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{"createdat": -1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var woodfinishReports []struct {
		ReportId    string    `bson:"_id"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		Value       float64   `bson:"value"`
		ProdType    string    `bson:"prodtype"`
		Itemcode    string    `bson:"itemcode"`
		ItemType    string    `bson:"itemtype"`
		Component   string    `bson:"component"`
		Factory     string    `bson:"factory"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}
	if err := cur.All(context.Background(), &woodfinishReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/woodfinish/admin/report.html")).Execute(w, map[string]interface{}{
		"woodfinishReports": woodfinishReports,
		"numberOfReports":   len(woodfinishReports),
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/woodfinish/admin/searchreport - search reports on page admin of woodfinish section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) swa_searchreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	searchWord := r.FormValue("reportSearch")
	regexWord := ".*" + searchWord + ".*"
	dateSearch, err := time.Parse("2006-01-02", searchWord)
	var filter bson.M
	if err != nil {
		filter = bson.M{"$or": bson.A{
			bson.M{"itemcode": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"component": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"prodtype": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"itemtype": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"factory": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"reporter": bson.M{"$regex": regexWord, "$options": "i"}},
		},
		}
	} else {
		filter = bson.M{"date": primitive.NewDateTimeFromTime(dateSearch)}
	}
	cur, err := s.mgdb.Collection("woodfinish").Find(context.Background(), filter, options.Find().SetSort(bson.M{"date": -1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var woodfinishReports []struct {
		ReportId    string    `bson:"_id"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		Value       float64   `bson:"value"`
		ProdType    string    `bson:"prodtype"`
		Itemcode    string    `bson:"itemcode"`
		ItemType    string    `bson:"itemtype"`
		Component   string    `bson:"component"`
		Factory     string    `bson:"factory"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}
	if err = cur.All(context.Background(), &woodfinishReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/woodfinish/admin/report_tbody.html")).Execute(w, map[string]interface{}{
		"woodfinishReports": woodfinishReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/woodfinish/admin/deletereport/:reportid - delete a report on page admin of woodfinish section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) swa_deletereport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportid, _ := primitive.ObjectIDFromHex(ps.ByName("reportid"))

	_, err := s.mgdb.Collection("woodfinish").DeleteOne(context.Background(), bson.M{"_id": reportid})
	if err != nil {
		log.Println(err)
		return
	}
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/pack/overview - get page overview of assembly
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) spk_overview(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/pack/overview/overview.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/pack/overview/loadreport - load report table of page overview of pack
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) pko_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("pack").Aggregate(context.Background(), mongo.Pipeline{
		{{"$sort", bson.M{"createdat": -1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}, "createdat": bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$createdat", "timezone": "Asia/Bangkok"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var packReports []struct {
		ReportId    string  `bson:"_id"`
		Date        string  `bson:"date"`
		Qty         float64 `bson:"qty"`
		Value       float64 `bson:"value"`
		ProdType    string  `bson:"prodtype"`
		Itemcode    string  `bson:"itemcode"`
		ItemType    string  `bson:"itemtype"`
		Part        string  `bson:"part"`
		Factory     string  `bson:"factory"`
		Reporter    string  `bson:"reporter"`
		CreatedDate string  `bson:"createdat"`
	}
	if err := cur.All(context.Background(), &packReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/pack/overview/report.html")).Execute(w, map[string]interface{}{
		"packReports":     packReports,
		"numberOfReports": len(packReports),
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/pack/admin/searchreport - search reports on page admin of pack section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) pko_reportsearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportsearch := r.FormValue("reportsearch")
	regexWord := ".*" + reportsearch + ".*"
	searchFilter := r.FormValue("searchFilter")

	cur, err := s.mgdb.Collection("pack").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{searchFilter: bson.M{"$regex": regexWord, "$options": "i"}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}, "createdat": bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$createdat", "timezone": "Asia/Bangkok"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var packReports []struct {
		ReportId    string  `bson:"_id"`
		Date        string  `bson:"date"`
		Qty         float64 `bson:"qty"`
		Value       float64 `bson:"value"`
		ProdType    string  `bson:"prodtype"`
		Itemcode    string  `bson:"itemcode"`
		ItemType    string  `bson:"itemtype"`
		Part        string  `bson:"part"`
		Factory     string  `bson:"factory"`
		Reporter    string  `bson:"reporter"`
		CreatedDate string  `bson:"createdat"`
	}
	if err = cur.All(context.Background(), &packReports); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/sections/pack/overview/report_tbody.html")).Execute(w, map[string]interface{}{
		"packReports": packReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/pack/entry - load page entry of pack section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) spk_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/pack/entry/entry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/pack/loadform - load form of page entry of pack section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) spk_loadform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/pack/entry/form.html")).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/pack/sendentry - post form of page entry of pack section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) spk_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, _ := r.Cookie("username")
	username := usernameToken.Value
	itemtype := "whole"
	if r.FormValue("switch") != "" {
		itemtype = r.FormValue("switch")
	}
	itemcode := r.FormValue("itemcode")
	part := r.FormValue("part")
	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))
	factory := r.FormValue("factory")
	prodtype := r.FormValue("prodtype")
	qty, _ := strconv.Atoi(r.FormValue("qty"))
	value, _ := strconv.ParseFloat(r.FormValue("value"), 64)

	if factory == "" || prodtype == "" || qty == 0 {
		template.Must(template.ParseFiles("templates/pages/sections/pack/entry/form.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thông tin bị thiếu, vui lòng nhập lại.",
		})
		return
	}
	insertedResult, err := s.mgdb.Collection("pack").InsertOne(context.Background(), bson.M{
		"date": primitive.NewDateTimeFromTime(date), "itemcode": itemcode, "itemtype": itemtype, "part": part,
		"factory": factory, "prodtype": prodtype, "qty": qty, "value": value, "reporter": username, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/sections/pack/entry/form.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Kết nối cơ sở dữ liệu thất bại, vui lòng nhập lại hoặc báo admin.",
		})
		return
	}

	//create a report for production value collection
	if itemtype == "whole" {
		_, err = s.mgdb.Collection("prodvalue").InsertOne(context.Background(), bson.M{
			"date": primitive.NewDateTimeFromTime(date), "item": itemcode, "itemtype": itemtype,
			"factory": factory, "prodtype": prodtype, "qty": qty, "value": value, "reporter": username, "createdat": primitive.NewDateTimeFromTime(time.Now()),
			"from": "pack", "refid": insertedResult.InsertedID,
		})
		if err != nil {
			log.Println(err)
			template.Must(template.ParseFiles("templates/pages/sections/pack/entry/form.html")).Execute(w, map[string]interface{}{
				"showErrDialog": true,
				"msgDialog":     "Kết nối cơ sở dữ liệu thất bại, vui lòng nhập lại hoặc báo admin.",
			})
			return
		}
	}
	template.Must(template.ParseFiles("templates/pages/sections/pack/entry/form.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Gửi dữ liệu thành công.",
	})
}

// ///////////////////////////////////////////////////////////////////////
// /sections/pack/admin - get page admin of pack section
// ///////////////////////////////////////////////////////////////////////
func (s *Server) spk_admin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/pack/admin/admin.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////
// /sections/pack/admin/loadreport - load report area on pack admin page
// ///////////////////////////////////////////////////////////////////////
func (s *Server) spka_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("pack").Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{"createdat": -1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var packReports []struct {
		ReportId    string    `bson:"_id"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		Value       float64   `bson:"value"`
		ProdType    string    `bson:"prodtype"`
		Itemcode    string    `bson:"itemcode"`
		ItemType    string    `bson:"itemtype"`
		Part        string    `bson:"part"`
		Factory     string    `bson:"factory"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}
	if err := cur.All(context.Background(), &packReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/pack/admin/report.html")).Execute(w, map[string]interface{}{
		"packReports":     packReports,
		"numberOfReports": len(packReports),
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/pack/admin/searchreport - search reports on page admin of pack section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) spka_searchreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	searchWord := r.FormValue("reportSearch")
	regexWord := ".*" + searchWord + ".*"
	dateSearch, err := time.Parse("2006-01-02", searchWord)
	var filter bson.M
	if err != nil {
		filter = bson.M{"$or": bson.A{
			bson.M{"itemcode": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"part": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"prodtype": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"itemtype": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"factory": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"reporter": bson.M{"$regex": regexWord, "$options": "i"}},
		},
		}
	} else {
		filter = bson.M{"date": primitive.NewDateTimeFromTime(dateSearch)}
	}
	cur, err := s.mgdb.Collection("pack").Find(context.Background(), filter, options.Find().SetSort(bson.M{"date": -1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var packReports []struct {
		ReportId    string    `bson:"_id"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		Value       float64   `bson:"value"`
		ProdType    string    `bson:"prodtype"`
		Itemcode    string    `bson:"itemcode"`
		ItemType    string    `bson:"itemtype"`
		Part        string    `bson:"part"`
		Factory     string    `bson:"factory"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}
	if err = cur.All(context.Background(), &packReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/pack/admin/report_tbody.html")).Execute(w, map[string]interface{}{
		"packReports": packReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/pack/admin/deletereport/:reportid - delete a report on page admin of pack section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) spka_deletereport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportid, _ := primitive.ObjectIDFromHex(ps.ByName("reportid"))

	deletedPackReport := s.mgdb.Collection("pack").FindOneAndDelete(context.Background(), bson.M{"_id": reportid})
	if deletedPackReport.Err() != nil {
		log.Println(deletedPackReport.Err())
		return
	}
	var packReport struct {
		ReportID string `bson:"_id"`
	}
	if err := deletedPackReport.Decode(&packReport); err != nil {
		log.Println(err)
	}
	refidObject, _ := primitive.ObjectIDFromHex(packReport.ReportID)
	// update production value
	result := s.mgdb.Collection("prodvalue").FindOneAndDelete(context.Background(), bson.M{"refid": refidObject})
	if result.Err() != nil {
		log.Println(result.Err())
	}
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/cutting/entry/woodrecoveryentry - get page entry of wood recovery of cutting section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sc_woodrecoveryentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/cutting/entry/woodrecovery.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/cutting/entry/woodrecoveryentry - get form
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sce_wr_loadform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/cutting/entry/wr_form.html")).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/cutting/entry/wr_sendentry - post form
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sce_wr_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, _ := r.Cookie("username")
	username := usernameToken.Value
	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))
	rate, _ := strconv.ParseFloat(r.FormValue("rate"), 64)
	prodtype := r.FormValue("prodtype")
	if r.FormValue("prodtype") == "" || r.FormValue("rate") == "" {
		template.Must(template.ParseFiles("templates/pages/sections/cutting/entry/wr_form.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thông tin bị thiếu, vui lòng nhập lại.",
		})
		return
	}
	_, err := s.mgdb.Collection("woodrecovery").InsertOne(context.Background(), bson.M{
		"date": primitive.NewDateTimeFromTime(date), "prodtype": prodtype, "rate": rate, "createdat": primitive.NewDateTimeFromTime(time.Now()), "reporter": username,
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/sections/cutting/entry/wr_form.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Kết nối cơ sở dữ liệu thất bại, vui lòng nhập lại hoặc báo admin.",
		})
		return
	}
	template.Must(template.ParseFiles("templates/pages/sections/cutting/entry/wr_form.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Gửi dữ liệu thành công.",
	})
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/panelcnc/overview - get page overview of panelcnc
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) spc_overview(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/panelcnc/overview/overview.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/panelcnc/overview/loadreport - load report table of page overview of panelcnc
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) spco_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("panelcnc").Aggregate(context.Background(), mongo.Pipeline{
		{{"$sort", bson.M{"createdat": -1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}},
			"startat":   bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$date", "timezone": "Asia/Bangkok"}},
			"endat":     bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$endat", "timezone": "Asia/Bangkok"}},
			"createdat": bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$createdat", "timezone": "Asia/Bangkok"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var panelcncReports []struct {
		ReportId    string  `bson:"_id"`
		Machine     string  `bson:"machine"`
		Date        string  `bson:"date"`
		Qty         float64 `bson:"qty"`
		StartAt     string  `bson:"startat"`
		EndAt       string  `bson:"endat"`
		Hours       float64 `bson:"hours"`
		Type        string  `bson:"type"`
		Reporter    string  `bson:"reporter"`
		CreatedDate string  `bson:"createdat"`
	}
	if err := cur.All(context.Background(), &panelcncReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/panelcnc/overview/report.html")).Execute(w, map[string]interface{}{
		"panelcncReports": panelcncReports,
		"numberOfReports": len(panelcncReports),
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/panelcnc/admin/searchreport - search reports on page admin of panelcnc section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) spco_reportsearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportsearch := r.FormValue("reportsearch")
	regexWord := ".*" + reportsearch + ".*"
	searchFilter := r.FormValue("searchFilter")

	cur, err := s.mgdb.Collection("panelcnc").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{searchFilter: bson.M{"$regex": regexWord, "$options": "i"}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}},
			"startat":   bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$date", "timezone": "Asia/Bangkok"}},
			"endat":     bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$endat", "timezone": "Asia/Bangkok"}},
			"createdat": bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$createdat", "timezone": "Asia/Bangkok"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var panelcncReports []struct {
		ReportId    string  `bson:"_id"`
		Machine     string  `bson:"machine"`
		Date        string  `bson:"date"`
		Qty         float64 `bson:"qty"`
		StartAt     string  `bson:"startat"`
		EndAt       string  `bson:"endat"`
		Hours       float64 `bson:"hours"`
		Type        string  `bson:"type"`
		Reporter    string  `bson:"reporter"`
		CreatedDate string  `bson:"createdat"`
	}
	if err = cur.All(context.Background(), &panelcncReports); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/sections/panelcnc/overview/report_tbody.html")).Execute(w, map[string]interface{}{
		"panelcncReports": panelcncReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/panelcnc/entry - load page entry of panelcnc section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) spc_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/panelcnc/entry/entry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/panelcnc/entry/loadform - load form of page entry of panelcnc section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) spc_loadform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/panelcnc/entry/form.html")).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/panelcnc/entry/sendentry - post form of page entry of panelcnc section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) spc_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, _ := r.Cookie("username")
	username := usernameToken.Value
	machine := r.FormValue("machine")
	start, _ := time.Parse("2006-01-02T15:04", r.FormValue("start"))
	end, _ := time.Parse("2006-01-02T15:04", r.FormValue("end"))
	hours := math.Round(end.Sub(start).Hours()*10) / 10
	qty, _ := strconv.Atoi(r.FormValue("qty"))
	operator := r.FormValue("operator")
	paneltype := r.FormValue("type")

	if paneltype == "" || machine == "" || r.FormValue("qty") == "" || hours <= 0 {
		template.Must(template.ParseFiles("templates/pages/sections/panelcnc/entry/form.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thông tin bị thiếu hoặc sai, vui lòng nhập lại.",
		})
		return
	}
	_, err := s.mgdb.Collection("panelcnc").InsertOne(context.Background(), bson.M{
		"date": primitive.NewDateTimeFromTime(start), "endat": primitive.NewDateTimeFromTime(end),
		"qty": qty, "createdat": primitive.NewDateTimeFromTime(time.Now()), "reporter": username,
		"machine": machine, "operator": operator, "type": paneltype, "hours": hours,
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/sections/panelcnc/entry/form.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Kết nối cơ sở dữ liệu thất bại, vui lòng nhập lại hoặc báo admin.",
		})
		return
	}
	template.Must(template.ParseFiles("templates/pages/sections/panelcnc/entry/form.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Gửi dữ liệu thành công.",
	})
}

// ///////////////////////////////////////////////////////////////////////
// /sections/panelcnc/admin - get page admin of panelcnc section
// ///////////////////////////////////////////////////////////////////////
func (s *Server) spc_admin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/panelcnc/admin/admin.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////
// /sections/veneer/admin/loadreport - load report area on veneer admin page
// ///////////////////////////////////////////////////////////////////////
func (s *Server) spca_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("panelcnc").Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{"createdat": -1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var panelcncReports []struct {
		ReportId    string    `bson:"_id"`
		Machine     string    `bson:"machine"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		StartAt     time.Time `bson:"startat"`
		EndAt       time.Time `bson:"endat"`
		Hours       float64   `bson:"hours"`
		Type        string    `bson:"type"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}
	if err := cur.All(context.Background(), &panelcncReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/panelcnc/admin/report.html")).Execute(w, map[string]interface{}{
		"panelcncReports": panelcncReports,
		"numberOfReports": len(panelcncReports),
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/panelcnc/admin/searchreport - search reports on page admin of panelcnc section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) spca_searchreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	searchWord := r.FormValue("reportSearch")
	regexWord := ".*" + searchWord + ".*"
	dateSearch, err := time.Parse("2006-01-02", searchWord)

	var filter bson.M
	if err != nil {
		filter = bson.M{"$or": bson.A{
			bson.M{"machine": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"type": bson.M{"$regex": regexWord, "$options": "i"}},
			bson.M{"reporter": bson.M{"$regex": regexWord, "$options": "i"}},
		},
		}
	} else {
		filter = bson.M{"date": primitive.NewDateTimeFromTime(dateSearch)}
	}
	cur, err := s.mgdb.Collection("panelcnc").Find(context.Background(), filter, options.Find().SetSort(bson.M{"date": -1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var panelcncReports []struct {
		ReportId    string    `bson:"_id"`
		Machine     string    `bson:"machine"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		StartAt     time.Time `bson:"startat"`
		EndAt       time.Time `bson:"endat"`
		Hours       float64   `bson:"hours"`
		Type        string    `bson:"type"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}
	if err = cur.All(context.Background(), &panelcncReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/panelcnc/admin/report_tbody.html")).Execute(w, map[string]interface{}{
		"panelcncReports": panelcncReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/panelcnc/admin/deletereport/:reportid - delete a report on page admin of panelcnc section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) spca_deletereport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportid, _ := primitive.ObjectIDFromHex(ps.ByName("reportid"))

	_, err := s.mgdb.Collection("panelcnc").DeleteOne(context.Background(), bson.M{"_id": reportid})
	if err != nil {
		log.Println(err)
		return
	}
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /6s/overview - get page overview of 6S
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) s_overview(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	template.Must(template.ParseFiles(
		"templates/pages/6s/overview/overview.html",
		"templates/shared/navbar.html")).Execute(w, nil)
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /6s/entry - get page entry of 6S
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) s6_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	template.Must(template.ParseFiles(
		"templates/pages/6s/entry/entry.html",
		"templates/shared/navbar.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": false,
		"showErrorDialog":   false,
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /6s/entry - send fast entry of 6S
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) s6_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	rawdate := r.FormValue("occurdate")
	date, _ := time.Parse("Jan 02, 2006", rawdate)
	strdate := date.Format("2006-01-02")

	rawscorelist := r.FormValue("scorelist")
	scores := strings.Fields(rawscorelist)

	if len(scores)%2 != 0 || len(scores) == 0 {
		template.Must(template.ParseFiles("templates/pages/6s/entry/entry.html", "templates/shared/navbar.html")).Execute(w, map[string]interface{}{
			"showSuccessDialog": false,
			"showErrorDialog":   true,
		})
		return
	}

	// convert to json string
	var jsonStr = `[`
	for i := 0; i < len(scores); i += 2 {
		scores[i] = strings.ToLower(strings.Replace(scores[i], "_", " ", -1))
		jsonStr += `{"area":"` + scores[i] + `", "score":` + scores[i+1] + `,"datestr":"` + strdate + `"},`
	}
	jsonStr = jsonStr[:len(jsonStr)-1] + `]`

	model := models.NewSixSModel(s.mgdb)
	if err := model.InsertMany(jsonStr); err != nil {
		template.Must(template.ParseFiles("templates/pages/6s/entry/entry.html", "templates/shared/navbar.html")).Execute(w, map[string]interface{}{
			"showSuccessDialog": false,
			"showErrorDialog":   true,
		})
		return
	}

	template.Must(template.ParseFiles("templates/pages/6s/entry/entry.html", "templates/shared/navbar.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"showErrorDialog":   false,
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /6s/admin - get admin page of 6S
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) s6_admin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	template.Must(template.ParseFiles(
		"templates/pages/6s/admin/admin.html",
		"templates/shared/navbar.html")).Execute(w, nil)
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /sections/packing/overview - get overview page of packing
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sp_overview(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/packing/overview/overview.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /sections/packing/entry - get entry page of packing
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sp_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	template.Must(template.ParseFiles(
		"templates/pages/sections/packing/entry/entry.html",
		"templates/shared/navbar.html")).Execute(w, nil)
}

func (s *Server) sp_loadentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// tìm những mo nào chưa done để hiện thị ra bảng
	results := models.NewMoModel(s.mgdb).FindNotDone()

	for i := 0; i < len(results); i++ {
		results[i].DonePercent = float64(results[i].DoneQty) / float64(results[i].NeedQty) * 100
	}

	template.Must(template.ParseFiles(
		"templates/pages/sections/packing/entry/main.html")).Execute(w, map[string]interface{}{
		"maxpage": len(results)/5 + 1,
		"results": results[0:5],
	})
}

func (s *Server) sp_mobystatus(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	results := models.NewMoModel(s.mgdb).SeachMo(ps.ByName("status"), "mo", "")
	for i := 0; i < len(results); i++ {
		results[i].DonePercent = float64(results[i].DoneQty) / float64(results[i].NeedQty) * 100
	}
	template.Must(template.ParseFiles("templates/pages/sections/packing/entry/mo_tbl.html")).Execute(w, map[string]interface{}{
		"results": results,
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /sections/packing/entry/mosearch - search mo on packing entry page
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sp_mosearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	results := models.NewMoModel(s.mgdb).SeachMo(r.FormValue("moStatus"), r.FormValue("searchFilter"), r.FormValue("mosearch"))
	for i := 0; i < len(results); i++ {
		results[i].DonePercent = float64(results[i].DoneQty) / float64(results[i].NeedQty) * 100
	}
	template.Must(template.ParseFiles("templates/pages/sections/packing/entry/mo_tbl.html")).Execute(w, map[string]interface{}{
		"results": results,
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////
// /sections/packing/entry/itemparts/:mo/:itemid - get form input when choose item
// ////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sp_itemparts(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	itemid := ps.ByName("itemid")
	mo := ps.ByName("mo")
	pi := ps.ByName("pi")

	result := models.NewMoModel(s.mgdb).FindByMoItemPi(mo, itemid, pi)
	if result.DoneQty == result.NeedQty {
		template.Must(template.ParseFiles("templates/shared/dialog.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"dialogMessage":     "Sản phẩm này đã đủ số lượng",
			"dialogRedirectUrl": "/sections/packing/entry",
		})
		return
	}
	resultJson, err := json.Marshal(result)
	if err != nil {
		log.Println(err)
	}

	// if item in mo don't have part, initialize parts
	if len(result.Item.Parts) == 0 {
		template.Must(template.ParseFiles("templates/pages/sections/packing/entry/initialparts.html")).Execute(w, map[string]interface{}{
			"resultJson": string(resultJson),
		})
		return
	}
	template.Must(template.ParseFiles(
		"templates/pages/sections/packing/entry/itempart_tbl.html")).Execute(w, map[string]interface{}{
		"parts":      result.Item.Parts,
		"resultJson": string(resultJson),
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////
// /sections/packing/entry/itempart - chỉ nhập số lượng để khởi tạo part
// ////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sp_itempart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	if r.FormValue("partnumber") == "" {
		template.Must(template.ParseFiles("templates/shared/dialog.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"dialogMessage":     "Số lượng part chưa được chọn",
			"dialogRedirectUrl": "/sections/packing/entry",
		})
		return
	}
	numberOfParts, _ := strconv.Atoi(r.FormValue("partnumber"))
	var result models.MoRecord

	if err := json.Unmarshal([]byte(r.FormValue("resultJson")), &result); err != nil {
		log.Println("sp_initparts: ", err)
	}

	partStr := `[
		{"id":"` + result.Item.Id + `_P1", "name":"Part 1/` + strconv.Itoa(numberOfParts) + ` of ` + result.Item.Name + `"}`
	for i := 1; i < numberOfParts; i++ {
		partStr += `,{"id":"` + result.Item.Id + `_P` + strconv.Itoa(i+1) + `", "name":"Part ` + strconv.Itoa(i+1) + `/` + strconv.Itoa(numberOfParts) + ` of ` + result.Item.Name + `"}`
	}
	partStr += `]`

	// initialize parts on mo collection
	if err := models.NewMoModel(s.mgdb).InitPart(result, partStr); err != nil {
		log.Println(err)
		return
	}

	// update on item collection
	if err := models.NewItemModel(s.mgdb).UpdateParts(result.Item.Id, partStr); err != nil {
		log.Println(err)
		return
	}

	template.Must(template.ParseFiles("templates/shared/dialog.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"dialogMessage":     "Cập nhật part sản phẩm thành công",
		"dialogRedirectUrl": "/sections/packing/entry",
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////
// /sections/packing/entry/initparts - initialize parts of item in mo
// ////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sp_initparts(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	if r.FormValue("partcode1") == "" || r.FormValue("partname1") == "" {
		w.Write([]byte("Phải có ít nhất 1 part"))
		return
	}

	partStr := `[
		{"id":"` + r.FormValue("partcode1") + `", "name":"` + r.FormValue("partname1") + `"}`

	if r.FormValue("partcode2") != "" || r.FormValue("partname2") != "" {
		partStr += `,{"id":"` + r.FormValue("partcode2") + `", "name":"` + r.FormValue("partname2") + `"}`
	}

	if r.FormValue("partcode3") != "" || r.FormValue("partname3") != "" {
		partStr += `,{"id":"` + r.FormValue("partcode3") + `", "name":"` + r.FormValue("partname3") + `"}`
	}

	if r.FormValue("partcode4") != "" || r.FormValue("partname4") != "" {
		partStr += `,{"id":"` + r.FormValue("partcode4") + `", "name":"` + r.FormValue("partname4") + `"}`
	}
	partStr += `]`

	var result models.MoRecord

	if err := json.Unmarshal([]byte(r.FormValue("resultJson")), &result); err != nil {
		log.Println("sp_initparts: ", err)
	}

	// initialize parts on mo collection
	if err := models.NewMoModel(s.mgdb).InitPart(result, partStr); err != nil {
		log.Println(err)
		return
	}

	// update on item collection
	if err := models.NewItemModel(s.mgdb).UpdateParts(result.Item.Id, partStr); err != nil {
		log.Println(err)
		return
	}

	template.Must(template.ParseFiles("templates/shared/dialog.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"dialogMessage":     "Cập nhật part sản phẩm thành công",
		"dialogRedirectUrl": "/sections/packing/entry",
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////
// /sections/packing/entry/maxpartqtyinput - get max quantity of parts of item
// ////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sp_getinputmax(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// tính max value của thanh slider
	var result models.MoRecord

	if err := json.Unmarshal([]byte(r.FormValue("resultJson")), &result); err != nil {
		log.Println("sp_getinputmax: ", err)
	}

	var maxInputQty int
	for _, p := range result.Item.Parts {
		if r.FormValue("itempart") == p.Id {
			maxInputQty = result.NeedQty - p.DoneQty
		}
	}

	template.Must(template.ParseFiles(
		"templates/pages/sections/packing/entry/qtyinput_slider.html")).Execute(w, map[string]interface{}{
		"maxInputQty": maxInputQty,
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /sections/packing/sendentry - create packing report, update motracking, check and create production value report
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sp_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameTk, err := r.Cookie("username")
	if err != nil {
		log.Println(err)
		http.Redirect(w, r, "/login", http.StatusSeeOther)
		return
	}

	var result models.MoRecord
	json.Unmarshal([]byte(r.FormValue("resultJson")), &result)

	inputDate, _ := time.Parse("2006-01-02", r.FormValue("occurdate"))

	updatedPartId := r.FormValue("itempart")
	incDonePartQty, _ := strconv.Atoi(r.FormValue("partqtyInput"))

	var qtyArr = []int{}
	var updatedPartName string

	for _, p := range result.Item.Parts {
		if updatedPartId == p.Id {
			qtyArr = append(qtyArr, incDonePartQty+p.DoneQty)
			updatedPartName = p.Name
		} else {
			qtyArr = append(qtyArr, p.DoneQty)
		}
	}

	// số bộ mới sinh ra sau khi cập nhật số lượng part
	theMin := qtyArr[0]
	for _, i := range qtyArr {
		if theMin >= i {
			theMin = i
		}
	}
	incDoneItemQty := theMin - result.DoneQty
	if incDoneItemQty < 0 {
		incDoneItemQty = 0
	}

	/////////////////////////////////////////////////
	// update mo with status of mo in 'mo' collection
	/////////////////////////////////////////////////
	newStatus := result.Status
	if result.NeedQty == result.DoneQty+incDoneItemQty {
		newStatus = "done"
	}

	if err := models.NewMoModel(s.mgdb).UpdatePartDoneIncQty(result.Mo, result.PI, result.Item.Id, updatedPartId, incDonePartQty, incDoneItemQty, newStatus); err != nil {
		log.Println("sp_sendentry: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("failed to update mo collection"))
		return
	}

	// create report for collection packing
	var newPackRecord = models.PackingRecord{
		Date:     inputDate,
		Mo:       result.Mo,
		Factory:  r.FormValue("factory"),
		ProdType: r.FormValue("prodtype"),
		Product: struct {
			Id   string "bson:\"id\" json:\"id\""
			Name string "bson:\"name\" json:\"name\""
		}{
			Id:   updatedPartId,
			Name: updatedPartName,
		},
		Parent: struct {
			Id      string  "bson:\"id\" json:\"id\""
			Name    string  "bson:\"name\" json:\"name\""
			NoParts int     "bson:\"noparts\" json:\"noparts\""
			Price   float64 "bson:\"price\" json:\"price\""
		}{
			Id:      result.Item.Id,
			Name:    result.Item.Name,
			NoParts: len(result.Item.Parts),
			Price:   result.Price,
		},
		Qty:       incDonePartQty,
		Value:     result.Price / float64(len(result.Item.Parts)) * float64(incDonePartQty),
		Reporter:  usernameTk.Value,
		CreatedAt: time.Now(),
	}

	_, err = models.NewPackingModel(s.mgdb).InsertNewReport(newPackRecord)
	if err != nil {
		log.Println("sp_sendentry: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("failed to update packing collection"))
		return
	}

	//////////////////////////////////////////////
	// update data for packchart in dashboard page
	//////////////////////////////////////////////
	xtype := r.FormValue("factory") + "-" + r.FormValue("prodtype")
	_, err = s.mgdb.Collection("packchart").UpdateOne(context.Background(), bson.M{
		"of": "packchart", "date": primitive.NewDateTimeFromTime(inputDate),
	}, bson.M{
		"$inc": bson.M{xtype: result.Price / float64(len(result.Item.Parts)) * float64(incDonePartQty)},
	}, options.Update().SetUpsert(true))
	if err != nil {
		log.Println("upsert packchart failed: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("failed to update packchart collection"))
		return
	}

	/////////////////////////////////////////////////
	// create report for collection production value
	/////////////////////////////////////////////////
	if incDoneItemQty > 0 {
		prodvalRecord := models.ProValRecord{
			Date:     inputDate,
			Factory:  r.FormValue("factory"),
			ProdType: r.FormValue("prodtype"),
			Item:     result.Item.Id,
			Qty:      incDoneItemQty,
			Value:    result.Price * float64(incDoneItemQty),
			// IdFromOrigin: sresult.InsertedID,
		}

		if err := models.NewProValModel(s.mgdb).Create(prodvalRecord); err != nil {
			log.Println("sp_sendentry: ", err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("failed to update prodvalue collection"))
			return
		}
	}

	http.Redirect(w, r, "/sections/packing/entry", http.StatusSeeOther)
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /sections/packing/admin - get admin page of packing
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sp_admin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/packing/admin/admin.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// bản tạm cho packing
func (s *Server) sp_entrytmp(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/packing/entry/entry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// end bản tạm cho packing

// ////////////////////////////////////////////////////////////////////////////////////////////
// /target/entry - get page target entry
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) tg_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/target/entry/entry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /target/entry - get page target entry
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) tge_loadsectionentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/target/entry/sectiontarget.html")).Execute(w, nil)
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /target/entry/settarget - post settarget in page target entry
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) tge_settarget(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	targetname := r.FormValue("targetname")
	targetstart, _ := time.Parse("2006-01-02", r.FormValue("targetstart"))
	targetend, _ := time.Parse("2006-01-02", r.FormValue("targetend"))
	weekdays := strings.Fields(r.FormValue("weekdays"))
	target, _ := strconv.Atoi(r.FormValue("target"))

	if targetname == "" || r.FormValue("target") == "" || r.FormValue("weekdays") == "" {
		template.Must(template.ParseFiles("templates/pages/target/entry/sectiontarget.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thiếu thông tin, vui lòng nhập lại.",
		})
		return
	}

	var intWeekDays []int
	for _, d := range weekdays {
		t, _ := strconv.Atoi(d)
		intWeekDays = append(intWeekDays, t)
	}

	var bdoc []interface{}
	for tmpdate := targetstart; tmpdate.Sub(targetend) <= 0; tmpdate = tmpdate.AddDate(0, 0, 1) {
		if slices.Contains(intWeekDays, int(tmpdate.Weekday())) {
			b := bson.M{
				"name": targetname, "date": primitive.NewDateTimeFromTime(tmpdate), "value": target,
			}
			bdoc = append(bdoc, b)
		}
	}

	_, err := s.mgdb.Collection("target").InsertMany(context.Background(), bdoc, options.InsertMany())
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/target/entry/sectiontarget.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Cập nhật thất bại, vui lòng nhập lại.",
		})
		return
	}

	template.Must(template.ParseFiles("templates/pages/target/entry/sectiontarget.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Đã đặt target thành công",
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /quality/entry - copy paste report for quality
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) q_fastentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/quality/entry/entry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /quality/loadform - load form of report for quality
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) q_loadform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/quality/entry/form.html")).Execute(w, nil)
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /quality/sendentry - post report for quality
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) q_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	lines := strings.Split(strings.Trim(r.FormValue("list"), "\n"), "\n")
	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))

	var jsonStr = `[`
	for _, line := range lines {
		raw := strings.Fields(line)
		section := raw[0]
		checkedqty := raw[1]
		failedqty := "0"
		if len(raw) == 3 {
			failedqty = raw[2]
		}

		jsonStr += `{
			"date":"` + date.Format("2006-01-02") + `", 
			"section":"` + section + `", 
			"checkedqty":` + checkedqty + `,
			"failedqty":` + failedqty + `
			},`
	}
	jsonStr = jsonStr[:len(jsonStr)-1] + `]`

	var bdoc []interface{}
	err := bson.UnmarshalExtJSON([]byte(jsonStr), true, &bdoc)
	if err != nil {
		log.Print(err)
		template.Must(template.ParseFiles("templates/pages/quality/entry/form.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Lỗi decode. Vui lòng liên hệ admin.",
		})
		return
	}
	_, err = s.mgdb.Collection("quality").InsertMany(context.Background(), bdoc)
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/quality/entry/form.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Kết nối database thất bại. Vui lòng liên hệ admin.",
		})
		return
	}
	template.Must(template.ParseFiles("templates/pages/quality/entry/form.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Gửi dữ liệu thành công.",
	})
}

// /////////////////////////////////////////////////////////////////////////////////////////
// /mo/entry - get entry page of mo
// /////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) mo_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/mo/entry/entry.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// /////////////////////////////////////////////////////////////////////////////////////////
// /mo/entry - post entry page of mo
// /////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) mo_insertMoList(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	const MAX = 32 << 20
	r.ParseMultipartForm(MAX)
	file, _, err := r.FormFile("inputfile")
	if err != nil {
		log.Println(err)
	}
	defer file.Close()
	f, err := excelize.OpenReader(file)
	if err != nil {
		log.Println(err)
	}
	defer f.Close()

	rows, _ := f.Rows("Sheet1")

	var jsonStr = `[`
	rows.Next()
	for rows.Next() {
		row, _ := rows.Columns()
		jsonStr += `{
			"mo":"` + row[0] + `",
			"item":{
				"id":"` + row[1] + `",
				"name":"` + row[2] + `"},
			"pi":"` + row[3] + `", 
			"needqty":` + row[10] + `, 
			"finish_desc": "` + row[5] + `", 
			"me_fib_finish": "` + row[6] + `", 
			"note": "` + row[7] + `", 
			"price": ` + row[8] + `, 
			"customer": "` + row[9] + `", 
			"productqty":` + row[4] + `, 
			"doneqty": 0, 
			"status": "raw"},`
	}
	jsonStr = jsonStr[:len(jsonStr)-1] + `]`

	// chưa xong để làm xong phần item rồi truy xuất colllection item để lấy parts

	model := models.NewMoModel(s.mgdb)
	if err := model.InsertMany(jsonStr); err != nil {
		log.Println("success")
		return
	}

	// template.Must(template.ParseFiles("templates/pages/6s/entry/entry.html", "templates/shared/navbar.html")).Execute(w, map[string]interface{}{
	// 	"showSuccessDialog": true,
	// 	"showErrorDialog":   false,
	// })
}

func (s *Server) mo_admin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	template.Must(template.ParseFiles(
		"templates/pages/mo/admin/admin.html",
		"templates/shared/navbar.html")).Execute(w, map[string]interface{}{
		"moareaData": nil,
	})
}

// /////////////////////////////////////////////////////////////////////////////////////////
// /item/entry - get entry page of item
// /////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) i_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	template.Must(template.ParseFiles("templates/pages/item/entry/entry.html", "templates/shared/navbar.html")).Execute(w, nil)
}

func (s *Server) i_importitemlist(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	const MAX = 32 << 20
	r.ParseMultipartForm(MAX)
	file, _, err := r.FormFile("inputfile")
	if err != nil {
		log.Println(err)
	}
	defer file.Close()
	f, err := excelize.OpenReader(file)
	if err != nil {
		log.Println(err)
	}
	defer f.Close()

	rows, _ := f.Rows("Sheet1")

	var jsonStr = `[`
	for rows.Next() {
		row, _ := rows.Columns()
		jsonStr += `{
		"id":"` + row[0] + `", 
		"name":"` + row[1] + `"},`

	}
	jsonStr = jsonStr[:len(jsonStr)-1] + `]`

	if err := models.NewItemModel(s.mgdb).InsertByStringJson(jsonStr); err != nil {
		log.Println(err)
		return
	}
}

// /////////////////////////////////////////////////////////////////////////////////////////
// /item/admin - get admin page of item
// /////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) i_admin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("item").Find(context.Background(), bson.M{})
	if err != nil {
		log.Println(err)
		return
	}
	defer cur.Close(context.Background())

	var results []struct {
		Id    string `bson:"id"`
		Name  string `bson:"name"`
		Parts []struct {
			Id   string `bson:"id"`
			Name string `bson:"name"`
			Qty  int    `bson:"qty"`
		} `bson:"parts"`
	}

	if err := cur.All(context.Background(), &results); err != nil {
		log.Println(err)
		return
	}

	template.Must(template.ParseFiles(
		"templates/pages/item/admin/admin.html",
		"templates/shared/navbar.html")).Execute(w, map[string]interface{}{
		"itemList": results,
	})
}

func (s *Server) i_additem(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	itemid := r.FormValue("itemid")
	itemname := r.FormValue("itemname")

	var item = models.Item{
		Id:   itemid,
		Name: itemname,
	}

	if err := models.NewItemModel(s.mgdb).InsertItem(item); err != nil {
		log.Println(err)
	}
	// template.Must(template.ParseFiles("templates/pages/item/admin/item_tbody.html")).Execute(w, map[string]interface{}{})
}

func (s *Server) i_addpart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pitemid := r.FormValue("pitemid")
	partid := r.FormValue("partid")
	partname := r.FormValue("partname")

	filter := bson.M{
		"id": pitemid,
	}
	update := bson.M{
		"$push": bson.M{"parts": bson.M{"id": partid, "name": partname}},
	}
	_, err := s.mgdb.Collection("item").UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Println(err)
	}
	cur, _ := s.mgdb.Collection("item").Find(context.Background(), bson.M{})
	defer cur.Close(context.Background())

	var itemList []models.Item
	cur.All(context.Background(), &itemList)

	template.Must(template.ParseFiles("templates/pages/item/admin/item_tbody.html")).Execute(w, map[string]interface{}{
		"itemList":          itemList,
		"showSuccessDialog": true,
	})

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

func (s *Server) testload(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/packing/overview/testload.html")).Execute(w, nil)
}
