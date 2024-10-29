package app

import (
	"bufio"
	"context"
	"dannyroman2015/phoebe/internal/models"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"math"
	"math/rand"
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
	"golang.org/x/text/language"
	"golang.org/x/text/message"
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
	// pipeline := mongo.Pipeline{
	// 	{{"$match", bson.M{"type": "report", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -15))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
	// 	{{"$addFields", bson.M{"is25": bson.M{"$eq": bson.A{"$thickness", 25}}}}},
	// 	{{"$group", bson.M{"_id": bson.M{"date": "$date", "is25": "$is25"}, "qty": bson.M{"$sum": "$qtycbm"}}}},
	// 	{{"$sort", bson.D{{"_id.date", 1}, {"_id.is25", 1}}}},
	// 	{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "is25": "$_id.is25"}}},
	// 	{{"$unset", "_id"}},
	// }
	pipeline := mongo.Pipeline{
		{{"$match", bson.M{"type": "report", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -12))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "is25reeded": "$is25reeded"}, "qty": bson.M{"$sum": "$qtycbm"}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.is25reeded", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "is25": "$_id.is25reeded"}}},
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

	//get wood return
	cur, err = s.mgdb.Collection("cutting").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"type": "return", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -12))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "is25": "$is25"}, "qty": bson.M{"$sum": "$qtycbm"}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.is25", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "is25": "$_id.is25"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
		return
	}
	var cuttingReturnData []struct {
		Date string  `bson:"date" json:"date"`
		Is25 bool    `bson:"is25" json:"is25"`
		Qty  float64 `bson:"qty" json:"qty"`
	}
	if err := cur.All(context.Background(), &cuttingReturnData); err != nil {
		log.Println(err)
		return
	}

	//get fine wood
	cur, err = s.mgdb.Collection("cutting").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"type": "fine", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -12))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": "$date", "qty": bson.M{"$sum": "$qtycbm"}}}},
		{{"$sort", bson.D{{"_id", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id"}}}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
		return
	}
	var cuttingFineData []struct {
		Date string  `bson:"date" json:"date"`
		Qty  float64 `bson:"qty" json:"qty"`
	}
	if err := cur.All(context.Background(), &cuttingFineData); err != nil {
		log.Println(err)
		return
	}

	//get target data for leftchart
	sr := s.mgdb.Collection("cutting").FindOne(context.Background(), bson.M{"type": "target"}, options.FindOne().SetSort(bson.M{"startdate": -1}))
	if sr.Err() != nil {
		log.Println(sr.Err())
	}
	var targetactualData struct {
		Name      string    `bson:"name" json:"name"`
		StartDate time.Time `bson:"startdate"`
		EnddDate  time.Time `bson:"enddate"`
		Detail    []struct {
			Type   string  `bson:"type" json:"type"`
			Target float64 `bson:"target" json:"target"`
		} `bson:"detail" json:"detail"`
		StartDateStr string `json:"startdate"`
		EndDateStr   string `json:"enddate"`
	}
	if err := sr.Decode(&targetactualData); err != nil {
		log.Println(err)
	}
	targetactualData.StartDateStr = targetactualData.StartDate.Format("02/01/2006")
	targetactualData.EndDateStr = targetactualData.EnddDate.Format("02/01/2006")

	cur, err = s.mgdb.Collection("cutting").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"type": "fine"}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(targetactualData.StartDate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(targetactualData.EnddDate)}}}}}},
		{{"$set", bson.M{"is25reeded": bson.M{"$ifNull": bson.A{"$is25reeded", false}}}}},
		{{"$group", bson.M{"_id": "$is25reeded", "qty": bson.M{"$sum": "$qtycbm"}}}},
		{{"$sort", bson.D{{"_id", 1}}}},
		{{"$set", bson.M{"prodtype": "$_id"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
		return
	}
	defer cur.Close(context.Background())
	var cuttingProdtypeData []struct {
		Prodtype bool    `bson:"prodtype" json:"prodtype"`
		Qty      float64 `bson:"qty" json:"qty"`
	}

	if err = cur.All(context.Background(), &cuttingProdtypeData); err != nil {
		log.Println(err)
		return
	}

	if len(cuttingProdtypeData) == 1 {
		if cuttingProdtypeData[0].Prodtype {
			cuttingProdtypeData = append(cuttingProdtypeData, struct {
				Prodtype bool    `bson:"prodtype" json:"prodtype"`
				Qty      float64 `bson:"qty" json:"qty"`
			}{
				Prodtype: false, Qty: 0,
			})
		} else {
			cuttingProdtypeData = append(cuttingProdtypeData, struct {
				Prodtype bool    `bson:"prodtype" json:"prodtype"`
				Qty      float64 `bson:"qty" json:"qty"`
			}{
				Prodtype: true, Qty: 0,
			})
		}
	}

	//get target line data of cutting
	cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"name": "cutting total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -12))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
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
	// get last update time of cutting
	cuttingSr := s.mgdb.Collection("cutting").FindOne(context.Background(), bson.M{"type": "report"}, options.FindOne().SetSort(bson.M{"createddate": -1}))
	if cuttingSr.Err() != nil {
		log.Println(cuttingSr.Err())
	}
	var cuttingLastReport struct {
		CreatedDate time.Time `bson:"createddate" json:"createddate"`
	}
	if err := cuttingSr.Decode(&cuttingLastReport); err != nil {
		log.Println(err)
	}
	cuttingUpTime := cuttingLastReport.CreatedDate.Add(7 * time.Hour).Format("15:04")

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
	if err = cur.All(context.Background(), &laminationTarget); err != nil {
		log.Println(err)
	}
	// get last update time of lamination
	laminationSr := s.mgdb.Collection("lamination").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
	if cuttingSr.Err() != nil {
		log.Println(cuttingSr.Err())
	}
	var laminationLastReport struct {
		CreatedDate time.Time `bson:"createdat" json:"createdat"`
	}
	if err := laminationSr.Decode(&laminationLastReport); err != nil {
		log.Println(err)
	}
	laminationUpTime := laminationLastReport.CreatedDate.Add(7 * time.Hour).Format("15:04")

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
		"cuttingReturnData":   cuttingReturnData,
		"cuttingFineData":     cuttingFineData,
		"targetactualData":    targetactualData,
		"cuttingProdtypeData": cuttingProdtypeData,
		"cuttingTarget":       cuttingTarget,
		"cuttingUpTime":       cuttingUpTime,
		"laminationChartData": laminationChartData,
		"laminationTarget":    laminationTarget,
		"laminationUpTime":    laminationUpTime,
		"packingData":         packchartData,
	})
}

// //////////////////////////////////////////////////////////
// router.GET("/dashboard/loadrawwood", s.d_loadrawwood)
// //////////////////////////////////////////////////////////
func (s *Server) d_loadrawwood(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// get data of raw wood input
	cur, err := s.mgdb.Collection("rawwood").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"type": "import"}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -15))}}}}}},
		{{"$group", bson.M{"_id": "$date", "qty": bson.M{"$sum": "$qty"}}}},
		{{"$sort", bson.M{"_id": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id"}}}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var rawwoodImportData []struct {
		Date string  `bson:"date" json:"date"`
		Qty  float64 `bson:"qty" json:"qty"`
	}
	if err := cur.All(context.Background(), &rawwoodImportData); err != nil {
		log.Println(err)
	}

	// get data of selection
	cur, err = s.mgdb.Collection("rawwood").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"type": "selection"}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -15))}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "woodtone": "$woodtone"}, "qty": bson.M{"$sum": "$qty"}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.woodtone", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "woodtone": "$_id.woodtone"}}},
		{{"$unset", bson.A{"_id.date", "_id.woodtone"}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var rawwoodSelectionData []struct {
		Date     string  `bson:"date" json:"date"`
		Woodtone string  `bson:"woodtone" json:"woodtone"`
		Qty      float64 `bson:"qty" json:"qty"`
	}
	if err := cur.All(context.Background(), &rawwoodSelectionData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/dashboard/rawwood.html")).Execute(w, map[string]interface{}{
		"rawwoodImportData":    rawwoodImportData,
		"rawwoodSelectionData": rawwoodSelectionData,
	})
}

// //////////////////////////////////////////////////////////
// /dashboard/loadproduction - load production area in dashboard
// //////////////////////////////////////////////////////////
func (s *Server) d_loadproduction(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pvPipeline := mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -20))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "factory": "$factory", "prodtype": "$prodtype", "item": "$item"}, "value": bson.M{"$sum": "$value"}}}},
		{{"$sort", bson.M{"_id.date": -1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "factory": bson.M{"$concat": bson.A{"Factory ", "$_id.factory"}}, "type": bson.M{"$toUpper": "$_id.prodtype"}, "item": "$_id.item"}}},
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
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "factory": bson.M{"$concat": bson.A{"Factory ", "$_id.factory"}}, "type": bson.M{"$toUpper": "$_id.prodtype"}, "item": "$_id.item"}}},
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
			{{"$group", bson.M{"_id": "$date", "value": bson.M{"$sum": "$value"}}}},
			{{"$sort", bson.M{"_id": 1}}},
			{{"$group", bson.M{"_id": bson.M{"$month": "$_id"}, "value": bson.M{"$push": "$value"}}}},
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

		var productiondata []PP
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
			productiondata = append(productiondata, a)
		}

		template.Must(template.ParseFiles("templates/pages/dashboard/prod_mtd.html")).Execute(w, map[string]interface{}{
			"productiondata": productiondata,
		})
	}
}

// /////////////////////////////////////////////////////////////
// /dashboard/loadreededline - load reededline area in dashboard
// /////////////////////////////////////////////////////////////
func (s *Server) d_loadreededline(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("reededline").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -20))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "tone": "$tone"}, "qty": bson.M{"$sum": "$qty"}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.tone", 1}}}},
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

	// get data of Gỗ 25 of cutting
	cur, err = s.mgdb.Collection("cutting").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"is25reeded": true}, bson.M{"type": "report"}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -20))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": "$date", "qty": bson.M{"$sum": "$qtycbm"}}}},
		{{"$sort", bson.M{"_id": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id"}}}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	var wood25data []struct {
		Date string  `bson:"date" json:"date"`
		Qty  float64 `bson:"qty" json:"qty"`
	}
	if err := cur.All(context.Background(), &wood25data); err != nil {
		log.Println(err)
	}

	// get target of reededline
	cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"name": "reededline total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -20))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$sort", bson.M{"date": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	var reededlineTarget []struct {
		Date  string  `bson:"date" json:"date"`
		Value float64 `bson:"value" json:"value"`
	}
	if err = cur.All(context.Background(), &reededlineTarget); err != nil {
		log.Println(err)
	}

	// get time of latest update
	sr := s.mgdb.Collection("reededline").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
	if sr.Err() != nil {
		log.Println(sr.Err())
	}
	var LastReport struct {
		Createdat time.Time `bson:"createdat" json:"createdat"`
	}
	if err := sr.Decode(&LastReport); err != nil {
		log.Println(err)
	}
	reededlineUpTime := LastReport.Createdat.Add(7 * time.Hour).Format("15:04")

	template.Must(template.ParseFiles("templates/pages/dashboard/reededline.html")).Execute(w, map[string]interface{}{
		"reededlinedata":   reededlinedata,
		"wood25data":       wood25data,
		"reededlineTarget": reededlineTarget,
		"reededlineUpTime": reededlineUpTime,
	})
}

// /////////////////////////////////////////////////////////////
// /dashboard/loadreededoutput - load reededoutput area in dashboard
// /////////////////////////////////////////////////////////////
func (s *Server) d_loadoutput(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("output").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"type": "reeded"}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "section": "$section"}, "qty": bson.M{"$sum": "$qty"}, "type": bson.M{"$first": "$type"}}}},
		{{"$set", bson.M{"section": "$_id.section", "date": "$_id.date"}}},
		{{"$sort", bson.M{"date": 1}}},
		{{"$group", bson.M{"_id": "$section", "type": bson.M{"$first": "$type"}, "qty": bson.M{"$sum": "$qty"}, "avg": bson.M{"$avg": "$qty"}, "lastdate": bson.M{"$last": "$date"}}}},
		{{"$sort", bson.M{"_id": 1}}},
		{{"$set", bson.M{"section": bson.M{"$substr": bson.A{"$_id", 2, -1}}, "lastdate": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$lastdate"}}}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var reededoutputData []struct {
		Section   string  `bson:"section" json:"section"`
		Type      string  `bson:"type" json:"type"`
		Qty       float64 `bson:"qty" json:"qty"`
		Avg       float64 `bson:"avg" json:"avg"`
		LastDate  string  `bson:"lastdate" json:"lastdate"`
		Inventory float64 `bson:"inventory" json:"inventory"`
	}
	if err := cur.All(context.Background(), &reededoutputData); err != nil {
		log.Println(err)
	}
	// get latest inventory
	sr := s.mgdb.Collection("output").FindOne(context.Background(), bson.M{"section": "a.Inventory"}, options.FindOne().SetSort(bson.M{"date": -1}))
	if sr.Err() != nil {
		log.Println(sr.Err())
	}
	var latestInventory struct {
		Date    time.Time `bson:"date"`
		Section string    `json:"section"`
		Qty     float64   `bson:"qty" json:"qty"`
		DateStr string    `json:"date"`
	}
	if err := sr.Decode(&latestInventory); err != nil {
		log.Println(err)
	}
	latestInventory.Section = "Inventory"
	latestInventory.DateStr = latestInventory.Date.Format("02-01-2006")
	// get last update time
	sr = s.mgdb.Collection("output").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
	if sr.Err() != nil {
		log.Println(sr.Err())
	}
	var latestOne struct {
		Date time.Time `bson:"createdat" json:"createdat"`
	}
	if err := sr.Decode(&latestOne); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/dashboard/output.html")).Execute(w, map[string]interface{}{
		"reededoutputData": reededoutputData,
		"latestInventory":  latestInventory,
		"outputUpTime":     latestOne.Date.Add(7 * time.Hour).Format("15:04 ngày 02-01-2006"),
	})
}

