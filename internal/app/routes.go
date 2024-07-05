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
	router.GET("/dashboard/loadpanelcnc", s.d_loadpanelcnc)

	router.GET("/incentive/admin", withAuth(s.iadmin))
	router.GET("/incentive/admin/loadcrittable", s.loadcrittable)
	router.POST("/incentive/admin/upsertcriteria", s.caupsertcriteria)
	router.DELETE("/incentive/admin/deletecriteria/:criteriaid", s.deletecriteria)
	router.POST("/incentive/admin/searchcriterion", s.ia_searchcriterion)
	router.GET("/incentive/admin/loadevaltable", s.loadevaltable)
	router.DELETE("/incentive/admin/deleteevaluate/:evaluateid", s.deleteevaluate)
	router.POST("/incentive/admin/searchevaluate", s.ia_searchevaluate)

	router.GET("/incentive/evaluate", s.evaluate) // use withAuth later
	router.POST("/incentive/evaluate/searchstaff", s.searchstaff)
	router.POST("/incentive/evaluate/searchcriterion", s.searchcriterion)
	router.POST("/incentive/evaluate/sendevaluate", s.sendevaluate)

	router.GET("/incentive/overview", s.ioverview)
	router.GET("/incentive/overview/loadscores", s.io_loadscores)
	router.POST("/incentive/overview/scoresearch", s.io_scoresearch)
	router.POST("/incentive/overview/evalsearch", s.io_evalsearch)

	// HR //////////////////////////////////////////////////////////////
	router.GET("/hr/admin", withAuth(s.hradmin))
	router.POST("/hr/admin/searchemployee", s.ha_searchemployee)
	router.POST("/hr/admin/upsertemployee", s.ha_upsertemployee)
	router.GET("/hr/admin/exportempexcel", s.ha_exportempexcel)
	router.GET("/hr/admin/prevnext/:currentPage/:prevnext", s.ha_prevnext)

	router.GET("/hr/entry", withAuth(s.hr_entry))
	router.POST("/hr/entry", s.hr_insertemplist)
	// end /////////////////////////////////////////////////////////////

	// 6S //////////////////////////////////////////////////////////////
	router.GET("/6s/overview", s.s_overview)

	router.GET("/6s/entry", s.s6_entry)
	router.POST("/6s/entry", s.s6_sendentry)

	router.GET("/6s/admin", s.s6_admin)
	// end 6S //////////////////////////////////////////////////////////////

	// Cuttting ////////////////////////////////////////////////////////
	router.GET("/sections/cutting/overview", s.sc_overview)

	router.GET("/sections/cutting/entry", withAuth(s.sc_entry))
	router.POST("/sections/cutting/entry/wrnoteinfo", s.sc_wrnoteinfo)
	router.GET("/sections/cutting/entry/newwrnote", s.sc_newwrnote)
	router.POST("/sections/cutting/entry/createwrnote", s.sc_createwrnote)
	router.POST("/sections/cutting/sendentry", s.sc_sendentry)

	router.GET("/sections/cutting/admin", withAuth(s.sc_admin))
	router.GET("/sections/cutting/admin/loadreports", s.sc_loadreports)
	router.GET("/sections/cutting/admin/loadwrnote", s.sc_loadwrnote)
	router.POST("/sections/cutting/admin/searchreport", s.sca_searchreport)
	router.DELETE("/sections/cutting/admin/deletereport/:reportid", s.sca_deletereport)
	// end Cuttting/////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////
	// packing ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	router.GET("/sections/packing/overview", s.sp_overview)

	router.GET("/sections/packing/entry", withAuth(s.sp_entry))
	router.GET("/sections/packing/entry/loadentry", s.sp_loadentry)
	router.GET("/selections/packing/entry/mo/:status", s.sp_mobystatus)
	router.POST("/selections/packing/entry/mosearch", s.sp_mosearch)
	router.GET("/sections/packing/entry/itemparts/:mo/:itemid/:pi", s.sp_itemparts)
	router.POST("/sections/packing/entry/initpart", s.sp_itempart)
	router.POST("/sections/packing/entry/initparts", s.sp_initparts)
	router.POST("/sections/packing/entry/maxpartqtyinput", s.sp_getinputmax)
	router.POST("/sections/packing/sendentry", s.sp_sendentry)

	router.GET("/sections/packing/admin", s.sp_admin)
	// end packing --------------------------------------------------------

	////////////////////////////////////////////////////////////////////
	// mo ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	router.GET("/mo/entry", withAuth(s.mo_entry))
	router.POST("/mo/entry", s.mo_insertMoList)

	router.GET("/mo/admin", s.mo_admin)
	// end packing --------------------------------------------------------

	////////////////////////////////////////////////////////////////////
	// item ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	router.GET("/item/entry", withAuth(s.i_entry))
	router.POST("/item/entry", s.i_importitemlist)

	router.GET("/item/admin", s.i_admin)
	router.POST("/item/admin/additem", s.i_additem)
	router.POST("/item/admin/addpart", s.i_addpart)
	// end item --------------------------------------------------------

	router.GET("/test", s.handleGetTest)

	router.GET("/test/loadmain", s.testload)

	return router
}
