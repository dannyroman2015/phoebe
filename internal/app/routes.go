package app

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (s *Server) routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.HandlerFunc(s.notFoundResponse)
	router.MethodNotAllowed = http.HandlerFunc(s.methodNotAllowedResponse)

	router.ServeFiles("/static/*filepath", http.Dir("static"))

	router.GET("/", s.index)
	router.GET("/home", s.home)

	router.GET("/login", s.serveLogin)
	router.POST("/login", s.requestLogin)
	router.GET("/logout", s.logout)

	router.GET("/v/:name", BasicAuth(s.handler, "thanh", "123"))

	router.GET("/send", s.handleGetSend)

	router.GET("/test", s.handleGetTest)

	return router
}