// //////////////////////////////////////////////////////////
// /dashboard/loadpanelcnc - load panelcnc area in dashboard
// //////////////////////////////////////////////////////////
func (s *Server) d_loadpanelcnc(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pipeline := mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -20))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, 1))}}}}}},
		{{"$group", bson.M{"_id": "$date", "qty": bson.M{"$sum": "$qty"}}}},
		{{"$sort", bson.D{{"_id", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id"}}}}},
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
	// get target of panelcnc
	cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"name": "panelcnc total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -20))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$sort", bson.M{"date": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	var panelcncTarget []struct {
		Date  string  `bson:"date" json:"date"`
		Value float64 `bson:"value" json:"value"`
	}
	if err = cur.All(context.Background(), &panelcncTarget); err != nil {
		log.Println(err)
	}

	// get time of latest update
	sr := s.mgdb.Collection("panelcnc").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
	if sr.Err() != nil {
		log.Println(sr.Err())
	}
	var LastReport struct {
		Createdat time.Time `bson:"createdat" json:"createdat"`
	}
	if err := sr.Decode(&LastReport); err != nil {
		log.Println(err)
	}
	panelcncUpTime := LastReport.Createdat.Add(7 * time.Hour).Format("15:04")

	template.Must(template.ParseFiles("templates/pages/dashboard/panelcncchart.html")).Execute(w, map[string]interface{}{
		"panelChartData": panelChartData,
		"panelcncTarget": panelcncTarget,
		"panelcncUpTime": panelcncUpTime,
	})
}

// //////////////////////////////////////////////////////////
// /dashboard/loadveneer - load veneer area in dashboard
// //////////////////////////////////////////////////////////
func (s *Server) d_loadveneer(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("veneer").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -15))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "type": "$type"}, "qty": bson.M{"$sum": "$qty"}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.type", 1}}}},
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
	// get target for veneer
	cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"name": "veneer total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -20))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$sort", bson.M{"date": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	var veneerTarget []struct {
		Date  string  `bson:"date" json:"date"`
		Value float64 `bson:"value" json:"value"`
	}
	if err = cur.All(context.Background(), &veneerTarget); err != nil {
		log.Println(err)
	}

	// get time of latest update
	sr := s.mgdb.Collection("veneer").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
	if sr.Err() != nil {
		log.Println(sr.Err())
	}
	var LastReport struct {
		Createdat time.Time `bson:"createdat" json:"createdat"`
	}
	if err := sr.Decode(&LastReport); err != nil {
		log.Println(err)
	}
	veneerUpTime := LastReport.Createdat.Add(7 * time.Hour).Format("15:04")

	template.Must(template.ParseFiles("templates/pages/dashboard/veneer.html")).Execute(w, map[string]interface{}{
		"veneerChartData": veneerChartData,
		"veneerTarget":    veneerTarget,
		"veneerUpTime":    veneerUpTime,
	})
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/loadassembly - load assembly area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) d_loadassembly(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("assembly").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"type": bson.M{"$exists": false}}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "factory": "$factory", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.factory", 1}, {"_id.prodtype", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": bson.M{"$concat": bson.A{"X", "$_id.factory", "-", "$_id.prodtype"}}}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var assemblyData []struct {
		Date  string  `bson:"date" json:"date"`
		Type  string  `bson:"type" json:"type"`
		Value float64 `bson:"value" json:"value"`
	}
	if err := cur.All(context.Background(), &assemblyData); err != nil {
		log.Println(err)
	}

	// get plan data
	cur, err = s.mgdb.Collection("assembly").Aggregate(context.Background(), mongo.Pipeline{
		// {{"$match", bson.M{"$and": bson.A{bson.M{"type": "plan", "date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -12))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$match", bson.M{"$and": bson.A{bson.M{"type": "plan", "date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}}}}},
		{{"$sort", bson.M{"createdat": -1}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "plantype": "$plantype"}, "plan": bson.M{"$first": "$plan"}, "plans": bson.M{"$firstN": bson.M{"input": "$plan", "n": 2}}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.plantype", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "plantype": "$_id.plantype"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var assemblyPlanData []struct {
		Date     string    `bson:"date" json:"date"`
		Plantype string    `bson:"plantype" json:"plantype"`
		Plan     float64   `bson:"plan" json:"plan"`
		Plans    []float64 `bson:"plans" json:"plans"`
		Change   float64   `json:"change"`
	}

	if err := cur.All(context.Background(), &assemblyPlanData); err != nil {
		log.Println(err)
	}
	for i := 0; i < len(assemblyPlanData); i++ {
		if len(assemblyPlanData[i].Plans) >= 2 && assemblyPlanData[i].Plans[1] != 0 {
			assemblyPlanData[i].Change = assemblyPlanData[i].Plans[1] - assemblyPlanData[i].Plan
		} else {
			assemblyPlanData[i].Change = 0
		}
	}

	// get inventory
	cur, err = s.mgdb.Collection("assembly").Find(context.Background(), bson.M{"type": "Inventory"}, options.Find().SetSort(bson.M{"createdat": -1}).SetLimit(2))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var assemblyInventoryData []struct {
		Prodtype     string    `bson:"prodtype" json:"prodtype"`
		Inventory    float64   `bson:"inventory" json:"inventory"`
		CreatedAt    time.Time `bson:"createdat" json:"createdat"`
		CreatedAtStr string    `json:"createdatstr"`
	}

	if err := cur.All(context.Background(), &assemblyInventoryData); err != nil {
		log.Println(err)
	}

	for i := 0; i < len(assemblyInventoryData); i++ {
		assemblyInventoryData[i].CreatedAtStr = assemblyInventoryData[i].CreatedAt.Add(7 * time.Hour).Format("15h04 date 2/1")
	}
	// get target
	cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
		// {{"$match", bson.M{"name": "assembly total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$match", bson.M{"name": "assembly total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}}}}},
		{{"$sort", bson.M{"date": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	var assemblyTarget []struct {
		Date  string  `bson:"date" json:"date"`
		Value float64 `bson:"value" json:"value"`
	}
	if err = cur.All(context.Background(), &assemblyTarget); err != nil {
		log.Println(err)
	}

	// get time of latest update
	sr := s.mgdb.Collection("assembly").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
	if sr.Err() != nil {
		log.Println(sr.Err())
	}
	var LastReport struct {
		Createdat time.Time `bson:"createdat" json:"createdat"`
	}
	if err := sr.Decode(&LastReport); err != nil {
		log.Println(err)
	}
	assemblyUpTime := LastReport.Createdat.Add(7 * time.Hour).Format("15:04")
	template.Must(template.ParseFiles("templates/pages/dashboard/assembly.html")).Execute(w, map[string]interface{}{
		"assemblyData":          assemblyData,
		"assemblyPlanData":      assemblyPlanData,
		"assemblyInventoryData": assemblyInventoryData,
		"assemblyTarget":        assemblyTarget,
		"assemblyUpTime":        assemblyUpTime,
	})
}

// router.GET("/dashboard/loadwhitewood", s.d_loadwhitewood)
func (s *Server) d_loadwhitewood(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("whitewood").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"type": bson.M{"$exists": false}}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -8))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.prodtype", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": "$_id.prodtype"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var whitewoodData []struct {
		Date  string  `bson:"date" json:"date"`
		Type  string  `bson:"type" json:"type"`
		Value float64 `bson:"value" json:"value"`
	}
	if err := cur.All(context.Background(), &whitewoodData); err != nil {
		log.Println(err)
	}

	// get plan data
	cur, err = s.mgdb.Collection("whitewood").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"type": "plan", "date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -8))}}}}}},
		{{"$sort", bson.M{"createdat": -1}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "plantype": "$plantype"}, "plan": bson.M{"$first": "$plan"}, "plans": bson.M{"$firstN": bson.M{"input": "$plan", "n": 2}}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.plantype", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "plantype": "$_id.plantype"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var whitewoodPlanData []struct {
		Date     string    `bson:"date" json:"date"`
		Plantype string    `bson:"plantype" json:"plantype"`
		Plan     float64   `bson:"plan" json:"plan"`
		Plans    []float64 `bson:"plans" json:"plans"`
		Change   float64   `json:"change"`
	}

	if err := cur.All(context.Background(), &whitewoodPlanData); err != nil {
		log.Println(err)
	}
	for i := 0; i < len(whitewoodPlanData); i++ {
		if len(whitewoodPlanData[i].Plans) >= 2 && whitewoodPlanData[i].Plans[1] != 0 {
			whitewoodPlanData[i].Change = whitewoodPlanData[i].Plans[1] - whitewoodPlanData[i].Plan
		} else {
			whitewoodPlanData[i].Change = 0
		}
	}

	// get Nam's data
	cur, err = s.mgdb.Collection("whitewood").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"type": "nam", "date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -8))}}}}}},
		{{"$group", bson.M{"_id": "$date", "value": bson.M{"$sum": "$value"}}}},
		{{"$sort", bson.D{{"_id", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id"}}}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	var NamData []struct {
		Date  string  `bson:"date" json:"date"`
		Value float64 `bson:"value" json:"value"`
	}
	if err = cur.All(context.Background(), &NamData); err != nil {
		log.Println(err)
	}

	// get inventory
	cur, err = s.mgdb.Collection("whitewood").Find(context.Background(), bson.M{"type": "Inventory"}, options.Find().SetSort(bson.M{"createdat": -1}).SetLimit(2))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var whitewoodInventoryData []struct {
		Prodtype     string    `bson:"prodtype" json:"prodtype"`
		Inventory    float64   `bson:"inventory" json:"inventory"`
		CreatedAt    time.Time `bson:"createdat" json:"createdat"`
		CreatedAtStr string    `json:"createdatstr"`
	}

	if err := cur.All(context.Background(), &whitewoodInventoryData); err != nil {
		log.Println(err)
	}

	for i := 0; i < len(whitewoodInventoryData); i++ {
		whitewoodInventoryData[i].CreatedAtStr = whitewoodInventoryData[i].CreatedAt.Add(7 * time.Hour).Format("15h04 date 2/1")
	}
	// get target
	cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"name": "whitewood total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -15))}}}}}},
		{{"$sort", bson.M{"date": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	var whitewoodTarget []struct {
		Date  string  `bson:"date" json:"date"`
		Value float64 `bson:"value" json:"value"`
	}
	if err = cur.All(context.Background(), &whitewoodTarget); err != nil {
		log.Println(err)
	}

	// get time of latest update
	sr := s.mgdb.Collection("whitewood").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
	if sr.Err() != nil {
		log.Println(sr.Err())
	}
	var LastReport struct {
		Createdat time.Time `bson:"createdat" json:"createdat"`
	}
	if err := sr.Decode(&LastReport); err != nil {
		log.Println(err)
	}
	whitewoodUpTime := LastReport.Createdat.Add(7 * time.Hour).Format("15:04")

	template.Must(template.ParseFiles("templates/pages/dashboard/whitewood.html")).Execute(w, map[string]interface{}{
		"whitewoodData":          whitewoodData,
		"whitewoodPlanData":      whitewoodPlanData,
		"namData":                NamData,
		"whitewoodInventoryData": whitewoodInventoryData,
		"whitewoodTarget":        whitewoodTarget,
		"whitewoodUpTime":        whitewoodUpTime,
	})
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/loadwoodfinish - load woodfinish area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) d_loadwoodfinish(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("woodfinish").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"type": bson.M{"$exists": false}}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "factory": "$factory", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.factory", 1}, {"_id.prodtype", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": bson.M{"$concat": bson.A{"X", "$_id.factory", "-", "$_id.prodtype"}}}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var woodfinishData []struct {
		Date  string  `bson:"date" json:"date"`
		Type  string  `bson:"type" json:"type"`
		Value float64 `bson:"value" json:"value"`
	}
	if err := cur.All(context.Background(), &woodfinishData); err != nil {
		log.Println(err)
	}

	// get plan data
	cur, err = s.mgdb.Collection("woodfinish").Aggregate(context.Background(), mongo.Pipeline{
		// {{"$match", bson.M{"$and": bson.A{bson.M{"type": "plan", "date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$match", bson.M{"$and": bson.A{bson.M{"type": "plan", "date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}}}}},
		{{"$sort", bson.M{"createdat": -1}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "plantype": "$plantype"}, "plan": bson.M{"$first": "$plan"}, "plans": bson.M{"$firstN": bson.M{"input": "$plan", "n": 2}}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.plantype", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "plantype": "$_id.plantype"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var woodfinishPlanData []struct {
		Date     string    `bson:"date" json:"date"`
		Plantype string    `bson:"plantype" json:"plantype"`
		Plan     float64   `bson:"plan" json:"plan"`
		Plans    []float64 `bson:"plans" json:"plans"`
		Change   float64   `json:"change"`
	}

	if err := cur.All(context.Background(), &woodfinishPlanData); err != nil {
		log.Println(err)
	}
	for i := 0; i < len(woodfinishPlanData); i++ {
		if len(woodfinishPlanData[i].Plans) >= 2 && woodfinishPlanData[i].Plans[1] != 0 {
			woodfinishPlanData[i].Change = woodfinishPlanData[i].Plans[1] - woodfinishPlanData[i].Plan
		} else {
			woodfinishPlanData[i].Change = 0
		}
	}

	// get inventory
	cur, err = s.mgdb.Collection("woodfinish").Find(context.Background(), bson.M{"type": "Inventory"}, options.Find().SetSort(bson.M{"createdat": -1}).SetLimit(2))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var woodfinishInventoryData []struct {
		Prodtype     string    `bson:"prodtype" json:"prodtype"`
		Inventory    float64   `bson:"inventory" json:"inventory"`
		CreatedAt    time.Time `bson:"createdat" json:"createdat"`
		CreatedAtStr string    `json:"createdatstr"`
	}

	if err := cur.All(context.Background(), &woodfinishInventoryData); err != nil {
		log.Println(err)
	}

	for i := 0; i < len(woodfinishInventoryData); i++ {
		woodfinishInventoryData[i].CreatedAtStr = woodfinishInventoryData[i].CreatedAt.Add(7 * time.Hour).Format("15h04 date 2/1")
	}
	// get target
	cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
		// {{"$match", bson.M{"name": "woodfinish total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$match", bson.M{"name": "woodfinish total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}}}}},
		{{"$sort", bson.M{"date": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	var woodfinishTarget []struct {
		Date  string  `bson:"date" json:"date"`
		Value float64 `bson:"value" json:"value"`
	}
	if err = cur.All(context.Background(), &woodfinishTarget); err != nil {
		log.Println(err)
	}

	// get time of latest update
	sr := s.mgdb.Collection("woodfinish").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
	if sr.Err() != nil {
		log.Println(sr.Err())
	}
	var LastReport struct {
		Createdat time.Time `bson:"createdat" json:"createdat"`
	}
	if err := sr.Decode(&LastReport); err != nil {
		log.Println(err)
	}
	woodfinishUpTime := LastReport.Createdat.Add(7 * time.Hour).Format("15:04")

	template.Must(template.ParseFiles("templates/pages/dashboard/woodfinish.html")).Execute(w, map[string]interface{}{
		"woodfinishData":          woodfinishData,
		"woodfinishPlanData":      woodfinishPlanData,
		"woodfinishInventoryData": woodfinishInventoryData,
		"woodfinishTarget":        woodfinishTarget,
		"woodfinishUpTime":        woodfinishUpTime,
	})
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/loadfinemill - load finemill area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) d_loadfinemill(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("finemill").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -15))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "factory": "$factory", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.factory", 1}, {"_id.prodtype", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": bson.M{"$concat": bson.A{"X", "$_id.factory", "-", "$_id.prodtype"}}}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var finemillData []struct {
		Date  string  `bson:"date" json:"date"`
		Type  string  `bson:"type" json:"type"`
		Value float64 `bson:"value" json:"value"`
	}
	if err := cur.All(context.Background(), &finemillData); err != nil {
		log.Println(err)
	}

	// get target
	cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"name": "finemill total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -15))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$sort", bson.M{"date": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	var finemillTarget []struct {
		Date  string  `bson:"date" json:"date"`
		Value float64 `bson:"value" json:"value"`
	}
	if err = cur.All(context.Background(), &finemillTarget); err != nil {
		log.Println(err)
	}

	// get time of latest update
	sr := s.mgdb.Collection("finemill").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
	if sr.Err() != nil {
		log.Println(sr.Err())
	}
	var LastReport struct {
		Createdat time.Time `bson:"createdat" json:"createdat"`
	}
	if err := sr.Decode(&LastReport); err != nil {
		log.Println(err)
	}
	finemillUpTime := LastReport.Createdat.Add(7 * time.Hour).Format("15:04")
	template.Must(template.ParseFiles("templates/pages/dashboard/finemill.html")).Execute(w, map[string]interface{}{
		"finemillData":   finemillData,
		"finemillTarget": finemillTarget,
		"finemillUpTime": finemillUpTime,
	})
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/loadpack - load pack area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) d_loadpack(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("pack").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"type": bson.M{"$exists": false}}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "factory": "$factory", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.factory", 1}, {"_id.prodtype", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": bson.M{"$concat": bson.A{"X", "$_id.factory", "-", "$_id.prodtype"}}}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	var packData []struct {
		Date  string  `bson:"date" json:"date"`
		Type  string  `bson:"type" json:"type"`
		Value float64 `bson:"value" json:"value"`
	}
	if err := cur.All(context.Background(), &packData); err != nil {
		log.Println(err)
	}

	// get plan data
	cur, err = s.mgdb.Collection("pack").Aggregate(context.Background(), mongo.Pipeline{
		// {{"$match", bson.M{"$and": bson.A{bson.M{"type": "plan", "date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$match", bson.M{"$and": bson.A{bson.M{"type": "plan", "date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}}}}},
		{{"$sort", bson.M{"createdat": -1}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "plantype": "$plantype"}, "plan": bson.M{"$first": "$plan"}, "plans": bson.M{"$firstN": bson.M{"input": "$plan", "n": 2}}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.plantype", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "plantype": "$_id.plantype"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var packPlanData []struct {
		Date     string    `bson:"date" json:"date"`
		Plantype string    `bson:"plantype" json:"plantype"`
		Plan     float64   `bson:"plan" json:"plan"`
		Plans    []float64 `bson:"plans" json:"plans"`
		Change   float64   `json:"change"`
	}

	if err := cur.All(context.Background(), &packPlanData); err != nil {
		log.Println(err)
	}
	for i := 0; i < len(packPlanData); i++ {
		if len(packPlanData[i].Plans) >= 2 && packPlanData[i].Plans[1] != 0 {
			packPlanData[i].Change = packPlanData[i].Plans[1] - packPlanData[i].Plan
		} else {
			packPlanData[i].Change = 0
		}
	}

	// get inventory
	cur, err = s.mgdb.Collection("pack").Find(context.Background(), bson.M{"type": "Inventory"}, options.Find().SetSort(bson.M{"createdat": -1}).SetLimit(2))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var packInventoryData []struct {
		Prodtype     string    `bson:"prodtype" json:"prodtype"`
		Inventory    float64   `bson:"inventory" json:"inventory"`
		CreatedAt    time.Time `bson:"createdat" json:"createdat"`
		CreatedAtStr string    `json:"createdatstr"`
	}

	if err := cur.All(context.Background(), &packInventoryData); err != nil {
		log.Println(err)
	}

	for i := 0; i < len(packInventoryData); i++ {
		packInventoryData[i].CreatedAtStr = packInventoryData[i].CreatedAt.Add(7 * time.Hour).Format("15h04 date 2/1")
	}

	// get target
	cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
		// {{"$match", bson.M{"name": "packing total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$match", bson.M{"name": "packing total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}}}}},
		{{"$sort", bson.M{"date": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	var packTarget []struct {
		Date  string  `bson:"date" json:"date"`
		Value float64 `bson:"value" json:"value"`
	}
	if err = cur.All(context.Background(), &packTarget); err != nil {
		log.Println(err)
	}
	// get time of latest update
	sr := s.mgdb.Collection("pack").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
	if sr.Err() != nil {
		log.Println(sr.Err())
	}
	var LastReport struct {
		Createdat time.Time `bson:"createdat" json:"createdat"`
	}
	if err := sr.Decode(&LastReport); err != nil {
		log.Println(err)
	}
	packUpTime := LastReport.Createdat.Add(7 * time.Hour).Format("15:04")

	template.Must(template.ParseFiles("templates/pages/dashboard/pack.html")).Execute(w, map[string]interface{}{
		"packData":          packData,
		"packPlanData":      packPlanData,
		"packInventoryData": packInventoryData,
		"packTarget":        packTarget,
		"packUpTime":        packUpTime,
	})
}

// router.GET("/dashboard/loadslicing", s.d_loadslicing)
func (s *Server) d_loadslicing(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// cur, err := s.mgdb.Collection("slicing").Aggregate(context.Background(), mongo.Pipeline{
	// 	{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -20))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
	// 	{{"$group", bson.M{"_id": bson.M{"date": "$date", "prodtype": "$prodtype"}, "qty": bson.M{"$sum": "$qty"}}}},
	// 	{{"$sort", bson.D{{"_id.date", 1}, {"_id.prodtype", 1}}}},
	// 	{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "prodtype": "$_id.prodtype"}}},
	// 	{{"$unset", "_id"}},
	// })
	// if err != nil {
	// 	log.Println(err)
	// }
	// var slicingData []struct {
	// 	Date     string  `bson:"date" json:"date"`
	// 	Prodtype string  `bson:"prodtype" json:"prodtype"`
	// 	Qty      float64 `bson:"qty" json:"qty"`
	// }
	// if err := cur.All(context.Background(), &slicingData); err != nil {
	// 	log.Println(err)
	// }
	// // get target of slicing
	// cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
	// 	{{"$match", bson.M{"name": "slicing total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -20))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
	// 	{{"$sort", bson.M{"date": 1}}},
	// 	{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
	// })
	// if err != nil {
	// 	log.Println(err)
	// }
	// var slicingTarget []struct {
	// 	Date  string  `bson:"date" json:"date"`
	// 	Value float64 `bson:"value" json:"value"`
	// }
	// if err = cur.All(context.Background(), &slicingTarget); err != nil {
	// 	log.Println(err)
	// }
	// // get last update time of slicing
	// slicingSr := s.mgdb.Collection("slicing").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
	// if slicingSr.Err() != nil {
	// 	log.Println(slicingSr.Err())
	// }
	// var slicingLastReport struct {
	// 	CreatedDate time.Time `bson:"createdat" json:"createdat"`
	// }
	// if err := slicingSr.Decode(&slicingLastReport); err != nil {
	// 	log.Println(err)
	// }

	// slicingUpTime := slicingLastReport.CreatedDate.Add(7 * time.Hour).Format("15:04")

	// template.Must(template.ParseFiles("templates/pages/dashboard/slicing.html")).Execute(w, map[string]interface{}{
	// 	"slicingData":   slicingData,
	// 	"slicingTarget": slicingTarget,
	// 	"slicingUpTime": slicingUpTime,
	// })

	cur, err := s.mgdb.Collection("output").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"section": "1.Slice"}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -25))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "type": "$type"}, "qty": bson.M{"$sum": "$qty"}}}},
		{{"$sort", bson.M{"_id.date": 1, "_id.type": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "prodtype": "$_id.type"}}},
		{{"$unset", bson.A{"_id.date", "_id.type"}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var slicingData []struct {
		Date     string  `bson:"date" json:"date"`
		Prodtype string  `bson:"prodtype" json:"prodtype"`
		Qty      float64 `bson:"qty" json:"qty"`
	}
	if err := cur.All(context.Background(), &slicingData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/dashboard/slicing.html")).Execute(w, map[string]interface{}{
		"slicingData": slicingData,
		// "slicingTarget": slicingTarget,
		// "slicingUpTime": slicingUpTime,
	})
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/loadwoodrecovery - load woodrecovery area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) d_loadwoodrecovery(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("woodrecovery").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -20))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$sort", bson.D{{"date", 1}, {"prodtype", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var woodrecoveryData []struct {
		Date     string  `bson:"date" json:"date"`
		Prodtype string  `bson:"prodtype" json:"prodtype"`
		Rate     float64 `bson:"rate" json:"rate"`
	}
	if err := cur.All(context.Background(), &woodrecoveryData); err != nil {
		log.Println(err)
	}
	// get last update time
	sr := s.mgdb.Collection("woodrecovery").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
	if sr.Err() != nil {
		log.Println(sr.Err())
	}
	var LastReport struct {
		Createdat time.Time `bson:"createdat" json:"createdat"`
	}
	if err := sr.Decode(&LastReport); err != nil {
		log.Println(err)
	}
	woodrecoveryUpTime := LastReport.Createdat.Add(7 * time.Hour).Format("15:04")
	template.Must(template.ParseFiles("templates/pages/dashboard/woodrecovery.html")).Execute(w, map[string]interface{}{
		"woodrecoveryData":   woodrecoveryData,
		"woodrecoveryUpTime": woodrecoveryUpTime,
	})
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/loadquality - load quality area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) d_loadquality(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("quality").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": time.Now().AddDate(0, 0, -13).Format("2006-01-02")}}, bson.M{"date": bson.M{"$lte": time.Now().Format("2006-01-02")}}}}}},
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
	for i := 0; i < len(qualityChartData); i++ {
		tmp, _ := time.Parse("2006-01-02", qualityChartData[i].Date)
		qualityChartData[i].Date = tmp.Format("02 Jan")
	}
	template.Must(template.ParseFiles("templates/pages/dashboard/quality.html")).Execute(w, map[string]interface{}{
		"qualityChartData": qualityChartData,
	})
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/loaddowntime - load downtime area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) d_loaddowntime(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("downtime").Aggregate(context.Background(), mongo.Pipeline{
		// {{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": time.Now().AddDate(0, 0, -20).Format("2006-01-02")}}, bson.M{"date": bson.M{"$lte": time.Now().Format("2006-01-02")}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "section": "$section"}, "downtime": bson.M{"$sum": "$downtime"}}}},
		{{"$sort", bson.D{{"_id.date", -1}, {"_id.section", 1}}}},
		{{"$set", bson.M{"date": "$_id.date", "section": "$_id.section"}}},
		{{"$unset", "_id"}},
		{{"$limit", 11}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var downtimeChartData []struct {
		Date     string  `bson:"date" json:"date"`
		Section  string  `bson:"section" json:"section"`
		Downtime float64 `bson:"downtime" json:"downtime"`
	}
	if err := cur.All(context.Background(), &downtimeChartData); err != nil {
		log.Println(err)
	}
	for i := 0; i < len(downtimeChartData); i++ {
		tmp, _ := time.Parse("2006-01-02", downtimeChartData[i].Date)
		downtimeChartData[i].Date = tmp.Format("02 Jan")
	}
	template.Must(template.ParseFiles("templates/pages/dashboard/downtime.html")).Execute(w, map[string]interface{}{
		"downtimeChartData": downtimeChartData,
	})
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/loadsixs - load 6S area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) d_loadsixs(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fromdate := time.Now().AddDate(-1, 0, 0).Format("2006-01-02")
	todate := time.Now().Format("2006-01-02")
	cur, err := s.mgdb.Collection("sixs").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"datestr": bson.M{"$gte": fromdate}}, bson.M{"datestr": bson.M{"$lte": todate}}}}}},
		{{"$sort", bson.M{"datestr": 1}}},
	})
	if err != nil {
		log.Println("dashboard: ", err)
	}

	type ScoreReport struct {
		Area  string  `bson:"area"`
		Date  string  `bson:"datestr"`
		Score float64 `bson:"score"`
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
// /dashboard/loadsafety
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) d_loadsafety(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("safety").Aggregate(context.Background(), mongo.Pipeline{
		{{"$sort", bson.D{{"date", -1}, {"area", -1}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var safetyData []struct {
		Date      time.Time `bson:"date" json:"date"`
		Area      string    `bson:"area" json:"area"`
		Severity  int       `bson:"severity" json:"severity"`
		CreatedAt time.Time `bson:"createdat" json:"createdat"`
	}
	if err := cur.All(context.Background(), &safetyData); err != nil {
		log.Println(err)
	}
	var safetyUpTime string
	if len(safetyData) != 0 {
		safetyUpTime = safetyData[0].Date.Format("02-01-2006")
	}
	template.Must(template.ParseFiles("templates/pages/dashboard/safety.html")).Execute(w, map[string]interface{}{
		"safetyData":   safetyData,
		"safetyUpTime": safetyUpTime,
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
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "machine": "$machine"}, "qty": bson.M{"$sum": "$qty"}}}},
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.machine", 1}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "machine": "$_id.machine"}}},
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

	case "general":
		pipeline := mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": "$date", "qty": bson.M{"$sum": "$qty"}}}},
			{{"$sort", bson.D{{"_id", 1}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id"}}}}},
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
		// get target of panelcnc
		cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"name": "panelcnc total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var panelcncTarget []struct {
			Date  string  `bson:"date" json:"date"`
			Value float64 `bson:"value" json:"value"`
		}
		if err = cur.All(context.Background(), &panelcncTarget); err != nil {
			log.Println(err)
		}

		// get time of latest update
		sr := s.mgdb.Collection("panelcnc").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
		if sr.Err() != nil {
			log.Println(sr.Err())
		}
		var LastReport struct {
			Createdat time.Time `bson:"createdat" json:"createdat"`
		}
		if err := sr.Decode(&LastReport); err != nil {
			log.Println(err)
		}
		panelcncUpTime := LastReport.Createdat.Add(7 * time.Hour).Format("15:04")

		template.Must(template.ParseFiles("templates/pages/dashboard/panelcnc_totalchart.html")).Execute(w, map[string]interface{}{
			"panelChartData": panelChartData,
			"panelcncTarget": panelcncTarget,
			"panelcncUpTime": panelcncUpTime,
		})

	case "efficiency":
		cur, err := s.mgdb.Collection("panelcnc").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": "$date", "qty": bson.M{"$sum": "$qty"}}}},
			{{"$sort", bson.M{"_id": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id"}}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var panelcncData []struct {
			Date string  `bson:"date" json:"date"`
			Qty  float64 `bson:"qty" json:"qty"`
		}
		if err := cur.All(context.Background(), &panelcncData); err != nil {
			log.Println(err)
		}
		// get workhr of pannelcnc from manhr
		cur, err = s.mgdb.Collection("manhr").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"section": "panelcnc", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println("err")
		}
		var panelcncManhr []struct {
			Date   string  `bson:"date" json:"date"`
			HC     int     `bson:"hc" json:"hc"`
			Workhr float64 `bson:"workhr" json:"workhr"`
		}
		if err = cur.All(context.Background(), &panelcncManhr); err != nil {
			log.Println("err")
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/panelcnc_efficiencychart.html")).Execute(w, map[string]interface{}{
			"panelcncData":  panelcncData,
			"panelcncManhr": panelcncManhr,
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
			{{"$match", bson.M{"$and": bson.A{bson.M{"type": bson.M{"$exists": false}}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "factory": "$factory", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}}}},
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.factory", 1}, {"_id.prodtype", 1}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": bson.M{"$concat": bson.A{"X", "$_id.factory", "-", "$_id.prodtype"}}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var assemblyData []struct {
			Date  string  `bson:"date" json:"date"`
			Type  string  `bson:"type" json:"type"`
			Value float64 `bson:"value" json:"value"`
		}
		if err := cur.All(context.Background(), &assemblyData); err != nil {
			log.Println(err)
		}

		// get plan data
		cur, err = s.mgdb.Collection("assembly").Aggregate(context.Background(), mongo.Pipeline{
			// {{"$match", bson.M{"$and": bson.A{bson.M{"type": "plan", "date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -12))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
			{{"$match", bson.M{"$and": bson.A{bson.M{"type": "plan", "date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}}}}},
			{{"$sort", bson.M{"createdat": -1}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "plantype": "$plantype"}, "plan": bson.M{"$first": "$plan"}, "plans": bson.M{"$firstN": bson.M{"input": "$plan", "n": 2}}}}},
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.plantype", 1}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "plantype": "$_id.plantype"}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var assemblyPlanData []struct {
			Date     string    `bson:"date" json:"date"`
			Plantype string    `bson:"plantype" json:"plantype"`
			Plan     float64   `bson:"plan" json:"plan"`
			Plans    []float64 `bson:"plans" json:"plans"`
			Change   float64   `json:"change"`
		}

		if err := cur.All(context.Background(), &assemblyPlanData); err != nil {
			log.Println(err)
		}
		for i := 0; i < len(assemblyPlanData); i++ {
			if len(assemblyPlanData[i].Plans) >= 2 && assemblyPlanData[i].Plans[1] != 0 {
				assemblyPlanData[i].Change = assemblyPlanData[i].Plans[1] - assemblyPlanData[i].Plan
			} else {
				assemblyPlanData[i].Change = 0
			}
		}

		// get inventory
		cur, err = s.mgdb.Collection("assembly").Find(context.Background(), bson.M{"type": "Inventory"}, options.Find().SetSort(bson.M{"createdat": -1}).SetLimit(2))
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var assemblyInventoryData []struct {
			Prodtype     string    `bson:"prodtype" json:"prodtype"`
			Inventory    float64   `bson:"inventory" json:"inventory"`
			CreatedAt    time.Time `bson:"createdat" json:"createdat"`
			CreatedAtStr string    `json:"createdatstr"`
		}

		if err := cur.All(context.Background(), &assemblyInventoryData); err != nil {
			log.Println(err)
		}

		for i := 0; i < len(assemblyInventoryData); i++ {
			assemblyInventoryData[i].CreatedAtStr = assemblyInventoryData[i].CreatedAt.Add(7 * time.Hour).Format("15h04 date 2/1")
		}
		// get target
		cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
			// {{"$match", bson.M{"name": "assembly total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
			{{"$match", bson.M{"name": "assembly total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var assemblyTarget []struct {
			Date  string  `bson:"date" json:"date"`
			Value float64 `bson:"value" json:"value"`
		}
		if err = cur.All(context.Background(), &assemblyTarget); err != nil {
			log.Println(err)
		}

		// get time of latest update
		sr := s.mgdb.Collection("assembly").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
		if sr.Err() != nil {
			log.Println(sr.Err())
		}
		var LastReport struct {
			Createdat time.Time `bson:"createdat" json:"createdat"`
		}
		if err := sr.Decode(&LastReport); err != nil {
			log.Println(err)
		}
		assemblyUpTime := LastReport.Createdat.Add(7 * time.Hour).Format("15:04")
		template.Must(template.ParseFiles("templates/pages/dashboard/assembly_generalchart.html")).Execute(w, map[string]interface{}{
			"assemblyData":          assemblyData,
			"assemblyPlanData":      assemblyPlanData,
			"assemblyInventoryData": assemblyInventoryData,
			"assemblyTarget":        assemblyTarget,
			"assemblyUpTime":        assemblyUpTime,
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

	case "value-target":
		cur, err := s.mgdb.Collection("assembly").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "factory": "$factory", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}}}},
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.factory", 1}, {"_id.prodtype", 1}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": bson.M{"$concat": bson.A{"X", "$_id.factory", "-", "$_id.prodtype"}}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var assemblyData []struct {
			Date  string  `bson:"date" json:"date"`
			Type  string  `bson:"type" json:"type"`
			Value float64 `bson:"value" json:"value"`
		}
		if err := cur.All(context.Background(), &assemblyData); err != nil {
			log.Println(err)
		}

		// get target
		cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"name": "assembly total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -15))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var assemblyTarget []struct {
			Date  string  `bson:"date" json:"date"`
			Value float64 `bson:"value" json:"value"`
		}
		if err = cur.All(context.Background(), &assemblyTarget); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/assembly_valuetargetchart.html")).Execute(w, map[string]interface{}{
			"assemblyData":   assemblyData,
			"assemblyTarget": assemblyTarget,
		})

	case "efficiency":
		cur, err := s.mgdb.Collection("assembly").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": "$date", "value": bson.M{"$sum": "$value"}}}},
			{{"$sort", bson.M{"_id": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id"}}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var assemblyData []struct {
			Date  string  `bson:"date" json:"date"`
			Value float64 `bson:"value" json:"value"`
		}
		if err := cur.All(context.Background(), &assemblyData); err != nil {
			log.Println(err)
		}
		//get manhr of assembly
		cur, err = s.mgdb.Collection("manhr").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"section": "assembly", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var assemblyManhr []struct {
			Date   string  `bson:"date" json:"date"`
			HC     int     `bson:"hc" json:"hc"`
			Workhr float64 `bson:"workhr" json:"workhr"`
		}
		if err = cur.All(context.Background(), &assemblyManhr); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/assembly_efficiencychart.html")).Execute(w, map[string]interface{}{
			"assemblyData":  assemblyData,
			"assemblyManhr": assemblyManhr,
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
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.itemtype", -1}}}},
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
		// get target of wood finish
		cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"name": "woodfinish total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var woodfinishTarget []struct {
			Date  string  `bson:"date" json:"date"`
			Value float64 `bson:"value" json:"value"`
		}
		if err = cur.All(context.Background(), &woodfinishTarget); err != nil {
			log.Println(err)
		}

		template.Must(template.ParseFiles("templates/pages/dashboard/wf_generalchart.html")).Execute(w, map[string]interface{}{
			"woodfinishChartData": woodfinishChartData,
			"woodfinishTarget":    woodfinishTarget,
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

	case "value-target":
		cur, err := s.mgdb.Collection("woodfinish").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"type": bson.M{"$exists": false}}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "factory": "$factory", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}}}},
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.factory", 1}, {"_id.prodtype", 1}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": bson.M{"$concat": bson.A{"X", "$_id.factory", "-", "$_id.prodtype"}}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var woodfinishData []struct {
			Date  string  `bson:"date" json:"date"`
			Type  string  `bson:"type" json:"type"`
			Value float64 `bson:"value" json:"value"`
		}
		if err := cur.All(context.Background(), &woodfinishData); err != nil {
			log.Println(err)
		}

		// get plan data
		cur, err = s.mgdb.Collection("woodfinish").Aggregate(context.Background(), mongo.Pipeline{
			// {{"$match", bson.M{"$and": bson.A{bson.M{"type": "plan", "date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
			{{"$match", bson.M{"$and": bson.A{bson.M{"type": "plan", "date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}}}}},
			{{"$sort", bson.M{"createdat": -1}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "plantype": "$plantype"}, "plan": bson.M{"$first": "$plan"}, "plans": bson.M{"$firstN": bson.M{"input": "$plan", "n": 2}}}}},
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.plantype", 1}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "plantype": "$_id.plantype"}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var woodfinishPlanData []struct {
			Date     string    `bson:"date" json:"date"`
			Plantype string    `bson:"plantype" json:"plantype"`
			Plan     float64   `bson:"plan" json:"plan"`
			Plans    []float64 `bson:"plans" json:"plans"`
			Change   float64   `json:"change"`
		}

		if err := cur.All(context.Background(), &woodfinishPlanData); err != nil {
			log.Println(err)
		}
		for i := 0; i < len(woodfinishPlanData); i++ {
			if len(woodfinishPlanData[i].Plans) >= 2 && woodfinishPlanData[i].Plans[1] != 0 {
				woodfinishPlanData[i].Change = woodfinishPlanData[i].Plans[1] - woodfinishPlanData[i].Plan
			} else {
				woodfinishPlanData[i].Change = 0
			}
		}

		// get inventory
		cur, err = s.mgdb.Collection("woodfinish").Find(context.Background(), bson.M{"type": "Inventory"}, options.Find().SetSort(bson.M{"createdat": -1}).SetLimit(2))
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var woodfinishInventoryData []struct {
			Prodtype     string    `bson:"prodtype" json:"prodtype"`
			Inventory    float64   `bson:"inventory" json:"inventory"`
			CreatedAt    time.Time `bson:"createdat" json:"createdat"`
			CreatedAtStr string    `json:"createdatstr"`
		}

		if err := cur.All(context.Background(), &woodfinishInventoryData); err != nil {
			log.Println(err)
		}

		for i := 0; i < len(woodfinishInventoryData); i++ {
			woodfinishInventoryData[i].CreatedAtStr = woodfinishInventoryData[i].CreatedAt.Add(7 * time.Hour).Format("15h04 date 2/1")
		}
		// get target
		cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
			// {{"$match", bson.M{"name": "woodfinish total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
			{{"$match", bson.M{"name": "woodfinish total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var woodfinishTarget []struct {
			Date  string  `bson:"date" json:"date"`
			Value float64 `bson:"value" json:"value"`
		}
		if err = cur.All(context.Background(), &woodfinishTarget); err != nil {
			log.Println(err)
		}

		// get time of latest update
		sr := s.mgdb.Collection("woodfinish").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
		if sr.Err() != nil {
			log.Println(sr.Err())
		}
		var LastReport struct {
			Createdat time.Time `bson:"createdat" json:"createdat"`
		}
		if err := sr.Decode(&LastReport); err != nil {
			log.Println(err)
		}
		woodfinishUpTime := LastReport.Createdat.Add(7 * time.Hour).Format("15:04")

		template.Must(template.ParseFiles("templates/pages/dashboard/wf_valuetargetchart.html")).Execute(w, map[string]interface{}{
			"woodfinishData":          woodfinishData,
			"woodfinishPlanData":      woodfinishPlanData,
			"woodfinishInventoryData": woodfinishInventoryData,
			"woodfinishTarget":        woodfinishTarget,
			"woodfinishUpTime":        woodfinishUpTime,
		})

	case "efficiency":
		cur, err := s.mgdb.Collection("woodfinish").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": "$date", "value": bson.M{"$sum": "$value"}}}},
			{{"$sort", bson.M{"_id": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id"}}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var woodfinishData []struct {
			Date  string  `bson:"date" json:"date"`
			Value float64 `bson:"value" json:"value"`
		}
		if err := cur.All(context.Background(), &woodfinishData); err != nil {
			log.Println(err)
		}
		//get manhr of woodfinish
		cur, err = s.mgdb.Collection("manhr").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"section": "woodfinish", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var woodfinishManhr []struct {
			Date   string  `bson:"date" json:"date"`
			HC     int     `bson:"hc" json:"hc"`
			Workhr float64 `bson:"workhr" json:"workhr"`
		}
		if err = cur.All(context.Background(), &woodfinishManhr); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/wf_efficiencychart.html")).Execute(w, map[string]interface{}{
			"woodfinishData":  woodfinishData,
			"woodfinishManhr": woodfinishManhr,
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
		// get data for cutting chart
		pipeline := mongo.Pipeline{
			{{"$match", bson.M{"type": "report", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "is25reeded": "$is25reeded"}, "qty": bson.M{"$sum": "$qtycbm"}}}},
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.is25reeded", 1}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "is25": "$_id.is25reeded"}}},
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

		//get wood return
		cur, err = s.mgdb.Collection("cutting").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"type": "return", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "is25": "$is25"}, "qty": bson.M{"$sum": "$qtycbm"}}}},
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.is25", 1}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "is25": "$_id.is25"}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
			return
		}
		var cuttingReturnData []struct {
			Date string  `bson:"date" json:"date"`
			Is25 bool    `bson:"is25" json:"is25"`
			Qty  float64 `bson:"qty" json:"qty"`
		}
		if err := cur.All(context.Background(), &cuttingReturnData); err != nil {
			log.Println(err)
			return
		}

		//get fine wood
		cur, err = s.mgdb.Collection("cutting").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"type": "fine", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": "$date", "qty": bson.M{"$sum": "$qtycbm"}}}},
			{{"$sort", bson.D{{"_id", 1}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id"}}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
			return
		}
		var cuttingFineData []struct {
			Date string  `bson:"date" json:"date"`
			Qty  float64 `bson:"qty" json:"qty"`
		}
		if err := cur.All(context.Background(), &cuttingFineData); err != nil {
			log.Println(err)
			return
		}

		//get target data for leftchart
		sr := s.mgdb.Collection("cutting").FindOne(context.Background(), bson.M{"type": "target"}, options.FindOne().SetSort(bson.M{"startdate": -1}))
		if sr.Err() != nil {
			log.Println(sr.Err())
		}
		var targetactualData struct {
			Name      string    `bson:"name" json:"name"`
			StartDate time.Time `bson:"startdate"`
			EnddDate  time.Time `bson:"enddate"`
			Detail    []struct {
				Type   string  `bson:"type" json:"type"`
				Target float64 `bson:"target" json:"target"`
			} `bson:"detail" json:"detail"`
			StartDateStr string `json:"startdate"`
			EndDateStr   string `json:"enddate"`
		}
		if err := sr.Decode(&targetactualData); err != nil {
			log.Println(err)
		}
		targetactualData.StartDateStr = targetactualData.StartDate.Format("02/01/2006")
		targetactualData.EndDateStr = targetactualData.EnddDate.Format("02/01/2006")

		cur, err = s.mgdb.Collection("cutting").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"type": "fine"}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(targetactualData.StartDate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(targetactualData.EnddDate)}}}}}},
			{{"$set", bson.M{"is25reeded": bson.M{"$ifNull": bson.A{"$is25reeded", false}}}}},
			{{"$group", bson.M{"_id": "$is25reeded", "qty": bson.M{"$sum": "$qtycbm"}}}},
			{{"$sort", bson.D{{"_id", 1}}}},
			{{"$set", bson.M{"prodtype": "$_id"}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
			return
		}
		defer cur.Close(context.Background())
		var cuttingProdtypeData []struct {
			Prodtype bool    `bson:"prodtype" json:"prodtype"`
			Qty      float64 `bson:"qty" json:"qty"`
		}

		if err = cur.All(context.Background(), &cuttingProdtypeData); err != nil {
			log.Println(err)
			return
		}

		if len(cuttingProdtypeData) == 1 {
			if cuttingProdtypeData[0].Prodtype {
				cuttingProdtypeData = append(cuttingProdtypeData, struct {
					Prodtype bool    `bson:"prodtype" json:"prodtype"`
					Qty      float64 `bson:"qty" json:"qty"`
				}{
					Prodtype: false, Qty: 0,
				})
			} else {
				cuttingProdtypeData = append(cuttingProdtypeData, struct {
					Prodtype bool    `bson:"prodtype" json:"prodtype"`
					Qty      float64 `bson:"qty" json:"qty"`
				}{
					Prodtype: true, Qty: 0,
				})
			}
		}

		//get target line data of cutting
		cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"name": "cutting total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
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
			"cuttingData":         cuttingData,
			"cuttingReturnData":   cuttingReturnData,
			"cuttingFineData":     cuttingFineData,
			"targetactualData":    targetactualData,
			"cuttingProdtypeData": cuttingProdtypeData,
			"cuttingTarget":       cuttingTarget,
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

	case "efficiency":
		cur, err := s.mgdb.Collection("cutting").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"type": "report", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "prodtype": "$prodtype"}, "qty": bson.M{"$sum": "$qtycbm"}}}},
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.prodtype", 1}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "prodtype": "$_id.prodtype"}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var cuttingData []struct {
			Date     string  `bson:"date" json:"date"`
			ProdType string  `bson:"prodtype" json:"prodtype"`
			Qty      float64 `bson:"qty" json:"qty"`
		}
		if err := cur.All(context.Background(), &cuttingData); err != nil {
			log.Println(err)
		}

		//get manhr of cutting
		cur, err = s.mgdb.Collection("manhr").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"section": "cutting", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var cuttingManhr []struct {
			Date   string  `bson:"date" json:"date"`
			HC     int     `bson:"hc" json:"hc"`
			WorkHr float64 `bson:"workhr" json:"workhr"`
			Qty    float64
		}
		if err = cur.All(context.Background(), &cuttingManhr); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/cutting_efficiencychart.html")).Execute(w, map[string]interface{}{
			"cuttingData":  cuttingData,
			"cuttingManhr": cuttingManhr,
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
		// get data for lamination
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
		if err = cur.All(context.Background(), &laminationTarget); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/lamination_generalchart.html")).Execute(w, map[string]interface{}{
			"laminationChartData": laminationChartData,
			"laminationTarget":    laminationTarget,
		})

	case "efficiency":
		cur, err := s.mgdb.Collection("lamination").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": "$date", "qty": bson.M{"$sum": "$qty"}}}},
			{{"$sort", bson.M{"_id": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id"}}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var laminationData []struct {
			Date string  `bson:"date" json:"date"`
			Qty  float64 `bson:"qty" json:"qty"`
		}
		if err := cur.All(context.Background(), &laminationData); err != nil {
			log.Println(err)
		}

		//get manhr of lamination
		cur, err = s.mgdb.Collection("manhr").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"section": "lamination", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var laminationManhr []struct {
			Date   string  `bson:"date" json:"date"`
			HC     int     `bson:"hc" json:"hc"`
			Workhr float64 `bson:"workhr" json:"workhr"`
		}
		if err = cur.All(context.Background(), &laminationManhr); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/lamination_efficiencychart.html")).Execute(w, map[string]interface{}{
			"laminationData":  laminationData,
			"laminationManhr": laminationManhr,
		})
	}
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/reededline/getchart
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
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.tone", 1}}}},
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

		// get data of Gỗ 25 of cutting
		cur, err = s.mgdb.Collection("cutting").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"is25reeded": true}, bson.M{"type": "report"}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": "$date", "qty": bson.M{"$sum": "$qtycbm"}}}},
			{{"$sort", bson.M{"_id": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id"}}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		var wood25data []struct {
			Date string  `bson:"date" json:"date"`
			Qty  float64 `bson:"qty" json:"qty"`
		}
		if err := cur.All(context.Background(), &wood25data); err != nil {
			log.Println(err)
		}

		// get target of reededline
		cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"name": "reededline total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var reededlineTarget []struct {
			Date  string  `bson:"date" json:"date"`
			Value float64 `bson:"value" json:"value"`
		}
		if err = cur.All(context.Background(), &reededlineTarget); err != nil {
			log.Println(err)
		}

		// get time of latest update
		sr := s.mgdb.Collection("reededline").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
		if sr.Err() != nil {
			log.Println(sr.Err())
		}
		var LastReport struct {
			Createdat time.Time `bson:"createdat" json:"createdat"`
		}
		if err := sr.Decode(&LastReport); err != nil {
			log.Println(err)
		}
		reededlineUpTime := LastReport.Createdat.Add(7 * time.Hour).Format("15:04")

		template.Must(template.ParseFiles("templates/pages/dashboard/reededline_generalchart.html")).Execute(w, map[string]interface{}{
			"reededlinedata":   reededlinedata,
			"wood25data":       wood25data,
			"reededlineTarget": reededlineTarget,
			"reededlineUpTime": reededlineUpTime,
		})

	case "efficiency":
		cur, err := s.mgdb.Collection("reededline").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": "$date", "qty": bson.M{"$sum": "$qty"}}}},
			{{"$sort", bson.M{"_id": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id"}}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var reededlineData []struct {
			Date string  `bson:"date" json:"date"`
			Qty  float64 `bson:"qty" json:"qty"`
		}
		if err := cur.All(context.Background(), &reededlineData); err != nil {
			log.Println(err)
		}

		//get manhr of reededline
		cur, err = s.mgdb.Collection("manhr").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"section": "reededline", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var reededlineManhr []struct {
			Date   string  `bson:"date" json:"date"`
			HC     int     `bson:"hc" json:"hc"`
			Workhr float64 `bson:"workhr" json:"workhr"`
		}
		if err = cur.All(context.Background(), &reededlineManhr); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/reededline_efficiencychart.html")).Execute(w, map[string]interface{}{
			"reededlineData":  reededlineData,
			"reededlineManhr": reededlineManhr,
		})
	}
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/output/getchart
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) do_getchart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pickedChart := r.FormValue("outputcharttype")
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("outputFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("outputToDate"))

	switch pickedChart {
	case "reeded":
		cur, err := s.mgdb.Collection("output").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"type": "reeded", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "section": "$section"}, "qty": bson.M{"$sum": "$qty"}, "type": bson.M{"$first": "$type"}}}},
			{{"$set", bson.M{"section": "$_id.section", "date": "$_id.date"}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$group", bson.M{"_id": "$section", "type": bson.M{"$first": "$type"}, "qty": bson.M{"$sum": "$qty"}, "avg": bson.M{"$avg": "$qty"}, "lastdate": bson.M{"$last": "$date"}}}},
			{{"$sort", bson.M{"_id": 1}}},
			{{"$set", bson.M{"section": bson.M{"$substr": bson.A{"$_id", 2, -1}}, "lastdate": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$lastdate"}}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var reededoutputData []struct {
			Section  string  `bson:"section" json:"section"`
			Type     string  `bson:"type" json:"type"`
			Qty      float64 `bson:"qty" json:"qty"`
			Avg      float64 `bson:"avg" json:"avg"`
			LastDate string  `bson:"lastdate" json:"lastdate"`
		}
		if err := cur.All(context.Background(), &reededoutputData); err != nil {
			log.Println(err)
		}
		// get latest inventory
		sr := s.mgdb.Collection("output").FindOne(context.Background(), bson.M{"date": primitive.NewDateTimeFromTime(todate), "section": "a.Inventory"})
		if sr.Err() != nil {
			log.Println(sr.Err())
		}
		var latestInventory struct {
			Date    time.Time `bson:"date"`
			Section string    `json:"section"`
			Qty     float64   `bson:"qty" json:"qty"`
			DateStr string    `json:"date"`
		}
		if err := sr.Decode(&latestInventory); err != nil {
			log.Println(err)
		}
		latestInventory.Section = "Inventory"
		latestInventory.DateStr = latestInventory.Date.Format("02-01-2006")
		template.Must(template.ParseFiles("templates/pages/dashboard/reededoutput_totalchart.html")).Execute(w, map[string]interface{}{
			"reededoutputData": reededoutputData,
			"latestInventory":  latestInventory,
		})

	case "fir":
		cur, err := s.mgdb.Collection("output").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"type": "fir", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$group", bson.M{"_id": "$section", "type": bson.M{"$first": "$type"}, "qty": bson.M{"$sum": "$qty"}, "avg": bson.M{"$avg": "$qty"}, "lastdate": bson.M{"$last": "$date"}}}},
			{{"$sort", bson.M{"_id": 1}}},
			{{"$set", bson.M{"section": bson.M{"$substr": bson.A{"$_id", 2, -1}}, "lastdate": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$lastdate"}}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var firoutputData []struct {
			Section  string  `bson:"section" json:"section"`
			Type     string  `bson:"type" json:"type"`
			Qty      float64 `bson:"qty" json:"qty"`
			Avg      float64 `bson:"avg" json:"avg"`
			LastDate string  `bson:"lastdate" json:"lastdate"`
		}
		if err := cur.All(context.Background(), &firoutputData); err != nil {
			log.Println(err)
		}

		template.Must(template.ParseFiles("templates/pages/dashboard/firoutput_totalchart.html")).Execute(w, map[string]interface{}{
			"firoutputData": firoutputData,
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
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.type", 1}}}},
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
		// get target for veneer
		cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"name": "veneer total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -20))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var veneerTarget []struct {
			Date  string  `bson:"date" json:"date"`
			Value float64 `bson:"value" json:"value"`
		}
		if err = cur.All(context.Background(), &veneerTarget); err != nil {
			log.Println(err)
		}

		template.Must(template.ParseFiles("templates/pages/dashboard/veneer_generalchart.html")).Execute(w, map[string]interface{}{
			"veneerChartData": veneerChartData,
			"veneerTarget":    veneerTarget,
		})

	case "efficiency":
		cur, err := s.mgdb.Collection("veneer").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": "$date", "qty": bson.M{"$sum": "$qty"}}}},
			{{"$sort", bson.M{"_id": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id"}}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var veneerData []struct {
			Date string  `bson:"date" json:"date"`
			Qty  float64 `bson:"qty" json:"qty"`
		}
		if err := cur.All(context.Background(), &veneerData); err != nil {
			log.Println(err)
		}

		//get manhr of veneer
		cur, err = s.mgdb.Collection("manhr").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"section": "veneer", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var veneerManhr []struct {
			Date   string  `bson:"date" json:"date"`
			HC     int     `bson:"hc" json:"hc"`
			Workhr float64 `bson:"workhr" json:"workhr"`
		}
		if err = cur.All(context.Background(), &veneerManhr); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/veneer_efficiencychart.html")).Execute(w, map[string]interface{}{
			"veneerData":  veneerData,
			"veneerManhr": veneerManhr,
		})
	}
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/finemill/getchart - change chart of finemill area in dashboard
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) df_getchart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pickedChart := r.FormValue("finemillcharttype")
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("finemillFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("finemillToDate"))

	switch pickedChart {
	case "general":
		cur, err := s.mgdb.Collection("finemill").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "itemtype": "$itemtype"}, "value": bson.M{"$sum": "$value"}}}},
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.itemtype", -1}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": "$_id.itemtype"}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var finemillData []struct {
			Date  string  `bson:"date" json:"date"`
			Type  string  `bson:"type" json:"type"`
			Value float64 `bson:"value" json:"value"`
		}
		if err := cur.All(context.Background(), &finemillData); err != nil {
			log.Println(err)
		}
		// get target of assembly
		cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"name": "finemill total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var finemillTarget []struct {
			Date  string  `bson:"date" json:"date"`
			Value float64 `bson:"value" json:"value"`
		}
		if err = cur.All(context.Background(), &finemillTarget); err != nil {
			log.Println(err)
		}

		template.Must(template.ParseFiles("templates/pages/dashboard/finemill_generalchart.html")).Execute(w, map[string]interface{}{
			"finemillData":   finemillData,
			"finemillTarget": finemillTarget,
		})

	case "detail":
		cur, err := s.mgdb.Collection("finemill").Aggregate(context.Background(), mongo.Pipeline{
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
		var finemillData []struct {
			Date  string  `bson:"date" json:"date"`
			Type  string  `bson:"type" json:"type"`
			Value float64 `bson:"value" json:"value"`
		}
		if err := cur.All(context.Background(), &finemillData); err != nil {
			log.Println(err)
		}

		template.Must(template.ParseFiles("templates/pages/dashboard/finemill_detailchart.html")).Execute(w, map[string]interface{}{
			"finemillData": finemillData,
		})

	case "value-target":
		cur, err := s.mgdb.Collection("finemill").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "factory": "$factory", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}}}},
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.factory", 1}, {"_id.prodtype", 1}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": bson.M{"$concat": bson.A{"X", "$_id.factory", "-", "$_id.prodtype"}}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var finemillData []struct {
			Date  string  `bson:"date" json:"date"`
			Type  string  `bson:"type" json:"type"`
			Value float64 `bson:"value" json:"value"`
		}
		if err := cur.All(context.Background(), &finemillData); err != nil {
			log.Println(err)
		}

		// get target
		cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"name": "finemill total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -15))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var finemillTarget []struct {
			Date  string  `bson:"date" json:"date"`
			Value float64 `bson:"value" json:"value"`
		}
		if err = cur.All(context.Background(), &finemillTarget); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/finemill_valuetargetchart.html")).Execute(w, map[string]interface{}{
			"finemillData":   finemillData,
			"finemillTarget": finemillTarget,
		})

	case "efficiency":
		cur, err := s.mgdb.Collection("finemill").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": "$date", "value": bson.M{"$sum": "$value"}}}},
			{{"$sort", bson.M{"_id": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id"}}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var finemillData []struct {
			Date  string  `bson:"date" json:"date"`
			Value float64 `bson:"value" json:"value"`
		}
		if err := cur.All(context.Background(), &finemillData); err != nil {
			log.Println(err)
		}
		//get manhr of assembly
		cur, err = s.mgdb.Collection("manhr").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"section": "finemill", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var finemillManhr []struct {
			Date   string  `bson:"date" json:"date"`
			HC     int     `bson:"hc" json:"hc"`
			Workhr float64 `bson:"workhr" json:"workhr"`
		}
		if err = cur.All(context.Background(), &finemillManhr); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/finemill_efficiencychart.html")).Execute(w, map[string]interface{}{
			"finemillData":  finemillData,
			"finemillManhr": finemillManhr,
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
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.itemtype", -1}}}},
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
		// get target for pack
		cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"name": "packing total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var packingTarget []struct {
			Date  string  `bson:"date" json:"date"`
			Value float64 `bson:"value" json:"value"`
		}
		if err = cur.All(context.Background(), &packingTarget); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/pack_generalchart.html")).Execute(w, map[string]interface{}{
			"packChartData": packChartData,
			"packingTarget": packingTarget,
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

	case "valuetarget":
		cur, err := s.mgdb.Collection("pack").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"type": bson.M{"$exists": false}}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "factory": "$factory", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}}}},
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.factory", 1}, {"_id.prodtype", 1}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": bson.M{"$concat": bson.A{"X", "$_id.factory", "-", "$_id.prodtype"}}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		var packData []struct {
			Date  string  `bson:"date" json:"date"`
			Type  string  `bson:"type" json:"type"`
			Value float64 `bson:"value" json:"value"`
		}
		if err := cur.All(context.Background(), &packData); err != nil {
			log.Println(err)
		}

		// get plan data
		cur, err = s.mgdb.Collection("pack").Aggregate(context.Background(), mongo.Pipeline{
			// {{"$match", bson.M{"$and": bson.A{bson.M{"type": "plan", "date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
			{{"$match", bson.M{"$and": bson.A{bson.M{"type": "plan", "date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}}}}},
			{{"$sort", bson.M{"createdat": -1}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "plantype": "$plantype"}, "plan": bson.M{"$first": "$plan"}, "plans": bson.M{"$firstN": bson.M{"input": "$plan", "n": 2}}}}},
			{{"$sort", bson.D{{"_id.date", 1}, {"_id.plantype", 1}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "plantype": "$_id.plantype"}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var packPlanData []struct {
			Date     string    `bson:"date" json:"date"`
			Plantype string    `bson:"plantype" json:"plantype"`
			Plan     float64   `bson:"plan" json:"plan"`
			Plans    []float64 `bson:"plans" json:"plans"`
			Change   float64   `json:"change"`
		}

		if err := cur.All(context.Background(), &packPlanData); err != nil {
			log.Println(err)
		}
		for i := 0; i < len(packPlanData); i++ {
			if len(packPlanData[i].Plans) >= 2 && packPlanData[i].Plans[1] != 0 {
				packPlanData[i].Change = packPlanData[i].Plans[1] - packPlanData[i].Plan
			} else {
				packPlanData[i].Change = 0
			}
		}

		// get inventory
		cur, err = s.mgdb.Collection("pack").Find(context.Background(), bson.M{"type": "Inventory"}, options.Find().SetSort(bson.M{"createdat": -1}).SetLimit(2))
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var packInventoryData []struct {
			Prodtype     string    `bson:"prodtype" json:"prodtype"`
			Inventory    float64   `bson:"inventory" json:"inventory"`
			CreatedAt    time.Time `bson:"createdat" json:"createdat"`
			CreatedAtStr string    `json:"createdatstr"`
		}

		if err := cur.All(context.Background(), &packInventoryData); err != nil {
			log.Println(err)
		}

		for i := 0; i < len(packInventoryData); i++ {
			packInventoryData[i].CreatedAtStr = packInventoryData[i].CreatedAt.Add(7 * time.Hour).Format("15h04 date 2/1")
		}

		// get target
		cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
			// {{"$match", bson.M{"name": "packing total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
			{{"$match", bson.M{"name": "packing total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var packTarget []struct {
			Date  string  `bson:"date" json:"date"`
			Value float64 `bson:"value" json:"value"`
		}
		if err = cur.All(context.Background(), &packTarget); err != nil {
			log.Println(err)
		}
		// get time of latest update
		sr := s.mgdb.Collection("pack").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
		if sr.Err() != nil {
			log.Println(sr.Err())
		}
		var LastReport struct {
			Createdat time.Time `bson:"createdat" json:"createdat"`
		}
		if err := sr.Decode(&LastReport); err != nil {
			log.Println(err)
		}
		packUpTime := LastReport.Createdat.Add(7 * time.Hour).Format("15:04")

		template.Must(template.ParseFiles("templates/pages/dashboard/pack_valuechart.html")).Execute(w, map[string]interface{}{
			"packData":          packData,
			"packPlanData":      packPlanData,
			"packInventoryData": packInventoryData,
			"packTarget":        packTarget,
			"packUpTime":        packUpTime,
		})

	case "efficiency":
		cur, err := s.mgdb.Collection("pack").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$group", bson.M{"_id": "$date", "value": bson.M{"$sum": "$value"}}}},
			{{"$sort", bson.M{"_id": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id"}}}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var packData []struct {
			Date  string  `bson:"date" json:"date"`
			Value float64 `bson:"value" json:"value"`
		}
		if err := cur.All(context.Background(), &packData); err != nil {
			log.Println(err)
		}
		//get manhr of pack
		cur, err = s.mgdb.Collection("manhr").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"section": "packing", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$sort", bson.M{"date": 1}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		var packManhr []struct {
			Date   string  `bson:"date" json:"date"`
			HC     int     `bson:"hc" json:"hc"`
			Workhr float64 `bson:"workhr" json:"workhr"`
		}
		if err = cur.All(context.Background(), &packManhr); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/packing_efficiencychart.html")).Execute(w, map[string]interface{}{
			"packData":  packData,
			"packManhr": packManhr,
		})

	}
}

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/woodrecovery/getchart
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) dwr_getchart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pickedChart := r.FormValue("woodrecoverycharttype")
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("woodrecoveryFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("woodrecoveryToDate"))
	log.Println(fromdate, todate, pickedChart)
	switch pickedChart {
	case "general":
		cur, err := s.mgdb.Collection("woodrecovery").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$sort", bson.D{{"date", 1}, {"prodtype", 1}}}},
			{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var woodrecoveryData []struct {
			Date     string  `bson:"date" json:"date"`
			Prodtype string  `bson:"prodtype" json:"prodtype"`
			Rate     float64 `bson:"rate" json:"rate"`
		}
		if err := cur.All(context.Background(), &woodrecoveryData); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/woodrecovery_generalchart.html")).Execute(w, map[string]interface{}{
			"woodrecoveryData": woodrecoveryData,
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
			Area  string  `bson:"area"`
			Date  string  `bson:"datestr"`
			Score float64 `bson:"score"`
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

// ////////////////////////////////////////////////////////////////////////////////
// /dashboard/downtime/getchart
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) dd_getchart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pickedChart := r.FormValue("downtimecharttype")
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("downtimeFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("downtimeToDate"))

	switch pickedChart {
	case "general":
		cur, err := s.mgdb.Collection("downtime").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": fromdate.Format("2006-01-02")}}, bson.M{"date": bson.M{"$lte": todate.Format("2006-01-02")}}}}}},
			{{"$group", bson.M{"_id": bson.M{"date": "$date", "section": "$section"}, "downtime": bson.M{"$sum": "$downtime"}}}},
			{{"$sort", bson.D{{"_id.date", -1}, {"_id.section", 1}}}},
			{{"$set", bson.M{"date": "$_id.date", "section": "$_id.section"}}},
			{{"$unset", "_id"}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var downtimeChartData []struct {
			Date     string  `bson:"date" json:"date"`
			Section  string  `bson:"section" json:"section"`
			Downtime float64 `bson:"downtime" json:"downtime"`
		}
		if err := cur.All(context.Background(), &downtimeChartData); err != nil {
			log.Println(err)
		}
		for i := 0; i < len(downtimeChartData); i++ {
			tmp, _ := time.Parse("2006-01-02", downtimeChartData[i].Date)
			downtimeChartData[i].Date = tmp.Format("02 Jan")
		}
		template.Must(template.ParseFiles("templates/pages/dashboard/downtime_generalchart.html")).Execute(w, map[string]interface{}{
			"downtimeChartData": downtimeChartData,
		})
	}
}

// ////////////////////////////////////////////////////////////////////////////////
// "/dashboard/safety/getchart"
// ////////////////////////////////////////////////////////////////////////////////
func (s *Server) dst_getchart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	pickedChart := r.FormValue("safetycharttype")
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("safetyFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("safetyToDate"))

	switch pickedChart {
	case "general":
		cur, err := s.mgdb.Collection("safety").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
			{{"$sort", bson.D{{"date", -1}, {"area", -1}}}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())

		var safetyData []struct {
			Date     time.Time `bson:"date" json:"date"`
			Area     string    `bson:"area" json:"area"`
			Severity int       `bson:"severity" json:"severity"`
		}
		if err := cur.All(context.Background(), &safetyData); err != nil {
			log.Println(err)
		}

		template.Must(template.ParseFiles("templates/pages/dashboard/safety_generalchart.html")).Execute(w, map[string]interface{}{
			"safetyData": safetyData,
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

// router.POST("/sections/rawwood/entry/entry", s.sre_entry)
func (s *Server) sre_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameTk, err := r.Cookie("username")
	if err != nil {
		log.Println(err)
		w.Write([]byte("Phải đăng nhập"))
		return
	}
	date, _ := time.Parse("2006-01-02", r.FormValue("iqcdate"))
	qty, _ := strconv.ParseFloat(r.FormValue("iqcqty"), 64)

	_, err = s.mgdb.Collection("rawwood").InsertOne(context.Background(), bson.M{
		"type": "import", "date": primitive.NewDateTimeFromTime(date), "qty": qty, "unit": "cbm", "reporter": usernameTk.Value,
		"createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
		w.Write([]byte("Thất bại"))
		return
	}
	w.Write([]byte("Thành công"))
}

// router.POST("/sections/rawwood/entry/selection", s.sre_selection)
func (s *Server) sre_selection(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameTk, err := r.Cookie("username")
	if err != nil {
		log.Println(err)
		w.Write([]byte("Phải đăng nhập"))
		return
	}
	date, _ := time.Parse("2006-01-02", r.FormValue("selectiondate"))
	brightqty, _ := strconv.ParseFloat(r.FormValue("brightqty"), 64)
	darkqty, _ := strconv.ParseFloat(r.FormValue("darkqty"), 64)

	if r.FormValue("brightqty") != "" {
		_, err = s.mgdb.Collection("rawwood").InsertOne(context.Background(), bson.M{
			"type": "selection", "date": primitive.NewDateTimeFromTime(date), "qty": brightqty, "unit": "cbm", "reporter": usernameTk.Value,
			"woodtone": "light", "createdat": primitive.NewDateTimeFromTime(time.Now()),
		})
		if err != nil {
			log.Println(err)
			w.Write([]byte("Thất bại"))
			return
		}
	}

	if r.FormValue("darkqty") != "" {
		_, err = s.mgdb.Collection("rawwood").InsertOne(context.Background(), bson.M{
			"type": "selection", "date": primitive.NewDateTimeFromTime(date), "qty": darkqty, "unit": "cbm", "reporter": usernameTk.Value,
			"woodtone": "dark", "createdat": primitive.NewDateTimeFromTime(time.Now()),
		})
		if err != nil {
			log.Println(err)
			w.Write([]byte("Thất bại"))
			return
		}
	}

	if r.FormValue("darkqty") == "" && r.FormValue("darkqty") == "" {
		w.Write([]byte("Thất bại"))
		return
	}

	w.Write([]byte("Thành công"))
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
		ProdType   string  `bson:"prodtype"`
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

	template.Must(template.ParseFiles("templates/pages/sections/cutting/overview/report_tbl.html")).Execute(w, map[string]interface{}{
		"reports":         reports,
		"numberOfReports": numberOfReports,
	})
}

// ///////////////////////////////////////////////////////////////////////////////
// /sections/cutting/overview/wrremainfilter - filter remain wrnote of overview of Cutting
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) sco_wrnotefilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	wrnotefilter := r.FormValue("wrnotefilter")

	var filter bson.M
	switch wrnotefilter {
	case "all":
		filter = bson.M{"type": "wrnote"}
	case "undone":
		filter = bson.M{"type": "wrnote", "wrremain": bson.M{"$gt": 0}}
	case "done":
		filter = bson.M{"type": "wrnote", "wrremain": 0}
	}

	cur, err := s.mgdb.Collection("cutting").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", filter}},
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
		ProdType   string  `bson:"prodtype"`
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
// /sections/cutting/overview/reportfilter - filter report of overview of Cutting
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) sco_reportfilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportFromDate, _ := time.Parse("2006-01-02", r.FormValue("reportFromDate"))
	reportToDate, _ := time.Parse("2006-01-02", r.FormValue("reportToDate"))

	filter := bson.M{"type": "report", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(reportFromDate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(reportToDate)}}}}

	cur, err := s.mgdb.Collection("cutting").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", filter}},
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
	if err = cur.All(context.Background(), &reports); err != nil {
		log.Println(err)
	}

	numberOfReports := len(reports)

	template.Must(template.ParseFiles("templates/pages/sections/cutting/overview/report_tbl.html")).Execute(w, map[string]interface{}{
		"reports":         reports,
		"numberOfReports": numberOfReports,
	})
}

// ///////////////////////////////////////////////////////////////////////////////
// router.POST("/sections/cutting/overview/createdemand", s.sco_createdemand)
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) sco_createdemand(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	startdate, _ := time.Parse("2006-01-02", r.FormValue("cutingdemanstartdate"))
	enddate, _ := time.Parse("2006-01-02", r.FormValue("cutingdemanenddate"))
	reeded25target, _ := strconv.ParseFloat(r.FormValue("cutting25reededdemand"), 64)
	otherstarget, _ := strconv.ParseFloat(r.FormValue("cuttingothersdemand"), 64)

	if r.FormValue("cuttingdemandname") == "" || r.FormValue("cutingdemanstartdate") == "" || r.FormValue("cutingdemanenddate") == "" || r.FormValue("cutting25reededdemand") == "" || r.FormValue("cuttingothersdemand") == "" {
		w.Write([]byte("thiếu thông tin để tạo demand"))
		return
	}

	_, err := s.mgdb.Collection("cutting").UpdateOne(context.Background(), bson.M{"type": "target", "name": r.FormValue("cuttingdemandname")}, bson.M{
		"$set": bson.M{"type": "target", "name": r.FormValue("cuttingdemandname"), "startdate": primitive.NewDateTimeFromTime(startdate), "enddate": primitive.NewDateTimeFromTime(enddate),
			"detail": bson.A{bson.M{"type": "25 Reeded", "target": reeded25target}, bson.M{"type": "Còn lại", "target": otherstarget}}},
	}, options.Update().SetUpsert(true))
	if err != nil {
		log.Println(err)
		return
	}

	// template.Must(template.ParseFiles("templates/pages/sections/cutting/overview/report_tbl.html")).Execute(w, map[string]interface{}{
	// 	"reports":         reports,
	// 	"numberOfReports": numberOfReports,
	// })
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
// router.GET("/hr/overview", s.hr_overview)
// ///////////////////////////////////////////////////////////////////////
func (s *Server) hr_overview(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/hr/overview/overview.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////
// router.GET("/hr/overview/loadchart", s.hr_loadchart)
// ///////////////////////////////////////////////////////////////////////
func (s *Server) hr_loadchart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, _ := s.mgdb.Collection("employee").Find(context.Background(), bson.M{})
	// var data = []struct {
	// 	Name   string `json:"name"`
	// 	Leader string `json:"parent"`
	// }{
	// 	{Name: "võ hoàng trung", Leader: "Nguyên văn Văn"},
	// 	{Name: "Cao bá Hung", Leader: "Nguyên văn Văn"},
	// 	{Name: "Nguyên văn Văn", Leader: "lâm thái Vũ"},
	// 	{Name: "lâm thái Vũ", Leader: "Cao Văn Tuấn"},
	// 	{Name: "Cao Văn Tuấn", Leader: ""},
	// 	{Name: "Thanh", Leader: "Nguyên văn Văn"},
	// 	{Name: "Ngọc", Leader: "Nguyên văn Văn"},
	// 	{Name: "Nguyen Ngoc Trí", Leader: "lâm thái Vũ"},
	// 	{Name: "Coa thanh luân", Leader: "võ hoàng trung"},
	// 	{Name: "Nguyên thiên hương", Leader: "võ hoàng trung"},
	// 	{Name: "lâm tuấn quát", Leader: "Nguyên thiên hương"},
	// 	{Name: "lam thanh xuan", Leader: "lâm tuấn quát"},
	// 	{Name: "luon tuan hai", Leader: "lam thanh xuan"},
	// 	{Name: "thiên lam loan", Leader: "Cao bá Hung"},
	// 	{Name: "công thai hoc", Leader: "Cao bá Hung"},
	// 	{Name: "nguyễn văn hậu", Leader: "Nguyen Ngoc Trí"},
	// }
	var data []struct {
		Name   string `bson:"name" json:"name"`
		Parent string `bson:"parent" json:"parent"`
	}
	if err := cur.All(context.Background(), &data); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/hr/overview/chart.html")).Execute(w, map[string]interface{}{
		"data": data,
	})
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
		log.Println(row[0])
		// jsonStr += `{
		// "id":"` + row[0] + `",
		// "name":"` + row[1] + `",
		// "section":"` + row[2] + `",
		// "subsection":"` + row[3] + `",
		// "position":"` + row[4] + `",
		// "facno":"` + row[5] + `",
		// "status":"` + row[6] + `"
		// },`
		jsonStr += `{
		"name":"` + row[0] + `", 
		"parent":"` + row[1] + `"
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
	cur, err := s.mgdb.Collection("cutting").Find(context.Background(), bson.M{"type": "wrnote", "wrremain": bson.M{"$gt": 0}}, options.Find().SetSort(bson.M{"wrnotecode": 1}))
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
	showForReeded := false
	if wrnoteinfo.Thickness == 25 {
		showForReeded = true
	}
	template.Must(template.ParseFiles("templates/pages/sections/cutting/entry/wrnoteinfo.html")).Execute(w, map[string]interface{}{
		"wrnoteinfo":    wrnoteinfo,
		"showForReeded": showForReeded,
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
	forreeded, _ := strconv.ParseBool(r.FormValue("forreeded"))

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
		"is25reeded": forreeded,
	})
	if err != nil {
		log.Println(err)
	}

	// update remain qty of wrnote
	_, err = s.mgdb.Collection("cutting").UpdateOne(context.Background(), bson.M{"type": "wrnote", "wrnotecode": wrnote}, bson.M{"$set": bson.M{"wrremain": math.Round((remain-qty)*1000) / 1000}})
	if err != nil {
		log.Println(err)
	}

	http.Redirect(w, r, "/sections/cutting/entry", http.StatusSeeOther)
}

// ///////////////////////////////////////////////////////////////////////
//
//	router.GET("/sections/cutting/entry/return", s.sce_return)
//
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sce_return(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	template.Must(template.ParseFiles("templates/pages/sections/cutting/entry/return.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////
// router.POST("/sections/cutting/entry/sendreturn", s.sce_sendreturn)
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sce_sendreturn(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	returndate, _ := time.Parse("2006-01-02", r.FormValue("returndate"))
	wrnotecode := r.FormValue("wrnotecode")
	returnqty, _ := strconv.ParseFloat(r.FormValue("returnqty"), 64)
	returntype := false
	if r.FormValue("returntype") == "true" {
		returntype = true
	}

	usernameToken, err := r.Cookie("username")
	if err != nil {
		log.Println(err)
		http.Redirect(w, r, "/login", http.StatusUnauthorized)
		return
	}

	if r.FormValue("returnqty") == "" || r.FormValue("returntype") == "" {
		w.Write([]byte("Thiếu thông tin nhập liệu"))
		return
	}

	_, err = s.mgdb.Collection("cutting").InsertOne(context.Background(), bson.M{
		"type": "return", "wrnote": wrnotecode, "qtycbm": returnqty, "reporter": usernameToken.Value,
		"date": primitive.NewDateTimeFromTime(returndate), "createdat": primitive.NewDateTimeFromTime(time.Now()),
		"is25": returntype,
	})
	if err != nil {
		log.Println(err)
	}

	http.Redirect(w, r, "/sections/cutting/entry/return", http.StatusSeeOther)
}

// ///////////////////////////////////////////////////////////////////////
//
//	router.GET("/sections/cutting/entry/fine", s.sce_fine)
//
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sce_fine(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/cutting/entry/fine.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////
// router.POST("/sections/cutting/entry/sendfine", s.sce_sendfine)
// ///////////////////////////////////////////////////////////////////////
func (s *Server) sce_sendfine(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	date, _ := time.Parse("2006-01-02", r.FormValue("finedate"))
	qty, _ := strconv.ParseFloat(r.FormValue("fineqty"), 64)
	is25reeded := false
	if r.FormValue("finetype") == "true" {
		is25reeded = true
	}
	usernameToken, err := r.Cookie("username")
	if err != nil {
		log.Println(err)
		http.Redirect(w, r, "/login", http.StatusUnauthorized)
		return
	}

	if r.FormValue("fineqty") == "" || r.FormValue("finetype") == "" {
		w.Write([]byte("Thiếu thông tin nhập liệu"))
		return
	}

	_, err = s.mgdb.Collection("cutting").InsertOne(context.Background(), bson.M{
		"type": "fine", "qtycbm": qty, "reporter": usernameToken.Value, "is25reeded": is25reeded,
		"date": primitive.NewDateTimeFromTime(date), "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
	}

	http.Redirect(w, r, "/sections/cutting/entry/fine", http.StatusSeeOther)
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
	cur, err := s.mgdb.Collection("cutting").Find(context.Background(), bson.M{"type": "report"}, options.Find().SetSort(bson.M{"createddate": -1}).SetLimit(20))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var cuttingReports []struct {
		ReportId     string    `bson:"_id"`
		Date         time.Time `bson:"date"`
		Wrnote       string    `bson:"wrnote"`
		Woodtype     string    `bson:"woodtype"`
		ProdType     string    `bson:"prodtype"`
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
	cur, err := s.mgdb.Collection("cutting").Find(context.Background(), bson.M{"type": "wrnote"}, options.Find().SetSort(bson.M{"createat": -1}).SetLimit(20))
	if err != nil {
		log.Println(err)
		return
	}
	defer cur.Close(context.Background())
	var cuttingWrnote []struct {
		WrnoteId    string    `bson:"_id"`
		WrnoteCode  string    `bson:"wrnotecode"`
		Woodtype    string    `bson:"woodtype"`
		ProdType    string    `bson:"prodtype"`
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
		bson.M{"$inc": bson.M{"wrremain": math.Round(report.Qty*1000) / 1000}})
	if wrnote.Err() != nil {
		log.Println(wrnote.Err())
		return
	}
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/cutting/admin/deletewrnote/:wrnoteid - delete a wrnote on page admin of cutting section
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
// /sections/cutting/admin/wrnoteupdateform/:wrnoteid - update a wrnote on page admin of cutting section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sca_wrnoteupdateform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	wrnoteid, _ := primitive.ObjectIDFromHex(ps.ByName("wrnoteid"))

	result := s.mgdb.Collection("cutting").FindOne(context.Background(), bson.M{"_id": wrnoteid})
	if result.Err() != nil {
		log.Println(result.Err())
		return
	}
	var cuttingWrnote struct {
		WrnoteId    string    `bson:"_id"`
		WrnoteCode  string    `bson:"wrnotecode"`
		Woodtype    string    `bson:"woodtype"`
		ProdType    string    `bson:"prodtype"`
		Thickness   float64   `bson:"thickness"`
		Qty         float64   `bson:"wrnoteqty"`
		Remain      float64   `bson:"wrremain"`
		Date        time.Time `bson:"date"`
		CreatedDate time.Time `bson:"createat"`
	}
	if err := result.Decode(&cuttingWrnote); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/sections/cutting/admin/wrnoteupdate_form.html")).Execute(w, map[string]interface{}{
		"cuttingWrnote": cuttingWrnote,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/cutting/admin/updatewrnote/:wrnoteid - update a wrnote on page admin of cutting section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sca_updatewrnote(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	wrnoteid, _ := primitive.ObjectIDFromHex(ps.ByName("wrnoteid"))
	prodtype := r.FormValue("prodtype")
	date, _ := time.Parse("2006-01-02", r.FormValue("occurdate"))

	result := s.mgdb.Collection("cutting").FindOneAndUpdate(context.Background(), bson.M{"_id": wrnoteid}, bson.M{"$set": bson.M{"prodtype": prodtype, "date": primitive.NewDateTimeFromTime(date)}})
	if result.Err() != nil {
		log.Println(result.Err())
		return
	}
	var cuttingWrnote struct {
		WrnoteId    string    `bson:"_id"`
		WrnoteCode  string    `bson:"wrnotecode"`
		Woodtype    string    `bson:"woodtype"`
		ProdType    string    `bson:"prodtype"`
		Thickness   float64   `bson:"thickness"`
		Qty         float64   `bson:"wrnoteqty"`
		Remain      float64   `bson:"wrremain"`
		Date        time.Time `bson:"date"`
		CreatedDate time.Time `bson:"createat"`
	}
	if err := result.Decode(&cuttingWrnote); err != nil {
		log.Println(err)
	}
	cuttingWrnote.ProdType = prodtype
	cuttingWrnote.Date = date

	// update reports
	_, err := s.mgdb.Collection("cutting").UpdateMany(context.Background(), bson.M{"type": "report", "wrnote": cuttingWrnote.WrnoteCode}, bson.M{"$set": bson.M{"prodtype": prodtype}})
	if err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/sections/cutting/admin/wrnote_tr.html")).Execute(w, map[string]interface{}{
		"cuttingWrnote": cuttingWrnote,
	})
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

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/cutting/admin/reportdatefilter
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sca_reportdatefilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("cuttingFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("cuttingToDate"))

	cur, err := s.mgdb.Collection("cutting").Find(context.Background(), bson.M{
		"type": "report",
		"$and": bson.A{
			bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}},
			bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}},
		},
	}, options.Find().SetSort(bson.M{"date": -1}))
	if err != nil {
		log.Println("failed to find cutting report at sca_reportdatefilter")
	}
	defer cur.Close(context.Background())
	var cuttingReports []struct {
		ReportId     string    `bson:"_id"`
		Date         time.Time `bson:"date"`
		Wrnote       string    `bson:"wrnote"`
		ProdType     string    `bson:"prodtype"`
		Woodtype     string    `bson:"woodtype"`
		Thickness    float64   `bson:"thickness"`
		Qty          float64   `bson:"qtycbm"`
		Type         string    `bson:"type"`
		Reporter     string    `bson:"reporter"`
		CreatedDate  time.Time `bson:"createddate"`
		LastModified time.Time `bson:"lastmodified"`
	}
	if err := cur.All(context.Background(), &cuttingReports); err != nil {
		log.Println("failed to decode cuttingReports at sca_reportdatefilter")
	}
	template.Must(template.ParseFiles("templates/pages/sections/cutting/admin/report_tbody.html")).Execute(w, map[string]interface{}{
		"cuttingReports": cuttingReports,
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
		{{"$sort", bson.D{{"date", -1}, {"createdat", -1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}, "at": bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$createdat", "timezone": "Asia/Bangkok"}}}}},
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
		{{"$sort", bson.D{{"date", -1}, {"createdat", -1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}, "createdat": bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m/%Y", "date": "$createdat", "timezone": "Asia/Bangkok"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var laminationReports []struct {
		Date      string  `bson:"date"`
		ProdType  string  `bson:"prodtype"`
		Qty       float64 `bson:"qty"`
		Reporter  string  `bson:"reporter"`
		CreatedAt string  `bson:"createdat"`
	}
	if err = cur.All(context.Background(), &laminationReports); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/sections/lamination/overview/report_tbody.html")).Execute(w, map[string]interface{}{
		"laminationReports": laminationReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/lamination/overview/reportdatefilter
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) slo_reportdatefilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("laminationFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("laminationToDate"))

	cur, err := s.mgdb.Collection("lamination").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
		{{"$sort", bson.D{{"date", -1}, {"createdat", -1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}, "createdat": bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m/%Y", "date": "$createdat", "timezone": "Asia/Bangkok"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var laminationReports []struct {
		Date      string  `bson:"date"`
		ProdType  string  `bson:"prodtype"`
		Qty       float64 `bson:"qty"`
		Reporter  string  `bson:"reporter"`
		CreatedAt string  `bson:"createdat"`
	}
	if err = cur.All(context.Background(), &laminationReports); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/sections/lamination/overview/report_tbody.html")).Execute(w, map[string]interface{}{
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

// router.GET("/sections/slicing/entry", s.ss_entry)
func (s *Server) ss_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/slicing/entry/entry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// router.GET("/sections/slicing/entry/loadform", s.sse_loadform)
func (s *Server) sse_loadform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/slicing/entry/form.html")).Execute(w, nil)
}

// outer.POST("/sections/slicing/entry/sendentry", s.sse_sendentry)
func (s *Server) sse_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, _ := r.Cookie("username")
	username := usernameToken.Value
	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))
	qty, _ := strconv.ParseFloat(r.FormValue("qty"), 64)
	prodtype := r.FormValue("prodtype")
	log.Println(qty)
	if r.FormValue("prodtype") == "" || r.FormValue("qty") == "" {
		template.Must(template.ParseFiles("templates/pages/sections/slicing/entry/form.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thông tin bị thiếu, vui lòng nhập lại.",
		})
		return
	}
	_, err := s.mgdb.Collection("slicing").InsertOne(context.Background(), bson.M{
		"date": primitive.NewDateTimeFromTime(date), "prodtype": prodtype, "qty": qty, "createdat": primitive.NewDateTimeFromTime(time.Now()), "reporter": username,
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/sections/slicing/entry/form.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Kết nối cơ sở dữ liệu thất bại, vui lòng nhập lại hoặc báo admin.",
		})
		return
	}
	template.Must(template.ParseFiles("templates/pages/sections/slicing/entry/form.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Gửi dữ liệu thành công.",
	})
}

// router.GET("/sections/slicing/admin", s.ss_admin)
func (s *Server) ss_admin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/slicing/admin/admin.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// router.GET("/sections/slicing/admin/loadreport", s.ssa_loadreport)
func (s *Server) ssa_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("slicing").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -3))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$sort", bson.D{{"date", -1}, {"createdat", -1}}}},
		{{"$set", bson.M{
			"date":      bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}},
			"createdat": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$createdat"}},
		}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var slicingData []struct {
		Id        string  `bson:"_id"`
		Date      string  `bson:"date"`
		CreatedAt string  `bson:"createdat"`
		ProdType  string  `bson:"prodtype"`
		Qty       float64 `bson:"qty"`
		Reporter  string  `bson:"reporter"`
	}
	if err := cur.All(context.Background(), &slicingData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/slicing/admin/report.html")).Execute(w, map[string]interface{}{
		"slicingData": slicingData,
	})
}

// router.POST("/sections/slicing/admin/reportsearch", s.ssa_reportsearch)
func (s *Server) ssa_reportsearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	searchRegex := ".*" + r.FormValue("reportsearch") + ".*"

	cur, err := s.mgdb.Collection("slicing").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$or": bson.A{
			bson.M{"prodtype": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"report": bson.M{"$regex": searchRegex, "$options": "i"}},
		}}}},
		{{"$sort", bson.D{{"date", -1}, {"createdat", -1}}}},
		{{"$set", bson.M{
			"date":      bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}},
			"createdat": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$createdat"}},
		}}},
	})

	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var slicingData []struct {
		Id        string  `bson:"_id"`
		Date      string  `bson:"date"`
		CreatedAt string  `bson:"createdat"`
		ProdType  string  `bson:"prodtype"`
		Qty       float64 `bson:"qty"`
		Reporter  string  `bson:"reporter"`
	}
	if err := cur.All(context.Background(), &slicingData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/slicing/admin/table.html")).Execute(w, map[string]interface{}{
		"slicingData": slicingData,
	})
}

// router.DELETE("/sections/slicing/admin/deletereport/:id", s.ssa_deletereport)
func (s *Server) ssa_deletereport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportid, _ := primitive.ObjectIDFromHex(ps.ByName("id"))

	_, err := s.mgdb.Collection("slicing").DeleteOne(context.Background(), bson.M{"_id": reportid})
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
		{{"$sort", bson.D{{"date", -1}, {"createdat", -1}}}},
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
		{{"$sort", bson.D{{"date", -1}, {"createdat", -1}}}},
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
// /sections/reededline/overview/reportdatefilter
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sro_reportdatefilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("reededlineFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("reededlineToDate"))

	cur, err := s.mgdb.Collection("reededline").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
		{{"$sort", bson.D{{"date", -1}, {"createdat", -1}}}},
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

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/output/entry - load page entry of output section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) so_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/output/entry/entry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/output/entry/loadentry
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) soe_loadentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/output/entry/form.html")).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/output/entry/sendentry
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) soe_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, _ := r.Cookie("username")
	username := usernameToken.Value
	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))
	qty, _ := strconv.ParseFloat(r.FormValue("qty"), 64)
	outputtype := r.FormValue("outputtype")
	section := r.FormValue("section")
	if r.FormValue("outputtype") == "" || r.FormValue("qty") == "" || r.FormValue("section") == "" {
		template.Must(template.ParseFiles("templates/pages/sections/output/entry/form.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thông tin bị thiếu, vui lòng nhập lại.",
		})
		return
	}
	_, err := s.mgdb.Collection("output").InsertOne(context.Background(), bson.M{
		"date": primitive.NewDateTimeFromTime(date), "type": outputtype, "section": section, "qty": qty, "createdat": primitive.NewDateTimeFromTime(time.Now()), "reporter": username,
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/sections/output/entry/form.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Kết nối cơ sở dữ liệu thất bại, vui lòng nhập lại hoặc báo admin.",
		})
		return
	}
	template.Must(template.ParseFiles("templates/pages/sections/output/entry/form.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Gửi dữ liệu thành công.",
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/output/entry/loadformentry
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) soe_loadformentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/output/entry/fastform.html")).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/output/entry/sendfastentry
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) soe_sendfastentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, _ := r.Cookie("username")
	username := usernameToken.Value
	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))
	outputtype := r.FormValue("outputtype")
	outputlistraw := strings.Fields(r.FormValue("outputlist"))
	var outputlist = make([]float64, len(outputlistraw))
	for i := 0; i < len(outputlistraw); i++ {
		var a float64
		a, err := strconv.ParseFloat(outputlistraw[i], 64)
		if err != nil {
			log.Println(err)
			template.Must(template.ParseFiles("templates/pages/sections/output/entry/form.html")).Execute(w, map[string]interface{}{
				"showErrDialog": true,
				"msgDialog":     "Phải nhập chuỗi số.",
			})
			return
		}
		outputlist[i] = a
	}
	if r.FormValue("outputtype") == "" || r.FormValue("outputlist") == "" {
		template.Must(template.ParseFiles("templates/pages/sections/output/entry/fastform.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thông tin bị thiếu, vui lòng nhập lại.",
		})
		return
	}
	var bdoc []interface{}
	var firsection = []string{"1.Slice", "2.Selection", "3.Lamination", "9.Delivery"}
	var reededsection = []string{"1.Slice", "2.Selection", "3.Lamination", "4.Drying", "5.Reeding", "6.Selection-2", "7.Tubi", "8.Veneer"}
	if outputtype == "fir" && len(outputlist) == 4 {
		for i := 0; i < len(firsection); i++ {
			b := bson.M{
				"date": primitive.NewDateTimeFromTime(date), "type": outputtype, "section": firsection[i], "qty": outputlist[i], "createdat": primitive.NewDateTimeFromTime(time.Now()), "reporter": username,
			}
			bdoc = append(bdoc, b)
		}
	}
	if outputtype == "reeded" && len(outputlist) == 8 {
		for i := 0; i < len(reededsection); i++ {
			b := bson.M{
				"date": primitive.NewDateTimeFromTime(date), "type": outputtype, "section": reededsection[i], "qty": outputlist[i], "createdat": primitive.NewDateTimeFromTime(time.Now()), "reporter": username,
			}
			bdoc = append(bdoc, b)
		}
	}
	_, err := s.mgdb.Collection("output").InsertMany(context.Background(), bdoc)
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/sections/output/entry/form.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Kết nối cơ sở dữ liệu thất bại, vui lòng nhập lại hoặc báo admin.",
		})
		return
	}
	template.Must(template.ParseFiles("templates/pages/sections/output/entry/fastform.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Gửi dữ liệu thành công.",
	})
}

// ///////////////////////////////////////////////////////////////////////
// /sections/output/admin
// ///////////////////////////////////////////////////////////////////////
func (s *Server) so_admin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/output/admin/admin.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////
// /sections/output/admin/loadreport
// ///////////////////////////////////////////////////////////////////////
func (s *Server) soa_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("output").Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{"createdat": -1}).SetLimit(20))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var outputReports []struct {
		ReportId    string    `bson:"_id"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		Type        string    `bson:"type"`
		Section     string    `bson:"section"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}
	if err := cur.All(context.Background(), &outputReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/output/admin/report.html")).Execute(w, map[string]interface{}{
		"outputReports":   outputReports,
		"numberOfReports": len(outputReports),
	})
}

// ///////////////////////////////////////////////////////////////////////
// /sections/output/admin/loadreport
// ///////////////////////////////////////////////////////////////////////
func (s *Server) soa_searchreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	searchRegex := ".*" + r.FormValue("reportSearch") + ".*"
	// searchNumber, _ := strconv.ParseFloat(r.FormValue("reportSearch"), 64)

	cur, err := s.mgdb.Collection("output").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$or": bson.A{
			bson.M{"section": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"type": bson.M{"$regex": searchRegex, "$options": "i"}},
			// bson.M{"qty": searchNumber},
		}}}},
		{{"$sort", bson.M{"date": -1}}},
	})
	if err != nil {
		log.Println("failed to access output at soa_searchreport")
	}
	defer cur.Close(context.Background())
	var outputReports []struct {
		ReportId    string    `bson:"_id"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		Type        string    `bson:"type"`
		Section     string    `bson:"section"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}

	if err := cur.All(context.Background(), &outputReports); err != nil {
		log.Println("failed to decode at soa_searchreport")
	}
	template.Must(template.ParseFiles("templates/pages/sections/output/admin/report_tbody.html")).Execute(w, map[string]interface{}{
		"outputReports": outputReports,
	})
}

// ///////////////////////////////////////////////////////////////////////
// /sections/output/admin/reportdatefilter
// ///////////////////////////////////////////////////////////////////////
func (s *Server) soa_reportdatefilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("fromdate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("todate"))

	cur, err := s.mgdb.Collection("output").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{
			bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}},
			bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}},
		}}}},
		{{"$sort", bson.M{"date": -1}}},
	})
	if err != nil {
		log.Println("failed to access output at soa_searchreport")
	}
	defer cur.Close(context.Background())
	var outputReports []struct {
		ReportId    string    `bson:"_id"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		Type        string    `bson:"type"`
		Section     string    `bson:"section"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}

	if err := cur.All(context.Background(), &outputReports); err != nil {
		log.Println("failed to decode at soa_searchreport")
	}
	template.Must(template.ParseFiles("templates/pages/sections/output/admin/report_tbody.html")).Execute(w, map[string]interface{}{
		"outputReports": outputReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/output/admin/deletereport/:reportid
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) soa_deletereport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportid, _ := primitive.ObjectIDFromHex(ps.ByName("reportid"))

	_, err := s.mgdb.Collection("output").DeleteOne(context.Background(), bson.M{"_id": reportid})
	if err != nil {
		log.Println(err)
		return
	}
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/output/admin/updateform/:reportid
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) soa_updateform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id, _ := primitive.ObjectIDFromHex(ps.ByName("reportid"))

	result := s.mgdb.Collection("output").FindOne(context.Background(), bson.M{"_id": id})
	if result.Err() != nil {
		log.Println(result.Err())
		return
	}
	var outputReports struct {
		ReportId    string    `bson:"_id"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		Type        string    `bson:"type"`
		Section     string    `bson:"section"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}
	if err := result.Decode(&outputReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/output/admin/update_form.html")).Execute(w, map[string]interface{}{
		"outputReports": outputReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// "/sections/output/admin/updatereport/:reportid"
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) soa_updatereport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id, _ := primitive.ObjectIDFromHex(ps.ByName("reportid"))
	outputtype := r.FormValue("outputtype")
	section := r.FormValue("section")
	qty, _ := strconv.ParseFloat(r.FormValue("qty"), 64)

	result := s.mgdb.Collection("output").FindOneAndUpdate(context.Background(), bson.M{"_id": id}, bson.M{"$set": bson.M{"type": outputtype, "section": section, "qty": qty}})
	if result.Err() != nil {
		log.Println(result.Err())
		return
	}
	var outputReports struct {
		ReportId    string    `bson:"_id"`
		Date        time.Time `bson:"date"`
		Qty         float64   `bson:"qty"`
		Type        string    `bson:"type"`
		Section     string    `bson:"section"`
		Reporter    string    `bson:"reporter"`
		CreatedDate time.Time `bson:"createdat"`
	}
	if err := result.Decode(&outputReports); err != nil {
		log.Println(err)
	}
	outputReports.Qty = qty
	outputReports.Type = outputtype
	outputReports.Section = section

	template.Must(template.ParseFiles("templates/pages/sections/output/admin/updated_tr.html")).Execute(w, map[string]interface{}{
		"outputReports": outputReports,
	})
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
		{{"$sort", bson.D{{"date", -1}, {"createdat", -1}}}},
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
// /sections/veneer/overview/reportdatefilter
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) svo_reportdatefilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("veneerFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("veneerToDate"))

	cur, err := s.mgdb.Collection("veneer").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
		{{"$sort", bson.D{{"date", -1}, {"createdat", -1}}}},
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

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/veneer/entry - load page entry of veneer section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sf_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/finemill/entry/entry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/finemill/entry/loadform - load form of page entry of finemill section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sfe_loadform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/finemill/entry/form.html")).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/finemill/sendentry - post form of page entry of finemill section
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sfe_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, _ := r.Cookie("username")
	username := usernameToken.Value
	itemtype := r.FormValue("itemtype")
	// itemtype := "whole"
	// if r.FormValue("switch") != "" {
	// 	itemtype = r.FormValue("switch")
	// }
	itemcode := r.FormValue("itemcode")
	// component := r.FormValue("component")
	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))
	factory := r.FormValue("factory")
	prodtype := r.FormValue("prodtype")
	qty, _ := strconv.Atoi(r.FormValue("qty"))
	value, _ := strconv.ParseFloat(r.FormValue("value"), 64)

	if factory == "" || prodtype == "" {
		template.Must(template.ParseFiles("templates/pages/sections/finemill/entry/form.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thông tin bị thiếu, vui lòng nhập lại.",
		})
		return
	}
	_, err := s.mgdb.Collection("finemill").InsertOne(context.Background(), bson.M{
		"date": primitive.NewDateTimeFromTime(date), "itemcode": itemcode, "itemtype": itemtype,
		"factory": factory, "prodtype": prodtype, "qty": qty, "value": value, "reporter": username, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/sections/finemill/entry/form.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Kết nối cơ sở dữ liệu thất bại, vui lòng nhập lại hoặc báo admin.",
		})
		return
	}
	template.Must(template.ParseFiles("templates/pages/sections/finemill/entry/form.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Gửi dữ liệu thành công.",
	})
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
		{{"$sort", bson.D{{"date", -1}, {"createdat", -1}}}},
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
// /sections/assembly/overview/reportdatefilter
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sao_reportdatefilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("assemblyFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("assemblyToDate"))

	cur, err := s.mgdb.Collection("assembly").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
		{{"$sort", bson.D{{"date", -1}, {"createdad", -1}}}},
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

// router.POST("/sections/assembly/overview/addplanvalue", s.sao_addplanvalue)
func (s *Server) sao_addplanvalue(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, err := r.Cookie("username")
	if err != nil {
		w.Write([]byte("Không có thẩm quyền"))
		return
	}
	date, _ := time.Parse("2006-01-02", r.FormValue("plandate"))
	brandplanvalue, _ := strconv.ParseFloat(r.FormValue("brandplanvalue"), 64)
	rhplanvalue, _ := strconv.ParseFloat(r.FormValue("rhplanvalue"), 64)

	// _, err = s.mgdb.Collection("assembly").UpdateOne(context.Background(), bson.D{{"type", "plan"}, {"date", primitive.NewDateTimeFromTime(date)}, {"plantype", "brand"}}, bson.M{
	// 	"$set": bson.M{"type": "plan", "date": primitive.NewDateTimeFromTime(date), "plantype": "brand", "plan": brandplanvalue, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now())},
	// }, options.Update().SetUpsert(true))
	_, err = s.mgdb.Collection("assembly").InsertOne(context.Background(), bson.M{
		"type": "plan", "date": primitive.NewDateTimeFromTime(date), "plantype": "brand", "plan": brandplanvalue, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
	}
	// _, err = s.mgdb.Collection("assembly").UpdateOne(context.Background(), bson.D{{"type", "plan"}, {"date", primitive.NewDateTimeFromTime(date)}, {"plantype", "rh"}}, bson.M{
	// 	"$set": bson.M{"type": "plan", "date": primitive.NewDateTimeFromTime(date), "plantype": "rh", "plan": rhplanvalue, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now())},
	// }, options.Update().SetUpsert(true))
	_, err = s.mgdb.Collection("assembly").InsertOne(context.Background(), bson.M{
		"type": "plan", "date": primitive.NewDateTimeFromTime(date), "plantype": "rh", "plan": rhplanvalue, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
	}
	http.Redirect(w, r, "/dashboard", http.StatusSeeOther)
}

// router.POST("/sections/assembly/overview/updateinventory", s.sao_updateinventory)
func (s *Server) sao_updateinventory(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, err := r.Cookie("username")
	if err != nil {
		w.Write([]byte("Không có thẩm quyền"))
		return
	}

	brandinventory, _ := strconv.ParseFloat(r.FormValue("brandinventory"), 64)
	rhinventory, _ := strconv.ParseFloat(r.FormValue("rhinventory"), 64)

	_, err = s.mgdb.Collection("assembly").InsertOne(context.Background(), bson.M{
		"type": "Inventory", "prodtype": "rh", "inventory": rhinventory, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
	}

	_, err = s.mgdb.Collection("assembly").InsertOne(context.Background(), bson.M{
		"type": "Inventory", "prodtype": "brand", "inventory": brandinventory, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
	}

	http.Redirect(w, r, "/dashboard", http.StatusSeeOther)
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
	itemtype := r.FormValue("itemtype")
	// itemtype := "whole"
	// if r.FormValue("switch") != "" {
	// 	itemtype = r.FormValue("switch")
	// }
	itemcode := r.FormValue("itemcode")
	component := r.FormValue("component")
	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))
	factory := r.FormValue("factory")
	prodtype := r.FormValue("prodtype")
	qty, _ := strconv.Atoi(r.FormValue("qty"))
	value, _ := strconv.ParseFloat(r.FormValue("value"), 64)

	if factory == "" || prodtype == "" {
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

// router.GET("/sections/assembly/planentry", s.sae_planentry)
func (s *Server) sae_planentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/assembly/entry/planentry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// router.GET("/sections/assembly/entry/loadplanform", s.sae_loadplanform)
func (s *Server) sae_loadplanform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/assembly/entry/planform.html")).Execute(w, nil)
}

// router.POST("/sections/assembly/entry/sendplanentry", s.sae_sendplanentry)
func (s *Server) sae_sendplanentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, _ := r.Cookie("username")
	username := usernameToken.Value

	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))
	value, _ := strconv.ParseFloat(r.FormValue("value"), 64)

	if r.FormValue("value") == "" {
		template.Must(template.ParseFiles("templates/pages/sections/assembly/entry/planform.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thông tin bị thiếu, vui lòng nhập lại.",
		})
		return
	}
	_, err := s.mgdb.Collection("assembly").InsertOne(context.Background(), bson.M{
		"date": primitive.NewDateTimeFromTime(date), "plan": value, "reporter": username, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/sections/assembly/entry/planform.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Kết nối cơ sở dữ liệu thất bại, vui lòng nhập lại hoặc báo admin.",
		})
		return
	}
	template.Must(template.ParseFiles("templates/pages/sections/assembly/entry/planform.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Gửi dữ liệu thành công.",
	})
}

// router.GET("/sections/assembly/inventoryentry", s.sai_inventoryentry)
func (s *Server) sai_inventoryentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/assembly/entry/inventoryentry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// router.GET("/sections/assembly/entry/loadinventoryform", s.sai_loadinventoryform)
func (s *Server) sai_loadinventoryform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/assembly/entry/inventoryform.html")).Execute(w, nil)
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
		{{"$sort", bson.D{{"date", -1}, {"createdat", -1}}}},
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
// /sections/woodfinish/overview/reportdatefilter
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) swo_reportdatefilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("woodfinishFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("woodfinishToDate"))

	cur, err := s.mgdb.Collection("woodfinish").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
		{{"$sort", bson.D{{"date", -1}, {"createdat", -1}}}},
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
	itemtype := r.FormValue("itemtype")
	// itemtype := "whole"
	// if r.FormValue("switch") != "" {
	// 	itemtype = r.FormValue("switch")
	// }
	itemcode := r.FormValue("itemcode")
	component := r.FormValue("component")
	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))
	factory := r.FormValue("factory")
	prodtype := r.FormValue("prodtype")
	qty, _ := strconv.Atoi(r.FormValue("qty"))
	value, _ := strconv.ParseFloat(r.FormValue("value"), 64)

	if factory == "" || prodtype == "" {
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

// router.POST("/sections/woodfinish/overview/addplanvalue", s.swo_addplanvalue)
func (s *Server) swo_addplanvalue(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, err := r.Cookie("username")
	if err != nil {
		w.Write([]byte("Không có thẩm quyền"))
		return
	}
	woodfinishdate, _ := time.Parse("2006-01-02", r.FormValue("woodfinishplandate"))
	woodfinishbrandplanvalue, _ := strconv.ParseFloat(r.FormValue("woodfinishbrandplanvalue"), 64)
	woodfinishrhplanvalue, _ := strconv.ParseFloat(r.FormValue("woodfinishrhplanvalue"), 64)

	_, err = s.mgdb.Collection("woodfinish").InsertOne(context.Background(), bson.M{"type": "plan", "date": primitive.NewDateTimeFromTime(woodfinishdate), "plantype": "brand", "plan": woodfinishbrandplanvalue, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now())})
	if err != nil {
		log.Println(err)
	}
	_, err = s.mgdb.Collection("woodfinish").InsertOne(context.Background(), bson.M{"type": "plan", "date": primitive.NewDateTimeFromTime(woodfinishdate), "plantype": "rh", "plan": woodfinishrhplanvalue, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now())})
	if err != nil {
		log.Println(err)
	}
	http.Redirect(w, r, "/dashboard", http.StatusSeeOther)
}

// router.POST("/sections/woodfinish/overview/updateinventory", s.swo_updateinventory)
func (s *Server) swo_updateinventory(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, err := r.Cookie("username")
	if err != nil {
		w.Write([]byte("Không có thẩm quyền"))
		return
	}

	woodfinishbrandinventory, _ := strconv.ParseFloat(r.FormValue("woodfinishbrandinventory"), 64)
	woodfinishrhinventory, _ := strconv.ParseFloat(r.FormValue("woodfinishrhinventory"), 64)

	_, err = s.mgdb.Collection("woodfinish").InsertOne(context.Background(), bson.M{
		"type": "Inventory", "prodtype": "rh", "inventory": woodfinishrhinventory, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
	}

	_, err = s.mgdb.Collection("woodfinish").InsertOne(context.Background(), bson.M{
		"type": "Inventory", "prodtype": "brand", "inventory": woodfinishbrandinventory, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
	}

	http.Redirect(w, r, "/dashboard", http.StatusSeeOther)
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

// router.POST("/sections/whitewood/overview/addmoney", s.swo_addmoney)
func (s *Server) swo_addmoney(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameTk, _ := r.Cookie("username")
	date, _ := time.Parse("2006-01-02", r.FormValue("whitewoodmoneydate"))
	brandmoney, _ := strconv.ParseFloat(r.FormValue("whitewoodbrandmoney"), 64)
	rhmoney, _ := strconv.ParseFloat(r.FormValue("whitewoodrhmoney"), 64)
	whitemoney, _ := strconv.ParseFloat(r.FormValue("whitewoodwhitemoney"), 64)

	if r.FormValue("whitewoodbrandmoney") != "" {
		_, err := s.mgdb.Collection("whitewood").InsertOne(context.Background(), bson.M{
			"date": primitive.NewDateTimeFromTime(date), "prodtype": "brand", "value": brandmoney, "reporter": usernameTk.Value, "createdat": primitive.NewDateTimeFromTime(time.Now()),
		})
		if err != nil {
			log.Println(err)
		}
	}

	if r.FormValue("whitewoodrhmoney") != "" {
		_, err := s.mgdb.Collection("whitewood").InsertOne(context.Background(), bson.M{
			"date": primitive.NewDateTimeFromTime(date), "prodtype": "rh", "value": rhmoney, "reporter": usernameTk.Value, "createdat": primitive.NewDateTimeFromTime(time.Now()),
		})
		if err != nil {
			log.Println(err)
		}
	}

	if r.FormValue("whitewoodwhitemoney") != "" {
		_, err := s.mgdb.Collection("whitewood").InsertOne(context.Background(), bson.M{
			"date": primitive.NewDateTimeFromTime(date), "prodtype": "white", "value": whitemoney, "reporter": usernameTk.Value, "createdat": primitive.NewDateTimeFromTime(time.Now()),
		})
		if err != nil {
			log.Println(err)
		}
	}

	cur, err := s.mgdb.Collection("whitewood").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"type": bson.M{"$exists": false}}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.prodtype", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": "$_id.prodtype"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var whitewoodData []struct {
		Date  string  `bson:"date" json:"date"`
		Type  string  `bson:"type" json:"type"`
		Value float64 `bson:"value" json:"value"`
	}
	if err := cur.All(context.Background(), &whitewoodData); err != nil {
		log.Println(err)
	}

	// get plan data
	cur, err = s.mgdb.Collection("whitewood").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"type": "plan", "date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}}}}},
		{{"$sort", bson.M{"createdat": -1}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "plantype": "$plantype"}, "plan": bson.M{"$first": "$plan"}, "plans": bson.M{"$firstN": bson.M{"input": "$plan", "n": 2}}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.plantype", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "plantype": "$_id.plantype"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var whitewoodPlanData []struct {
		Date     string    `bson:"date" json:"date"`
		Plantype string    `bson:"plantype" json:"plantype"`
		Plan     float64   `bson:"plan" json:"plan"`
		Plans    []float64 `bson:"plans" json:"plans"`
		Change   float64   `json:"change"`
	}

	if err := cur.All(context.Background(), &whitewoodPlanData); err != nil {
		log.Println(err)
	}
	for i := 0; i < len(whitewoodPlanData); i++ {
		if len(whitewoodPlanData[i].Plans) >= 2 && whitewoodPlanData[i].Plans[1] != 0 {
			whitewoodPlanData[i].Change = whitewoodPlanData[i].Plans[1] - whitewoodPlanData[i].Plan
		} else {
			whitewoodPlanData[i].Change = 0
		}
	}

	// get inventory
	cur, err = s.mgdb.Collection("whitewood").Find(context.Background(), bson.M{"type": "Inventory"}, options.Find().SetSort(bson.M{"createdat": -1}).SetLimit(2))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var whitewoodInventoryData []struct {
		Prodtype     string    `bson:"prodtype" json:"prodtype"`
		Inventory    float64   `bson:"inventory" json:"inventory"`
		CreatedAt    time.Time `bson:"createdat" json:"createdat"`
		CreatedAtStr string    `json:"createdatstr"`
	}

	if err := cur.All(context.Background(), &whitewoodInventoryData); err != nil {
		log.Println(err)
	}

	for i := 0; i < len(whitewoodInventoryData); i++ {
		whitewoodInventoryData[i].CreatedAtStr = whitewoodInventoryData[i].CreatedAt.Add(7 * time.Hour).Format("15h04 date 2/1")
	}
	// get target
	cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"name": "whitewood total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -15))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$sort", bson.M{"date": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	var whitewoodTarget []struct {
		Date  string  `bson:"date" json:"date"`
		Value float64 `bson:"value" json:"value"`
	}
	if err = cur.All(context.Background(), &whitewoodTarget); err != nil {
		log.Println(err)
	}

	// get time of latest update
	sr := s.mgdb.Collection("whitewood").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
	if sr.Err() != nil {
		log.Println(sr.Err())
	}
	var LastReport struct {
		Createdat time.Time `bson:"createdat" json:"createdat"`
	}
	if err := sr.Decode(&LastReport); err != nil {
		log.Println(err)
	}
	whitewoodUpTime := LastReport.Createdat.Add(7 * time.Hour).Format("15:04")

	template.Must(template.ParseFiles("templates/pages/dashboard/whitewood_generalchart.html")).Execute(w, map[string]interface{}{
		"whitewoodData":          whitewoodData,
		"whitewoodPlanData":      whitewoodPlanData,
		"whitewoodInventoryData": whitewoodInventoryData,
		"whitewoodTarget":        whitewoodTarget,
		"whitewoodUpTime":        whitewoodUpTime,
	})
}

// router.POST("/sections/whitewood/overview/addplanvalue", s.swwo_addplanvalue)
func (s *Server) swwo_addplanvalue(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, err := r.Cookie("username")
	if err != nil {
		w.Write([]byte("Không có thẩm quyền"))
		return
	}
	date, _ := time.Parse("2006-01-02", r.FormValue("whitewoodplandate"))
	brandplanvalue, _ := strconv.ParseFloat(r.FormValue("whitewoodbrandplanvalue"), 64)
	rhplanvalue, _ := strconv.ParseFloat(r.FormValue("whitewoodrhplanvalue"), 64)

	_, err = s.mgdb.Collection("whitewood").InsertOne(context.Background(), bson.M{"type": "plan", "date": primitive.NewDateTimeFromTime(date), "plantype": "brand", "plan": brandplanvalue, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now())})
	if err != nil {
		log.Println(err)
	}
	_, err = s.mgdb.Collection("whitewood").InsertOne(context.Background(), bson.M{"type": "plan", "date": primitive.NewDateTimeFromTime(date), "plantype": "rh", "plan": rhplanvalue, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now())})
	if err != nil {
		log.Println(err)
	}
	http.Redirect(w, r, "/dashboard", http.StatusSeeOther)
}

// router.POST("/sections/whitewood/overview/updateinventory", s.swwo_updateinventory)
func (s *Server) swwo_updateinventory(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, err := r.Cookie("username")
	if err != nil {
		w.Write([]byte("Không có thẩm quyền"))
		return
	}

	brandinventory, _ := strconv.ParseFloat(r.FormValue("whitewoodbrandinventory"), 64)
	rhinventory, _ := strconv.ParseFloat(r.FormValue("whitewoodrhinventory"), 64)

	_, err = s.mgdb.Collection("whitewood").InsertOne(context.Background(), bson.M{
		"type": "Inventory", "prodtype": "rh", "inventory": brandinventory, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
	}

	_, err = s.mgdb.Collection("whitewood").InsertOne(context.Background(), bson.M{
		"type": "Inventory", "prodtype": "brand", "inventory": rhinventory, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
	}

	http.Redirect(w, r, "/dashboard", http.StatusSeeOther)
}

// router.POST("/sections/whitewood/overview/addnammoney", s.swo_addnammoney)
func (s *Server) swo_addnammoney(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameTk, _ := r.Cookie("username")
	date, _ := time.Parse("2006-01-02", r.FormValue("whitewoodnamdate"))
	value, _ := strconv.ParseFloat(r.FormValue("whitewoodnammoney"), 64)

	if r.FormValue("whitewoodnammoney") == "" {
		w.Write([]byte("Thiếu thông tin"))
		return
	}

	_, err := s.mgdb.Collection("whitewood").InsertOne(context.Background(), bson.M{
		"date": primitive.NewDateTimeFromTime(date), "prodtype": "variance", "value": value, "reporter": usernameTk.Value, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
	}

	// load chart
	cur, err := s.mgdb.Collection("whitewood").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"type": bson.M{"$exists": false}}, bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.prodtype", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "type": "$_id.prodtype"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var whitewoodData []struct {
		Date  string  `bson:"date" json:"date"`
		Type  string  `bson:"type" json:"type"`
		Value float64 `bson:"value" json:"value"`
	}
	if err := cur.All(context.Background(), &whitewoodData); err != nil {
		log.Println(err)
	}

	// get plan data
	cur, err = s.mgdb.Collection("whitewood").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"type": "plan", "date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -10))}}}}}},
		{{"$sort", bson.M{"createdat": -1}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "plantype": "$plantype"}, "plan": bson.M{"$first": "$plan"}, "plans": bson.M{"$firstN": bson.M{"input": "$plan", "n": 2}}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.plantype", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$_id.date"}}, "plantype": "$_id.plantype"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var whitewoodPlanData []struct {
		Date     string    `bson:"date" json:"date"`
		Plantype string    `bson:"plantype" json:"plantype"`
		Plan     float64   `bson:"plan" json:"plan"`
		Plans    []float64 `bson:"plans" json:"plans"`
		Change   float64   `json:"change"`
	}

	if err := cur.All(context.Background(), &whitewoodPlanData); err != nil {
		log.Println(err)
	}
	for i := 0; i < len(whitewoodPlanData); i++ {
		if len(whitewoodPlanData[i].Plans) >= 2 && whitewoodPlanData[i].Plans[1] != 0 {
			whitewoodPlanData[i].Change = whitewoodPlanData[i].Plans[1] - whitewoodPlanData[i].Plan
		} else {
			whitewoodPlanData[i].Change = 0
		}
	}

	// get inventory
	cur, err = s.mgdb.Collection("whitewood").Find(context.Background(), bson.M{"type": "Inventory"}, options.Find().SetSort(bson.M{"createdat": -1}).SetLimit(2))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var whitewoodInventoryData []struct {
		Prodtype     string    `bson:"prodtype" json:"prodtype"`
		Inventory    float64   `bson:"inventory" json:"inventory"`
		CreatedAt    time.Time `bson:"createdat" json:"createdat"`
		CreatedAtStr string    `json:"createdatstr"`
	}

	if err := cur.All(context.Background(), &whitewoodInventoryData); err != nil {
		log.Println(err)
	}

	for i := 0; i < len(whitewoodInventoryData); i++ {
		whitewoodInventoryData[i].CreatedAtStr = whitewoodInventoryData[i].CreatedAt.Add(7 * time.Hour).Format("15h04 date 2/1")
	}
	// get target
	cur, err = s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"name": "whitewood total by date", "$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -15))}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now())}}}}}},
		{{"$sort", bson.M{"date": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	var whitewoodTarget []struct {
		Date  string  `bson:"date" json:"date"`
		Value float64 `bson:"value" json:"value"`
	}
	if err = cur.All(context.Background(), &whitewoodTarget); err != nil {
		log.Println(err)
	}

	// get time of latest update
	sr := s.mgdb.Collection("whitewood").FindOne(context.Background(), bson.M{}, options.FindOne().SetSort(bson.M{"createdat": -1}))
	if sr.Err() != nil {
		log.Println(sr.Err())
	}
	var LastReport struct {
		Createdat time.Time `bson:"createdat" json:"createdat"`
	}
	if err := sr.Decode(&LastReport); err != nil {
		log.Println(err)
	}
	whitewoodUpTime := LastReport.Createdat.Add(7 * time.Hour).Format("15:04")

	template.Must(template.ParseFiles("templates/pages/dashboard/whitewood_generalchart.html")).Execute(w, map[string]interface{}{
		"whitewoodData":          whitewoodData,
		"whitewoodPlanData":      whitewoodPlanData,
		"whitewoodInventoryData": whitewoodInventoryData,
		"whitewoodTarget":        whitewoodTarget,
		"whitewoodUpTime":        whitewoodUpTime,
	})
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
		{{"$sort", bson.D{{"date", -1}, {"createdat", -1}}}},
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
// /sections/pack/overview/reportdatefilter
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) pko_reportdatefilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("packingFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("packingToDate"))
	cur, err := s.mgdb.Collection("pack").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
		{{"$sort", bson.D{{"date", -1}, {"createdat", -1}}}},
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
	itemtype := r.FormValue("itemtype")
	// itemtype := "whole"
	// if r.FormValue("switch") != "" {
	// 	itemtype = r.FormValue("switch")
	// }
	itemcode := r.FormValue("itemcode")
	part := r.FormValue("part")
	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))
	factory := r.FormValue("factory")
	prodtype := r.FormValue("prodtype")
	qty, _ := strconv.Atoi(r.FormValue("qty"))
	value, _ := strconv.ParseFloat(r.FormValue("value"), 64)

	if factory == "" || prodtype == "" {
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

	template.Must(template.ParseFiles("templates/pages/sections/pack/entry/form.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Gửi dữ liệu thành công.",
	})
}

// router.POST("/sections/pack/overview/updateinventory", s.spo_updateinventory)
func (s *Server) spo_updateinventory(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, err := r.Cookie("username")
	if err != nil {
		w.Write([]byte("Không có thẩm quyền"))
		return
	}

	packbrandinventory, _ := strconv.ParseFloat(r.FormValue("packbrandinventory"), 64)
	packrhinventory, _ := strconv.ParseFloat(r.FormValue("packrhinventory"), 64)

	_, err = s.mgdb.Collection("pack").InsertOne(context.Background(), bson.M{
		"type": "Inventory", "prodtype": "rh", "inventory": packrhinventory, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
	}

	_, err = s.mgdb.Collection("pack").InsertOne(context.Background(), bson.M{
		"type": "Inventory", "prodtype": "brand", "inventory": packbrandinventory, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
	}

	http.Redirect(w, r, "/dashboard", http.StatusSeeOther)
}

// router.POST("/sections/pack/overview/addplanvalue", s.spo_addplanvalue)
func (s *Server) spo_addplanvalue(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, err := r.Cookie("username")
	if err != nil {
		w.Write([]byte("Không có thẩm quyền"))
		return
	}
	date, _ := time.Parse("2006-01-02", r.FormValue("packplandate"))
	packbrandplanvalue, _ := strconv.ParseFloat(r.FormValue("packbrandplanvalue"), 64)
	packrhplanvalue, _ := strconv.ParseFloat(r.FormValue("packrhplanvalue"), 64)

	_, err = s.mgdb.Collection("pack").InsertOne(context.Background(), bson.M{"type": "plan", "date": primitive.NewDateTimeFromTime(date), "plantype": "brand", "plan": packbrandplanvalue, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now())})
	if err != nil {
		log.Println(err)
	}
	_, err = s.mgdb.Collection("pack").InsertOne(context.Background(), bson.M{"type": "plan", "date": primitive.NewDateTimeFromTime(date), "plantype": "rh", "plan": packrhplanvalue, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now())})
	if err != nil {
		log.Println(err)
	}
	http.Redirect(w, r, "/dashboard", http.StatusSeeOther)
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
// /sections/pack/admin/reportdatefilter
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) spka_reportdatefilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("packingFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("packingToDate"))

	filter := bson.M{"$and": bson.A{
		bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}},
		bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}},
	},
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
// /sections/pack/admin/updateform/:reportid
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) spka_updateform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportid, _ := primitive.ObjectIDFromHex(ps.ByName("reportid"))
	result := s.mgdb.Collection("pack").FindOne(context.Background(), bson.M{"_id": reportid})
	if result.Err() != nil {
		log.Println(result.Err())
		return
	}
	var packReports struct {
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
	if err := result.Decode(&packReports); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/pack/admin/update_form.html")).Execute(w, map[string]interface{}{
		"packReports": packReports,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/pack/admin/updatereport/:reportid
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) spka_updatereport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	reportid, _ := primitive.ObjectIDFromHex(ps.ByName("reportid"))
	qty, _ := strconv.ParseFloat(r.FormValue("qty"), 64)
	value, _ := strconv.ParseFloat(r.FormValue("value"), 64)

	result := s.mgdb.Collection("pack").FindOneAndUpdate(context.Background(), bson.M{"_id": reportid}, bson.M{"$set": bson.M{"qty": qty, "value": value}})
	if result.Err() != nil {
		log.Println(result.Err())
		return
	}
	var packReports struct {
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
	if err := result.Decode(&packReports); err != nil {
		log.Println(err)
	}
	packReports.Qty = qty
	packReports.Value = value

	// update production value
	_, err := s.mgdb.Collection("prodvalue").UpdateOne(context.Background(), bson.M{"refid": reportid}, bson.M{"$set": bson.M{"qty": qty, "value": value}})
	if err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/sections/pack/admin/updated_tr.html")).Execute(w, map[string]interface{}{
		"packReports": packReports,
	})
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
		{{"$sort", bson.D{{"date", -1}, {"createdat", -1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}},
			"startat":   bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$startat"}},
			"endat":     bson.M{"$dateToString": bson.M{"format": "%H:%M ngày %d/%m", "date": "$endat"}},
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
// /sections/panelcnc/overview/reportdatefilter
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) spco_reportdatefilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("panelcncFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("panelcncToDate"))

	cur, err := s.mgdb.Collection("panelcnc").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
		{{"$sort", bson.D{{"date", -1}, {"createdat", -1}}}},
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
	qty, _ := strconv.Atoi(r.FormValue("qty"))
	operator := r.FormValue("operator")
	paneltype := r.FormValue("type")
	machine := r.FormValue("machine")
	var start, end time.Time
	var hours float64
	now := time.Now()
	switch r.FormValue("timerange") {
	case "6h - 8h":
		start = time.Date(now.Year(), now.Month(), now.Day(), 6, 0, 0, 0, time.Local)
		end = time.Date(now.Year(), now.Month(), now.Day(), 8, 0, 0, 0, time.Local)
		hours = 2
	case "8h - 10h":
		start = time.Date(now.Year(), now.Month(), now.Day(), 8, 0, 0, 0, time.Local)
		end = time.Date(now.Year(), now.Month(), now.Day(), 10, 0, 0, 0, time.Local)
	case "10h - 11h30":
		start = time.Date(now.Year(), now.Month(), now.Day(), 10, 0, 0, 0, time.Local)
		end = time.Date(now.Year(), now.Month(), now.Day(), 11, 30, 0, 0, time.Local)
	case "12h15 - 14h":
		start = time.Date(now.Year(), now.Month(), now.Day(), 12, 15, 0, 0, time.Local)
		end = time.Date(now.Year(), now.Month(), now.Day(), 14, 0, 0, 0, time.Local)
	case "14h - 16h":
		start = time.Date(now.Year(), now.Month(), now.Day(), 14, 0, 0, 0, time.Local)
		end = time.Date(now.Year(), now.Month(), now.Day(), 16, 0, 0, 0, time.Local)
	case "16h30 - 18h":
		start = time.Date(now.Year(), now.Month(), now.Day(), 16, 30, 0, 0, time.Local)
		end = time.Date(now.Year(), now.Month(), now.Day(), 18, 0, 0, 0, time.Local)
	case "18h - 20h":
		start = time.Date(now.Year(), now.Month(), now.Day(), 18, 0, 0, 0, time.Local)
		end = time.Date(now.Year(), now.Month(), now.Day(), 20, 0, 0, 0, time.Local)
	case "20h - 22h":
		start = time.Date(now.Year(), now.Month(), now.Day(), 20, 0, 0, 0, time.Local)
		end = time.Date(now.Year(), now.Month(), now.Day(), 22, 0, 0, 0, time.Local)
	case "22h30 - 0h":
		start = time.Date(now.Year(), now.Month(), now.Day(), 22, 30, 0, 0, time.Local)
		end = time.Date(now.Year(), now.Month(), now.Day()+1, 0, 0, 0, 0, time.Local)
	case "0h - 2h":
		start = time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.Local)
		end = time.Date(now.Year(), now.Month(), now.Day(), 2, 0, 0, 0, time.Local)
	case "2h45 - 4h":
		start = time.Date(now.Year(), now.Month(), now.Day(), 2, 45, 0, 0, time.Local)
		end = time.Date(now.Year(), now.Month(), now.Day(), 4, 0, 0, 0, time.Local)
	case "4h - 6h":
		start = time.Date(now.Year(), now.Month(), now.Day(), 4, 0, 0, 0, time.Local)
		end = time.Date(now.Year(), now.Month(), now.Day(), 6, 0, 0, 0, time.Local)
	case "other":
		start, _ = time.ParseInLocation("2006-01-02T15:04", r.FormValue("start"), time.Local)
		end, _ = time.ParseInLocation("2006-01-02T15:04", r.FormValue("end"), time.Local)
	}
	hours = math.Round(end.Sub(start).Hours()*10) / 10
	date, _ := time.Parse("2006-01-02", start.Format("2006-01-02"))

	if machine == "" || r.FormValue("qty") == "" || hours <= 0 || r.FormValue("timerange") == "" {
		template.Must(template.ParseFiles("templates/pages/sections/panelcnc/entry/form.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thông tin bị thiếu hoặc sai, vui lòng nhập lại.",
		})
		return
	}
	_, err := s.mgdb.Collection("panelcnc").InsertOne(context.Background(), bson.M{
		"date": primitive.NewDateTimeFromTime(date), "startat": primitive.NewDateTimeFromTime(start), "endat": primitive.NewDateTimeFromTime(end),
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

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/outsource/entry
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sos_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/sections/outsource/entry/entry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/outsource/entry/loadform
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sose_loadform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/sections/outsource/entry/form.html")).Execute(w, nil)
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /sections/outsource/entry/sendentry
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) sose_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, _ := r.Cookie("username")
	username := usernameToken.Value
	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))
	value, _ := strconv.ParseFloat(r.FormValue("value"), 64)
	factory := r.FormValue("factory")
	item := r.FormValue("item")
	qty, _ := strconv.Atoi(r.FormValue("qty"))

	if r.FormValue("value") == "" || r.FormValue("factory") == "" {
		template.Must(template.ParseFiles("templates/pages/sections/outsource/entry/form.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thông tin bị thiếu, vui lòng nhập lại.",
		})
		return
	}
	insertedResult, err := s.mgdb.Collection("outsource").InsertOne(context.Background(), bson.M{
		"date": primitive.NewDateTimeFromTime(date), "item": item, "factory": factory, "qty": qty, "value": value, "reporter": username, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/sections/outsource/entry/form.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Kết nối cơ sở dữ liệu thất bại, vui lòng nhập lại hoặc báo admin.",
		})
		return
	}

	//create a report for production value collection
	_, err = s.mgdb.Collection("prodvalue").InsertOne(context.Background(), bson.M{
		"date":    primitive.NewDateTimeFromTime(date),
		"factory": factory, "prodtype": "outsource", "item": item, "qty": qty, "value": value, "reporter": username, "createdat": primitive.NewDateTimeFromTime(time.Now()),
		"from": "outsource", "refid": insertedResult.InsertedID,
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/sections/outsource/entry/form.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Kết nối cơ sở dữ liệu thất bại, vui lòng nhập lại hoặc báo admin.",
		})
		return
	}

	template.Must(template.ParseFiles("templates/pages/sections/outsource/entry/form.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Gửi dữ liệu thành công.",
	})
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
	var scores []string
	scanner := bufio.NewScanner(strings.NewReader(r.FormValue("scorelist")))
	for scanner.Scan() {
		line := scanner.Text()
		arr := strings.Fields(line)
		score := arr[len(arr)-1]
		section := strings.Join(arr[:len(arr)-1], " ")
		scores = append(scores, section)
		scores = append(scores, score)
	}
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
// /production/overview - get page overview of production
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) p_overview(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/production/overview/overview.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// ///////////////////////////////////////////////////////////////////////////////
// /production/overview/loadprodtype - load chart prodtype of page overview of Production value
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) po_loadprodtype(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("prodvalue").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$expr": bson.M{"$eq": bson.A{bson.M{"$month": "$date"}, int(time.Now().Month())}}}}},
		{{"$group", bson.M{"_id": "$prodtype", "value": bson.M{"$sum": "$value"}}}},
		{{"$sort", bson.M{"value": -1}}},
		{{"$set", bson.M{"name": "$_id"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var prodtypeChartData []struct {
		Name  string  `bson:"name" json:"name"`
		Value float64 `bson:"value" json:"value"`
	}
	if err = cur.All(context.Background(), &prodtypeChartData); err != nil {
		log.Println(err)
	}
	cur, err = s.mgdb.Collection("prodvalue").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$expr": bson.M{"$eq": bson.A{bson.M{"$month": "$date"}, int(time.Now().Month())}}}}},
		{{"$sort", bson.D{{"createdat", -1}, {"date", -1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%Y-%m-%d", "date": "$date"}}, "createdat": bson.M{"$dateToString": bson.M{"format": "%Y-%m-%d %H:%M", "date": "$createdat", "timezone": "Asia/Bangkok"}}}}},
	})
	if err != nil {
		log.Println(err)
	}

	var rawData []struct {
		Date      string `bson:"date" json:"date"`
		CreatedAt string `bson:"createdat" json:"createdat"`
	}
	if err := cur.All(context.Background(), &rawData); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/production/overview/prodtype.html")).Execute(w, map[string]interface{}{
		"prodtypeChartData": prodtypeChartData,
		"rawData":           rawData,
	})
}

// ///////////////////////////////////////////////////////////////////////////////
// /production/overview/loadsummary - load summary table of page overview of Production value
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) po_loadsummary(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("prodvalue").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$expr": bson.M{"$eq": bson.A{bson.M{"$month": "$date"}, int(time.Now().Month())}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}, "qty": bson.M{"$sum": "$qty"}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.prodtype", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%Y-%m-%d", "date": "$_id.date"}}, "prodtype": "$_id.prodtype"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var data []struct {
		Date     string  `bson:"date" json:"date"`
		Prodtype string  `bson:"prodtype" json:"prodtype"`
		Value    float64 `bson:"value" json:"value"`
		Qty      int     `bson:"qty" json:"qty"`
	}
	if err = cur.All(context.Background(), &data); err != nil {
		log.Println(err)
	}
	var mtdv, rhmtdv, brandmtdv, outsourcemtdv float64
	var mtdp, rhmtdp, brandmtdp, outsourcemtdp int
	var dates []string
	for _, i := range data {
		mtdv += i.Value
		mtdp += i.Qty
		switch i.Prodtype {
		case "brand":
			brandmtdv += i.Value
			brandmtdp += i.Qty
		case "rh":
			rhmtdv += i.Value
			rhmtdp += i.Qty
		case "outsource":
			outsourcemtdv += i.Value
			outsourcemtdp += i.Qty
		}
		if !slices.Contains(dates, i.Date) {
			dates = append(dates, i.Date)
		}
	}

	pastdays := len(dates)

	var todayv, todaybrandv, todayrhv, todayoutsourcev float64
	var todayp int
	todayv, todaybrandv, todayrhv, todayoutsourcev = 0, 0, 0, 0
	todayp = 0
	if pastdays >= 1 && time.Now().Add(7*time.Hour).Format("2006-01-02") == dates[len(dates)-1] {
		pastdays--

		for i := len(data) - 1; i > 0; i-- {
			if data[i].Date != dates[len(dates)-1] {
				break
			}
			todayv += data[i].Value
			todayp += data[i].Qty
			switch data[i].Prodtype {
			case "brand":
				todaybrandv += data[i].Value
			case "rh":
				todayrhv += data[i].Value
			case "outsource":
				todayoutsourcev += data[i].Value
			}
		}
	}
	if pastdays == 0 {
		pastdays = 1
	}
	// cái náy dùng được, để sau này dùng
	var estdays int
	start := time.Now()
	end := time.Date(2024, time.Now().Month()+1, 1, 0, 0, 0, 0, time.Local)
	for d := start; !d.After(end); d = d.AddDate(0, 0, 1) {
		if d.Weekday() != time.Sunday {
			estdays++
		}
	}

	// dùng tạm estdays tính tay này
	// estdays := 24 - pastdays

	p := message.NewPrinter(language.English)
	template.Must(template.ParseFiles("templates/pages/production/overview/summary.html")).Execute(w, map[string]interface{}{
		"month":         time.Now().Month().String(),
		"mtdv":          p.Sprintf("%.0f", mtdv),
		"mtdp":          p.Sprintf("%d", mtdp),
		"brandmtdv":     p.Sprintf("%.0f", brandmtdv),
		"brandmtdp":     p.Sprintf("%d", brandmtdp),
		"rhmtdv":        p.Sprintf("%.0f", rhmtdv),
		"rhmtdp":        p.Sprintf("%d", rhmtdp),
		"outsourcemtdv": p.Sprintf("%.0f", outsourcemtdv),
		"pastdays":      pastdays,
		"avgv":          p.Sprintf("%.0f", (mtdv-todayv)/float64(pastdays)),
		"avgp":          p.Sprintf("%d", mtdp/pastdays),
		"brandavgv":     p.Sprintf("%.0f", (brandmtdv-todaybrandv)/float64(pastdays)),
		"brandavgp":     p.Sprintf("%d", brandmtdp/pastdays),
		"rhavgv":        p.Sprintf("%.0f", (rhmtdv-todayrhv)/float64(pastdays)),
		"rhavgp":        p.Sprintf("%d", rhmtdp/pastdays),
		"outsourceavgv": p.Sprintf("%.0f", (outsourcemtdv-todayoutsourcev)/float64(pastdays)),
		"estv":          p.Sprintf("%.0f", (mtdv-todayv)/float64(pastdays)*float64(estdays)+(mtdv-todayv)),
		"estbrandv":     p.Sprintf("%.0f", (brandmtdv-todaybrandv)/float64(pastdays)*float64(estdays)+(brandmtdv-todaybrandv)),
		"estrhv":        p.Sprintf("%.0f", (rhmtdv-todayrhv)/float64(pastdays)*float64(estdays)+(rhmtdv-todayrhv)),
		"estoutsourcev": p.Sprintf("%.0f", (outsourcemtdv-todayoutsourcev)/float64(pastdays)*float64(estdays)+(outsourcemtdv-todayoutsourcev)),
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /production/overview/loadreport - load report table of page overview of production
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) po_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("prodvalue").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{}}},
		{{"$sort", bson.M{"createdat": -1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}, "at": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y %H:%M", "date": "$createdat"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var prodvalueData []struct {
		Id        string  `bson:"_id" json:"id"`
		Date      string  `bson:"date" json:"date"`
		Item      string  `bson:"item" json:"item"`
		ProdType  string  `bson:"prodtype" json:"prodtype"`
		ItemType  string  `bson:"itemtype" json:"itemtype"`
		Qty       int     `bson:"qty" json:"qty"`
		Value     float64 `bson:"value" json:"value"`
		From      string  `bson:"from" json:"from"`
		RefId     string  `bson:"refid" json:"refid"`
		Factory   string  `bson:"factory" json:"factory"`
		Reporter  string  `bson:"reporter" json:"reporter"`
		CreatedAt string  `bson:"at" json:"at"`
	}
	if err = cur.All(context.Background(), &prodvalueData); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/production/overview/report.html")).Execute(w, map[string]interface{}{
		"prodvalueData":   prodvalueData,
		"numberOfReports": len(prodvalueData),
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /production/overview/reportfilter
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) po_reportfilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fromdate, _ := time.Parse("2006-01-02", r.FormValue("reportFromDate"))
	todate, _ := time.Parse("2006-01-02", r.FormValue("reportToDate"))

	cur, err := s.mgdb.Collection("prodvalue").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(fromdate)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(todate)}}}}}},
		{{"$sort", bson.D{{"date", -1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}, "at": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y %H:%M", "date": "$createdat"}}}}},
	})
	if err != nil {
		log.Println("failed to access prodvalue at po_reportfilter")
	}
	defer cur.Close(context.Background())
	var prodvalueData []struct {
		Id        string  `bson:"_id" json:"id"`
		Date      string  `bson:"date" json:"date"`
		Item      string  `bson:"item" json:"item"`
		ProdType  string  `bson:"prodtype" json:"prodtype"`
		ItemType  string  `bson:"itemtype" json:"itemtype"`
		Qty       int     `bson:"qty" json:"qty"`
		Value     float64 `bson:"value" json:"value"`
		From      string  `bson:"from" json:"from"`
		RefId     string  `bson:"refid" json:"refid"`
		Factory   string  `bson:"factory" json:"factory"`
		Reporter  string  `bson:"reporter" json:"reporter"`
		CreatedAt string  `bson:"at" json:"at"`
	}
	if err = cur.All(context.Background(), &prodvalueData); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/production/overview/report_tbody.html")).Execute(w, map[string]interface{}{
		"prodvalueData": prodvalueData,
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /production/overview/prodtypefilter
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) po_prodtypefilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	start, _ := time.Parse("2006-01-02", r.FormValue("prodtypeFromDate"))
	end, _ := time.Parse("2006-01-02", r.FormValue("prodtypeToDate"))
	cur, err := s.mgdb.Collection("prodvalue").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(start)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(end)}}}}}},
		{{"$group", bson.M{"_id": "$prodtype", "value": bson.M{"$sum": "$value"}}}},
		{{"$sort", bson.M{"value": -1}}},
		{{"$set", bson.M{"name": "$_id"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var prodtypeChartData []struct {
		Name  string  `bson:"name" json:"name"`
		Value float64 `bson:"value" json:"value"`
	}
	if err = cur.All(context.Background(), &prodtypeChartData); err != nil {
		log.Println(err)
	}
	cur, err = s.mgdb.Collection("prodvalue").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"date": bson.M{"$gte": primitive.NewDateTimeFromTime(start)}}, bson.M{"date": bson.M{"$lte": primitive.NewDateTimeFromTime(end)}}}}}},
		{{"$sort", bson.D{{"date", -1}, {"createdat", -1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%Y-%m-%d", "date": "$date"}}, "createdat": bson.M{"$dateToString": bson.M{"format": "%Y-%m-%d %H:%M", "date": "$createdat", "timezone": "Asia/Bangkok"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	var rawData []struct {
		Date      string `bson:"date" json:"date"`
		CreatedAt string `bson:"createdat" json:"createdat"`
	}
	if err := cur.All(context.Background(), &rawData); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/production/overview/prodtypechart.html")).Execute(w, map[string]interface{}{
		"prodtypeChartData": prodtypeChartData,
		"rawData":           rawData,
	})
}

// ///////////////////////////////////////////////////////////////////////////////
// /production/overview/loadsummary - load summary table of page overview of Production value
// ///////////////////////////////////////////////////////////////////////////////
func (s *Server) po_summarydatefilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	month, _ := strconv.Atoi(r.FormValue("summarymonth"))
	cur, err := s.mgdb.Collection("prodvalue").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$expr": bson.M{"$eq": bson.A{bson.M{"$month": "$date"}, month}}}}},
		{{"$group", bson.M{"_id": bson.M{"date": "$date", "prodtype": "$prodtype"}, "value": bson.M{"$sum": "$value"}, "qty": bson.M{"$sum": "$qty"}}}},
		{{"$sort", bson.D{{"_id.date", 1}, {"_id.prodtype", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%Y-%m-%d", "date": "$_id.date"}}, "prodtype": "$_id.prodtype"}}},
		{{"$unset", "_id"}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var data []struct {
		Date     string  `bson:"date" json:"date"`
		Prodtype string  `bson:"prodtype" json:"prodtype"`
		Value    float64 `bson:"value" json:"value"`
		Qty      int     `bson:"qty" json:"qty"`
	}
	if err = cur.All(context.Background(), &data); err != nil {
		log.Println(err)
	}
	if len(data) == 0 {
		template.Must(template.ParseFiles("templates/pages/production/overview/summary_tbody.html")).Execute(w, map[string]interface{}{})
		return
	}

	var mtdv, rhmtdv, brandmtdv, outsourcemtdv float64
	var mtdp, rhmtdp, brandmtdp, outsourcemtdp int
	var dates []string
	for _, i := range data {
		mtdv += i.Value
		mtdp += i.Qty
		switch i.Prodtype {
		case "brand":
			brandmtdv += i.Value
			brandmtdp += i.Qty
		case "rh":
			rhmtdv += i.Value
			rhmtdp += i.Qty
		case "outsource":
			outsourcemtdv += i.Value
			outsourcemtdp += i.Qty
		}
		if !slices.Contains(dates, i.Date) {
			dates = append(dates, i.Date)
		}
	}

	pastdays := len(dates)
	var todayv, todaybrandv, todayrhv, todayoutsourcev float64
	var todayp int
	if time.Now().Add(7*time.Hour).Format("2006-01-02") == dates[len(dates)-1] {
		pastdays--
		for i := len(data) - 1; i > 0; i-- {
			if data[i].Date != dates[len(dates)-1] {
				break
			}
			todayv += data[i].Value
			todayp += data[i].Qty
			switch data[i].Prodtype {
			case "brand":
				todaybrandv += data[i].Value
			case "rh":
				todayrhv += data[i].Value
			case "outsource":
				todayoutsourcev += data[i].Value
			}
		}
	}
	var estdays int
	if month != int(time.Now().Month()) {
		estdays = 0
	} else {
		start := time.Now()
		end := time.Date(2024, time.Now().Month()+1, 1, 0, 0, 0, 0, time.Local)
		for d := start; !d.After(end); d = d.AddDate(0, 0, 1) {
			if d.Weekday() != time.Sunday {
				estdays++
			}
		}
	}

	p := message.NewPrinter(language.English)
	template.Must(template.ParseFiles("templates/pages/production/overview/summary_tbody.html")).Execute(w, map[string]interface{}{
		"mtdv":          p.Sprintf("%.0f", mtdv),
		"mtdp":          p.Sprintf("%d", mtdp),
		"brandmtdv":     p.Sprintf("%.0f", brandmtdv),
		"brandmtdp":     p.Sprintf("%d", brandmtdp),
		"rhmtdv":        p.Sprintf("%.0f", rhmtdv),
		"rhmtdp":        p.Sprintf("%d", rhmtdp),
		"outsourcemtdv": p.Sprintf("%.0f", outsourcemtdv),
		"pastdays":      pastdays,
		"avgv":          p.Sprintf("%.0f", mtdv/float64(pastdays)),
		"avgp":          p.Sprintf("%d", mtdp/pastdays),
		"brandavgv":     p.Sprintf("%.0f", brandmtdv/float64(pastdays)),
		"brandavgp":     p.Sprintf("%d", brandmtdp/pastdays),
		"rhavgv":        p.Sprintf("%.0f", rhmtdv/float64(pastdays)),
		"rhavgp":        p.Sprintf("%d", rhmtdp/pastdays),
		"outsourceavgv": p.Sprintf("%.0f", outsourcemtdv/float64(pastdays)),
		"estv":          p.Sprintf("%.0f", (mtdv-todayv)/float64(pastdays)*float64(estdays)+(mtdv-todayv)),
		"estbrandv":     p.Sprintf("%.0f", (brandmtdv-todaybrandv)/float64(pastdays)*float64(estdays)+(brandmtdv-todaybrandv)),
		"estrhv":        p.Sprintf("%.0f", (rhmtdv-todayrhv)/float64(pastdays)*float64(estdays)+(rhmtdv-todayrhv)),
		"estoutsourcev": p.Sprintf("%.0f", (outsourcemtdv-todayoutsourcev)/float64(pastdays)*float64(estdays)+(outsourcemtdv-todayoutsourcev)),
	})
}

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
// /target/entry/loadsectionentry
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) tge_loadsectionentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/target/entry/sectiontarget.html")).Execute(w, nil)
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /target/entry/loadreport
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) tge_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
		{{"$sort", bson.D{{"date", -1}, {"name", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var targetData []struct {
		Id    string  `bson:"_id"`
		Date  string  `bson:"date"`
		Name  string  `bson:"name"`
		Value float64 `bson:"value"`
	}
	if err := cur.All(context.Background(), &targetData); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/target/entry/report.html")).Execute(w, map[string]interface{}{
		"targetData": targetData,
	})
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

	// var bdoc []interface{}
	for tmpdate := targetstart; tmpdate.Before(targetend.AddDate(0, 0, 1)); tmpdate = tmpdate.AddDate(0, 0, 1) {
		if slices.Contains(intWeekDays, int(tmpdate.Weekday())) {
			// b := bson.M{
			// 	"name": targetname, "date": primitive.NewDateTimeFromTime(tmpdate), "value": target,
			// }
			// bdoc = append(bdoc, b)
			_, err := s.mgdb.Collection("target").UpdateOne(context.Background(), bson.M{"name": targetname, "date": primitive.NewDateTimeFromTime(tmpdate)}, bson.M{
				"$set": bson.M{"value": target},
			}, options.Update().SetUpsert(true))
			if err != nil {
				log.Println(err)
				template.Must(template.ParseFiles("templates/pages/target/entry/sectiontarget.html")).Execute(w, map[string]interface{}{
					"showErrDialog": true,
					"msgDialog":     "Cập nhật thất bại, vui lòng nhập lại.",
				})
				return
			}
		}
	}

	// _, err := s.mgdb.Collection("target").InsertMany(context.Background(), bdoc, options.InsertMany())
	// if err != nil {
	// 	log.Println(err)
	// 	template.Must(template.ParseFiles("templates/pages/target/entry/sectiontarget.html")).Execute(w, map[string]interface{}{
	// 		"showErrDialog": true,
	// 		"msgDialog":     "Cập nhật thất bại, vui lòng nhập lại.",
	// 	})
	// 	return
	// }

	template.Must(template.ParseFiles("templates/pages/target/entry/sectiontarget.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Đã đặt target thành công",
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /target/entry/loadplanworkdays
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) tge_loadplanworkdays(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/target/entry/planworkdays.html")).Execute(w, nil)
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /target/entry/setworkdays
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) tge_setworkdays(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	month, _ := strconv.Atoi(r.FormValue("month"))
	workdays, _ := strconv.Atoi(r.FormValue("workdays"))

	if r.FormValue("month") == "" || r.FormValue("workdays") == "" {
		template.Must(template.ParseFiles("templates/pages/target/entry/planworkdays.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thiếu thông tin, vui lòng nhập lại.",
		})
		return
	}
	date := time.Date(time.Now().Year(), time.Month(month), 15, 0, 0, 0, 0, time.Local)

	_, err := s.mgdb.Collection("target").InsertOne(context.Background(), bson.M{
		"name": "plan work days", "date": primitive.NewDateTimeFromTime(date), "value": workdays,
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/target/entry/planworkdays.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Cập nhật thất bại, vui lòng nhập lại.",
		})
		return
	}

	template.Must(template.ParseFiles("templates/pages/target/entry/planworkdays.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Đã đặt số ngày dự kiến thành công",
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /target/entry/search
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) tge_search(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	searchRegex := ".*" + r.FormValue("targetSearch") + ".*"
	cur, err := s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"name": bson.M{"$regex": searchRegex, "$options": "i"}}}},
		{{"$sort", bson.M{"date": -1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var targetData []struct {
		Id    string  `bson:"_id"`
		Date  string  `bson:"date"`
		Name  string  `bson:"name"`
		Value float64 `bson:"value"`
	}
	if err := cur.All(context.Background(), &targetData); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/target/entry/target_tbody.html")).Execute(w, map[string]interface{}{
		"targetData": targetData,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /target/entry/filterbydate
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) tge_filterbydate(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	occurdate, _ := time.Parse("2006-01-02", r.FormValue("occurdate"))

	cur, err := s.mgdb.Collection("target").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"date": primitive.NewDateTimeFromTime(occurdate)}}},
		{{"$sort", bson.M{"name": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var targetData []struct {
		Id    string  `bson:"_id"`
		Date  string  `bson:"date"`
		Name  string  `bson:"name"`
		Value float64 `bson:"value"`
	}
	if err := cur.All(context.Background(), &targetData); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/target/entry/target_tbody.html")).Execute(w, map[string]interface{}{
		"targetData": targetData,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /target/entry/deletereport/:id
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) tge_deletereport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id, _ := primitive.ObjectIDFromHex(ps.ByName("id"))

	_, err := s.mgdb.Collection("target").DeleteOne(context.Background(), bson.M{"_id": id})
	if err != nil {
		log.Println(err)
		return
	}
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /manhr/admin - get page manhr admin
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) m_admin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/manhr/admin/admin.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /manhr/admin/loadentry - load entry section
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) ma_loadentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/manhr/admin/manhrentry.html")).Execute(w, nil)
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /manhr/admin/loadreport - load manhr table section
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) ma_loadreport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("manhr").Aggregate(context.Background(), mongo.Pipeline{
		{{"$sort", bson.D{{"date", -1}, {"section", 1}}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var manhrData []struct {
		Id      string  `bson:"_id"`
		Date    string  `bson:"date"`
		Section string  `bson:"section"`
		Hc      int     `bson:"hc"`
		Workhr  float64 `bson:"workhr"`
	}
	if err := cur.All(context.Background(), &manhrData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/manhr/admin/report.html")).Execute(w, map[string]interface{}{
		"manhrData":       manhrData,
		"numberOfReports": len(manhrData),
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /manhr/admin/sendentry - send entry of manhr
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) ma_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	section := r.FormValue("section")
	date, _ := time.Parse("2006-01-02", r.FormValue("occurdate"))
	hc, _ := strconv.Atoi(r.FormValue("hc"))
	workhr, _ := strconv.ParseFloat(r.FormValue("workhr"), 64)
	if section == "" || hc == 0 || workhr == 0 {
		template.Must(template.ParseFiles("templates/pages/manhr/admin/manhrentry.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thiếu thông tin nhập liệu",
		})
		return
	}
	_, err := s.mgdb.Collection("manhr").InsertOne(context.Background(), bson.M{
		"section": section, "date": primitive.NewDateTimeFromTime(date), "hc": hc, "workhr": workhr,
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/manhr/admin/manhrentry.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Record này có thể đã có rồi, check và update thay vì tạo mới.",
		})
		return
	}
	template.Must(template.ParseFiles("templates/pages/manhr/admin/manhrentry.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Cập nhật thành công",
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /manhr/admin/deletereport/:id
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) ma_deletereport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id, _ := primitive.ObjectIDFromHex(ps.ByName("id"))

	_, err := s.mgdb.Collection("manhr").DeleteOne(context.Background(), bson.M{"_id": id})
	if err != nil {
		log.Println(err)
		return
	}
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /manhr/admin/updateform/:id
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) ma_updateform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id, _ := primitive.ObjectIDFromHex(ps.ByName("id"))

	result := s.mgdb.Collection("manhr").FindOne(context.Background(), bson.M{"_id": id})
	if result.Err() != nil {
		log.Println(result.Err())
		return
	}
	var manhrData struct {
		Id      string    `bson:"_id"`
		Date    time.Time `bson:"date"`
		Section string    `bson:"section"`
		Hc      int       `bson:"hc"`
		Workhr  float64   `bson:"workhr"`
	}
	if err := result.Decode(&manhrData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/manhr/admin/update_form.html")).Execute(w, map[string]interface{}{
		"manhrData": manhrData,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /manhr/admin/updatereport/:id
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) ma_updatereport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id, _ := primitive.ObjectIDFromHex(ps.ByName("id"))
	hc, _ := strconv.Atoi(r.FormValue("hc"))
	workhr, _ := strconv.ParseFloat(r.FormValue("workhr"), 64)

	result := s.mgdb.Collection("manhr").FindOneAndUpdate(context.Background(), bson.M{"_id": id}, bson.M{"$set": bson.M{"hc": hc, "workhr": workhr}})
	if result.Err() != nil {
		log.Println(result.Err())
		return
	}
	var manhrData struct {
		Id      string    `bson:"_id"`
		Date    time.Time `bson:"date"`
		Section string    `bson:"section"`
		Hc      int       `bson:"hc"`
		Workhr  float64   `bson:"workhr"`
		DateStr string
	}
	if err := result.Decode(&manhrData); err != nil {
		log.Println(err)
	}
	manhrData.Hc = hc
	manhrData.Workhr = workhr
	manhrData.DateStr = manhrData.Date.Format("02-01-2006")

	template.Must(template.ParseFiles("templates/pages/manhr/admin/updated_tr.html")).Execute(w, map[string]interface{}{
		"manhrData": manhrData,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /manhr/admin/search
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) ma_search(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	searchRegex := ".*" + r.FormValue("manhrSearch") + ".*"
	cur, err := s.mgdb.Collection("manhr").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"section": bson.M{"$regex": searchRegex, "$options": "i"}}}},
		{{"$sort", bson.M{"date": -1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var manhrData []struct {
		Id      string  `bson:"_id"`
		Date    string  `bson:"date"`
		Section string  `bson:"section"`
		Hc      int     `bson:"hc"`
		Workhr  float64 `bson:"workhr"`
	}
	if err := cur.All(context.Background(), &manhrData); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/manhr/admin/manhr_tbody.html")).Execute(w, map[string]interface{}{
		"manhrData": manhrData,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /manhr/admin/filterbydate
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) ma_filterbydate(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	occurdate, _ := time.Parse("2006-01-02", r.FormValue("occurdate"))

	cur, err := s.mgdb.Collection("manhr").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"date": primitive.NewDateTimeFromTime(occurdate)}}},
		{{"$sort", bson.M{"section": 1}}},
		{{"$set", bson.M{"date": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$date"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var manhrData []struct {
		Id      string  `bson:"_id"`
		Date    string  `bson:"date"`
		Section string  `bson:"section"`
		Hc      int     `bson:"hc"`
		Workhr  float64 `bson:"workhr"`
	}
	if err := cur.All(context.Background(), &manhrData); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/manhr/admin/manhr_tbody.html")).Execute(w, map[string]interface{}{
		"manhrData": manhrData,
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /downtime/entry - copy paste report for downtime
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) dt_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/downtime/entry/entry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /downtime//entry/loadform - load form of report for downtime
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) dte_loadform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/downtime/entry/form.html")).Execute(w, nil)
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /downtime/sendentry - post report for downtime
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) dte_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	lines := strings.Split(strings.Trim(r.FormValue("list"), "\n"), "\n")
	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))

	var jsonStr = `[`
	for _, line := range lines {
		raw := strings.Fields(line)
		if len(raw) < 2 {
			template.Must(template.ParseFiles("templates/pages/downtime/entry/form.html")).Execute(w, map[string]interface{}{
				"showErrDialog": true,
				"msgDialog":     "Lỗi nhập liệu. Vui lòng thử lại.",
			})
			return
		}
		section := raw[0]
		downtime := raw[1]

		jsonStr += `{
			"date":"` + date.Format("2006-01-02") + `", 
			"section":"` + section + `", 
			"downtime":` + downtime + `
			},`
	}
	jsonStr = jsonStr[:len(jsonStr)-1] + `]`

	var bdoc []interface{}
	err := bson.UnmarshalExtJSON([]byte(jsonStr), true, &bdoc)
	if err != nil {
		log.Print(err)
		template.Must(template.ParseFiles("templates/pages/downtime/entry/form.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Lỗi decode. Vui lòng liên hệ admin.",
		})
		return
	}
	_, err = s.mgdb.Collection("downtime").InsertMany(context.Background(), bdoc)
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/downtime/entry/form.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Kết nối database thất bại. Vui lòng liên hệ admin.",
		})
		return
	}
	template.Must(template.ParseFiles("templates/pages/downtime/entry/form.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Gửi dữ liệu thành công.",
	})
}

// router.GET("/colormixing/admin", s.c_admin)
func (s *Server) c_admin(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/colormixing/admin/admin.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// router.GET("/colormixing/admin/loadusingtimeform", s.ca_loadusingtimeform)
func (s *Server) ca_loadusingtimeform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("mixingbatch").Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{"issueddate": -1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var batchData []struct {
		BatchNo string `bson:"batchno"`
	}
	if err := cur.All(context.Background(), &batchData); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/colormixing/admin/usingtimeform.html")).Execute(w, map[string]interface{}{
		"batchData": batchData,
	})
}

// router.GET("/colormixing/admin/loadinspectionform", s.ca_loadinspectionform)
func (s *Server) ca_loadinspectionform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("colorpanel").Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{"panelno": 1}))
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var colorData []struct {
		Code string `bson:"panelno"`
		User string `bson:"user"`
	}
	if err := cur.All(context.Background(), &colorData); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/colormixing/admin/inspectionform.html")).Execute(w, map[string]interface{}{
		"colorData": colorData,
	})
}

// router.POST("/colormixing/admin/addinspection", s.ca_addinspection)
func (s *Server) ca_addinspection(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	inspecteddate, _ := time.Parse("2006-01-02", r.FormValue("inspecteddate"))
	delta, _ := strconv.ParseFloat(r.FormValue("delta"), 64)

	sr := s.mgdb.Collection("colorpanel").FindOne(context.Background(), bson.M{"panelno": r.FormValue("panelno"), "inspections.date": inspecteddate.Format("02-01-2006")})
	var rc interface{}
	if err := sr.Decode(&rc); err != nil {
		log.Println(err)
	}
	if rc != nil {
		template.Must(template.ParseFiles("templates/pages/colormixing/admin/inspectionform.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Cập nhật thất bại, đã tồn tại",
		})
		return
	}

	_, err := s.mgdb.Collection("colorpanel").UpdateOne(context.Background(), bson.M{"panelno": r.FormValue("panelno")}, bson.M{"$push": bson.M{
		"inspections": bson.M{"$each": bson.A{bson.M{
			"date":      inspecteddate.Format("02-01-2006"),
			"result":    r.FormValue("inspectionresult"),
			"delta":     delta,
			"inspector": r.FormValue("inspector"),
		}}, "$position": 0}}})

	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/colormixing/admin/inspectionform.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Cập nhật thất bại",
		})
		return
	}

	template.Must(template.ParseFiles("templates/pages/colormixing/admin/inspectionform.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Cập nhật thành công",
	})
}

// router.POST("/mixingcolor/getusingstart", s.getusingstart)
func (s *Server) getusingstart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	sr := s.mgdb.Collection("mixingbatch").FindOne(context.Background(), bson.M{"batchno": r.FormValue("batchno")})
	if sr.Err() != nil {
		log.Println(sr.Err())
	}
	var batchData struct {
		IssuedDate time.Time `bson:"issueddate"`
	}
	if err := sr.Decode(&batchData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/mixingcolor/entry/usingstart_input.html")).Execute(w, map[string]interface{}{
		"usingstart": batchData.IssuedDate.Format("2006-01-02T15:04"),
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /mixingcolor/loaddeliveryentry
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) loaddeliveryentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("mixingbatch").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"status": "Approved"}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var batchlData []struct {
		BatchNo string `bson:"batchno"`
	}
	if err := cur.All(context.Background(), &batchlData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/mixingcolor/deliveryentry.html")).Execute(w, map[string]interface{}{
		"batchlData": batchlData,
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /mixingcolor/senddeliveryentry
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) senddeliveryentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	batchno := r.FormValue("batchno")
	deliverydate, _ := time.Parse("2006-01-02", r.FormValue("deliverydate"))
	item := r.FormValue("item")
	mo := r.FormValue("mo")
	reciever := r.FormValue("reciever")
	area := r.FormValue("area")

	_, err := s.mgdb.Collection("batchdelivery").InsertOne(context.Background(), bson.M{
		"date": primitive.NewDateTimeFromTime(deliverydate), "batchno": batchno, "item": item, "mo": mo, "reciever": reciever, "area": area,
	})
	if err != nil {
		log.Println(err)
	}

	cur, err := s.mgdb.Collection("mixingbatch").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"status": "Approved"}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var batchlData []struct {
		BatchNo string `bson:"batchno"`
	}
	if err := cur.All(context.Background(), &batchlData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/mixingcolor/deliveryentry.html")).Execute(w, map[string]interface{}{
		"batchlData":        batchlData,
		"showSuccessDialog": true,
		"msgDialog":         "Thêm báo cáo thành công",
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /mixingcolor/batchentry
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) mc_batchentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// cur, err := s.mgdb.Collection("colorpanel").Find(context.Background(), bson.M{})
	// if err != nil {
	// 	log.Println(err)
	// }
	// defer cur.Close(context.Background())
	// var colorpanelData []struct {
	// 	Code     string `bson:"code"`
	// 	Color    string `bson:"color"`
	// 	Brand    string `bson:"brand"`
	// 	Supplier string `bson:"supplier"`
	// }
	// if err := cur.All(context.Background(), &colorpanelData); err != nil {
	// 	log.Println(err)
	// }

	template.Must(template.ParseFiles(
		"templates/pages/mixingcolor/entry/batchentry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /mixingcolor/entry/loadbatchform
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) mce_loadbatchform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("colorpanel").Find(context.Background(), bson.M{})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var colorpanelData []struct {
		Code     string `bson:"code"`
		Color    string `bson:"color"`
		Brand    string `bson:"brand"`
		Supplier string `bson:"supplier"`
	}
	if err := cur.All(context.Background(), &colorpanelData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles(
		"templates/pages/mixingcolor/entry/batchform.html",
	)).Execute(w, map[string]interface{}{
		"colorpanelData": colorpanelData,
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /mixingcolor/entry/sendbatchentry
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) mce_sendbatchentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	batchno := r.FormValue("batchno")
	log.Println(r.FormValue("mixingdate"))
	// loc, _ := time.LoadLocation("Asia/Bangkok")
	mixingdate, err := time.Parse("2006-01-02T15:04", r.FormValue("mixingdate"))
	// mixingdate, err := time.Parse("2006-01-02", r.FormValue("mixingdate"))
	if err != nil {
		log.Println(err)
	}
	volume, _ := strconv.Atoi(r.FormValue("volume"))
	operator := r.FormValue("operator")
	// color := r.FormValue("color")
	code := r.FormValue("code")
	// brand := r.FormValue("brand")
	// supplier := r.FormValue("supplier")
	classification := r.FormValue("classification")
	sopno := r.FormValue("sopno")
	viscosity, _ := strconv.ParseFloat(r.FormValue("viscosity"), 64)
	lightdark, _ := strconv.ParseFloat(r.FormValue("lightdark"), 64)
	redgreen, _ := strconv.ParseFloat(r.FormValue("redgreen"), 64)
	yellowblue, _ := strconv.ParseFloat(r.FormValue("yellowblue"), 64)
	status := r.FormValue("status")
	// issueddate, err := time.ParseInLocation("2006-01-02T15:04", r.FormValue("issueddate"), loc)
	issueddate, err := time.Parse("2006-01-02", r.FormValue("issueddate"))
	if err != nil {
		log.Println(err)
	}
	if batchno == "" || r.FormValue("volume") == "" || code == "" || status == "" {
		template.Must(template.ParseFiles("templates/pages/mixingcolor/entry/batchform.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thiếu thông tin",
		})
		return
	}

	sr := s.mgdb.Collection("colorpanel").FindOne(context.Background(), bson.M{"code": code})
	if sr.Err() != nil {
		log.Println(sr.Err())
	}
	var colorData struct {
		Brand    string `bson:"brand"`
		Supplier string `bson:"supplier"`
		Name     string `bson:"name"`
	}
	if err := sr.Decode(&colorData); err != nil {
		log.Println(err)
	}

	_, err = s.mgdb.Collection("mixingbatch").InsertOne(context.Background(), bson.M{
		"batchno": batchno, "mixingdate": primitive.NewDateTimeFromTime(mixingdate), "volume": volume,
		"operator": operator, "color": bson.M{"code": code, "name": colorData.Name, "brand": colorData.Brand, "supplier": colorData.Supplier}, "classification": classification, "sopno": sopno,
		"viscosity": viscosity, "redgreen": redgreen, "yellowblue": yellowblue, "lightdark": lightdark, "status": status, "issueddate": primitive.NewDateTimeFromTime(issueddate),
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/mixingcolor/entry/batchform.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Failed to insert to database",
		})
		return
	}
	template.Must(template.ParseFiles("templates/pages/mixingcolor/entry/batchform.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Thêm vào thành công",
	})
}

// router.GET("/colormixing/admin/loadbatchentry", s.ca_loadbatchentry)
func (s *Server) ca_loadbatchentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// cur, err := s.mgdb.Collection("colorpanel").Find(context.Background(), bson.M{})
	// if err != nil {
	// 	log.Println(err)
	// }
	// defer cur.Close(context.Background())
	// var colorpanelData []struct {
	// 	PanelNo string `bson:"panelno"`
	// 	// Color    string `bson:"color"`
	// 	// Brand    string `bson:"brand"`
	// 	// Supplier string `bson:"supplier"`
	// }
	// if err := cur.All(context.Background(), &colorpanelData); err != nil {
	// 	log.Println(err)
	// }
	template.Must(template.ParseFiles("templates/pages/colormixing/admin/batchentry.html")).Execute(w, map[string]interface{}{
		// "colorpanelData": colorpanelData,
	})
}

// router.GET("/colormixing/admin/loadpanelentry", s.ca_loadpanelentry)
func (s *Server) ca_loadpanelentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/colormixing/admin/panelentry.html")).Execute(w, nil)
}

// router.POST("/colormixing/admin/sendpanelentry", s.ca_sendpanelentry)
func (s *Server) ca_sendpanelentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	approveddate, _ := time.Parse("2006-01-02", r.FormValue("approveddate"))
	expireddate, _ := time.Parse("2006-01-02", r.FormValue("expireddate"))
	_, err := s.mgdb.Collection("colorpanel").InsertOne(context.Background(), bson.M{
		"panelno": r.FormValue("panelno"), "user": r.FormValue("user"), "finishcode": r.FormValue("finishcode"), "finishname": r.FormValue("finishname"),
		"substrate": r.FormValue("substrate"), "collection": r.FormValue("collection"), "brand": r.FormValue("brand"),
		"chemicalsystem": r.FormValue("chemicalsystem"), "texture": r.FormValue("texture"), "thickness": r.FormValue("thickness"), "sheen": r.FormValue("sheen"),
		"hardness": r.FormValue("hardness"), "prepared": r.FormValue("prepared"), "review": r.FormValue("review"), "approved": r.FormValue("approved"),
		"approveddate": primitive.NewDateTimeFromTime(approveddate), "expireddate": primitive.NewDateTimeFromTime(expireddate),
	})
	if err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/colormixing/admin/panelentry.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Cập nhật thành công",
	})
}

// router.POST("/colormixing/admin/sendbatchentry", s.ca_sendmixingentry)
func (s *Server) ca_sendmixingentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	batchno := r.FormValue("batchno")

	mixingdate, _ := time.Parse("020120061504", batchno[0:4]+"20"+batchno[4:10])
	issueddate := mixingdate.Add(time.Duration(rand.Intn(15)) * time.Minute)

	code := r.FormValue("code")
	name := r.FormValue("name")
	brand := r.FormValue("brand")
	supplier := r.FormValue("supplier")

	volume, _ := strconv.ParseFloat(r.FormValue("volume"), 64)
	operator := r.FormValue("operator")
	reciever := r.FormValue("receiver")
	area := r.FormValue("area")
	classification := r.FormValue("classification")
	sopno := r.FormValue("sopno")
	viscosity, _ := strconv.ParseFloat(r.FormValue("viscosity"), 64)
	nk2, _ := strconv.ParseFloat(r.FormValue("nk2"), 64)
	fordcup4, _ := strconv.ParseFloat(r.FormValue("fordcup4"), 64)
	lightdark, _ := strconv.ParseFloat(r.FormValue("lightdark"), 64)
	redgreen, _ := strconv.ParseFloat(r.FormValue("redgreen"), 64)
	yellowblue, _ := strconv.ParseFloat(r.FormValue("yellowblue"), 64)
	status := r.FormValue("status")

	if batchno == "" || r.FormValue("volume") == "" || code == "" || status == "" {
		template.Must(template.ParseFiles("templates/pages/colormixing/admin/batchentry.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thiếu thông tin",
		})
		return
	}

	_, err := s.mgdb.Collection("mixingbatch").InsertOne(context.Background(), bson.M{
		"batchno": batchno, "mixingdate": primitive.NewDateTimeFromTime(mixingdate), "volume": volume, "receiver": reciever, "area": area,
		"color": bson.M{"code": code, "name": name, "brand": brand}, "nk2": nk2, "fordcup4": fordcup4,
		"operator": operator, "classification": classification, "sopno": sopno, "supplier": supplier,
		"viscosity": viscosity, "redgreen": redgreen, "yellowblue": yellowblue, "lightdark": lightdark, "status": status, "issueddate": primitive.NewDateTimeFromTime(issueddate),
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/colormixing/admin/batchentry.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
			"msgDialog":     "Failed to insert to database",
		})
	}

	template.Must(template.ParseFiles("templates/pages/colormixing/admin/batchentry.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Thêm vào thành công",
	})
}

// router.GET("/colormixing/admin/loadmixingbatch", s.ca_loadmixingbatch)
func (s *Server) ca_loadmixingbatch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("mixingbatch").Aggregate(context.Background(), mongo.Pipeline{
		{{"$sort", bson.D{{"mixingdate", -1}, {"batchno", 1}}}},
		{{"$set", bson.M{
			"mixingdate": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$mixingdate"}},
			"issueddate": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$issueddate"}},
			"startuse":   bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$startuse"}},
			"enduse":     bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$enduse"}},
		}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var mixingbatchData []models.BatchRecord_datestr
	if err := cur.All(context.Background(), &mixingbatchData); err != nil {
		log.Println(err)
	}

	var operatorMap = make(map[string]bool, len(mixingbatchData))
	var colorMap = make(map[string]bool, len(mixingbatchData))
	var codeMap = make(map[string]bool, len(mixingbatchData))
	var brandMap = make(map[string]bool, len(mixingbatchData))
	var supplierMap = make(map[string]bool, len(mixingbatchData))
	var classificationMap = make(map[string]bool, len(mixingbatchData))
	var sopnoMap = make(map[string]bool, len(mixingbatchData))
	var statusMap = make(map[string]bool, len(mixingbatchData))

	for _, v := range mixingbatchData {
		operatorMap[v.Operator] = true
		codeMap[v.Color.Code] = true
		colorMap[v.Color.Name] = true
		brandMap[v.Color.Brand] = true
		supplierMap[v.Color.Supplier] = true
		classificationMap[v.Classification] = true
		sopnoMap[v.SOPNo] = true
		statusMap[v.Status] = true
	}
	var operators = make([]string, 0, len(operatorMap))
	for k, _ := range operatorMap {
		operators = append(operators, k)
	}
	var colors = make([]string, 0, len(colorMap))
	for k, _ := range colorMap {
		colors = append(colors, k)
	}
	var codes = make([]string, 0, len(codeMap))
	for k, _ := range codeMap {
		codes = append(codes, k)
	}
	var brands = make([]string, 0, len(brandMap))
	for k, _ := range brandMap {
		brands = append(brands, k)
	}
	var suppliers = make([]string, 0, len(supplierMap))
	for k, _ := range supplierMap {
		suppliers = append(suppliers, k)
	}
	var classifications = make([]string, 0, len(classificationMap))
	for k, _ := range classificationMap {
		classifications = append(classifications, k)
	}
	var sopnos = make([]string, 0, len(sopnoMap))
	for k, _ := range sopnoMap {
		sopnos = append(sopnos, k)
	}
	var statuses = make([]string, 0, len(statusMap))
	for k, _ := range statusMap {
		statuses = append(statuses, k)
	}

	template.Must(template.ParseFiles("templates/pages/colormixing/admin/mixingbatch.html")).Execute(w, map[string]interface{}{
		"mixingbatchData": mixingbatchData,
		"operators":       operators,
		"colors":          colors,
		"codes":           codes,
		"brands":          brands,
		"suppliers":       suppliers,
		"classifications": classifications,
		"sopnos":          sopnos,
		"statuses":        statuses,
	})
}

// router.GET("/colormixing/admin/loadcolorpanel", s.ca_loadcolorpanel)
func (s *Server) ca_loadcolorpanel(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("colorpanel").Aggregate(context.Background(), mongo.Pipeline{
		{{"$sort", bson.D{{"panelno", 1}}}},
		{{"$set", bson.M{
			"expireddate":  bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$expireddate"}},
			"approveddate": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$approveddate"}},
		}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var colorpanelData []struct {
		Id           string `bson:"_id"`
		PanelNo      string `bson:"panelno"`
		User         string `bson:"user"`
		FinishCode   string `bson:"finishcode"`
		FinishName   string `bson:"finishname"`
		Substrate    string `bson:"substrate"`
		Collection   string `bson:"collection"`
		Brand        string `bson:"brand"`
		FinishSystem string `bson:"chemicalsystem"`
		Texture      string `bson:"texture"`
		Thickness    string `bson:"thickness"`
		Sheen        string `bson:"sheen"`
		Hardness     string `bson:"hardness"`
		Prepared     string `bson:"prepared"`
		Review       string `bson:"review"`
		Approved     string `bson:"approved"`
		ApprovedDate string `bson:"approveddate"`
		ExpiredDate  string `bson:"expireddate"`
		Inspections  []struct {
			Date   string `bson:"date"`
			Result string `bson:"result"`
		} `bson:"inpsections"`
		ExpiredColor string
	}
	if err := cur.All(context.Background(), &colorpanelData); err != nil {
		log.Println(err)
	}
	for i := 0; i < len(colorpanelData); i++ {
		expireddate, _ := time.Parse("02-01-2006", colorpanelData[i].ExpiredDate)
		if expireddate.AddDate(0, -1, 0).Compare(time.Now()) < 1 {
			colorpanelData[i].ExpiredColor = "#FFD1D1"
		} else {
			colorpanelData[i].ExpiredColor = "white"
		}
	}

	// var codeMap = make(map[string]bool, len(colorpanelData))
	// var categoryMap = make(map[string]bool, len(colorpanelData))
	// var userMap = make(map[string]bool, len(colorpanelData))
	// var onproductMap = make(map[string]bool, len(colorpanelData))
	// var supplierMap = make(map[string]bool, len(colorpanelData))
	// var nameMap = make(map[string]bool, len(colorpanelData))
	// var brandMap = make(map[string]bool, len(colorpanelData))
	// var substrateMap = make(map[string]bool, len(colorpanelData))
	// var surfaceMap = make(map[string]bool, len(colorpanelData))
	// var inspectionstatusMap = make(map[string]bool, len(colorpanelData))

	// for _, v := range colorpanelData {
	// 	codeMap[v.Code] = true
	// 	categoryMap[v.Category] = true
	// 	userMap[v.User] = true
	// 	onproductMap[v.OnProduct] = true
	// 	supplierMap[v.Supplier] = true
	// 	nameMap[v.Name] = true
	// 	brandMap[v.Brand] = true
	// 	substrateMap[v.Substrate] = true
	// 	surfaceMap[v.Surface] = true
	// 	inspectionstatusMap[v.InspectionStatus] = true
	// }
	// var codes = make([]string, 0, len(codeMap))
	// for k, _ := range codeMap {
	// 	codes = append(codes, k)
	// }
	// var categories = make([]string, 0, len(categoryMap))
	// for k, _ := range categoryMap {
	// 	categories = append(categories, k)
	// }
	// var users = make([]string, 0, len(userMap))
	// for k, _ := range userMap {
	// 	users = append(users, k)
	// }
	// var onproducts = make([]string, 0, len(onproductMap))
	// for k, _ := range onproductMap {
	// 	onproducts = append(onproducts, k)
	// }
	// var suppliers = make([]string, 0, len(supplierMap))
	// for k, _ := range supplierMap {
	// 	suppliers = append(suppliers, k)
	// }
	// var colors = make([]string, 0, len(nameMap))
	// for k, _ := range nameMap {
	// 	colors = append(colors, k)
	// }
	// var brands = make([]string, 0, len(brandMap))
	// for k, _ := range brandMap {
	// 	brands = append(brands, k)
	// }
	// var substrates = make([]string, 0, len(substrateMap))
	// for k, _ := range substrateMap {
	// 	substrates = append(substrates, k)
	// }
	// var surfaces = make([]string, 0, len(surfaceMap))
	// for k, _ := range surfaceMap {
	// 	surfaces = append(surfaces, k)
	// }
	// var inspectionstatuses = make([]string, 0, len(inspectionstatusMap))
	// for k, _ := range inspectionstatusMap {
	// 	inspectionstatuses = append(inspectionstatuses, k)
	// }

	template.Must(template.ParseFiles("templates/pages/colormixing/admin/colorpanel.html")).Execute(w, map[string]interface{}{
		"colorpanelData": colorpanelData,
		// "codes":              codes,
		// "categories":         categories,
		// "users":              users,
		// "onproducts":         onproducts,
		// "suppliers":          suppliers,
		// "colors":             colors,
		// "brands":             brands,
		// "substrates":         substrates,
		// "surfaces":           surfaces,
		// "inspectionstatuses": inspectionstatuses,
	})
}

// router.POST("/colormixing/admin/searchpanel", s.ca_searchpanel)
func (s *Server) ca_searchpanel(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	searchRegex := ".*" + r.FormValue("panelsearch") + ".*"

	cur, err := s.mgdb.Collection("colorpanel").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$or": bson.A{
			bson.M{"panelno": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"user": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"finishcode": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"finishname": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"collection": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"brand": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"chemicalsystem": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"texture": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"thickness": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"sheen": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"hardness": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"approved": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"prepared": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"review": bson.M{"$regex": searchRegex, "$options": "i"}},
		}}}},
		{{"$sort", bson.D{{"panelno", 1}}}},
		{{"$set", bson.M{
			"approveddate": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$approveddate"}},
			"expireddate":  bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$expireddate"}},
		}}},
	})

	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var colorpanelData []models.ColorRecord_datestr
	if err := cur.All(context.Background(), &colorpanelData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/colormixing/admin/panel_tbody.html")).Execute(w, map[string]interface{}{
		"colorpanelData": colorpanelData,
	})
}

// router.POST("/colormixing/admin/searchbatch", s.ca_searchbatch)
func (s *Server) ca_searchbatch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	searchRegex := ".*" + r.FormValue("batchsearch") + ".*"

	cur, err := s.mgdb.Collection("mixingbatch").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$or": bson.A{
			bson.M{"batchno": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"item": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"mo": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"status": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"color.code": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"color.name": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"color.brand": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"color.supplier": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"classification": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"operator": bson.M{"$regex": searchRegex, "$options": "i"}},
		}}}},
		{{"$sort", bson.D{{"mixingdate", -1}, {"batchno", 1}}}},
		{{"$set", bson.M{
			"mixingdate": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$mixingdate"}},
			"issueddate": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$issueddate"}},
			"startuse":   bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$startuse"}},
			"enduse":     bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$enduse"}},
		}}},
	})

	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var mixingbatchData []models.BatchRecord_datestr
	if err := cur.All(context.Background(), &mixingbatchData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/colormixing/admin/batch_tbody.html")).Execute(w, map[string]interface{}{
		"mixingbatchData": mixingbatchData,
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /mixingcolor/mixingfilter
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) mixingfilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	operator := r.FormValue("operator")
	color := r.FormValue("color")
	code := r.FormValue("code")
	brand := r.FormValue("brand")
	supplier := r.FormValue("supplier")
	classification := r.FormValue("classification")
	sopno := r.FormValue("sopno")
	status := r.FormValue("status")
	mixingdate, _ := time.Parse("2006-01-02", r.FormValue("mixingdate"))

	var filters = bson.A{}
	if operator != "" {
		filters = append(filters, bson.M{"operator": operator})
	}
	if color != "" {
		filters = append(filters, bson.M{"color.name": color})
	}
	if code != "" {
		filters = append(filters, bson.M{"color.code": code})
	}
	if brand != "" {
		filters = append(filters, bson.M{"color.brand": brand})
	}
	if supplier != "" {
		filters = append(filters, bson.M{"color.supplier": supplier})
	}
	if classification != "" {
		filters = append(filters, bson.M{"classification": classification})
	}
	if sopno != "" {
		filters = append(filters, bson.M{"sopno": sopno})
	}
	if status != "" {
		filters = append(filters, bson.M{"status": status})
	}
	if r.FormValue("mixingdate") != "" {
		filters = append(filters, bson.M{"$and": bson.A{bson.M{"mixingdate": bson.M{"$gte": primitive.NewDateTimeFromTime(mixingdate)}}, bson.M{"mixingdate": bson.M{"$lt": primitive.NewDateTimeFromTime(mixingdate.AddDate(0, 0, 1))}}}})
	}

	var cur *mongo.Cursor
	var err interface{}
	if len(filters) != 0 {
		cur, err = s.mgdb.Collection("mixingbatch").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": filters}}},
			{{"$sort", bson.D{{"mixingdate", -1}, {"batchno", 1}}}},
			{{"$set", bson.M{
				"mixingdate": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$mixingdate"}},
				"issueddate": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$issueddate"}},
				"startuse":   bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$startuse"}},
				"enduse":     bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$enduse"}},
			}}},
		})
	} else {
		cur, err = s.mgdb.Collection("mixingbatch").Aggregate(context.Background(), mongo.Pipeline{
			{{"$sort", bson.D{{"mixingdate", -1}, {"batchno", 1}}}},
			{{"$set", bson.M{
				"mixingdate": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$mixingdate"}},
				"issueddate": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$issueddate"}},
				"startuse":   bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$startuse"}},
				"enduse":     bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$enduse"}},
			}}},
		})
	}

	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var mixingbatchData []struct {
		BatchNo    string  `bson:"batchno"`
		MixingDate string  `bson:"mixingdate"`
		Volume     float64 `bson:"volume"`
		Operator   string  `bson:"operator"`
		Color      struct {
			Code     string `bson:"code"`
			Name     string `bson:"name"`
			Brand    string `bson:"brand"`
			Supplier string `bson:"supplier"`
		} `bson:"color"`
		Classification string  `bson:"classification"`
		SOPNo          string  `bson:"sopno"`
		Viscosity      float64 `bson:"viscosity"`
		LightDark      float64 `bson:"lightdark"`
		RedGreen       float64 `bson:"redgreen"`
		YellowBlue     float64 `bson:"yellowblue"`
		Status         string  `bson:"status"`
		IssuedDate     string  `bson:"issueddate"`
		StartUse       string  `bson:"startuse"`
		EndUse         string  `bson:"enduse"`
		Area           string  `bson:"area"`
		Receiver       string  `bson:"receiver"`
	}
	if err := cur.All(context.Background(), &mixingbatchData); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/mixingcolor/mixing_tbody.html")).Execute(w, map[string]interface{}{
		"mixingbatchData": mixingbatchData,
	})
}

// router.GET("/colormixing/admin/batchupdateform/:batchno", s.ca_batchupdateform)
func (s *Server) ca_batchupdateform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	batchno := ps.ByName("batchno")
	result := s.mgdb.Collection("mixingbatch").FindOne(context.Background(), bson.M{"batchno": batchno})
	if result.Err() != nil {
		log.Println(result.Err())
		return
	}
	var mixingbatchRecord struct {
		BatchNo    string    `bson:"batchno"`
		MixingDate time.Time `bson:"mixingdate"`
		Volume     float64   `bson:"volume"`
		Operator   string    `bson:"operator"`
		Color      struct {
			Code     string `bson:"code"`
			Name     string `bson:"name"`
			Brand    string `bson:"brand"`
			Supplier string `bson:"supplier"`
		} `bson:"color"`
		Classification string    `bson:"classification"`
		SOPNo          string    `bson:"sopno"`
		Viscosity      float64   `bson:"viscosity"`
		Nk2            float64   `bson:"nk2"`
		Fordcup4       float64   `bson:"fordcup4"`
		LightDark      float64   `bson:"lightdark"`
		RedGreen       float64   `bson:"redgreen"`
		YellowBlue     float64   `bson:"yellowblue"`
		Status         string    `bson:"status"`
		IssuedDate     time.Time `bson:"issueddate"`
		StartUse       time.Time `bson:"startuse"`
		EndUse         time.Time `bson:"enduse"`
		Area           string    `bson:"area"`
		Receiver       string    `bson:"receiver"`
		Step           string    `bson:"step"`
	}
	if err := result.Decode(&mixingbatchRecord); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/colormixing/admin/batchupdateform.html")).Execute(w, map[string]interface{}{
		"mixingbatchRecord": mixingbatchRecord,
	})
}

// router.PUT("/colormixing/admin/updatebatch/:batchno", s.ca_updatebatch)
func (s *Server) ca_updatebatch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	batchno := ps.ByName("batchno")
	batchinput := r.FormValue("batchno")
	weight, _ := strconv.ParseFloat(r.FormValue("volume"), 64)
	viscosity, _ := strconv.ParseFloat(r.FormValue("viscosity"), 64)
	nk2, _ := strconv.ParseFloat(r.FormValue("nk2"), 64)
	fordcup4, _ := strconv.ParseFloat(r.FormValue("fordcup4"), 64)
	lightdark, _ := strconv.ParseFloat(r.FormValue("lightdark"), 64)
	redgreen, _ := strconv.ParseFloat(r.FormValue("redgreen"), 64)
	yellowblue, _ := strconv.ParseFloat(r.FormValue("yellowblue"), 64)
	step := r.FormValue("step")
	code := r.FormValue("code")
	name := r.FormValue("name")
	supplier := r.FormValue("supplier")
	brand := r.FormValue("brand")
	classification := r.FormValue("classification")
	sopno := r.FormValue("sopno")
	operator := r.FormValue("operator")
	receiver := r.FormValue("receiver")
	area := r.FormValue("area")

	result := s.mgdb.Collection("mixingbatch").FindOneAndUpdate(context.Background(), bson.M{"batchno": batchno}, bson.M{
		"$set": bson.M{"batchno": batchinput, "volume": weight, "viscosity": viscosity, "lightdark": lightdark, "redgreen": redgreen, "yellowblue": yellowblue, "color.code": code,
			"color.name": name, "color.supplier": supplier, "supplier": supplier, "color.brand": brand, "classification": classification, "sopno": sopno, "operator": operator,
			"receiver": receiver, "area": area, "step": step, "nk2": nk2, "fordcup4": fordcup4,
		}})
	if result.Err() != nil {
		log.Println(result.Err())
		return
	}
	var mixingbatchRecord struct {
		BatchNo       string    `bson:"batchno"`
		MixingDate    time.Time `bson:"mixingdate"`
		MixingDateStr string
		Volume        float64 `bson:"volume"`
		Operator      string  `bson:"operator"`
		Color         struct {
			Code     string `bson:"code"`
			Name     string `bson:"name"`
			Brand    string `bson:"brand"`
			Supplier string `bson:"supplier"`
		} `bson:"color"`
		Classification string    `bson:"classification"`
		SOPNo          string    `bson:"sopno"`
		Viscosity      float64   `bson:"viscosity"`
		Nk2            float64   `bson:"nk2"`
		Fordcup4       float64   `bson:"fordcup4"`
		LightDark      float64   `bson:"lightdark"`
		RedGreen       float64   `bson:"redgreen"`
		YellowBlue     float64   `bson:"yellowblue"`
		Supplier       string    `bson:"supplier"`
		Status         string    `bson:"status"`
		IssuedDate     time.Time `bson:"issueddate"`
		IssuedDateStr  string
		StartUse       time.Time `bson:"startuse"`
		StartUseStr    string
		EndUseStr      string
		EndUse         time.Time `bson:"enduse"`
		Area           string    `bson:"area"`
		Receiver       string    `bson:"receiver"`
		Step           string    `bson:"step"`
	}
	if err := result.Decode(&mixingbatchRecord); err != nil {
		log.Println(err)
	}
	mixingbatchRecord.BatchNo = batchinput
	mixingbatchRecord.Volume = weight
	mixingbatchRecord.Viscosity = viscosity
	mixingbatchRecord.Nk2 = nk2
	mixingbatchRecord.Fordcup4 = fordcup4
	mixingbatchRecord.LightDark = lightdark
	mixingbatchRecord.RedGreen = redgreen
	mixingbatchRecord.YellowBlue = yellowblue
	mixingbatchRecord.Color.Code = code
	mixingbatchRecord.Color.Name = name
	mixingbatchRecord.Color.Brand = brand
	mixingbatchRecord.Color.Supplier = supplier
	mixingbatchRecord.Supplier = supplier
	mixingbatchRecord.Classification = classification
	mixingbatchRecord.Operator = operator
	mixingbatchRecord.Classification = classification
	mixingbatchRecord.Receiver = receiver
	mixingbatchRecord.SOPNo = sopno
	mixingbatchRecord.Area = area
	mixingbatchRecord.Step = step
	mixingbatchRecord.MixingDateStr = mixingbatchRecord.MixingDate.Format("15:04 02-01-2006")
	mixingbatchRecord.IssuedDateStr = mixingbatchRecord.IssuedDate.Format("15:04 02-01-2006")
	mixingbatchRecord.StartUseStr = mixingbatchRecord.StartUse.Format("15:04 02-01-2006")
	mixingbatchRecord.EndUseStr = mixingbatchRecord.EndUse.Format("15:04 02-01-2006")

	template.Must(template.ParseFiles("templates/pages/colormixing/admin/batchupdated_tr.html")).Execute(w, map[string]interface{}{
		"mixingbatchRecord": mixingbatchRecord,
	})
}

// router.GET("/colormixing/admin/loadauditentry", s.ca_loadauditentry)
func (s *Server) ca_loadauditentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("audit").Find(context.Background(), bson.M{})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var auditdata []struct {
		Id       string `bson:"_id"`
		Category string `bson:"category"`
		Name     string `bson:"name"`
	}
	if err := cur.All(context.Background(), &auditdata); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/colormixing/admin/audit_entry.html")).Execute(w, map[string]interface{}{
		"auditdata": auditdata,
	})
}

// router.GET("/colormixing/admin/failaudit/:id", s.ca_failaudit)
func (s *Server) ca_failaudit(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	auditdate, _ := time.Parse("2006-01-02", r.FormValue("auditdate"))
	id, _ := primitive.ObjectIDFromHex(ps.ByName("id"))
	_, err := s.mgdb.Collection("audit").UpdateOne(context.Background(), bson.M{"_id": id}, bson.M{
		"$push": bson.M{"audits": bson.M{"date": primitive.NewDateTimeFromTime(auditdate), "result": "Failed",
			"inspector": r.FormValue("inspector"), "supervisor": r.FormValue("supervisor"), "factory": r.FormValue("factory")}},
	})
	if err != nil {
		log.Println(err)
	}
}

// router.POST("/colormixing/admin/passaudit/:id", s.ca_passaduti)
func (s *Server) ca_passaduti(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	auditdate, _ := time.Parse("2006-01-02", r.FormValue("auditdate"))
	id, _ := primitive.ObjectIDFromHex(ps.ByName("id"))
	_, err := s.mgdb.Collection("audit").UpdateOne(context.Background(), bson.M{"_id": id}, bson.M{
		"$push": bson.M{"audits": bson.M{"date": primitive.NewDateTimeFromTime(auditdate), "result": "Passed",
			"inspector": r.FormValue("inspector"), "supervisor": r.FormValue("supervisor"), "factory": r.FormValue("factory")}},
	})
	if err != nil {
		log.Println(err)
	}
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// /mixingcolor/mixingreports/:batchno
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) mixingreports(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("batch_item").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"batchno": ps.ByName("batchno")}}},
		{{"$sort", bson.M{"created": -1}}},
		{{"$set", bson.M{"created": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$created"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var batchitemData []struct {
		Created string `bson:"created"`
		Item    string `bson:"item"`
		Mo      string `bson:'mo"`
	}
	if err := cur.All(context.Background(), &batchitemData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/mixingcolor/report_tbl.html")).Execute(w, map[string]interface{}{
		"batchitemData": batchitemData,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// mixingcolor/deletereports
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) deletereport(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

}

// router.DELETE("/colormixing/admin/deletemixing/:batchno", s.ca_deletemixing)
func (s *Server) ca_deletemixing(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	batchno := ps.ByName("batchno")
	_, err := s.mgdb.Collection("mixingbatch").DeleteOne(context.Background(), bson.M{"batchno": batchno})
	if err != nil {
		log.Println(err)
		return
	}
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /mixingcolor/addcolorform
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) addcolorform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/mixingcolor/colorform_tr.html")).Execute(w, nil)
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /mixingcolor/addcolor
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) addcolor(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	issued, _ := time.Parse("2006-01-02", r.FormValue("issued"))
	expired, _ := time.Parse("2006-01-02", r.FormValue("expired"))
	remaked, _ := time.Parse("2006-01-02", r.FormValue("remaked"))
	inspected, _ := time.Parse("2006-01-02", r.FormValue("inspected"))

	_, err := s.mgdb.Collection("colorpanel").InsertOne(context.Background(), bson.M{
		"issued": primitive.NewDateTimeFromTime(issued), "expired": primitive.NewDateTimeFromTime(expired),
		"code": r.FormValue("code"), "name": r.FormValue("name"), "category": r.FormValue("category"),
		"user": r.FormValue("user"), "substrate": r.FormValue("substrate"), "onproduct": r.FormValue("onproduct"),
		"surface": r.FormValue("surface"), "brand": r.FormValue("brand"), "supplier": r.FormValue("supplier"),
		"remaked": primitive.NewDateTimeFromTime(remaked), "inspected": primitive.NewDateTimeFromTime(inspected),
		"inspectionstatus": r.FormValue("inspectionstatus"), "remark": r.FormValue("remark"), "alert": r.FormValue("alert"),
		"factory": r.FormValue("factory"),
	})
	if err != nil {
		log.Println(err)
		return
	}
	var colorpanel = struct {
		Code             string `bson:"code"`
		Issued           string `bson:"issued"`
		Category         string `bson:"category"`
		User             string `bson:"user"`
		OnProduct        string `bson:"onproduct"`
		Name             string `bson:"name"`
		Brand            string `bson:"brand"`
		Supplier         string `bson:"supplier"`
		Substrate        string `bson:"substrate"`
		Surface          string `bson:"surface"`
		Expired          string `bson:"expired"`
		Remaked          string `bson:"remaked"`
		Inspected        string `bson:"inspected"`
		InspectionStatus string `bson:"inspectionstatus"`
		Remark           string `bson:"remark"`
		Alert            string `bson:"alert"`
		Factory          string `bson:"factory"`
	}{
		Code: r.FormValue("code"), Name: r.FormValue("name"), Category: r.FormValue("category"), User: r.FormValue("user"), Substrate: r.FormValue("substrate"),
		Brand: r.FormValue("brand"), Supplier: r.FormValue("supplier"), Remaked: remaked.Format("02-01-2006"), Inspected: inspected.Format("01-02-2006"),
		InspectionStatus: r.FormValue("inspectionstatus"), Remark: r.FormValue("remark"), Alert: r.FormValue("alert"), Factory: r.FormValue("factory"),
		Issued: issued.Format("02-01-2006"), Expired: expired.Format("02-01-2006"),
	}

	template.Must(template.ParseFiles("templates/pages/mixingcolor/color_tr.html")).Execute(w, map[string]interface{}{
		"colorpanel": colorpanel,
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /mixingcolor/colorsearch
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) colorsearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	searchRegex := ".*" + r.FormValue("colorSearch") + ".*"

	cur, err := s.mgdb.Collection("colorpanel").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$or": bson.A{
			bson.M{"code": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"color": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"category": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"onproduct": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"substrate": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"brand": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"user": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"surface": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"supplier": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"inspectionstatus": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"remark": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"alert": bson.M{"$regex": searchRegex, "$options": "i"}},
		}}}},
		{{"$sort", bson.D{{"issued", -1}, {"code", 1}}}},
		{{"$set", bson.M{
			"issued":    bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$issued"}},
			"expired":   bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$expired"}},
			"remaked":   bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$remaked"}},
			"inspected": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$inspected"}},
		}}},
	})

	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var colorpanelData []struct {
		Code             string `bson:"code"`
		Issued           string `bson:"issued"`
		Category         string `bson:"category"`
		User             string `bson:"user"`
		OnProduct        string `bson:"onproduct"`
		Color            string `bson:"color"`
		Brand            string `bson:"brand"`
		Supplier         string `bson:"supplier"`
		Substrate        string `bson:"substrate"`
		Surface          string `bson:"surface"`
		Expired          string `bson:"expired"`
		Remaked          string `bson:"remaked"`
		Inspected        string `bson:"inspected"`
		InspectionStatus string `bson:"inspectionstatus"`
		Remark           string `bson:"remark"`
		Alert            string `bson:"alert"`
	}
	if err := cur.All(context.Background(), &colorpanelData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/mixingcolor/color_tbody.html")).Execute(w, map[string]interface{}{
		"colorpanelData": colorpanelData,
	})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /mixingcolor/colorfilter
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) colorfilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// operator := r.FormValue("operator")
	// color := r.FormValue("color")
	// code := r.FormValue("code")
	// brand := r.FormValue("brand")
	// supplier := r.FormValue("supplier")
	// classification := r.FormValue("classification")
	// sopno := r.FormValue("sopno")
	// status := r.FormValue("status")
	// mixingdate, _ := time.Parse("2006-01-02", r.FormValue("mixingdate"))

	var filters = bson.A{}
	if r.FormValue("colorcode") != "" {
		filters = append(filters, bson.M{"code": r.FormValue("colorcode")})
	}
	if r.FormValue("category") != "" {
		filters = append(filters, bson.M{"category": r.FormValue("category")})
	}
	if r.FormValue("user") != "" {
		filters = append(filters, bson.M{"user": r.FormValue("user")})
	}
	if r.FormValue("onproduct") != "" {
		filters = append(filters, bson.M{"onproduct": r.FormValue("onproduct")})
	}
	if r.FormValue("colorsupplier") != "" {
		filters = append(filters, bson.M{"supplier": r.FormValue("colorsupplier")})
	}
	if r.FormValue("color") != "" {
		filters = append(filters, bson.M{"color": r.FormValue("color")})
	}
	if r.FormValue("brand") != "" {
		filters = append(filters, bson.M{"brand": r.FormValue("brand")})
	}
	if r.FormValue("substrate") != "" {
		filters = append(filters, bson.M{"substrate": r.FormValue("substrate")})
	}
	if r.FormValue("surface") != "" {
		filters = append(filters, bson.M{"surface": r.FormValue("surface")})
	}
	if r.FormValue("inspectionstatus") != "" {
		filters = append(filters, bson.M{"inspectionstatus": r.FormValue("inspectionstatus")})
	}
	// if r.FormValue("mixingdate") != "" {
	// 	filters = append(filters, bson.M{"$and": bson.A{bson.M{"mixingdate": bson.M{"$gte": primitive.NewDateTimeFromTime(mixingdate)}}, bson.M{"mixingdate": bson.M{"$lt": primitive.NewDateTimeFromTime(mixingdate.AddDate(0, 0, 1))}}}})
	// }

	var cur *mongo.Cursor
	var err interface{}
	if len(filters) != 0 {
		cur, err = s.mgdb.Collection("colorpanel").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": filters}}},
			{{"$sort", bson.D{{"issued", -1}, {"code", 1}}}},
			{{"$set", bson.M{
				"issued":    bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$issued"}},
				"expired":   bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$expired"}},
				"remaked":   bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$remaked"}},
				"inspected": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$inspected"}},
			}}},
		})
	} else {
		cur, err = s.mgdb.Collection("colorpanel").Aggregate(context.Background(), mongo.Pipeline{
			{{"$sort", bson.D{{"issued", -1}, {"code", 1}}}},
			{{"$set", bson.M{
				"issued":    bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$issued"}},
				"expired":   bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$expired"}},
				"remaked":   bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$remaked"}},
				"inspected": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$inspected"}},
			}}},
		})
	}

	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var colorpanelData []struct {
		Code             string `bson:"code"`
		Issued           string `bson:"issued"`
		Category         string `bson:"category"`
		User             string `bson:"user"`
		OnProduct        string `bson:"onproduct"`
		Color            string `bson:"color"`
		Brand            string `bson:"brand"`
		Supplier         string `bson:"supplier"`
		Substrate        string `bson:"substrate"`
		Surface          string `bson:"surface"`
		Expired          string `bson:"expired"`
		Remaked          string `bson:"remaked"`
		Inspected        string `bson:"inspected"`
		InspectionStatus string `bson:"inspectionstatus"`
		Remark           string `bson:"remark"`
		Alert            string `bson:"alert"`
	}
	if err := cur.All(context.Background(), &colorpanelData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/mixingcolor/color_tbody.html")).Execute(w, map[string]interface{}{
		"colorpanelData": colorpanelData,
	})
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// router.DELETE("/colormixing/admin/deletepanel/:id", s.ca_deletepanel)
// //////////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) ca_deletepanel(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id, _ := primitive.ObjectIDFromHex(ps.ByName("id"))
	_, err := s.mgdb.Collection("colorpanel").DeleteOne(context.Background(), bson.M{"_id": id})
	if err != nil {
		log.Println(err)
		return
	}
}

