package main

import (
	"context"
	"dannyroman2015/phoebe/internal/app"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
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
	pineline := mongo.Pipeline{
		{{"$match", bson.D{{"value", bson.D{{"$gte", 50}, {"$lt", 150}}}}}},
	}
	cur, err := mgdb.Collection("persons").Aggregate(context.Background(), pineline)
	if err != nil {
		log.Println(err)
	}
	var r = []interface{}{}
	cur.All(context.Background(), &r)
	for i, v := range r {
		log.Println(i, v)
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
