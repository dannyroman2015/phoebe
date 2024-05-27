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