// router.GET("/colormixing/admin/panelupdateform/:id}", s.ca_panelupdateform)
func (s *Server) ca_panelupdateform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id, _ := primitive.ObjectIDFromHex(ps.ByName("id"))

	result := s.mgdb.Collection("colorpanel").FindOne(context.Background(), bson.M{"_id": id})
	if result.Err() != nil {
		log.Println(result.Err())
		return
	}
	var colorpanelData struct {
		Id           string    `bson:"_id"`
		PanelNo      string    `bson:"panelno"`
		User         string    `bson:"user"`
		FinishCode   string    `bson:"finishcode"`
		FinishName   string    `bson:"finishname"`
		Substrate    string    `bson:"substrate"`
		Collection   string    `bson:"collection"`
		Brand        string    `bson:"brand"`
		FinishSystem string    `bson:"chemicalsystem"`
		Texture      string    `bson:"texture"`
		Thickness    string    `bson:"thickness"`
		Sheen        string    `bson:"sheen"`
		Hardness     string    `bson:"hardness"`
		Prepared     string    `bson:"prepared"`
		Review       string    `bson:"review"`
		Approved     string    `bson:"approved"`
		ApprovedDate time.Time `bson:"approveddate"`
		ExpiredDate  time.Time `bson:"expireddate"`
	}
	if err := result.Decode(&colorpanelData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/colormixing/admin/panelupdate_form.html")).Execute(w, map[string]interface{}{
		"colorpanelData": colorpanelData,
	})
}

