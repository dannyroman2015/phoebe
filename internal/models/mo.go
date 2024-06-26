package models

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// /////////////////////////////////////////////////////
// MoModel for collection "mo"
// /////////////////////////////////////////////////////
type MoRecord struct {
	Mo   string `bson:"mo" json:"mo"`
	Item struct {
		Id    string `bson:"id" json:"id"`
		Name  string `bson:"name" json:"name"`
		Parts []struct {
			Id   string `bson:"id" json:"id"`
			Name string `bson:"name" json:"name"`
			// NeedQty int    `bson:"needqty" json:"needqty"`
			DoneQty int `bson:"doneqty" json:"doneqty"`
		} `bson:"parts" json:"parts"`
	} `bson:"item" json:"item"`
	NeedQty     int     `bson:"needqty" json:"needqty"`
	DoneQty     int     `bson:"doneqty" json:"doneqty"`
	PI          string  `bson:"pi" json:"pi"`
	Price       float64 `bson:"price" json:"price"`
	Status      string  `bson:"status" json:"status"`
	Note        string  `bson:"note" json:"note"`
	FinishDesc  string  `bson:"finish_desc" json:"finish_desc"`
	DonePercent float64
}

type MoModel struct {
	mgdb *mongo.Database
}

func NewMoModel(mgdb *mongo.Database) *MoModel {
	return &MoModel{mgdb: mgdb}
}

func (m *MoModel) InsertMany(moStrJson string) error {
	var bdoc []interface{}
	err := bson.UnmarshalExtJSON([]byte(moStrJson), true, &bdoc)
	if err != nil {
		log.Print("failed to unmarshal json string", err)
		return err
	}

	_, err = m.mgdb.Collection("mo").InsertMany(context.Background(), bdoc)
	if err != nil {
		log.Println("failed to insert many to employee collection", err)
		return err
	}

	return nil
}

func (m *MoModel) FindNotDone() []MoRecord {
	var results []MoRecord
	cur, err := m.mgdb.Collection("mo").Find(context.Background(), bson.M{"status": bson.M{"$ne": "done"}}, options.Find().SetLimit(5))
	if err != nil {
		log.Println("FindNotDone: ", err)
		return results
	}

	if err = cur.All(context.Background(), &results); err != nil {
		log.Println("FindNotDone: ", err)
		return results
	}

	return results
}

func (m *MoModel) FindByMoItem(mo, itemid string) MoRecord {
	var result MoRecord
	if err := m.mgdb.Collection("mo").FindOne(context.Background(), bson.M{"item.id": itemid, "mo": mo}).Decode(&result); err != nil {
		log.Println("FindByMoItem: ", err)
		return result
	}

	return result
}

func (m *MoModel) UpdatePartDoneIncQty(mo, itemid, updatedPartId string, incPartQty, incItemQty int) error {
	filter := bson.M{
		"mo":            mo,
		"item.id":       itemid,
		"item.parts.id": updatedPartId,
	}
	update := bson.M{
		"$inc": bson.M{"item.parts.$.doneqty": incPartQty, "doneqty": incItemQty},
	}
	_, err := m.mgdb.Collection("mo").UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Println("failed to update", err)
		return err
	}
	return nil
}
