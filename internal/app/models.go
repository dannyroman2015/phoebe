package app

import (
	"go.mongodb.org/mongo-driver/mongo"
)

type Models struct {
	UserModel UserModel
}

type UserModel struct {
	mgdb *mongo.Database
}