// router.PUT("/colormixing/admin/updatepanel/:id", s.ca_updatepanel)
func (s *Server) ca_updatepanel(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id, _ := primitive.ObjectIDFromHex(ps.ByName("id"))

	result := s.mgdb.Collection("colorpanel").FindOneAndUpdate(context.Background(), bson.M{"_id": id}, bson.M{"$set": bson.M{
		"user": r.FormValue("user"), "panelno": r.FormValue("panelno"), "finishcode": r.FormValue("finsihcode"), "finishname": r.FormValue("finishname"),
		"substrate": r.FormValue("substrate"), "collection": r.FormValue("collection"), "brand": r.FormValue("brand"), "finishsystem": r.FormValue("finishsystem"),
		"texture": r.FormValue("texture"),
	}})
	if result.Err() != nil {
		log.Println(result.Err())
		return
	}
	var colorpanelData struct {
		Id           string    `bson:"_id"`
		PanelNo      string    `bson:"panelno"`
		User         string    `bson:"user"`
		FinishCode   string    `bson:"finishcode"`
		FinishName   string    `bson:"finishname"`
		Substrate    string    `bson:"substrate"`
		Collection   string    `bson:"collection"`
		Brand        string    `bson:"brand"`
		FinishSystem string    `bson:"chemicalsystem"`
		Texture      string    `bson:"texture"`
		Thickness    string    `bson:"thickness"`
		Sheen        string    `bson:"sheen"`
		Hardness     string    `bson:"hardness"`
		Prepared     string    `bson:"prepared"`
		Review       string    `bson:"review"`
		Approved     string    `bson:"approved"`
		ApprovedDate time.Time `bson:"approveddate"`
		ExpiredDate  time.Time `bson:"expireddate"`
	}
	if err := result.Decode(&colorpanelData); err != nil {
		log.Println(err)
	}
	colorpanelData.User = r.FormValue("user")
	colorpanelData.PanelNo = r.FormValue("panelno")
	colorpanelData.FinishCode = r.FormValue("finishcode")
	colorpanelData.FinishName = r.FormValue("finishname")
	colorpanelData.Substrate = r.FormValue("substrate")
	colorpanelData.Collection = r.FormValue("collection")
	colorpanelData.Brand = r.FormValue("brand")
	colorpanelData.FinishSystem = r.FormValue("finishsystem")
	colorpanelData.Texture = r.FormValue("texture")

	template.Must(template.ParseFiles("templates/pages/colormixing/admin/panelupdated_tr.html")).Execute(w, map[string]interface{}{
		"colorpanelData": colorpanelData,
	})
}

