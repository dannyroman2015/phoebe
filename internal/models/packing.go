package models

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// /////////////////////////////////////////////////////
// MoModel for collection "mo"
// /////////////////////////////////////////////////////
type PackingRecord struct {
	Date     time.Time `bson:"date"`
	Factory  string    `bson:"factory"`
	ProdType string    `bson:"prodtype"`
	Product  struct {
		Id     string `bson:"id"`
		Name   string `bson:"name"`
		IsPart bool   `bson:"ispart"`
	} `bson:"product"`
	ParentItem struct {
		Id   string `bson:"id"`
		Name string `bson:"name"`
	} `bson:"parent"`
}

type PackingModel struct {
	mgdb *mongo.Database
}

func NewPackingModel(mgdb *mongo.Database) *MoModel {
	return &MoModel{mgdb: mgdb}
}

func (m *PackingModel) InsertNewReport() error {
	bdoc := bson.M{}
	_, err := m.mgdb.Collection("packing").InsertOne(context.Background(), bdoc)
	if err != nil {
		return err
	}
	return nil
}
