package app

import "database/sql"

type Models struct {
	A ModelA
}

func NewModels(db *sql.DB) *Models {
	return &Models{
		A: ModelA{
			db: db,
		},
	}
}

type ModelA struct {
	db *sql.DB
}

func (m *ModelA) Get(id string) {
	//...
}

func (m *ModelA) Insert(id string) {
	//...
}
