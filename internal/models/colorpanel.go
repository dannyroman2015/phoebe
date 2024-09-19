package models

import "time"

type ColorRecord_datestr struct {
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
	Inspections      []struct {
		Date   time.Time `bson:"date"`
		Result string    `bson:"result"`
	} `bson:"inspections"`
}
