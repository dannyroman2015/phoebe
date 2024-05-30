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

	pineline := mongo.Pipeline{
		bson.D{{"$unwind", bson.M{"path": "$products"}}},
		bson.D{{"$match", bson.D{{"products.price", bson.M{"$gt": 15.00}}}}},
		bson.D{{"$group", bson.D{
			{"_id", "$products.prod_id"},
			{"product", bson.D{{"$first", "$products.name"}}},
			{"total_value", bson.M{"$sum": "$products.price"}},
			{"quantity", bson.M{"$sum": 1}},
		}}},
		bson.D{{"$set", bson.M{"product_id": "$_id"}}},
		bson.D{{"$unset", "_id"}},
	}

	cur, err := mgdb.Collection("orders").Aggregate(context.Background(), pineline)
	if err != nil {
		log.Println(err)
	}
	// type P struct {
	// 	_id                primitive.ObjectID   `bson:"_id"`
	// 	First_puchase_date time.Time            `bson:"first_puchase_date"`
	// 	Total_value        primitive.Decimal128 `bson:"total_value"`
	// 	Total_order        int                  `bson:"total_orders"`
	// }

	// var r []P
	var r []struct {
		Product_id  string               `bson:"product_id"`
		Product     string               `bson:"product"`
		Total_value primitive.Decimal128 `bson:"total_value"`
		Quantity    int                  `bson:"quantity"`
	}
	if err := cur.All(context.Background(), &r); err != nil {
		log.Println(err)
	}
	log.Println(r)
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
