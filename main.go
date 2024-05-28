package main

import (
	"context"
	"dannyroman2015/phoebe/internal/app"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	//// connect to postgres database
	// pgdb, err := app.OpenPgDB(`postgresql://postgres:kbEviyUjJecPLMxXRNweNyvIobFzCZAQ@monorail.proxy.rlwy.net:27572/railway`)
	// if err != nil {
	// 	log.Println("Failed to connect postgres database")
	// }
	// defer pgdb.Close()

	// connect to mongodb
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://mongo:rzLmDKylubzBEngsuxZTvuqgfFxXFxVM@roundhouse.proxy.rlwy.net:49073"))
	if err != nil {
		panic(err)
	}
	mgdb := client.Database("phoebe")

	//region test

	a, _ := time.Parse("2006-01-02", "2020-01-01")
	b, _ := time.Parse("2006-01-02", "2021-01-02")
	start := primitive.NewDateTimeFromTime(a)
	end := primitive.NewDateTimeFromTime(b)

	// pineline := mongo.Pipeline{
	// 	bson.D{{"$match", bson.D{{"$and", bson.A{
	// 		bson.D{{"orderdate", bson.D{{"$gt", start}}}},
	// 		bson.D{{"orderdate", bson.D{{"$lt", end}}}},
	// 	}}}}},
	// 	bson.D{{"$sort", bson.D{{"orderdate", -1}}}},
	// }
	// cur, err := mgdb.Collection("orders").Aggregate(context.TODO(), pineline)
	var opts = options.Find().SetSort(bson.M{"orderdate": -1})
	cur, err := mgdb.Collection("orders").Find(context.TODO(),
		bson.M{"orderdate": bson.M{"$gt": start, "$lt": end}}, opts)
	if err != nil {
		log.Println(err)
	}
	var r = []interface{}{}
	cur.All(context.Background(), &r)
	for _, v := range r {
		res, _ := bson.MarshalExtJSON(v, true, true)
		log.Println(string(res))
	}
	//endregion

	port := os.Getenv("PORT")
	if port == "" {
		port = ":3000"
	} else {
		port = ":" + port
	}

	// server := app.NewServer(port, pgdb)
	server := app.NewServer(port, mgdb)
	server.Start()
}
