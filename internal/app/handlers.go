package app

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (s *Server) handleGetHome(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	data := map[string]string{
		"message": "Hello, world!",
	}
	if err := s.writeJSON(w, data, http.StatusOK); err != nil {
		s.serverErrorResponse(w, r, err)
	}
}