// router.GET("/mixingcolor/usingentry", s.mc_usingreports)
func (s *Server) mc_usingreports(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/mixingcolor/entry/usingentry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// router.GET("/mixingcolor/entry/loadusingform", s.mc_loadusingform)
func (s *Server) mc_loadusingform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	template.Must(template.ParseFiles(
		"templates/pages/mixingcolor/entry/usingform.html",
	)).Execute(w, nil)
}

// router.GET("/mixingcolor/entry/getupdateform", s.mc_getupdateform)
func (s *Server) mc_getupdateform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	switch r.URL.Query().Get("formtype") {
	case "usingtime":
		cur, err := s.mgdb.Collection("mixingbatch").Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{"issueddate": -1}))
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var batchData []struct {
			BatchNo string `bson:"batchno"`
		}
		if err := cur.All(context.Background(), &batchData); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/mixingcolor/entry/usingtimeform.html")).Execute(w, map[string]interface{}{
			"batchData": batchData,
		})
	case "usingitem":
		cur, err := s.mgdb.Collection("mixingbatch").Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{"issueddate": -1}))
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var batchData []struct {
			BatchNo string `bson:"batchno"`
		}
		if err := cur.All(context.Background(), &batchData); err != nil {
			log.Println(err)
		}
		template.Must(template.ParseFiles("templates/pages/mixingcolor/entry/usingitemform.html")).Execute(w, map[string]interface{}{
			"batchData": batchData,
		})

	case "createcolor":
		template.Must(template.ParseFiles("templates/pages/mixingcolor/entry/createcolorform.html")).Execute(w, nil)
	case "fastbatch":
		template.Must(template.ParseFiles("templates/pages/mixingcolor/entry/fastbatchform.html")).Execute(w, nil)
	}

}

