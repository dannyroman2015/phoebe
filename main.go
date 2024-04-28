package main

import (
	"html/template"
	"net/http"
	"os"
)

func main() {
	// mux := http.NewServeMux()
	// assuming you have a net/http#ServeMux called `mux`
	http.Handle("/static/", http.StripPrefix("/static", http.FileServer(http.Dir("./static"))))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		tmpl := template.Must(template.ParseFiles("templates/index.html"))
		tmpl.Execute(w, nil)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = ":3000"
	} else {
		port = ":" + port
	}
	http.ListenAndServe(port, nil)
}
