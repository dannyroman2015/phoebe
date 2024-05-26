package app

type User struct {
	Username   string   `bson:"username"`
	Password   string   `bson:"password"`
	IsAdmin    string   `bson:"isadmin"`
	Info       string   `bson:"info"`
	Defaulturl string   `bson:"defaulturl"`
	Authurls   []string `bson:"authurls"`
}