// router.GET("/mixingcolor/entry/updateusingtime", s.mc_updateusingtime)
func (s *Server) mc_updateusingtime(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	startuse, _ := time.Parse("2006-01-02T15:04", r.FormValue("startusing"))
	enduse, _ := time.Parse("2006-01-02T15:04", r.FormValue("endusing"))
	switch {
	case (r.FormValue("startusing") == "" && r.FormValue("endusing") == "") || r.FormValue("batchno") == "":
		template.Must(template.ParseFiles("templates/pages/mixingcolor/entry/usingform.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thiếu thông tin",
		})
		return
	case r.FormValue("startusing") != "" && r.FormValue("endusing") == "":
		s.mgdb.Collection("mixingbatch").UpdateOne(context.Background(), bson.M{"batchno": r.FormValue("batchno")}, bson.M{
			"$set": bson.M{"startuse": primitive.NewDateTimeFromTime(startuse)},
		})
	case r.FormValue("startusing") == "" && r.FormValue("endusing") != "":
		_, err := s.mgdb.Collection("mixingbatch").UpdateOne(context.Background(), bson.M{"batchno": r.FormValue("batchno")}, bson.M{
			"$set": bson.M{"enduse": primitive.NewDateTimeFromTime(enduse)},
		})
		if err != nil {
			log.Println(err)
		}
	case r.FormValue("startusing") != "" && r.FormValue("endusing") != "":
		_, err := s.mgdb.Collection("mixingbatch").UpdateOne(context.Background(), bson.M{"batchno": r.FormValue("batchno")}, bson.M{
			"$set": bson.M{"startuse": primitive.NewDateTimeFromTime(startuse), "enduse": primitive.NewDateTimeFromTime(enduse)},
		})
		if err != nil {
			log.Println(err)
		}
	}

	template.Must(template.ParseFiles("templates/pages/mixingcolor/entry/usingform.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Cập nhật thành công",
	})

}

// router.POST("/mixingcolor/entry/updateusingitem", s.updateusingitem)
func (s *Server) mc_updateusingitem(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	if r.FormValue("item") == "" || r.FormValue("mo") == "" || r.FormValue("batchno") == "" {
		template.Must(template.ParseFiles("templates/pages/mixingcolor/entry/usingform.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"msgDialog":         "Thiếu thông tin",
		})
		return
	}

	_, err := s.mgdb.Collection("batch_item").InsertOne(context.Background(), bson.M{
		"batchno": r.FormValue("batchno"), "item": r.FormValue("item"), "mo": r.FormValue("mo"), "created": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
	}

	_, err = s.mgdb.Collection("mixingbatch").UpdateOne(context.Background(), bson.M{"batchno": r.FormValue("batchno")}, bson.M{
		"$addToSet": bson.M{"items": bson.M{"code": r.FormValue("item"), "mo": r.FormValue("mo")}},
	})
	if err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/mixingcolor/entry/usingform.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
		"msgDialog":         "Cập nhật thành công",
	})
}

