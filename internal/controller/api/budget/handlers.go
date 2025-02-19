package budget

import (
	"coinz/internal/model/dto"
	"net/http"
)

type handlers struct {
	*router
}

func newHandlers(router *router) *handlers {
	return &handlers{router}
}

// @Route: /
// @Method: GET
// @Render the index page
// func (h *handlers) indexHTML() http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {

// 		budgets, err := model.GetAllMonthlyBudgetsDTO(h.DbPool)
// 		if err != nil {
// 			h.Orbit.Error(w, 500, err.Error())
// 		}

//			h.TemplRender(w, r, 200, view.Index(budgets))
//		}
//	}
func (h *handlers) getAllBudgetsJSON() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		budgets, err := dto.GetAllMonthlyBudgetsDTO(h.DbPool)
		if err != nil {
			h.Orbit.ErrorJSON(w, 500, err.Error())
		}

		h.Orbit.JSON(w, 200, budgets)
	}
}
