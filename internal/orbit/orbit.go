package orbit

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
)

type Orbit struct {
	GlobalStyles string
}

func NewOrbit() *Orbit {
	return &Orbit{}
}

func Launch(r http.Handler) {
	fmt.Printf("🔥 Launching at http://%s:%s 🔥\n", os.Getenv("HOST"), os.Getenv("PORT"))
	err := http.ListenAndServe(fmt.Sprintf("%s:%s", os.Getenv("HOST"), os.Getenv("PORT")), r)
	if err != nil {
		log.Fatal(err)
	}
}

func (o *Orbit) Text(w http.ResponseWriter, code int, text string) {
	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(code)
	w.Write([]byte(text))
}

func (o *Orbit) HTML(w http.ResponseWriter, code int, html string) {
	w.Header().Set("Content-Type", "text/html")
	w.WriteHeader(code)
	w.Write([]byte(html))
}

func (o *Orbit) JSON(w http.ResponseWriter, code int, data any) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		o.Error(w, 500, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(jsonData)
}

func (o *Orbit) Error(w http.ResponseWriter, code int, errorMessage string) {
	http.Error(w, errorMessage, code)
}

func (o *Orbit) ErrorJSON(w http.ResponseWriter, code int, errorMessage string) {
	jsonData, err := json.Marshal(fmt.Sprintf("error: %s", errorMessage))
	if err != nil {
		o.Error(w, 500, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(jsonData)
}

// func (o *Orbit) TemplRender(w http.ResponseWriter, r *http.Request, code int, component templ.Component) {

// 	// wrap the temple view in the main layout
// 	view.Main(o.GlobalStyles, component, r.URL.Path).Render(context.Background(), w)
// }