// router.POST("/mixingcolor/entry/searchcolorcode", s.mce_searchcolorcode)
func (s *Server) mce_searchcolorcode(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("colorpanel").Find(context.Background(), bson.M{"code": bson.M{"$regex": ".*" + r.FormValue("codesearch") + ".*", "$options": "i"}})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var codes []struct {
		Code string `bson:"code"`
	}
	if err := cur.All(context.Background(), &codes); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/mixingcolor/entry/colorcodelist.html")).Execute(w, map[string]interface{}{
		"codes": codes,
	})
}

// router.POST("/mixingcolor/entry/createfastbatch", s.mce_createfastbatch)
func (s *Server) mce_createfastbatch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	log.Println(r.FormValue("rawstr"))
	colorcode := r.FormValue("codesearch")
	rawArray := strings.Split(r.FormValue("rawstr"), ";")
	log.Println(colorcode)
	log.Println(rawArray)

	batchno := rawArray[0]
	mixingdate, _ := time.Parse("020120061504", rawArray[0][0:4]+"20"+rawArray[0][4:10])
	issueddate := mixingdate.Add(time.Duration(rand.Intn(15)) * time.Minute)
	volume, _ := strconv.ParseFloat(rawArray[1], 64)
	status := "Approved"
	switch {
	case rawArray[2] == "r":
		status = "Rejected"
	case rawArray[2] == "p":
		status = "Pending"
	case len(rawArray[2]) > 1:
		status = rawArray[2]
	}
	viscosity, _ := strconv.ParseFloat(rawArray[3], 64)
	lightdark, _ := strconv.ParseFloat(rawArray[4], 64)
	redgreen, _ := strconv.ParseFloat(rawArray[5], 64)
	yellowblue, _ := strconv.ParseFloat(rawArray[6], 64)
	classification := rawArray[7]
	if rawArray[7] == "m" || rawArray[7] == "M" {
		classification = "Mass Production"
	}
	if rawArray[7] == "s" || rawArray[7] == "S" {
		classification = "Sample"
	}
	sopno := colorcode[0:strings.Index(colorcode, rawArray[8])]
	mixer := rawArray[9]
	receiver := rawArray[10]
	area := rawArray[11]

	log.Println(batchno)
	log.Println(mixingdate)
	log.Println(issueddate)
	log.Println(volume)
	log.Println(status)
	log.Println(viscosity)
	log.Println(lightdark)
	log.Println(redgreen)
	log.Println(yellowblue)
	log.Println(sopno)
	log.Println(mixer)
	log.Println(receiver)
	log.Println(area)

	sr := s.mgdb.Collection("colorpanel").FindOne(context.Background(), bson.M{"code": colorcode})
	if sr.Err() != nil {
		log.Println(sr.Err())
	}
	var colorData struct {
		Brand    string `bson:"brand"`
		Supplier string `bson:"supplier"`
		Name     string `bson:"name"`
	}
	if err := sr.Decode(&colorData); err != nil {
		log.Println(err)
	}

	_, err := s.mgdb.Collection("mixingbatch").InsertOne(context.Background(), bson.M{
		"batchno": batchno, "mixingdate": primitive.NewDateTimeFromTime(mixingdate), "volume": volume, "receiver": receiver, "area": area,
		"operator": mixer, "color": bson.M{"code": colorcode, "name": colorData.Name, "brand": colorData.Brand, "supplier": colorData.Supplier}, "classification": classification, "sopno": sopno,
		"viscosity": viscosity, "redgreen": redgreen, "yellowblue": yellowblue, "lightdark": lightdark, "status": status, "issueddate": primitive.NewDateTimeFromTime(issueddate),
	})
	if err != nil {
		log.Println(err)
		// template.Must(template.ParseFiles("templates/pages/mixingcolor/mixingentry.html")).Execute(w, map[string]interface{}{
		// 	"showErrDialog": true,
		// 	"msgDialog":     "Failed to insert to database",
		// })
	}
	// defer cur.Close(context.Background())
	// var codes []struct {
	// 	Code string `bson:"code"`
	// }
	// if err := cur.All(context.Background(), &codes); err != nil {
	// 	log.Println(err)
	// }
	// template.Must(template.ParseFiles("templates/pages/mixingcolor/entry/colorcodelist.html")).Execute(w, map[string]interface{}{
	// 	"codes": codes,
	// })
}

// router.GET("/mixingcolor/colorentry", s.mc_colorentry)
func (s *Server) mc_colorentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/mixingcolor/entry/colorentry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// router.GET("/mixingcolor/entry/loadcolorform", s.mc_loadcolorform)
func (s *Server) mc_loadcolorform(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	template.Must(template.ParseFiles(
		"templates/pages/mixingcolor/entry/colorform.html",
	)).Execute(w, nil)
}

// router.GET("/colormixing/overview", s.c_overview)
func (s *Server) c_overview(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/colormixing/overview/overview.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// router.GET("/colormixing/overview/loadbatch", s.co_loadbatch)
func (s *Server) co_loadbatch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("mixingbatch").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"mixingdate": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -3))}}, bson.M{"mixingdate": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, 1))}}}}}},
		{{"$sort", bson.D{{"mixingdate", -1}, {"batchno", 1}}}},
		{{"$set", bson.M{
			"mixingdate": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$mixingdate"}},
			"issueddate": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$issueddate"}},
			"startuse":   bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$startuse"}},
			"enduse":     bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$enduse"}},
		}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var mixingbatchData []models.BatchRecord_datestr
	if err := cur.All(context.Background(), &mixingbatchData); err != nil {
		log.Println(err)
	}

	var operatorMap = make(map[string]bool, len(mixingbatchData))
	var colorMap = make(map[string]bool, len(mixingbatchData))
	var codeMap = make(map[string]bool, len(mixingbatchData))
	var brandMap = make(map[string]bool, len(mixingbatchData))
	var supplierMap = make(map[string]bool, len(mixingbatchData))
	var classificationMap = make(map[string]bool, len(mixingbatchData))
	var sopnoMap = make(map[string]bool, len(mixingbatchData))
	var statusMap = make(map[string]bool, len(mixingbatchData))

	for _, v := range mixingbatchData {
		operatorMap[v.Operator] = true
		codeMap[v.Color.Code] = true
		colorMap[v.Color.Name] = true
		brandMap[v.Color.Brand] = true
		supplierMap[v.Color.Supplier] = true
		classificationMap[v.Classification] = true
		sopnoMap[v.SOPNo] = true
		statusMap[v.Status] = true
	}
	var operators = make([]string, 0, len(operatorMap))
	for k, _ := range operatorMap {
		operators = append(operators, k)
	}
	var colors = make([]string, 0, len(colorMap))
	for k, _ := range colorMap {
		colors = append(colors, k)
	}
	var codes = make([]string, 0, len(codeMap))
	for k, _ := range codeMap {
		codes = append(codes, k)
	}
	var brands = make([]string, 0, len(brandMap))
	for k, _ := range brandMap {
		brands = append(brands, k)
	}
	var suppliers = make([]string, 0, len(supplierMap))
	for k, _ := range supplierMap {
		suppliers = append(suppliers, k)
	}
	var classifications = make([]string, 0, len(classificationMap))
	for k, _ := range classificationMap {
		classifications = append(classifications, k)
	}
	var sopnos = make([]string, 0, len(sopnoMap))
	for k, _ := range sopnoMap {
		sopnos = append(sopnos, k)
	}
	var statuses = make([]string, 0, len(statusMap))
	for k, _ := range statusMap {
		statuses = append(statuses, k)
	}

	template.Must(template.ParseFiles("templates/pages/colormixing/overview/batch.html")).Execute(w, map[string]interface{}{
		"mixingbatchData": mixingbatchData,
		"operators":       operators,
		"colors":          colors,
		"codes":           codes,
		"brands":          brands,
		"suppliers":       suppliers,
		"classifications": classifications,
		"sopnos":          sopnos,
		"statuses":        statuses,
	})
}

// router.GET("/colormixing/overview/searchbatch", s.co_searchbatch)
func (s *Server) co_searchbatch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	searchRegex := ".*" + r.FormValue("batchsearch") + ".*"

	cur, err := s.mgdb.Collection("mixingbatch").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$or": bson.A{
			bson.M{"batchno": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"status": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"items": bson.M{"$elemMatch": bson.M{"code": bson.M{"$regex": searchRegex, "$options": "i"}}}},
			bson.M{"items": bson.M{"$elemMatch": bson.M{"mo": bson.M{"$regex": searchRegex, "$options": "i"}}}},
			bson.M{"color.code": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"color.name": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"color.brand": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"color.supplier": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"classification": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"operator": bson.M{"$regex": searchRegex, "$options": "i"}},
		}}}},
		{{"$sort", bson.D{{"mixingdate", -1}, {"batchno", 1}}}},
		{{"$set", bson.M{
			"mixingdate": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$mixingdate"}},
			"issueddate": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$issueddate"}},
			"startuse":   bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$startuse"}},
			"enduse":     bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$enduse"}},
		}}},
	})

	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var mixingbatchData []models.BatchRecord_datestr
	if err := cur.All(context.Background(), &mixingbatchData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/colormixing/overview/batch_tbody.html")).Execute(w, map[string]interface{}{
		"mixingbatchData": mixingbatchData,
	})
}

// router.POST("/colormixing/overview/filterbatch", s.co_filterbatch)
func (s *Server) co_filterbatch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	mixingdatefrom, _ := time.Parse("2006-01-02", r.FormValue("mixingdatefrom"))
	mixingdateto, _ := time.Parse("2006-01-02", r.FormValue("mixingdateto"))

	var filters = bson.A{}
	if r.FormValue("operator") != "" {
		filters = append(filters, bson.M{"operator": r.FormValue("operator")})
	}
	if r.FormValue("color") != "" {
		filters = append(filters, bson.M{"color.name": r.FormValue("color")})
	}
	if r.FormValue("code") != "" {
		filters = append(filters, bson.M{"color.code": r.FormValue("code")})
	}
	if r.FormValue("brand") != "" {
		filters = append(filters, bson.M{"color.brand": r.FormValue("brand")})
	}
	if r.FormValue("supplier") != "" {
		filters = append(filters, bson.M{"color.supplier": r.FormValue("supplier")})
	}
	if r.FormValue("classification") != "" {
		filters = append(filters, bson.M{"classification": r.FormValue("classification")})
	}
	if r.FormValue("sopno") != "" {
		filters = append(filters, bson.M{"sopno": r.FormValue("sopno")})
	}
	if r.FormValue("status") != "" {
		filters = append(filters, bson.M{"status": r.FormValue("status")})
	}
	if r.FormValue("isusingend") != "" {
		if r.FormValue("isusingend") == "Yes" {
			filters = append(filters, bson.M{"enduse": bson.M{"$exists": true}})
		} else {
			filters = append(filters, bson.M{"enduse": bson.M{"$exists": false}})
		}
	}
	if r.FormValue("mixingdatefrom") != "" || r.FormValue("mixingdateto") != "" {
		filters = append(filters, bson.M{"$and": bson.A{bson.M{"mixingdate": bson.M{"$gte": primitive.NewDateTimeFromTime(mixingdatefrom)}}, bson.M{"mixingdate": bson.M{"$lte": primitive.NewDateTimeFromTime(mixingdateto)}}}})
	}

	var cur *mongo.Cursor
	var err interface{}
	if len(filters) != 0 {
		cur, err = s.mgdb.Collection("mixingbatch").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": filters}}},
			{{"$sort", bson.D{{"mixingdate", -1}, {"batchno", 1}}}},
			{{"$set", bson.M{
				"mixingdate": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$mixingdate"}},
				"issueddate": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$issueddate"}},
				"startuse":   bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$startuse"}},
				"enduse":     bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$enduse"}},
			}}},
		})
	} else {
		cur, err = s.mgdb.Collection("mixingbatch").Aggregate(context.Background(), mongo.Pipeline{
			{{"$sort", bson.D{{"mixingdate", -1}, {"batchno", 1}}}},
			{{"$set", bson.M{
				"mixingdate": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$mixingdate"}},
				"issueddate": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$issueddate"}},
				"startuse":   bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$startuse"}},
				"enduse":     bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$enduse"}},
			}}},
		})
	}

	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var mixingbatchData []models.BatchRecord_datestr
	if err := cur.All(context.Background(), &mixingbatchData); err != nil {
		log.Println(err)
	}
	template.Must(template.ParseFiles("templates/pages/colormixing/overview/batch_tbody.html")).Execute(w, map[string]interface{}{
		"mixingbatchData": mixingbatchData,
	})
}

// router.POST("/colormixing/overview/:batchno/items", s.co_batchitems)
func (s *Server) co_batchitems(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("batch_item").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"batchno": ps.ByName("batchno")}}},
		{{"$sort", bson.M{"created": -1}}},
		{{"$set", bson.M{"created": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$created"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var batchitemData []struct {
		Created string `bson:"created"`
		Item    string `bson:"item"`
		Mo      string `bson:'mo"`
	}
	if err := cur.All(context.Background(), &batchitemData); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/colormixing/overview/batchitem_tbl.html")).Execute(w, map[string]interface{}{
		"batchitemData": batchitemData,
	})
}

// router.GET("/colormixing/overview/changedisplay/:type/edit/false", s.co_changedisplay)
func (s *Server) co_changedisplay(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	switch ps.ByName("type") {
	case "colorpanel":
		cur, err := s.mgdb.Collection("colorpanel").Aggregate(context.Background(), mongo.Pipeline{
			{{"$sort", bson.D{{"panelno", 1}}}},
			{{"$set", bson.M{
				"expireddate":  bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$expireddate"}},
				"approveddate": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$approveddate"}},
			}}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())

		var colorpanelData []models.ColorRecord_datestr
		if err := cur.All(context.Background(), &colorpanelData); err != nil {
			log.Println(err)
		}

		for i := 0; i < len(colorpanelData); i++ {
			expireddate, _ := time.Parse("02-01-2006", colorpanelData[i].ExpiredDate)
			if expireddate.AddDate(0, -1, 0).Compare(time.Now()) < 1 {
				colorpanelData[i].ExpiredColor = "#FFD1D1"
			} else {
				colorpanelData[i].ExpiredColor = "white"
			}
			if len(colorpanelData[i].Inspections) != 0 {
				nextInspectionDate, _ := time.Parse("02-01-2006", colorpanelData[i].Inspections[0].Date)
				colorpanelData[i].NextInspection = nextInspectionDate.AddDate(0, 0, 15).Format("02-01-2006") + " (next inspection...)"
				if len(colorpanelData[i].Inspections) > 3 {
					colorpanelData[i].Inspections = colorpanelData[i].Inspections[:3]
				}
			}
		}

		var codeMap = make(map[string]bool, len(colorpanelData))
		var userMap = make(map[string]bool, len(colorpanelData))
		var nameMap = make(map[string]bool, len(colorpanelData))
		var brandMap = make(map[string]bool, len(colorpanelData))
		var substrateMap = make(map[string]bool, len(colorpanelData))

		for _, v := range colorpanelData {
			codeMap[v.PanelNo] = true
			userMap[v.User] = true
			nameMap[v.FinishName] = true
			brandMap[v.Brand] = true
			substrateMap[v.Substrate] = true
		}

		var codes = make([]string, 0, len(codeMap))
		for k, _ := range codeMap {
			codes = append(codes, k)
		}
		slices.Sort(codes)

		var names = make([]string, 0, len(nameMap))
		for k, _ := range nameMap {
			names = append(names, k)
		}
		slices.Sort(names)

		var users = make([]string, 0, len(userMap))
		for k, _ := range userMap {
			users = append(users, k)
		}
		slices.Sort(users)

		var brands = make([]string, 0, len(brandMap))
		for k, _ := range brandMap {
			brands = append(brands, k)
		}
		slices.Sort(brands)

		var substrates = make([]string, 0, len(substrateMap))
		for k, _ := range substrateMap {
			substrates = append(substrates, k)
		}
		slices.Sort(substrates)

		template.Must(template.ParseFiles("templates/pages/colormixing/overview/color.html")).Execute(w, map[string]interface{}{
			"colorpanelData": colorpanelData,
			"codes":          codes,
			"names":          names,
			"users":          users,
			"brands":         brands,
			"substrates":     substrates,
		})

	case "mixingbatch":
		cur, err := s.mgdb.Collection("mixingbatch").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": bson.A{bson.M{"mixingdate": bson.M{"$gte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, -3))}}, bson.M{"mixingdate": bson.M{"$lte": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, 1))}}}}}},
			{{"$sort", bson.D{{"mixingdate", -1}, {"batchno", 1}}}},
			{{"$set", bson.M{
				"mixingdate": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$mixingdate"}},
				"issueddate": bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$issueddate"}},
				"startuse":   bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$startuse"}},
				"enduse":     bson.M{"$dateToString": bson.M{"format": "%H:%M %d-%m-%Y", "date": "$enduse"}},
			}}},
		})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())

		var mixingbatchData []models.BatchRecord_datestr
		if err := cur.All(context.Background(), &mixingbatchData); err != nil {
			log.Println(err)
		}

		var operatorMap = make(map[string]bool, len(mixingbatchData))
		var colorMap = make(map[string]bool, len(mixingbatchData))
		var codeMap = make(map[string]bool, len(mixingbatchData))
		var brandMap = make(map[string]bool, len(mixingbatchData))
		var supplierMap = make(map[string]bool, len(mixingbatchData))
		var classificationMap = make(map[string]bool, len(mixingbatchData))
		var sopnoMap = make(map[string]bool, len(mixingbatchData))
		var statusMap = make(map[string]bool, len(mixingbatchData))

		for _, v := range mixingbatchData {
			operatorMap[v.Operator] = true
			codeMap[v.Color.Code] = true
			colorMap[v.Color.Name] = true
			brandMap[v.Color.Brand] = true
			supplierMap[v.Color.Supplier] = true
			classificationMap[v.Classification] = true
			sopnoMap[v.SOPNo] = true
			statusMap[v.Status] = true
		}
		var operators = make([]string, 0, len(operatorMap))
		for k, _ := range operatorMap {
			operators = append(operators, k)
		}
		var colors = make([]string, 0, len(colorMap))
		for k, _ := range colorMap {
			colors = append(colors, k)
		}
		var codes = make([]string, 0, len(codeMap))
		for k, _ := range codeMap {
			codes = append(codes, k)
		}
		var brands = make([]string, 0, len(brandMap))
		for k, _ := range brandMap {
			brands = append(brands, k)
		}
		var suppliers = make([]string, 0, len(supplierMap))
		for k, _ := range supplierMap {
			suppliers = append(suppliers, k)
		}
		var classifications = make([]string, 0, len(classificationMap))
		for k, _ := range classificationMap {
			classifications = append(classifications, k)
		}
		var sopnos = make([]string, 0, len(sopnoMap))
		for k, _ := range sopnoMap {
			sopnos = append(sopnos, k)
		}
		var statuses = make([]string, 0, len(statusMap))
		for k, _ := range statusMap {
			statuses = append(statuses, k)
		}

		template.Must(template.ParseFiles("templates/pages/colormixing/overview/batch.html")).Execute(w, map[string]interface{}{
			"mixingbatchData": mixingbatchData,
			"operators":       operators,
			"colors":          colors,
			"codes":           codes,
			"brands":          brands,
			"suppliers":       suppliers,
			"classifications": classifications,
			"sopnos":          sopnos,
			"statuses":        statuses,
		})

	case "audit":
		cur, err := s.mgdb.Collection("audit").Aggregate(context.Background(), mongo.Pipeline{})
		if err != nil {
			log.Println(err)
		}
		defer cur.Close(context.Background())
		var auditdata []struct {
			Id         string `bson:"_id"`
			Name       string `bson:"name"`
			EName      string `bson:"ename"`
			Category   string `bson:"category"`
			Department string `bson:"department"`
			Audits     []struct {
				Date       time.Time `bson:"date"`
				Inspector  string    `bson:"inspector"`
				Supervisor string    `bson:"supervisor"`
				Result     string    `bson:"result"`
			} `bson:"audits"`
		}
		if err := cur.All(context.Background(), &auditdata); err != nil {
			log.Println(err)
		}
		var auditdates []string
		for _, d := range auditdata[0].Audits {
			auditdates = append(auditdates, d.Date.Format("02/01"))
		}
		template.Must(template.ParseFiles("templates/pages/colormixing/overview/audit.html")).Execute(w, map[string]interface{}{
			"auditdata":  auditdata,
			"auditdates": auditdates,
		})
	}

}

// router.POST("/colormixing/overview/searchcolor", s.co_searchcolor)
func (s *Server) co_searchcolor(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	searchRegex := ".*" + r.FormValue("colorsearch") + ".*"

	cur, err := s.mgdb.Collection("colorpanel").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$or": bson.A{
			bson.M{"panelno": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"user": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"finishcode": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"finishname": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"collection": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"brand": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"chemicalsystem": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"texture": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"thickness": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"sheen": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"hardness": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"approved": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"prepared": bson.M{"$regex": searchRegex, "$options": "i"}},
			bson.M{"review": bson.M{"$regex": searchRegex, "$options": "i"}},
		}}}},
		{{"$sort", bson.D{{"panelno", 1}}}},
		{{"$set", bson.M{
			"approveddate": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$approveddate"}},
			"expireddate":  bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$expireddate"}},
		}}},
	})

	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var colorpanelData []models.ColorRecord_datestr
	if err := cur.All(context.Background(), &colorpanelData); err != nil {
		log.Println(err)
	}

	for i := 0; i < len(colorpanelData); i++ {
		expireddate, _ := time.Parse("02-01-2006", colorpanelData[i].ExpiredDate)
		if expireddate.AddDate(0, -1, 0).Compare(time.Now()) < 1 {
			colorpanelData[i].ExpiredColor = "#FFD1D1"
		} else {
			colorpanelData[i].ExpiredColor = "white"
		}
		if len(colorpanelData[i].Inspections) != 0 {
			nextInspectionDate, _ := time.Parse("02-01-2006", colorpanelData[i].Inspections[0].Date)
			colorpanelData[i].NextInspection = nextInspectionDate.AddDate(0, 0, 15).Format("02-01-2006") + " (next inspection...)"
			if len(colorpanelData[i].Inspections) > 3 {
				colorpanelData[i].Inspections = colorpanelData[i].Inspections[:3]
			}
		}
	}

	template.Must(template.ParseFiles("templates/pages/colormixing/overview/color_tbody.html")).Execute(w, map[string]interface{}{
		"colorpanelData": colorpanelData,
	})
}

// router.POST("/colormixing/overview/filtercolor", s.co_filtercolor)
func (s *Server) co_filtercolor(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var filters = bson.A{}
	if r.FormValue("colorcode") != "" {
		filters = append(filters, bson.M{"panelno": r.FormValue("colorcode")})
	}
	if r.FormValue("user") != "" {
		filters = append(filters, bson.M{"user": r.FormValue("user")})
	}
	if r.FormValue("finishname") != "" {
		filters = append(filters, bson.M{"finishname": r.FormValue("finishname")})
	}
	if r.FormValue("brand") != "" {
		filters = append(filters, bson.M{"brand": r.FormValue("brand")})
	}
	switch r.FormValue("isinspected") {
	case "yes":
		filters = append(filters, bson.M{"inspections": bson.M{"$exists": true}})
	case "no":
		filters = append(filters, bson.M{"inspections": bson.M{"$exists": false}})
	}

	var cur *mongo.Cursor
	var err interface{}
	if len(filters) != 0 {
		cur, err = s.mgdb.Collection("colorpanel").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"$and": filters}}},
			{{"$sort", bson.D{{"panelno", 1}}}},
			{{"$set", bson.M{
				"approveddate": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$approveddate"}},
				"expireddate":  bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$expireddate"}},
			}}},
		})
	} else {
		cur, err = s.mgdb.Collection("colorpanel").Aggregate(context.Background(), mongo.Pipeline{
			{{"$sort", bson.D{{"panelno", 1}}}},
			{{"$set", bson.M{
				"approveddate": bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$approveddate"}},
				"expireddate":  bson.M{"$dateToString": bson.M{"format": "%d-%m-%Y", "date": "$expireddate"}},
			}}},
		})
	}

	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var colorpanelData []models.ColorRecord_datestr
	if err := cur.All(context.Background(), &colorpanelData); err != nil {
		log.Println(err)
	}

	for i := 0; i < len(colorpanelData); i++ {
		expireddate, _ := time.Parse("02-01-2006", colorpanelData[i].ExpiredDate)
		if expireddate.AddDate(0, -1, 0).Compare(time.Now()) < 1 {
			colorpanelData[i].ExpiredColor = "#FFD1D1"
		} else {
			colorpanelData[i].ExpiredColor = "white"
		}
		if len(colorpanelData[i].Inspections) != 0 {
			nextInspectionDate, _ := time.Parse("02-01-2006", colorpanelData[i].Inspections[0].Date)
			colorpanelData[i].NextInspection = nextInspectionDate.AddDate(0, 0, 15).Format("02-01-2006") + " (next inspection...)"
			if len(colorpanelData[i].Inspections) > 3 {
				colorpanelData[i].Inspections = colorpanelData[i].Inspections[:3]
			}
		}
	}

	template.Must(template.ParseFiles("templates/pages/colormixing/overview/color_tbody.html")).Execute(w, map[string]interface{}{
		"colorpanelData": colorpanelData,
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

// router.GET("/gnhh/overview", s.g_overview)
func (s *Server) g_overview(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/gnhh/overview/overview.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// router.GET("/gnhh/overview/loadchart", s.go_loadchart)
func (s *Server) go_loadchart(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	mos, err := s.mgdb.Collection("gnhh").Distinct(context.Background(), "mo", bson.M{})
	if err != nil {
		log.Println(err)
	}

	cur, err := s.mgdb.Collection("gnhh").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"mo": mos[len(mos)-1]}}},
		{{"$sort", bson.M{"shipmentdate": 1}}},
		// {{"$set", bson.M{"shipmentdate": bson.M{"$dateToString": bson.M{"format": "%d %b", "date": "$shipmentdate"}}}}},
		// {{"$limit", 2}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	type PP struct {
		Id           string  `bson:"_id" json:"id"`
		Mo           string  `bson:"mo" json:"mo"`
		Itemcode     string  `bson:"itemcode" json:"itemcode"`
		ItemName     string  `bson:"itemname" json:"itemname"`
		Parent       string  `bson:"parent" json:"parent"`
		Qty          float64 `bson:"qty" json:"qty"`
		Unit         string  `bson:"unit" json:"unit"`
		Done         float64 `bson:"done" json:"done"`
		DeliveryQty  float64 `bson:"deliveryqty" json:"deliveryqty"`
		Alert        bool    `bson:"alert" json:"alert"`
		ShipmentDate string  `bson:"shipmentdate" json:"shipmentdate"`
		// Children    []PP    `bson:"children" json:"children"`
	}

	var gnhhdata []PP

	if err := cur.All(context.Background(), &gnhhdata); err != nil {
		log.Println(err)
	}
	var data = struct {
		Itemcode string `bson:"itemcode" json:"itemcode"`
		Children []PP   `bson:"children" json:"children"`
	}{
		Itemcode: mos[len(mos)-1].(string),
		Children: gnhhdata,
	}

	cur, err = s.mgdb.Collection("gnhh").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"mo": mos[len(mos)-1].(string), "itemlevel": 0}}},
	})
	if err != nil {
		log.Println(err)
	}
	var prodlist []struct {
		ProductCode string  `bson:"itemcode"`
		Qty         float64 `bson:"qty"`
		Done        float64 `bson:"done"`
	}
	if err := cur.All(context.Background(), &prodlist); err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/gnhh/overview/chart.html")).Execute(w, map[string]interface{}{
		"gnhhdata":  data,
		"mos":       mos,
		"currentmo": mos[len(mos)-1].(string),
		// "prodlist":  prodlist,
	})
}

