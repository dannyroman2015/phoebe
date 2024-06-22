package app

import "time"

type User struct {
	Username   string   `bson:"username"`
	Password   string   `bson:"password"`
	IsAdmin    string   `bson:"isadmin"`
	Info       string   `bson:"info"`
	Defaulturl string   `bson:"defaulturl"`
	Authurls   []string `bson:"authurls"`
}

type CuttingRecord struct {
	Type         string    `bson:"type"`
	Date         time.Time `bson:"date"`
	Qty          float64   `bson:"qty"`
	Unit         string    `bson:"unit"`
	Reporter     string    `bson:"reporter"`
	CreatedDate  time.Time `bson:"createdDate"`
	ModifiedDate time.Time `bson:"modifiedDate"`
}

type PackingRecord struct {
	Date     time.Time `bson:"date"`
	ProType  string    `bson:"protype"`
	FacNo    string    `bson:"facno"`
	Qty      int       `bson:"qty"`
	Unit     string    `bson:"unit"`
	Price    float64   `bson:"price"`
	Currency string    `bson:"currency"`
}

type Score struct {
	EmpId      string `bson:"empid"`
	EmpName    string `bson:"empname"`
	EmpSection string `bson:"empsection"`
	PointTotal int    `bson:"point_total"`
}

type Employee struct {
	Id      string `bson:"id"`
	Name    string `bson:"name"`
	Section string `bson:"section"`
}

type CuttingQty struct {
	Date time.Time `bson:"date"`
	Qty  float64   `bson:"qty_total"`
}
