package main

import (
	"context"
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
	userColl := client.Database("phoebe").Collection("user")

	_, err = userColl.DeleteOne(context.Background(), bson.M{"name": "trung"})
	if err != nil {
		panic(err)
	}

	// port := os.Getenv("PORT")
	// if port == "" {
	// 	port = ":3000"
	// } else {
	// 	port = ":" + port
	// }

	// server := app.NewServer(port, pgdb)
	// server.Start()
}
