package models

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type Item struct {
	Id    string `bson:"id" json:"id"`
	Name  string `bson:"name" json:"name"`
	Parts []struct {
		Id   string `bson:"id" json:"id"`
		Name string `bson:"name" json:"name"`
	} `bson:"parts" json:"parts"`
}

type ItemModel struct {
	mgdb *mongo.Database
}

func NewItemModel(mgdb *mongo.Database) *ItemModel {
	return &ItemModel{
		mgdb: mgdb,
	}
}

func (m *ItemModel) InsertItem(item Item) error {
	_, err := m.mgdb.Collection("item").InsertOne(context.Background(), bson.M{
		"id":   item.Id,
		"name": item.Name,
	})
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}
