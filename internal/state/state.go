package state

import (
	"coinz/internal/database"
)

type State struct {
	DbPool *database.DbPool
}
