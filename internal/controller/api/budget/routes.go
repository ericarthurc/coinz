package budget

import (
	"coinz/internal/database"
	"coinz/internal/orbit"

	"github.com/go-chi/chi/v5"
)

// Can pass global state to the router here
type router struct {
	*database.DbPool
	*orbit.Orbit
	*chi.Mux
}

func newRouter(dbPool *database.DbPool, orb *orbit.Orbit) *router {
	return &router{
		DbPool: dbPool,
		Orbit:  orb,
		Mux:    chi.NewRouter(),
	}
}

// route: /api/budget
func Routes(dbPool *database.DbPool, orb *orbit.Orbit) *router {
	r := newRouter(dbPool, orb)
	h := newHandlers(r)

	r.Get("/", h.getAllBudgetsJSON())

	return r
}
