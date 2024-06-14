package models

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// /////////////////////////////////////////////////////
// 6SModel for collection "sixs"
// /////////////////////////////////////////////////////
type SixS struct {
}

type SixSModel struct {
	mgdb *mongo.Database
}

func NewSixSModel(mgdb *mongo.Database) *SixSModel {
	return &SixSModel{mgdb: mgdb}
}

func (m *SixSModel) InsertMany(scoresStrJson string) error {
	var bdoc []interface{}
	err := bson.UnmarshalExtJSON([]byte(scoresStrJson), true, &bdoc)
	if err != nil {
		log.Print("failed to unmarshal json string", err)
		return err
	}

	_, err = m.mgdb.Collection("sixs").InsertMany(context.Background(), bdoc)
	if err != nil {
		log.Println("failed to insert many to sixs collection", err)
		return err
	}

	return nil
}