// router.GET("/gnhh/overview/loadtimeline", s.go_loadtimeline)
func (s *Server) go_loadtimeline(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("timeline_report").Aggregate(context.Background(), mongo.Pipeline{
		{{"$sort", bson.M{"createdat": -1}}},
		{{"$set", bson.M{"createdat": bson.M{"$dateToString": bson.M{"format": "%H:%M %d %b", "date": "$createdat"}}}}},
		{{"$limit", 20}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	var timelinedata []struct {
		CodePath  string  `bson:"codepath"`
		Title     string  `bson:"title"`
		Qty       float64 `bson:"qty"`
		Note      string  `bson:"note"`
		Reporter  string  `bson:"reporter"`
		CreatedAt string  `bson:"createdat"`
		Code      string
	}

	if err := cur.All(context.Background(), &timelinedata); err != nil {
		log.Println(err)
	}

	for i := 0; i < len(timelinedata); i++ {
		arr := strings.Split(timelinedata[i].CodePath, "->")
		timelinedata[i].Code = arr[len(arr)-1]
	}
	template.Must(template.ParseFiles("templates/pages/gnhh/overview/timeline.html")).Execute(w, map[string]interface{}{
		"timelinedata": timelinedata,
	})
}

// router.GET("/gnhh/overview/loaddetail", s.go_loaddetail)
func (s *Server) go_loaddetail(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// cur, err := s.mgdb.Collection("totalbom").Aggregate(context.Background(), mongo.Pipeline{
	// 	{{"$match", bson.M{"mo": "MO-223", "level": 0}}},
	// 	{{"$group", bson.M{"_id": "$itemcode", "qty": bson.M{"$sum": "$qty"}}}},
	// 	{{"$sort", bson.M{"_id": 1}}},
	// 	{{"$set", bson.M{"itemcode": "$_id"}}},
	// })
	// if err != nil {
	// 	log.Println(err)
	// }
	// defer cur.Close(context.Background())
	// var data []struct {
	// 	Code string  `bson:"itemcode"`
	// 	Qty  float64 `bson:"qty"`
	// }
	// if err := cur.All(context.Background(), &data); err != nil {
	// 	log.Println(err)
	// }

	template.Must(template.ParseFiles("templates/pages/gnhh/overview/detail.html")).Execute(w, map[string]interface{}{
		// "data": data,
	})
}

// router.POST("/gnhh/overview/updatetimeline", s.go_updatetimeline)
func (s *Server) go_updatetimeline(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	authurlsToken, err := r.Cookie("authurls")
	usernameToken, _ := r.Cookie("username")
	if err != nil {
		log.Println(err)
		w.Write([]byte("Phải đăng nhập và có thẩm quyền"))
		return
	}
	if !strings.Contains(authurlsToken.Value, r.URL.Path) {
		w.Write([]byte("Không có thẩm quyền"))
		return
	}

	timelinetype := r.FormValue("timelinetype")
	qty, _ := strconv.ParseFloat(r.FormValue("qty"), 64)
	note := r.FormValue("note")
	path := strings.Split(r.FormValue("codepath"), "->")

	if timelinetype == "" || len(path) < 2 {
		w.Write([]byte("Thiếu thông tin, vui lòng kiểm tra lại"))
		return
	}

	type PP struct {
		Id           string  `bson:"_id" json:"id"`
		Mo           string  `bson:"mo" json:"mo"`
		Itemcode     string  `bson:"itemcode" json:"itemcode"`
		ItemName     string  `bson:"itemname" json:"itemname"`
		Parent       string  `bson:"parent" json:"parent"`
		Qty          float64 `bson:"qty" json:"qty"`
		Unit         string  `bson:"unit" json:"unit"`
		Done         float64 `bson:"done" json:"done"`
		Alert        bool    `bson:"alert" json:"alert"`
		DeliveryQty  float64 `bson:"deliveryqty" json:"deliveryqty"`
		ShipmentDate string  `bson:"shipmentdate" json:"shipmentdate"`
		Children     []PP    `bson:"children" json:"children"`
	}

	switch timelinetype {

	case "Lãnh đủ vật tư":
		sr := s.mgdb.Collection("gnhh").FindOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]})
		if sr.Err() != nil {
			log.Println(sr.Err())
		}
		var rc PP
		if err := sr.Decode(&rc); err != nil {
			log.Println(err)
		}
		qty = rc.Qty

		switch len(path) {
		case 2:
			qty = rc.Qty
			rc.Done = rc.Qty
			rc.DeliveryQty = rc.Qty

			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"done": qty, "deliveryqty": qty}})
			if err != nil {
				log.Println(err)
			}

		case 3:
			for i := 0; i < len(rc.Children); i++ {
				if rc.Children[i].Itemcode == path[2] {
					qty = rc.Children[i].Qty
					rc.Children[i].Done = qty
					rc.Children[i].DeliveryQty = qty
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": rc.Children}})
			if err != nil {
				log.Println(err)
			}

		case 4:
			for i := 0; i < len(rc.Children); i++ {
				if rc.Children[i].Itemcode == path[2] {
					for j := 0; j < len(rc.Children[i].Children); j++ {
						if rc.Children[i].Children[j].Itemcode == path[3] {
							qty = rc.Children[i].Children[j].Qty
							rc.Children[i].Children[j].Done = qty
							rc.Children[i].Children[j].DeliveryQty = qty
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": rc.Children}})
			if err != nil {
				log.Println(err)
			}

		case 5:
			for i := 0; i < len(rc.Children); i++ {
				if rc.Children[i].Itemcode == path[2] {
					for j := 0; j < len(rc.Children[i].Children); j++ {
						if rc.Children[i].Children[j].Itemcode == path[3] {
							for k := 0; k < len(rc.Children[i].Children[j].Children); k++ {
								if rc.Children[i].Children[j].Children[k].Itemcode == path[4] {
									qty = rc.Children[i].Children[j].Children[k].Qty
									rc.Children[i].Children[j].Children[k].Done = qty
									rc.Children[i].Children[j].Children[k].DeliveryQty = qty
									break
								}
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": rc.Children}})
			if err != nil {
				log.Println(err)
			}

		case 6:
			for i := 0; i < len(rc.Children); i++ {
				if rc.Children[i].Itemcode == path[2] {
					for j := 0; j < len(rc.Children[i].Children); j++ {
						if rc.Children[i].Children[j].Itemcode == path[3] {
							for k := 0; k < len(rc.Children[i].Children[j].Children); k++ {
								if rc.Children[i].Children[j].Children[k].Itemcode == path[4] {
									for l := 0; l < len(rc.Children[i].Children[j].Children[k].Children); l++ {
										if rc.Children[i].Children[j].Children[k].Children[l].Itemcode == path[5] {
											qty = rc.Children[i].Children[j].Children[k].Children[l].Qty
											rc.Children[i].Children[j].Children[k].Children[l].Done = qty
											rc.Children[i].Children[j].Children[k].Children[l].DeliveryQty = qty
											break
										}
									}
									break
								}
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": rc.Children}})
			if err != nil {
				log.Println(err)
			}

		case 7:
			for i := 0; i < len(rc.Children); i++ {
				if rc.Children[i].Itemcode == path[2] {
					for j := 0; j < len(rc.Children[i].Children); j++ {
						if rc.Children[i].Children[j].Itemcode == path[3] {
							for k := 0; k < len(rc.Children[i].Children[j].Children); k++ {
								if rc.Children[i].Children[j].Children[k].Itemcode == path[4] {
									for l := 0; l < len(rc.Children[i].Children[j].Children[k].Children); l++ {
										if rc.Children[i].Children[j].Children[k].Children[l].Itemcode == path[5] {
											for m := 0; m < len(rc.Children[i].Children[j].Children[k].Children[l].Children); m++ {
												if rc.Children[i].Children[j].Children[k].Children[l].Children[m].Itemcode == path[6] {
													qty = rc.Children[i].Children[j].Children[k].Children[l].Children[m].Qty
													rc.Children[i].Children[j].Children[k].Children[l].Children[m].Done = qty
													rc.Children[i].Children[j].Children[k].Children[l].Children[m].DeliveryQty = qty
													break
												}
											}
											break
										}
									}
									break
								}
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": rc.Children}})
			if err != nil {
				log.Println(err)
			}
		}

	case "Hoàn thành toàn bộ":
		sr := s.mgdb.Collection("gnhh").FindOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]})
		if sr.Err() != nil {
			log.Println(sr.Err())
		}
		var r PP
		if err := sr.Decode(&r); err != nil {
			log.Println(err)
		}
		switch len(path) {
		case 2:
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"done": r.Qty}})
			if err != nil {
				log.Println(err)
			}

		case 3:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					r.Children[i].Done = r.Children[i].Qty
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}

		case 4:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					for j := 0; j < len(r.Children[i].Children); j++ {
						if r.Children[i].Children[j].Itemcode == path[3] {
							r.Children[i].Children[j].Done = r.Children[i].Children[j].Qty
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}

		case 5:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					for j := 0; j < len(r.Children[i].Children); j++ {
						if r.Children[i].Children[j].Itemcode == path[3] {
							for k := 0; k < len(r.Children[i].Children[j].Children); k++ {
								if r.Children[i].Children[j].Children[k].Itemcode == path[4] {
									r.Children[i].Children[j].Children[k].Done = r.Children[i].Children[j].Children[k].Qty
									break
								}
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}

		case 6:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					for j := 0; j < len(r.Children[i].Children); j++ {
						if r.Children[i].Children[j].Itemcode == path[3] {
							for k := 0; k < len(r.Children[i].Children[j].Children); k++ {
								if r.Children[i].Children[j].Children[k].Itemcode == path[4] {
									for l := 0; l < len(r.Children[i].Children[j].Children[k].Children); l++ {
										if r.Children[i].Children[j].Children[k].Children[l].Itemcode == path[5] {
											r.Children[i].Children[j].Children[k].Children[l].Done = r.Children[i].Children[j].Children[k].Children[l].Qty
											break
										}
									}
									break
								}
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}

		case 7:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					for j := 0; j < len(r.Children[i].Children); j++ {
						if r.Children[i].Children[j].Itemcode == path[3] {
							for k := 0; k < len(r.Children[i].Children[j].Children); k++ {
								if r.Children[i].Children[j].Children[k].Itemcode == path[4] {
									for l := 0; l < len(r.Children[i].Children[j].Children[k].Children); l++ {
										if r.Children[i].Children[j].Children[k].Children[l].Itemcode == path[5] {
											for m := 0; m < len(r.Children[i].Children[j].Children[k].Children[l].Children); m++ {
												if r.Children[i].Children[j].Children[k].Children[l].Children[m].Itemcode == path[6] {
													r.Children[i].Children[j].Children[k].Children[l].Children[m].Done = r.Children[i].Children[j].Children[k].Children[l].Children[m].Qty
													break
												}
											}
											break
										}
									}
									break
								}
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}
		}

	case "Hoàn thành cho toàn bộ MO":
		cur, err := s.mgdb.Collection("totalbom").Aggregate(context.Background(), mongo.Pipeline{
			{{"$match", bson.M{"mo": path[0], "itemcode": path[len(path)-1]}}},
		})
		if err != nil {
			log.Println(err)
			w.Write([]byte("loi"))
			return
		}
		defer cur.Close(context.Background())
		var products []struct {
			ItemCode string   `bson:"itemcode"`
			Path     []string `bson:"path"`
		}
		if err := cur.All(context.Background(), &products); err != nil {
			log.Println(err)
			w.Write([]byte("loi"))
			return
		}

		for _, product := range products {
			sr := s.mgdb.Collection("gnhh").FindOne(context.Background(), bson.M{"mo": product.Path[0], "itemcode": product.Path[1]})
			if sr.Err() != nil {
				log.Println(sr.Err())
			}
			var p PP
			if err := sr.Decode(&p); err != nil {
				log.Println(err)
			}
			switch len(product.Path) {

			case 3:
				for i := 0; i < len(p.Children); i++ {
					if p.Children[i].Itemcode == product.Path[2] {
						for j := 0; j < len(p.Children[i].Children); j++ {
							if p.Children[i].Children[j].Itemcode == product.ItemCode {
								p.Children[i].Children[j].Done = p.Children[i].Children[j].Qty
							}
						}
					}
				}

			case 4:
				for i := 0; i < len(p.Children); i++ {
					if p.Children[i].Itemcode == product.Path[2] {
						for j := 0; j < len(p.Children[i].Children); j++ {
							if p.Children[i].Children[j].Itemcode == product.Path[3] {
								for k := 0; k < len(p.Children[i].Children[j].Children); k++ {
									if p.Children[i].Children[j].Children[k].Itemcode == product.ItemCode {
										p.Children[i].Children[j].Children[k].Done = p.Children[i].Children[j].Children[k].Qty
									}
								}
							}
						}
					}
				}

			case 5:
				for i := 0; i < len(p.Children); i++ {
					if p.Children[i].Itemcode == product.Path[2] {
						for j := 0; j < len(p.Children[i].Children); j++ {
							if p.Children[i].Children[j].Itemcode == product.Path[3] {
								for k := 0; k < len(p.Children[i].Children[j].Children); k++ {
									if p.Children[i].Children[j].Children[k].Itemcode == product.Path[4] {
										for l := 0; l < len(p.Children[i].Children[j].Children[k].Children); l++ {
											if p.Children[i].Children[j].Children[k].Children[l].Itemcode == product.ItemCode {
												p.Children[i].Children[j].Children[k].Children[l].Done = p.Children[i].Children[j].Children[k].Children[l].Qty
											}
										}
									}
								}
							}
						}
					}
				}

			case 6:
				for i := 0; i < len(p.Children); i++ {
					if p.Children[i].Itemcode == product.Path[2] {
						for j := 0; j < len(p.Children[i].Children); j++ {
							if p.Children[i].Children[j].Itemcode == product.Path[3] {
								for k := 0; k < len(p.Children[i].Children[j].Children); k++ {
									if p.Children[i].Children[j].Children[k].Itemcode == product.Path[4] {
										for l := 0; l < len(p.Children[i].Children[j].Children[k].Children); l++ {
											if p.Children[i].Children[j].Children[k].Children[l].Itemcode == product.Path[5] {
												for m := 0; m < len(p.Children[i].Children[j].Children[k].Children[l].Children); m++ {
													if p.Children[i].Children[j].Children[k].Children[l].Children[m].Itemcode == product.ItemCode {
														p.Children[i].Children[j].Children[k].Children[l].Children[m].Done = p.Children[i].Children[j].Children[k].Children[l].Children[m].Qty
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}

			case 7:
				for i := 0; i < len(p.Children); i++ {
					if p.Children[i].Itemcode == product.Path[2] {
						for j := 0; j < len(p.Children[i].Children); j++ {
							if p.Children[i].Children[j].Itemcode == product.Path[3] {
								for k := 0; k < len(p.Children[i].Children[j].Children); k++ {
									if p.Children[i].Children[j].Children[k].Itemcode == product.Path[4] {
										for l := 0; l < len(p.Children[i].Children[j].Children[k].Children); l++ {
											if p.Children[i].Children[j].Children[k].Children[l].Itemcode == product.Path[5] {
												for m := 0; m < len(p.Children[i].Children[j].Children[k].Children[l].Children); m++ {
													if p.Children[i].Children[j].Children[k].Children[l].Children[m].Itemcode == product.Path[6] {
														for n := 0; n < len(p.Children[i].Children[j].Children[k].Children[l].Children[m].Children); n++ {
															if p.Children[i].Children[j].Children[k].Children[l].Children[m].Children[n].Itemcode == product.ItemCode {
																p.Children[i].Children[j].Children[k].Children[l].Children[m].Children[n].Done = p.Children[i].Children[j].Children[k].Children[l].Children[m].Children[n].Qty
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}

			}

			_, err = s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": product.Path[0], "itemcode": product.Path[1]}, bson.M{
				"$set": bson.M{"children": p.Children},
			})
			if err != nil {
				log.Println(err)
			}
		}

	case "Làm được":
		sr := s.mgdb.Collection("gnhh").FindOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]})
		if sr.Err() != nil {
			log.Println(sr.Err())
		}
		var r PP
		if err := sr.Decode(&r); err != nil {
			log.Println(err)
		}

		switch len(path) {
		case 2:
			r.Done = qty
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"done": qty}})
			if err != nil {
				log.Println(err)
			}
		case 3:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					r.Children[i].Done = qty
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}

		case 4:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					for j := 0; j < len(r.Children[i].Children); j++ {
						if r.Children[i].Children[j].Itemcode == path[3] {
							r.Children[i].Children[j].Done = qty
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}

		case 5:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					for j := 0; j < len(r.Children[i].Children); j++ {
						if r.Children[i].Children[j].Itemcode == path[3] {
							for k := 0; k < len(r.Children[i].Children[j].Children); k++ {
								if r.Children[i].Children[j].Children[k].Itemcode == path[4] {
									r.Children[i].Children[j].Children[k].Done = qty
									break
								}
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}

		case 6:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					for j := 0; j < len(r.Children[i].Children); j++ {
						if r.Children[i].Children[j].Itemcode == path[3] {
							for k := 0; k < len(r.Children[i].Children[j].Children); k++ {
								if r.Children[i].Children[j].Children[k].Itemcode == path[4] {
									for l := 0; l < len(r.Children[i].Children[j].Children[k].Children); l++ {
										if r.Children[i].Children[j].Children[k].Children[l].Itemcode == path[5] {
											r.Children[i].Children[j].Children[k].Children[l].Done = qty
											break
										}
									}
									break
								}
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}

		case 7:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					for j := 0; j < len(r.Children[i].Children); j++ {
						if r.Children[i].Children[j].Itemcode == path[3] {
							for k := 0; k < len(r.Children[i].Children[j].Children); k++ {
								if r.Children[i].Children[j].Children[k].Itemcode == path[4] {
									for l := 0; l < len(r.Children[i].Children[j].Children[k].Children); l++ {
										if r.Children[i].Children[j].Children[k].Children[l].Itemcode == path[5] {
											for m := 0; m < len(r.Children[i].Children[j].Children[k].Children[l].Children); m++ {
												if r.Children[i].Children[j].Children[k].Children[l].Children[m].Itemcode == path[6] {
													r.Children[i].Children[j].Children[k].Children[l].Children[m].Done = qty
													break
												}
											}
											break
										}
									}
									break
								}
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}
		}

	case "Giao hàng":
		sr := s.mgdb.Collection("gnhh").FindOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]})
		if sr.Err() != nil {
			log.Println(sr.Err())
		}
		var rc PP
		if err := sr.Decode(&rc); err != nil {
			log.Println(err)
		}

		switch len(path) {
		case 2:
			if qty == 0 {
				qty = rc.Done
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"deliveryqty": qty}})
			if err != nil {
				log.Println(err)
			}

		case 3:
			for i := 0; i < len(rc.Children); i++ {
				if rc.Children[i].Itemcode == path[2] {
					if qty != 0 {
						rc.Children[i].DeliveryQty = qty
					} else {
						rc.Children[i].DeliveryQty = rc.Children[i].Done
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": rc.Children}})
			if err != nil {
				log.Println(err)
			}

		case 4:
			for i := 0; i < len(rc.Children); i++ {
				if rc.Children[i].Itemcode == path[2] {
					for j := 0; j < len(rc.Children[i].Children); j++ {
						if rc.Children[i].Children[j].Itemcode == path[3] {
							if qty != 0 {
								rc.Children[i].Children[j].DeliveryQty = qty
							} else {
								rc.Children[i].Children[j].DeliveryQty = rc.Children[i].Children[j].Done
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": rc.Children}})
			if err != nil {
				log.Println(err)
			}

		case 5:
			for i := 0; i < len(rc.Children); i++ {
				if rc.Children[i].Itemcode == path[2] {
					for j := 0; j < len(rc.Children[i].Children); j++ {
						if rc.Children[i].Children[j].Itemcode == path[3] {
							for k := 0; k < len(rc.Children[i].Children[j].Children); k++ {
								if rc.Children[i].Children[j].Children[k].Itemcode == path[4] {
									if qty != 0 {
										rc.Children[i].Children[j].Children[k].DeliveryQty = qty
									} else {
										rc.Children[i].Children[j].Children[k].DeliveryQty = rc.Children[i].Children[j].Children[k].Done
									}
									break
								}
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": rc.Children}})
			if err != nil {
				log.Println(err)
			}

		case 6:
			for i := 0; i < len(rc.Children); i++ {
				if rc.Children[i].Itemcode == path[2] {
					for j := 0; j < len(rc.Children[i].Children); j++ {
						if rc.Children[i].Children[j].Itemcode == path[3] {
							for k := 0; k < len(rc.Children[i].Children[j].Children); k++ {
								if rc.Children[i].Children[j].Children[k].Itemcode == path[4] {
									for l := 0; l < len(rc.Children[i].Children[j].Children[k].Children); l++ {
										if rc.Children[i].Children[j].Children[k].Children[l].Itemcode == path[5] {
											if qty != 0 {
												rc.Children[i].Children[j].Children[k].Children[l].DeliveryQty = qty
											} else {
												rc.Children[i].Children[j].Children[k].Children[l].DeliveryQty = rc.Children[i].Children[j].Children[k].Children[l].Done
											}
											break
										}
									}
									break
								}
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": rc.Children}})
			if err != nil {
				log.Println(err)
			}

		case 7:
			for i := 0; i < len(rc.Children); i++ {
				if rc.Children[i].Itemcode == path[2] {
					for j := 0; j < len(rc.Children[i].Children); j++ {
						if rc.Children[i].Children[j].Itemcode == path[3] {
							for k := 0; k < len(rc.Children[i].Children[j].Children); k++ {
								if rc.Children[i].Children[j].Children[k].Itemcode == path[4] {
									for l := 0; l < len(rc.Children[i].Children[j].Children[k].Children); l++ {
										if rc.Children[i].Children[j].Children[k].Children[l].Itemcode == path[5] {
											for m := 0; m < len(rc.Children[i].Children[j].Children[k].Children[l].Children); m++ {
												if rc.Children[i].Children[j].Children[k].Children[l].Children[m].Itemcode == path[6] {
													if qty != 0 {
														rc.Children[i].Children[j].Children[k].Children[l].Children[m].DeliveryQty = qty
													} else {
														rc.Children[i].Children[j].Children[k].Children[l].Children[m].DeliveryQty = rc.Children[i].Children[j].Children[k].Children[l].Children[m].Done
													}
													break
												}
											}
											break
										}
									}
									break
								}
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": rc.Children}})
			if err != nil {
				log.Println(err)
			}
		}

	case "Xác nhận Nhận hàng":

	case "Cảnh báo":
		sr := s.mgdb.Collection("gnhh").FindOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]})
		if sr.Err() != nil {
			log.Println(sr.Err())
		}
		var r PP
		if err := sr.Decode(&r); err != nil {
			log.Println(err)
		}

		switch len(path) {
		case 2:
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"alert": true}})
			if err != nil {
				log.Println(err)
			}

		case 3:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					r.Children[i].Alert = true
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}

		case 4:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					for j := 0; j < len(r.Children[i].Children); j++ {
						if r.Children[i].Children[j].Itemcode == path[3] {
							r.Children[i].Children[j].Alert = true
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}

		case 5:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					for j := 0; j < len(r.Children[i].Children); j++ {
						if r.Children[i].Children[j].Itemcode == path[3] {
							for k := 0; k < len(r.Children[i].Children[j].Children); k++ {
								if r.Children[i].Children[j].Children[k].Itemcode == path[4] {
									r.Children[i].Children[j].Children[k].Alert = true
									break
								}
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}

		case 6:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					for j := 0; j < len(r.Children[i].Children); j++ {
						if r.Children[i].Children[j].Itemcode == path[3] {
							for k := 0; k < len(r.Children[i].Children[j].Children); k++ {
								if r.Children[i].Children[j].Children[k].Itemcode == path[4] {
									for l := 0; l < len(r.Children[i].Children[j].Children[k].Children); l++ {
										if r.Children[i].Children[j].Children[k].Children[l].Itemcode == path[5] {
											r.Children[i].Children[j].Children[k].Children[l].Alert = true
											break
										}
									}
									break
								}
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}

		case 7:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					for j := 0; j < len(r.Children[i].Children); j++ {
						if r.Children[i].Children[j].Itemcode == path[3] {
							for k := 0; k < len(r.Children[i].Children[j].Children); k++ {
								if r.Children[i].Children[j].Children[k].Itemcode == path[4] {
									for l := 0; l < len(r.Children[i].Children[j].Children[k].Children); l++ {
										if r.Children[i].Children[j].Children[k].Children[l].Itemcode == path[5] {
											for m := 0; m < len(r.Children[i].Children[j].Children[k].Children[l].Children); m++ {
												if r.Children[i].Children[j].Children[k].Children[l].Children[m].Itemcode == path[6] {
													r.Children[i].Children[j].Children[k].Children[l].Children[m].Alert = true
													break
												}
											}
											break
										}
									}
									break
								}
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}
		}

	case "Tắt cảnh báo":
		sr := s.mgdb.Collection("gnhh").FindOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]})
		if sr.Err() != nil {
			log.Println(sr.Err())
		}
		var r PP
		if err := sr.Decode(&r); err != nil {
			log.Println(err)
		}

		switch len(path) {
		case 2:
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"alert": false}})
			if err != nil {
				log.Println(err)
			}

		case 3:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					r.Children[i].Alert = false
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}

		case 4:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					for j := 0; j < len(r.Children[i].Children); j++ {
						if r.Children[i].Children[j].Itemcode == path[3] {
							r.Children[i].Children[j].Alert = false
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}

		case 5:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					for j := 0; j < len(r.Children[i].Children); j++ {
						if r.Children[i].Children[j].Itemcode == path[3] {
							for k := 0; k < len(r.Children[i].Children[j].Children); k++ {
								if r.Children[i].Children[j].Children[k].Itemcode == path[4] {
									r.Children[i].Children[j].Children[k].Alert = false
									break
								}
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}

		case 6:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					for j := 0; j < len(r.Children[i].Children); j++ {
						if r.Children[i].Children[j].Itemcode == path[3] {
							for k := 0; k < len(r.Children[i].Children[j].Children); k++ {
								if r.Children[i].Children[j].Children[k].Itemcode == path[4] {
									for l := 0; l < len(r.Children[i].Children[j].Children[k].Children); l++ {
										if r.Children[i].Children[j].Children[k].Children[l].Itemcode == path[5] {
											r.Children[i].Children[j].Children[k].Children[l].Alert = false
											break
										}
									}
									break
								}
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}

		case 7:
			for i := 0; i < len(r.Children); i++ {
				if r.Children[i].Itemcode == path[2] {
					for j := 0; j < len(r.Children[i].Children); j++ {
						if r.Children[i].Children[j].Itemcode == path[3] {
							for k := 0; k < len(r.Children[i].Children[j].Children); k++ {
								if r.Children[i].Children[j].Children[k].Itemcode == path[4] {
									for l := 0; l < len(r.Children[i].Children[j].Children[k].Children); l++ {
										if r.Children[i].Children[j].Children[k].Children[l].Itemcode == path[5] {
											for m := 0; m < len(r.Children[i].Children[j].Children[k].Children[l].Children); m++ {
												if r.Children[i].Children[j].Children[k].Children[l].Children[m].Itemcode == path[6] {
													r.Children[i].Children[j].Children[k].Children[l].Children[m].Alert = false
													break
												}
											}
											break
										}
									}
									break
								}
							}
							break
						}
					}
					break
				}
			}
			_, err := s.mgdb.Collection("gnhh").UpdateOne(context.Background(), bson.M{"mo": path[0], "itemcode": path[1]}, bson.M{"$set": bson.M{"children": r.Children}})
			if err != nil {
				log.Println(err)
			}
		}

	case "Khác":

	}

	// create report for timeline
	_, err = s.mgdb.Collection("timeline_report").InsertOne(context.Background(), bson.M{
		"codepath": r.FormValue("codepath"), "title": timelinetype, "qty": qty, "note": note, "reporter": usernameToken.Value, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
	}

	// reload tree chart
	var pipeline mongo.Pipeline
	if r.FormValue("productcode") == "all" {
		if r.FormValue("productstatus") == "done" {
			pipeline = mongo.Pipeline{
				{{"$match", bson.M{"$and": bson.A{bson.M{"mo": r.FormValue("mo")}, bson.M{"$expr": bson.M{"$eq": bson.A{"$qty", "$done"}}}}}}},
			}
		}
		if r.FormValue("productstatus") == "undone" {
			pipeline = mongo.Pipeline{
				{{"$match", bson.M{"$and": bson.A{bson.M{"mo": r.FormValue("mo")}, bson.M{"$expr": bson.M{"$ne": bson.A{"$qty", "$done"}}}}}}},
			}
		}
	} else {
		switch r.FormValue("productstatus") {
		case "all":
			pipeline = mongo.Pipeline{
				{{"$match", bson.M{"$and": bson.A{bson.M{"mo": r.FormValue("mo")}, bson.M{"itemcode": r.FormValue("productcode")}}}}},
			}

		case "done":
			pipeline = mongo.Pipeline{
				{{"$match", bson.M{"$and": bson.A{bson.M{"mo": r.FormValue("mo")}, bson.M{"itemcode": r.FormValue("productcode")}, bson.M{"$expr": bson.M{"$eq": bson.A{"$qty", "$done"}}}}}}},
			}

		case "undone":
			pipeline = mongo.Pipeline{
				{{"$match", bson.M{"$and": bson.A{bson.M{"mo": r.FormValue("mo")}, bson.M{"itemcode": r.FormValue("productcode")}, bson.M{"$expr": bson.M{"$ne": bson.A{"$qty", "$done"}}}}}}},
			}
		}
	}

	cur, err := s.mgdb.Collection("gnhh").Aggregate(context.Background(), pipeline)
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	// type PP struct {
	// 	Id          string  `bson:"_id" json:"id"`
	// 	Mo          string  `bson:"mo" json:"mo"`
	// 	Itemcode    string  `bson:"itemcode" json:"itemcode"`
	// 	ItemName    string  `bson:"itemname" json:"itemname"`
	// 	Parent      string  `bson:"parent" json:"parent"`
	// 	Qty         float64 `bson:"qty" json:"qty"`
	// 	Unit        string  `bson:"unit" json:"unit"`
	// 	Done        float64 `bson:"done" json:"done"`
	// 	DeliveryQty float64 `bson:"deliveryqty" json:"deliveryqty"`
	// 	Alert       bool    `bson:"alert" json:"alert"`
	// 	Children    []PP    `bson:"children" json:"children"`
	// }

	var gnhhdata []PP

	if err := cur.All(context.Background(), &gnhhdata); err != nil {
		log.Println(err)
	}
	var data = struct {
		Itemcode string `bson:"itemcode" json:"itemcode"`
		Children []PP   `bson:"children" json:"children"`
	}{
		Itemcode: r.FormValue("mo"),
		Children: gnhhdata,
	}

	template.Must(template.ParseFiles("templates/pages/gnhh/overview/treechart.html")).Execute(w, map[string]interface{}{
		"gnhhdata": data,
	})
}

// router.POST("/gnhh/overview/searchtimeline", s.go_searchtimeline)
func (s *Server) go_searchtimeline(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	regexSearch := ".*" + r.FormValue("timelinesearch") + ".*"

	cur, err := s.mgdb.Collection("timeline_report").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$or": bson.A{
			bson.M{"codepath": bson.M{"$regex": regexSearch, "$options": "i"}},
		}}}},
		{{"$sort", bson.M{"createdat": -1}}},
		{{"$set", bson.M{"createdat": bson.M{"$dateToString": bson.M{"format": "%H:%M %d %b", "date": "$createdat"}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	var timelinedata []struct {
		CodePath  string  `bson:"codepath"`
		Title     string  `bson:"title"`
		Qty       float64 `bson:"qty"`
		Note      string  `bson:"note"`
		Reporter  string  `bson:"reporter"`
		CreatedAt string  `bson:"createdat"`
		Code      string
	}
	if err := cur.All(context.Background(), &timelinedata); err != nil {
		log.Println(err)
	}
	for i := 0; i < len(timelinedata); i++ {
		arr := strings.Split(timelinedata[i].CodePath, "->")
		timelinedata[i].Code = arr[len(arr)-1]
	}
	template.Must(template.ParseFiles("templates/pages/gnhh/overview/timeline_report.html")).Execute(w, map[string]interface{}{
		"timelinedata": timelinedata,
	})
}

// router.GET("/gnhh/overview/loadtree", s.go_loadtree)
func (s *Server) go_loadtree(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("gnhh").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"mo": "MO-222"}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	type PP struct {
		Id          string  `bson:"_id" json:"id"`
		Mo          string  `bson:"mo" json:"mo"`
		Itemcode    string  `bson:"itemcode" json:"itemcode"`
		ItemName    string  `bson:"itemname" json:"itemname"`
		Parent      string  `bson:"parent" json:"parent"`
		Qty         float64 `bson:"qty" json:"qty"`
		Unit        string  `bson:"unit" json:"unit"`
		Done        float64 `bson:"done" json:"done"`
		DeliveryQty float64 `bson:"deliveryqty" json:"deliveryqty"`
		Alert       bool    `bson:"alert" json:"alert"`
		Children    []PP    `bson:"children" json:"children"`
	}

	var gnhhdata []PP

	if err := cur.All(context.Background(), &gnhhdata); err != nil {
		log.Println(err)
	}
	var data = struct {
		Itemcode string `bson:"itemcode" json:"itemcode"`
		Children []PP   `bson:"children" json:"children"`
	}{
		Itemcode: "MO-222",
		Children: gnhhdata,
	}

	template.Must(template.ParseFiles("templates/pages/gnhh/overview/treechart.html")).Execute(w, map[string]interface{}{
		"gnhhdata": data,
	})
}

// router.POST("/gnhh/overview/getproductcodes", s.go_getproductcodes)
func (s *Server) go_getproductcodes(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var filter bson.M
	switch r.FormValue("productstatus") {
	case "done":
		filter = bson.M{
			"$and": bson.A{bson.M{"mo": r.FormValue("mo")}, bson.M{"$expr": bson.M{"$eq": bson.A{"$qty", "$done"}}}},
		}
	case "undone":
		filter = bson.M{
			"$and": bson.A{bson.M{"mo": r.FormValue("mo")}, bson.M{"$expr": bson.M{"$ne": bson.A{"$qty", "$done"}}}},
		}
	case "":
	case "all":
		filter = bson.M{
			"mo": r.FormValue("mo"),
		}
	}

	productcodes, err := s.mgdb.Collection("gnhh").Distinct(context.Background(), "itemcode", filter)
	if err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/gnhh/overview/productcode_select.html")).Execute(w, map[string]interface{}{
		"productcodes": productcodes,
	})
}

// router.POST("/gnhh/overview/mofilter", s.go_mofilter)
func (s *Server) go_mofilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	if r.FormValue("mo") == "" || r.FormValue("productstatus") == "" {
		w.Write([]byte("Thiếu thông tin lọc"))
		return
	}

	// r.ParseForm()

	// var prodlist bson.A
	// for _, prd := range r.Form["productcode"] {
	// 	prodlist = append(prodlist, prd)
	// }

	var pipeline mongo.Pipeline
	if r.FormValue("productcode") == "all" {
		if r.FormValue("productstatus") == "done" {
			pipeline = mongo.Pipeline{
				{{"$match", bson.M{"$and": bson.A{bson.M{"mo": r.FormValue("mo")}, bson.M{"$expr": bson.M{"$eq": bson.A{"$qty", "$done"}}}}}}},
			}
		}
		if r.FormValue("productstatus") == "undone" {
			pipeline = mongo.Pipeline{
				{{"$match", bson.M{"$and": bson.A{bson.M{"mo": r.FormValue("mo")}, bson.M{"$expr": bson.M{"$ne": bson.A{"$qty", "$done"}}}}}}},
			}
		}
	} else {
		switch r.FormValue("productstatus") {
		case "all":
			pipeline = mongo.Pipeline{
				{{"$match", bson.M{"$and": bson.A{bson.M{"mo": r.FormValue("mo")}, bson.M{"itemcode": r.FormValue("productcode")}}}}},
			}

		case "done":
			pipeline = mongo.Pipeline{
				{{"$match", bson.M{"$and": bson.A{bson.M{"mo": r.FormValue("mo")}, bson.M{"itemcode": r.FormValue("productcode")}, bson.M{"$expr": bson.M{"$eq": bson.A{"$qty", "$done"}}}}}}},
			}

		case "undone":
			pipeline = mongo.Pipeline{
				{{"$match", bson.M{"$and": bson.A{bson.M{"mo": r.FormValue("mo")}, bson.M{"itemcode": r.FormValue("productcode")}, bson.M{"$expr": bson.M{"$ne": bson.A{"$qty", "$done"}}}}}}},
			}
		}

	}

	cur, err := s.mgdb.Collection("gnhh").Aggregate(context.Background(), pipeline)
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	type PP struct {
		Id           string  `bson:"_id" json:"id"`
		Mo           string  `bson:"mo" json:"mo"`
		Itemcode     string  `bson:"itemcode" json:"itemcode"`
		ItemName     string  `bson:"itemname" json:"itemname"`
		Parent       string  `bson:"parent" json:"parent"`
		Qty          float64 `bson:"qty" json:"qty"`
		Unit         string  `bson:"unit" json:"unit"`
		Done         float64 `bson:"done" json:"done"`
		DeliveryQty  float64 `bson:"deliveryqty" json:"deliveryqty"`
		Alert        bool    `bson:"alert" json:"alert"`
		ShipmentDate string  `bson:"shipmentdate" json:"shipmentdate"`
		Children     []PP    `bson:"children" json:"children"`
	}

	var gnhhdata []PP

	if err := cur.All(context.Background(), &gnhhdata); err != nil {
		log.Println(err)
	}
	var data = struct {
		Itemcode string `bson:"itemcode" json:"itemcode"`
		Children []PP   `bson:"children" json:"children"`
	}{
		Itemcode: r.FormValue("mo"),
		Children: gnhhdata,
	}

	template.Must(template.ParseFiles("templates/pages/gnhh/overview/treechart.html")).Execute(w, map[string]interface{}{
		"gnhhdata": data,
	})
}

// router.POST("/gnhh/overview/productfilter", s.go_productfilter)
func (s *Server) go_productfilter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cur, err := s.mgdb.Collection("gnhh").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"mo": "MO-222"}, bson.M{"done": bson.M{"$eq": "$qty"}}}}}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())

	type PP struct {
		Id          string  `bson:"_id" json:"id"`
		Mo          string  `bson:"mo" json:"mo"`
		Itemcode    string  `bson:"itemcode" json:"itemcode"`
		ItemName    string  `bson:"itemname" json:"itemname"`
		Parent      string  `bson:"parent" json:"parent"`
		Qty         float64 `bson:"qty" json:"qty"`
		Unit        string  `bson:"unit" json:"unit"`
		Done        float64 `bson:"done" json:"done"`
		DeliveryQty float64 `bson:"deliveryqty" json:"deliveryqty"`
		Alert       bool    `bson:"alert" json:"alert"`
		Children    []PP    `bson:"children" json:"children"`
	}

	var gnhhdata []PP

	if err := cur.All(context.Background(), &gnhhdata); err != nil {
		log.Println(err)
	}
	var data = struct {
		Itemcode string `bson:"itemcode" json:"itemcode"`
		Children []PP   `bson:"children" json:"children"`
	}{
		Itemcode: "MO-222",
		Children: gnhhdata,
	}

	template.Must(template.ParseFiles("templates/pages/gnhh/overview/treechart.html")).Execute(w, map[string]interface{}{
		"gnhhdata": data,
	})
}

// router.POST("/gnhh/overview/searchdetail", s.go_searchdetail)
func (s *Server) go_searchdetail(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	searchRegex := ".*" + r.FormValue("detailsearch") + ".*"

	cur, err := s.mgdb.Collection("totalbom").Aggregate(context.Background(), mongo.Pipeline{
		{{"$match", bson.M{"$and": bson.A{bson.M{"mo": r.FormValue("mo")}, bson.M{"itemcode": bson.M{"$regex": searchRegex, "$options": "i"}}}}}},
		{{"$group", bson.M{"_id": "$itemcode", "totalqty": bson.M{"$sum": "$qty"}, "name": bson.M{"$first": "$name"}, "unit": bson.M{"$first": "$unit"}, "parents": bson.M{"$push": bson.M{"code": "$parent", "qty": "$qty", "unit": "$unit", "productcode": "$productcode"}}}}},
		{{"$limit", 1}},
	})
	if err != nil {
		log.Println(err)
	}
	defer cur.Close(context.Background())
	type P struct {
		Code    string  `bson:"_id"`
		Name    string  `bson:"name"`
		Qty     float64 `bson:"totalqty"`
		Unit    string  `bson:"unit"`
		Parents []struct {
			Code        string  `bson:"code"`
			Qty         float64 `bson:"qty"`
			Unit        string  `bson:"unit"`
			ProductCode string  `bson:"productcode"`
		} `bson:"parents"`
	}
	var data []P
	if err := cur.All(context.Background(), &data); err != nil {
		log.Println(err)
	}
	var fdata P
	if len(data) != 0 {
		fdata = data[0]
	}

	template.Must(template.ParseFiles("templates/pages/gnhh/overview/item_info.html")).Execute(w, map[string]interface{}{
		"data": fdata,
	})
}

// router.GET("/gnhh/entry/import", s.ge_import)
func (s *Server) ge_import(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles("templates/pages/gnhh/entry/import.html", "templates/shared/navbar.html")).Execute(w, nil)
}

// router.POST("/gnhh/entry/importdata", s.ge_importdata)
func (s *Server) ge_importdata(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	mo := r.FormValue("mo")

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

	rows, _ := f.Rows("Output")

	type P struct {
		Mo           string
		Itemcode     string
		Itemname     string
		Itemlevel    int
		Productcode  string
		Parent       string
		Category     string
		Itemtype     string
		Qty          float64
		Unit         string
		ShipmentDate string
		Children     []P
	}

	var products []P
	var product P
	var level2Index int
	var level3Index int
	var level4Index int
	var level5Index int
	var level6Index int
	var bdoc []interface{}
	var rcord []interface{}
	var path []string

	rows.Next()
	for rows.Next() {
		row, _ := rows.Columns()
		qty, _ := strconv.ParseFloat(row[7], 64)
		// level, _ := strconv.Atoi(row[2])
		level, _ := strconv.Atoi(row[0])
		shipmentdate := ""

		if len(row) == 10 {
			shipmentdate = row[9]
		}

		var p = P{
			Mo:           mo,
			Itemcode:     row[1],
			Itemname:     row[3],
			Itemlevel:    level,
			Productcode:  row[2],
			Parent:       row[4],
			Category:     row[5],
			Itemtype:     row[6],
			Qty:          qty,
			Unit:         row[8],
			ShipmentDate: shipmentdate,
		}

		switch row[0] {
		case "0":
			if product.Itemcode != "" {
				products = append(products, product)
			}
			product = p

			path = []string{mo}

		case "1":
			product.Children = append(product.Children, p)

			if len(path) > 1 {
				path = path[:2]
			} else {
				path = append(path, row[4])
			}

		case "2":
			for i := 0; i < len(product.Children); i++ {
				if product.Children[i].Itemcode == row[4] {
					product.Children[i].Children = append(product.Children[i].Children, p)
					level2Index = i
				}
			}

			if len(path) > 2 {
				path = path[:3]
			} else {
				path = append(path, row[4])
			}

		case "3":
			for i := 0; i < len(product.Children[level2Index].Children); i++ {
				if product.Children[level2Index].Children[i].Itemcode == row[4] {
					product.Children[level2Index].Children[i].Children = append(product.Children[level2Index].Children[i].Children, p)
					level3Index = i
				}
			}

			if len(path) > 3 {
				path = path[:4]
			} else {
				path = append(path, row[4])
			}

		case "4":
			for i := 0; i < len(product.Children[level2Index].Children[level3Index].Children); i++ {
				if product.Children[level2Index].Children[level3Index].Children[i].Itemcode == row[4] {
					product.Children[level2Index].Children[level3Index].Children[i].Children = append(product.Children[level2Index].Children[level3Index].Children[i].Children, p)
					level4Index = i
				}
			}

			if len(path) > 4 {
				path = path[:5]
			} else {
				path = append(path, row[4])
			}

		case "5":
			for i := 0; i < len(product.Children[level2Index].Children[level3Index].Children[level4Index].Children); i++ {
				if product.Children[level2Index].Children[level3Index].Children[level4Index].Children[i].Itemcode == row[4] {
					product.Children[level2Index].Children[level3Index].Children[level4Index].Children[i].Children = append(product.Children[level2Index].Children[level3Index].Children[level4Index].Children[i].Children, p)
					level5Index = i
				}
			}

			if len(path) > 5 {
				path = path[:6]
			} else {
				path = append(path, row[4])
			}

		case "6":
			for i := 0; i < len(product.Children[level2Index].Children[level3Index].Children[level4Index].Children[level5Index].Children); i++ {
				if product.Children[level2Index].Children[level3Index].Children[level4Index].Children[level5Index].Children[i].Itemcode == row[4] {
					product.Children[level2Index].Children[level3Index].Children[level4Index].Children[level5Index].Children[i].Children = append(product.Children[level2Index].Children[level3Index].Children[level4Index].Children[level5Index].Children[i].Children, p)
					level6Index = i
				}
			}

			if len(path) > 6 {
				path = path[:7]
			} else {
				path = append(path, row[4])
			}

		case "7":
			for i := 0; i < len(product.Children[level2Index].Children[level3Index].Children[level4Index].Children[level5Index].Children[level6Index].Children); i++ {
				if product.Children[level2Index].Children[level3Index].Children[level4Index].Children[level5Index].Children[level6Index].Children[i].Itemcode == row[4] {
					product.Children[level2Index].Children[level3Index].Children[level4Index].Children[level5Index].Children[level6Index].Children[i].Children = append(product.Children[level2Index].Children[level3Index].Children[level4Index].Children[level5Index].Children[level6Index].Children[i].Children, p)
					// level7Index = i
				}
			}

			if len(path) > 7 {
				path = path[:8]
			} else {
				path = append(path, row[4])
			}
		}

		// insert every row to a collection
		var tempPath = make([]string, len(path))
		copy(tempPath, path)

		b := bson.M{
			"mo":          mo,
			"level":       level,
			"itemcode":    row[1],
			"productcode": row[2],
			"name":        row[3],
			"parent":      row[4],
			"category":    row[5],
			"type":        row[6],
			"qty":         qty,
			"unit":        row[8],
			"path":        tempPath,
		}
		rcord = append(rcord, b)
		// end

	}

	_, err = s.mgdb.Collection("totalbom").InsertMany(context.Background(), rcord)
	if err != nil {
		log.Println(err)
	}

	products = append(products, product)

	for _, p := range products {
		b, err := bson.Marshal(p)
		if err != nil {
			log.Println(err)
		}
		bdoc = append(bdoc, b)
	}

	_, err = s.mgdb.Collection("gnhh").InsertMany(context.Background(), bdoc)
	if err != nil {
		log.Println(err)
	}

	template.Must(template.ParseFiles("templates/pages/gnhh/entry/import.html", "templates/shared/navbar.html")).Execute(w, map[string]interface{}{})
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /safety/entry
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) s_entry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	template.Must(template.ParseFiles(
		"templates/pages/safety/entry/entry.html",
		"templates/shared/navbar.html",
	)).Execute(w, nil)
}

// ////////////////////////////////////////////////////////////////////////////////////////////
// /safety/sendentry
// ////////////////////////////////////////////////////////////////////////////////////////////
func (s *Server) s_sendentry(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	usernameToken, _ := r.Cookie("username")
	username := usernameToken.Value
	date, _ := time.Parse("Jan 02, 2006", r.FormValue("occurdate"))
	area := r.FormValue("area")
	severity, _ := strconv.Atoi(r.FormValue("severity"))
	casualty := r.FormValue("casualty")

	if area == "" {
		template.Must(template.ParseFiles("templates/pages/safety/entry/entry.html", "templates/shared/navbar.html")).Execute(w, map[string]interface{}{
			"showMissingDialog": true,
			"showErrorDialog":   false,
		})
		return
	}
	_, err := s.mgdb.Collection("safety").InsertOne(context.Background(), bson.M{
		"date": primitive.NewDateTimeFromTime(date), "area": area, "severity": severity, "casualty": casualty,
		"reporter": username, "createdat": primitive.NewDateTimeFromTime(time.Now()),
	})
	if err != nil {
		log.Println(err)
		template.Must(template.ParseFiles("templates/pages/safety/entry/entry.html", "templates/shared/navbar.html")).Execute(w, map[string]interface{}{
			"showErrDialog": true,
		})
		return
	}
	template.Must(template.ParseFiles("templates/pages/safety/entry/entry.html", "templates/shared/navbar.html")).Execute(w, map[string]interface{}{
		"showSuccessDialog": true,
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
