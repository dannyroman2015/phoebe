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
	router.POST("/logout", s.logout)
	router.POST("/request", s.sendRequest)

	router.GET("/admin", withAuth(s.admin))

	router.GET("/dashboard", s.dashboard)

	router.GET("/character/score", s.cscore)
	router.POST("/character/score/a", s.cscore_ap)
	router.GET("/character/score/b/:id", s.cscore_b)
	router.POST("/character/score/c/:id", s.cscore_cp)
	router.POST("/character/score/d", s.cscore_dp)

	router.GET("/sections/cutting", s.cuttingSection)

	router.GET("/footer", s.footer)
	router.GET("/test", s.handleGetTest)
	router.GET("/testalpinejs", s.handleAlpine)
	router.GET("/test2", s.handletestgojs)
	router.GET("/test3", s.handletest3)

	return router
}
