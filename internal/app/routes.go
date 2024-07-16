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
	router.GET("/dashboard/loadproduction", s.d_loadproduction)
	router.POST("/dashboard/production/getchart", s.dpr_getchart)
	router.GET("/dashboard/loadreededline", s.d_loadreededline)
	router.GET("/dashboard/loadpanelcnc", s.d_loadpanelcnc)
	router.GET("/dashboard/loadveneer", s.d_loadveneer)
	router.GET("/dashboard/loadassembly", s.d_loadassembly)
	router.GET("/dashboard/loadwoodfinish", s.d_loadwoodfinish)
	router.GET("/dashboard/loadpack", s.d_loadpack)
	router.GET("/dashboard/loadwoodrecovery", s.d_loadwoodrecovery)
	router.GET("/dashboard/loadquality", s.d_loadquality)
	router.POST("/dashboard/panelcnc/getchart", s.dpc_getchart)
	router.POST("/dashboard/assembly/getchart", s.da_getchart)
	router.POST("/dashboard/woodfinish/getchart", s.dw_getchart)
	router.POST("/dashboard/cutting/getchart", s.dc_getchart)
	router.POST("/dashboard/lamination/getchart", s.dl_getchart)
	router.POST("/dashboard/reededline/getchart", s.dr_getchart)
	router.POST("/dashboard/veneer/getchart", s.dv_getchart)
	router.GET("/dashboard/pack/getchart", s.dp_getchart)

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
	router.GET("/sections/cutting/woodrecoveryentry", s.sc_woodrecoveryentry)
	router.GET("/sections/cutting/entry/wr_loadform", s.sce_wr_loadform)
	router.POST("/sections/cutting/entry/wr_sendentry", s.sce_wr_sendentry)

	router.GET("/sections/cutting/admin", withAuth(s.sc_admin))
	router.GET("/sections/cutting/admin/loadreports", s.sc_loadreports)
	router.GET("/sections/cutting/admin/loadwrnote", s.sc_loadwrnote)
	router.POST("/sections/cutting/admin/searchreport", s.sca_searchreport)
	router.DELETE("/sections/cutting/admin/deletereport/:reportid", s.sca_deletereport)
	// end Cuttting/////////////////////////////////////////////////////////////

	// Lamination ////////////////////////////////////////////////////////
	router.GET("/sections/lamination/entry", withAuth(s.sl_entry))
	router.GET("/sections/lamination/entry/loadform", s.sle_loadform)
	router.POST("/sections/lamination/entry/sendentry", s.sle_sendentry)
	// end Lamination/////////////////////////////////////////////////////////////

	// Reededline ////////////////////////////////////////////////////////
	router.GET("/sections/reededline/entry", withAuth(s.sr_entry))
	router.GET("/sections/reededline/entry/loadform", s.sre_loadform)
	router.POST("/sections/reededline/entry/sendentry", s.sre_sendentry)
	// end Lamination/////////////////////////////////////////////////////////////

	// Assembly ////////////////////////////////////////////////////////
	router.GET("/sections/assembly/entry", withAuth(s.sa_entry))
	router.GET("/sections/assembly/entry/loadform", s.sae_loadform)
	router.POST("/sections/assembly/entry/sendentry", s.sae_sendentry)
	// end Assembly/////////////////////////////////////////////////////////////

	// WoodFinish ////////////////////////////////////////////////////////
	router.GET("/sections/woodfinish/entry", withAuth(s.sw_entry))
	router.GET("/sections/woodfinish/entry/loadform", s.swe_loadform)
	router.POST("/sections/woodfinish/entry/sendentry", s.swe_sendentry)
	// end WoodFinish/////////////////////////////////////////////////////////////

	// Pack ////////////////////////////////////////////////////////
	router.GET("/sections/pack/entry", withAuth(s.spk_entry))
	router.GET("/sections/pack/entry/loadform", s.spk_loadform)
	router.POST("/sections/pack/entry/sendentry", s.spk_sendentry)
	// end Pack/////////////////////////////////////////////////////////////

	// Panelcnc ////////////////////////////////////////////////////////
	router.GET("/sections/panelcnc/entry", withAuth(s.spc_entry))
	router.GET("/sections/panelcnc/entry/loadform", s.spc_loadform)
	router.POST("/sections/panelcnc/entry/sendentry", s.spc_sendentry)
	// end Panelcnc/////////////////////////////////////////////////////////////

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
	// end packing

	////////////////////////////////////////////////////////////////////
	// Quality ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	router.GET("/quality/fastentry", s.q_fastentry)
	router.GET("/quality/entry/loadform", s.q_loadform)
	router.POST("/quality/entry/sendentry", s.q_sendentry)
	// end packing

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
