package models

import (
	"context"
	"errors"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// /////////////////////////////////////////////////////
// CuttingModel for collection "cutting"
// /////////////////////////////////////////////////////
type CuttingReport struct {
	ReportId         string    `bson:"_id"`
	Date             time.Time `bson:"date"`
	WoodType         string    `bson:"woodtype"`
	Qtycbm           float64   `bson:"qtycbm"`
	Thickness        float64   `bson:"thickness"`
	WoodRecievedNote string    `bson:"wrnote"`
	Reporter         string    `bson:"reporter"`
	CreatedDate      time.Time `bson:"createddate"`
	LastModified     time.Time `bson:"lastmodified"`
}

type CuttingModel struct {
	mgdb *mongo.Database
}

func NewCuttingModel(mgdb *mongo.Database) *CuttingModel {
	return &CuttingModel{mgdb: mgdb}
}

func (m *CuttingModel) PartalUpdate(cuttingReport *CuttingReport) error {
	id, _ := primitive.ObjectIDFromHex(cuttingReport.ReportId)
	log.Println(id)
	// m.mgdb.Collection("cutting").UpdateOne(context.Background(), bson.M{"_id": id})
	return nil
}

func (m *CuttingModel) FindAllReportsSortDateDesc() ([]CuttingReport, error) {
	cur, err := m.mgdb.Collection("cutting").Find(context.Background(), bson.M{"type": "report"}, options.Find().SetSort(bson.M{"occurdate": -1}))
	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer cur.Close(context.Background())

	var results []CuttingReport
	if err = cur.All(context.Background(), &results); err != nil {
		log.Println(err)
		return nil, err
	}

	return results, nil
}

func (m *CuttingModel) InsertOne(entry CuttingReport) error {
	_, err := m.mgdb.Collection("cutting").InsertOne(context.Background(), bson.M{
		"type":         "report",
		"date":         entry.Date,
		"woodtype":     entry.WoodType,
		"qtycbm":       entry.Qtycbm,
		"thickness":    entry.Thickness,
		"wrnote":       entry.WoodRecievedNote,
		"reporter":     entry.Reporter,
		"createddate":  entry.CreatedDate,
		"lastmodified": entry.LastModified,
	})
	if err != nil {
		log.Println(err)
		return errors.New("failed to insert one to cutting collection")
	}
	return nil
}
