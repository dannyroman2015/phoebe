package app

import "database/sql"

type PgDB struct {
	conStr string
	db     *sql.DB
}

func NewPgDB(conStr string) *PgDB {
	return &PgDB{
		conStr: conStr,
	}
}
