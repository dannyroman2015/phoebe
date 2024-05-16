package app

type User struct {
	Username   string         `bson:"username"`
	Password   string         `bson:"password"`
	IsAdmin    string         `bson:"isadmin"`
	Info       map[string]any `bson:"info"`
	Defaulturl string         `bson:"defaulturl"`
	Permission []string       `bson:"permission"`
}
