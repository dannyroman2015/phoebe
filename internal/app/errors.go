package app

import (
	"fmt"
	"net/http"
)

func (s *Server) errorResponse(w http.ResponseWriter, r *http.Request, status int, message interface{}) {
	env := map[string]interface{}{
		"error": message,
	}

	if err := s.writeJSON(w, env, status); err != nil {
		s.Logger.Println(err)
		w.WriteHeader(500)
	}
}

func (s *Server) serverErrorResponse(w http.ResponseWriter, r *http.Request, err error) {
	s.Logger.Println(err)
	message := "The server encountered an error and could not process your request."
	s.errorResponse(w, r, http.StatusInternalServerError, message)
}

func (s *Server) notFoundResponse(w http.ResponseWriter, r *http.Request) {
	message := "The requested resource could not be found."
	s.errorResponse(w, r, http.StatusNotFound, message)
}

func (s *Server) methodNotAllowedResponse(w http.ResponseWriter, r *http.Request) {
	message := fmt.Sprintf("The %s method is not allowed for this resource.", r.Method)
	s.errorResponse(w, r, http.StatusMethodNotAllowed, message)
}

func (s *Server) badRequestResponse(w http.ResponseWriter, r *http.Request, err error) {
	s.errorResponse(w, r, http.StatusBadRequest, err.Error())
}

func (s *Server) failedValidationResponse(w http.ResponseWriter, r *http.Request, err map[string]string) {
	s.errorResponse(w, r, http.StatusUnprocessableEntity, err)
}
