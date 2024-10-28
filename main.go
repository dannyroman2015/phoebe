package main

import (
	"context"
	"dannyroman2015/phoebe/internal/app"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {

	// connect to postgres database
	// pgdb, err := app.OpenPgDB(`postgresql://postgres:kbEviyUjJecPLMxXRNweNyvIobFzCZAQ@monorail.proxy.rlwy.net:27572/railway`)
	// if err != nil {
	// 	log.Println("Failed to connect postgres database")
	// }
	// defer pgdb.Close()

	// connect to mongodb
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://mongo:rzLmDKylubzBEngsuxZTvuqgfFxXFxVM@roundhouse.proxy.rlwy.net:49073"))
	if err != nil {
		panic(err)
	}
	mgdb := client.Database("phoebe")

	//region test
	// t, _ := time.Parse("2006-01-02", "2020-01-01")
	// v, _ := time.Parse("2006-01-02", "2021-01-01")
	// start := primitive.NewDateTimeFromTime(t)
	// end := primitive.NewDateTimeFromTime(v)
	// pineline := mongo.Pipeline{
	// 	{{"$match", bson.D{{"$and", bson.A{bson.M{"orderdate": bson.M{"$gte": start}}, bson.M{"orderdate": bson.M{"$lt": end}}}}}}},
	// 	{{"$lookup", bson.M{
	// 		"from":         "products",
	// 		"localField":   "product_id",
	// 		"foreignField": "id",
	// 		"as":           "product_mapping",
	// 	}}},
	// 	{{"$set", bson.M{"product_mapping": bson.M{"$first": "$product_mapping"}}}},
	// 	{{"$set", bson.M{"product_name": "$product_mapping.name", "product_category": "$product_mapping.category"}}},
	// 	{{"$unset", bson.A{"_id", "product_id", "product_mapping"}}},
	// }

	// cur, err := mgdb.Collection("orders").Aggregate(context.Background(), pineline)
	// if err != nil {
	// 	log.Println(err)
	// }
	// type P struct {
	// 	_id                primitive.ObjectID   `bson:"_id"`
	// 	First_puchase_date time.Time            `bson:"first_puchase_date"`
	// 	Total_value        primitive.Decimal128 `bson:"total_value"`
	// 	Total_order        int                  `bson:"total_orders"`
	// }

	// var r []struct {
	// 	Customer_id      string               `bson:"customer_id"`
	// 	Orderdate        time.Time            `bson:"orderdate"`
	// 	Value            primitive.Decimal128 `bson:"value"`
	// 	Product_name     string               `bson:"product_name"`
	// 	product_category string               `bson:"product_category"`
	// }
	// if err := cur.All(context.Background(), &r); err != nil {
	// 	log.Println(err)
	// }
	// log.Println(r)
	//endregion

	port := os.Getenv("PORT")
	if port == "" {
		port = ":3000"
	} else {
		port = ":" + port
	}

	// server := app.NewServer(port, pgdb)
	// server := app.NewServer(port, mgdb, pgdb)
	server := app.NewServer(port, mgdb)
	server.Start()
}
