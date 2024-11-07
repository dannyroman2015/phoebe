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
	router.GET("/dashboard/loadproductionvop", s.d_loadproductionvop)
	router.GET("/dashboard/loadplan", s.d_loadproductionplan)
	router.GET("/dashboard/loadrawwood", s.d_loadrawwood)
	router.GET("/dashboard/loadproduction", s.d_loadproduction)
	router.GET("/dashboard/loadreededline", s.d_loadreededline)
	router.GET("/dashboard/loadoutput", s.d_loadoutput)
	router.GET("/dashboard/loadpanelcnc", s.d_loadpanelcnc)
	router.GET("/dashboard/loadveneer", s.d_loadveneer)
	router.GET("/dashboard/loadassembly", s.d_loadassembly)
	router.GET("/dashboard/loadwhitewood", s.d_loadwhitewood)
	router.GET("/dashboard/loadwoodfinish", s.d_loadwoodfinish)
	router.GET("/dashboard/loadfinemill", s.d_loadfinemill)
	router.GET("/dashboard/loadpack", s.d_loadpack)
	router.GET("/dashboard/loadslicing", s.d_loadslicing)
	router.GET("/dashboard/loadquality", s.d_loadquality)
	router.GET("/dashboard/loadwoodrecovery", s.d_loadwoodrecovery)
	router.GET("/dashboard/loaddowntime", s.d_loaddowntime)
	router.GET("/dashboard/loadsixs", s.d_loadsixs)
	router.GET("/dashboard/loadsafety", s.d_loadsafety)
	router.POST("/dashboard/production/getchart", s.dpr_getchart)
	router.POST("/dashboard/panelcnc/getchart", s.dpc_getchart)
	router.POST("/dashboard/assembly/getchart", s.da_getchart)
	router.POST("/dashboard/woodfinish/getchart", s.dw_getchart)
	router.POST("/dashboard/cutting/getchart", s.dc_getchart)
	router.POST("/dashboard/lamination/getchart", s.dl_getchart)
	router.POST("/dashboard/reededline/getchart", s.dr_getchart)
	router.POST("/dashboard/output/getchart", s.do_getchart)
	router.POST("/dashboard/veneer/getchart", s.dv_getchart)
	router.POST("/dashboard/finemill/getchart", s.df_getchart)
	router.POST("/dashboard/pack/getchart", s.dp_getchart)
	router.POST("/dashboard/woodrecovery/getchart", s.dwr_getchart)
	router.POST("/dashboard/sixs/getchart", s.ds_getchart)
	router.POST("/dashboard/quality/getchart", s.dq_getchart)
	router.POST("/dashboard/downtime/getchart", s.dd_getchart)
	router.POST("/dashboard/safety/getchart", s.dst_getchart)

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
	router.GET("/hr/overview", s.hr_overview)
	router.GET("/hr/overview/loadchart", s.hr_loadchart)

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

	// Rawwood ////////////////////////////////////////////////////////
	router.POST("/sections/rawwood/entry/entry", withAuth2(s.sre_entry))
	router.POST("/sections/rawwood/entry/selection", withAuth2(s.sre_selection))
	// End Rawwood ////////////////////////////////////////////////////////

	// Cuttting ////////////////////////////////////////////////////////
	router.GET("/sections/cutting/overview", s.sc_overview)
	router.GET("/sections/cutting/overview/loadwoodremain", s.sco_loadwoodremain)
	router.GET("/sections/cutting/overview/loadwrnote", s.sco_loadwrnote)
	router.GET("/sections/cutting/overview/loadreport", s.sco_loadreport)
	router.POST("/sections/cutting/overview/wrnotesearch", s.sco_wrnotesearch)
	router.POST("/sections/cutting/overview/reportsearch", s.sco_reportsearch)
	router.POST("/sections/cutting/overview/wrnotefilter", s.sco_wrnotefilter)
	router.POST("/sections/cutting/overview/reportfilter", s.sco_reportfilter)
	router.POST("/sections/cutting/overview/createdemand", s.sco_createdemand)

	router.GET("/sections/cutting/entry", withAuth(s.sc_entry))
	router.POST("/sections/cutting/entry/wrnoteinfo", s.sc_wrnoteinfo)
	router.GET("/sections/cutting/entry/newwrnote", s.sc_newwrnote)
	router.POST("/sections/cutting/entry/createwrnote", s.sc_createwrnote)
	router.POST("/sections/cutting/sendentry", s.sc_sendentry)
	router.GET("/sections/cutting/entry/return", s.sce_return)
	router.POST("/sections/cutting/entry/sendreturn", s.sce_sendreturn)
	router.GET("/sections/cutting/entry/fine", s.sce_fine)
	router.POST("/sections/cutting/entry/sendfine", s.sce_sendfine)

	router.GET("/sections/cutting/woodrecoveryentry", withAuth(s.sc_woodrecoveryentry))
	router.GET("/sections/cutting/entry/wr_loadform", s.sce_wr_loadform)
	router.POST("/sections/cutting/entry/wr_sendentry", s.sce_wr_sendentry)

	router.GET("/sections/cutting/admin", withAuth(s.sc_admin))
	router.GET("/sections/cutting/admin/loadreports", s.sc_loadreports)
	router.GET("/sections/cutting/admin/loadwrnote", s.sc_loadwrnote)
	router.POST("/sections/cutting/admin/searchreport", s.sca_searchreport)
	router.POST("/sections/cutting/admin/searchwrnote", s.sca_searchwrnote)
	router.POST("/sections/cutting/admin/reportdatefilter", s.sca_reportdatefilter)
	router.DELETE("/sections/cutting/admin/deletereport/:reportid", s.sca_deletereport)
	router.DELETE("/sections/cutting/admin/deletewrnote/:wrnoteid", s.sca_deletewrnote)
	router.GET("/sections/cutting/admin/wrnoteupdateform/:wrnoteid", s.sca_wrnoteupdateform)
	router.PUT("/sections/cutting/admin/updatewrnote/:wrnoteid", s.sca_updatewrnote)
	// end Cuttting/////////////////////////////////////////////////////////////

	// Lamination ////////////////////////////////////////////////////////
	router.GET("/sections/lamination/overview", s.sl_overview)
	router.GET("/sections/lamination/overview/loadreport", s.slo_loadreport)
	router.POST("/sections/lamination/overview/reportsearch", s.slo_reportsearch)
	router.POST("/sections/lamination/overview/reportdatefilter", s.slo_reportdatefilter)

	router.GET("/sections/lamination/entry", withAuth(s.sl_entry))
	router.GET("/sections/lamination/entry/loadform", s.sle_loadform)
	router.POST("/sections/lamination/entry/sendentry", s.sle_sendentry)

	router.GET("/sections/lamination/admin", withAuth(s.sl_admin))
	router.GET("/sections/lamination/admin/loadreport", s.sla_loadreport)
	router.POST("/sections/lamination/admin/searchreport", s.sla_searchreport)
	router.DELETE("/sections/lamination/admin/deletereport/:reportid", s.sla_deletereport)
	// end Lamination/////////////////////////////////////////////////////////////

	// Slicing ////////////////////////////////////////////////////////
	router.GET("/sections/slicing/entry", withAuth(s.ss_entry))
	router.GET("/sections/slicing/entry/loadform", s.sse_loadform)
	router.POST("/sections/slicing/entry/sendentry", s.sse_sendentry)

	router.GET("/sections/slicing/admin", s.ss_admin)
	router.GET("/sections/slicing/admin/loadreport", s.ssa_loadreport)
	router.POST("/sections/slicing/admin/reportsearch", s.ssa_reportsearch)
	router.DELETE("/sections/slicing/admin/deletereport/:id", s.ssa_deletereport)
	// end Slicing/////////////////////////////////////////////////////////////

	// Reededline ////////////////////////////////////////////////////////
	router.GET("/sections/reededline/overview", s.sr_overview)
	router.GET("/sections/reededline/overview/loadreport", s.sro_loadreport)
	router.POST("/sections/reededline/overview/reportsearch", s.sro_reportsearch)
	router.POST("/sections/reededline/overview/reportdatefilter", s.sro_reportdatefilter)

	router.GET("/sections/reededline/entry", withAuth(s.sr_entry))
	router.GET("/sections/reededline/entry/loadform", s.sre_loadform)
	router.POST("/sections/reededline/entry/sendentry", s.sre_sendentry)

	router.GET("/sections/reededline/admin", withAuth(s.sr_admin))
	router.GET("/sections/reededline/admin/loadreport", s.sra_loadreport)
	router.POST("/sections/reededline/admin/searchreport", s.sra_searchreport)
	router.DELETE("/sections/reededline/admin/deletereport/:reportid", s.sra_deletereport)
	// end Reededline/////////////////////////////////////////////////////////////

	// Output ////////////////////////////////////////////////////////
	router.GET("/sections/output/entry", withAuth(s.so_entry))
	router.GET("/sections/output/entry/loadentry", s.soe_loadentry)
	router.POST("/sections/output/entry/sendentry", s.soe_sendentry)
	router.GET("/sections/output/entry/loadformentry", s.soe_loadformentry)
	router.POST("/sections/output/entry/sendfastentry", s.soe_sendfastentry)

	router.GET("/sections/output/admin", withAuth(s.so_admin))
	router.GET("/sections/output/admin/loadreport", s.soa_loadreport)
	router.POST("/sections/output/admin/searchreport", s.soa_searchreport)
	router.POST("/sections/output/admin/reportdatefilter", s.soa_reportdatefilter)
	router.DELETE("/sections/output/admin/deletereport/:reportid", s.soa_deletereport)
	router.GET("/sections/output/admin/updateform/:reportid", s.soa_updateform)
	router.PUT("/sections/output/admin/updatereport/:reportid", s.soa_updatereport)

	// end Output/////////////////////////////////////////////////////////////

	// Veneer ////////////////////////////////////////////////////////
	router.GET("/sections/veneer/overview", s.sv_overview)
	router.GET("/sections/veneer/overview/loadreport", s.svo_loadreport)
	router.POST("/sections/veneer/overview/reportsearch", s.svo_reportsearch)
	router.POST("/sections/veneer/overview/reportdatefilter", s.svo_reportdatefilter)

	router.GET("/sections/veneer/entry", withAuth(s.sv_entry))
	router.GET("/sections/veneer/entry/loadform", s.sve_loadform)
	router.POST("/sections/veneer/entry/sendentry", s.sve_sendentry)

	router.GET("/sections/veneer/admin", withAuth(s.sv_admin))
	router.GET("/sections/veneer/admin/loadreport", s.sva_loadreport)
	router.POST("/sections/veneer/admin/searchreport", s.sva_searchreport)
	router.DELETE("/sections/veneer/admin/deletereport/:reportid", s.sva_deletereport)
	// end Veneer/////////////////////////////////////////////////////////////

	// Finemill ////////////////////////////////////////////////////////
	router.GET("/sections/finemill/entry", withAuth(s.sf_entry))
	router.GET("/sections/finemill/entry/loadform", s.sfe_loadform)
	router.POST("/sections/finemill/entry/sendentry", s.sfe_sendentry)

	// end Veneer/////////////////////////////////////////////////////////////

	// Assembly ////////////////////////////////////////////////////////
	router.GET("/sections/assembly/overview", s.sa_overview)
	router.GET("/sections/assembly/overview/loadreport", s.sao_loadreport)
	router.POST("/sections/assembly/overview/reportsearch", s.sao_reportsearch)
	router.POST("/sections/assembly/overview/reportdatefilter", s.sao_reportdatefilter)
	router.POST("/sections/assembly/overview/addplanvalue", s.sao_addplanvalue)
	router.POST("/sections/assembly/overview/updateinventory", s.sao_updateinventory)

	router.GET("/sections/assembly/entry", withAuth(s.sa_entry))
	router.GET("/sections/assembly/entry/loadform", s.sae_loadform)
	router.POST("/sections/assembly/entry/sendentry", s.sae_sendentry)

	router.GET("/sections/assembly/planentry", s.sae_planentry)
	router.GET("/sections/assembly/entry/loadplanform", s.sae_loadplanform)
	router.POST("/sections/assembly/entry/sendplanentry", s.sae_sendplanentry)

	router.GET("/sections/assembly/inventoryentry", s.sai_inventoryentry)
	router.GET("/sections/assembly/entry/loadinventoryform", s.sai_loadinventoryform)

	router.GET("/sections/assembly/admin", withAuth(s.sa_admin))
	router.GET("/sections/assembly/admin/loadreport", s.saa_loadreport)
	router.POST("/sections/assembly/admin/searchreport", s.saa_searchreport)
	router.DELETE("/sections/assembly/admin/deletereport/:reportid", s.saa_deletereport)
	// end Assembly/////////////////////////////////////////////////////////////

	// WoodFinish ////////////////////////////////////////////////////////
	router.GET("/sections/woodfinish/overview", s.sw_overview)
	router.GET("/sections/woodfinish/overview/loadreport", s.swo_loadreport)
	router.POST("/sections/woodfinish/overview/reportsearch", s.swo_reportsearch)
	router.POST("/sections/woodfinish/overview/reportdatefilter", s.swo_reportdatefilter)

	router.GET("/sections/woodfinish/entry", withAuth(s.sw_entry))
	router.GET("/sections/woodfinish/entry/loadform", s.swe_loadform)
	router.POST("/sections/woodfinish/entry/sendentry", s.swe_sendentry)

	router.POST("/sections/woodfinish/overview/addplanvalue", s.swo_addplanvalue)
	router.POST("/sections/woodfinish/overview/updateinventory", s.swo_updateinventory)

	router.GET("/sections/woodfinish/admin", withAuth(s.sw_admin))
	router.GET("/sections/woodfinish/admin/loadreport", s.swa_loadreport)
	router.POST("/sections/woodfinish/admin/searchreport", s.swa_searchreport)
	router.DELETE("/sections/woodfinish/admin/deletereport/:reportid", s.swa_deletereport)
	// end WoodFinish/////////////////////////////////////////////////////////////

	// White Wood ////////////////////////////////////////////////////////
	router.POST("/sections/whitewood/overview/addmoney", withAuth2(s.swo_addmoney))
	router.POST("/sections/whitewood/overview/addplanvalue", withAuth2(s.swwo_addplanvalue))
	router.POST("/sections/whitewood/overview/updateinventory", s.swwo_updateinventory)
	router.POST("/sections/whitewood/overview/addnammoney", s.swo_addnammoney)
	// end White Wood/////////////////////////////////////////////////////////////

	// Pack ////////////////////////////////////////////////////////
	router.GET("/sections/pack/overview", s.spk_overview)
	router.GET("/sections/pack/overview/loadreport", s.pko_loadreport)
	router.POST("/sections/pack/overview/reportsearch", s.pko_reportsearch)
	router.POST("/sections/pack/overview/reportdatefilter", s.pko_reportdatefilter)

	router.GET("/sections/pack/entry", withAuth(s.spk_entry))
	router.GET("/sections/pack/entry/loadform", s.spk_loadform)
	router.POST("/sections/pack/entry/sendentry", s.spk_sendentry)

	router.POST("/sections/pack/overview/updateinventory", s.spo_updateinventory)
	router.POST("/sections/pack/overview/addplanvalue", s.spo_addplanvalue)

	router.GET("/sections/pack/admin", withAuth(s.spk_admin))
	router.GET("/sections/pack/admin/loadreport", s.spka_loadreport)
	router.POST("/sections/pack/admin/searchreport", s.spka_searchreport)
	router.POST("/sections/pack/admin/reportdatefilter", s.spka_reportdatefilter)
	router.DELETE("/sections/pack/admin/deletereport/:reportid", s.spka_deletereport)
	router.GET("/sections/pack/admin/updateform/:reportid", s.spka_updateform)
	router.PUT("/sections/pack/admin/updatereport/:reportid", s.spka_updatereport)
	// end Pack/////////////////////////////////////////////////////////////

	// Panelcnc ////////////////////////////////////////////////////////
	router.GET("/sections/panelcnc/overview", s.spc_overview)
	router.GET("/sections/panelcnc/overview/loadreport", s.spco_loadreport)
	router.POST("/sections/panelcnc/overview/reportsearch", s.spco_reportsearch)
	router.POST("/sections/panelcnc/overview/reportdatefilter", s.spco_reportdatefilter)

	router.GET("/sections/panelcnc/entry", withAuth(s.spc_entry))
	router.GET("/sections/panelcnc/entry/loadform", s.spc_loadform)
	router.POST("/sections/panelcnc/entry/sendentry", s.spc_sendentry)

	router.GET("/sections/panelcnc/admin", withAuth(s.spc_admin))
	router.GET("/sections/panelcnc/admin/loadreport", s.spca_loadreport)
	router.POST("/sections/panelcnc/admin/searchreport", s.spca_searchreport)
	router.DELETE("/sections/panelcnc/admin/deletereport/:reportid", s.spca_deletereport)
	// end Panelcnc/////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////
	// Outsource ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	router.GET("/sections/outsource/entry", withAuth(s.sos_entry))
	router.GET("/sections/outsource/entry/loadform", s.sose_loadform)
	router.POST("/sections/outsource/entry/sendentry", s.sose_sendentry)
	// end Outsource

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
	// Production Value ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	router.GET("/production/overview", s.p_overview)
	router.GET("/production/overview/loadprodtype", s.po_loadprodtype)
	router.GET("/production/overview/loadsummary", s.po_loadsummary)
	router.GET("/production/overview/loadreport", s.po_loadreport)
	router.POST("/production/overview/reportfilter", s.po_reportfilter)
	// router.POST("/production/overview/reportsearch", s.po_reportsearch)
	router.POST("/production/overview/prodtypefilter", s.po_prodtypefilter)
	router.POST("/production/overview/summarydatefilter", s.po_summarydatefilter)

	// end Production Value

	////////////////////////////////////////////////////////////////////
	// Target ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	router.GET("/target/entry", withAuth(s.tg_entry))
	router.GET("/target/entry/loadsectionentry", s.tge_loadsectionentry)
	router.GET("/target/entry/loadreport", s.tge_loadreport)
	router.POST("/target/entry/settarget", s.tge_settarget)
	router.GET("/target/entry/loadplanworkdays", s.tge_loadplanworkdays)
	router.POST("/target/entry/setworkdays", s.tge_setworkdays)
	router.POST("/target/entry/search", s.tge_search)
	router.POST("/target/entry/filterbydate", s.tge_filterbydate)
	router.DELETE("/target/entry/deletereport/:id", s.tge_deletereport)

	// end Target

	////////////////////////////////////////////////////////////////////
	// Manhr ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	router.GET("/manhr/admin", withAuth(s.m_admin))
	router.GET("/manhr/admin/loadentry", s.ma_loadentry)
	router.GET("/manhr/admin/loadreport", s.ma_loadreport)
	router.POST("/manhr/admin/sendentry", s.ma_sendentry)
	router.DELETE("/manhr/admin/deletereport/:id", s.ma_deletereport)
	router.GET("/manhr/admin/updateform/:id", s.ma_updateform)
	router.PUT("/manhr/admin/updatereport/:id", s.ma_updatereport)
	router.POST("/manhr/admin/search", s.ma_search)
	router.POST("/manhr/admin/filterbydate", s.ma_filterbydate)

	router.POST("/manhr/entry/sendtotalmanhr", s.me_sendtotalmanhr)

	// end Manhr

	////////////////////////////////////////////////////////////////////
	// Downtime ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	router.GET("/downtime/entry", withAuth(s.dt_entry))
	router.GET("/downtime/entry/loadform", s.dte_loadform)
	router.POST("/downtime/entry/sendentry", s.dte_sendentry)
	// end Downtime

	////////////////////////////////////////////////////////////////////
	// Mixing Color ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////

	router.POST("/mixingcolor/getusingstart", s.getusingstart)
	router.GET("/mixingcolor/loaddeliveryentry", s.loaddeliveryentry)
	router.POST("/mixingcolor/senddeliveryentry", s.senddeliveryentry)
	router.GET("/mixingcolor/batchentry", s.mc_batchentry)
	router.GET("/mixingcolor/entry/loadbatchform", s.mce_loadbatchform)
	router.POST("/mixingcolor/entry/sendbatchentry", s.mce_sendbatchentry)

	router.POST("/mixingcolor/mixingfilter", s.mixingfilter)

	router.POST("/mixingcolor/mixingreports/:batchno", s.mixingreports)
	router.GET("/mixingcolor/deletereports", s.deletereport)

	router.GET("/mixingcolor/addcolorform", s.addcolorform)
	router.PUT("/mixingcolor/addcolor", s.addcolor)
	router.POST("/mixingcolor/colorsearch", s.colorsearch)
	router.POST("/mixingcolor/colorfilter", s.colorfilter)

	router.GET("/mixingcolor/usingentry", s.mc_usingreports)
	router.GET("/mixingcolor/entry/loadusingform", s.mc_loadusingform)
	router.GET("/mixingcolor/entry/getupdateform", s.mc_getupdateform)
	router.POST("/mixingcolor/entry/updateusingtime", s.mc_updateusingtime)
	router.POST("/mixingcolor/entry/updateusingitem", s.mc_updateusingitem)
	router.POST("/mixingcolor/entry/searchcolorcode", s.mce_searchcolorcode)
	router.POST("/mixingcolor/entry/createfastbatch", s.mce_createfastbatch)

	router.GET("/mixingcolor/colorentry", s.mc_colorentry)
	router.GET("/mixingcolor/entry/loadcolorform", s.mc_loadcolorform)
	// end Mixing Color

	////////////////////////////////////////////////////////////////////
	// Color Mixing ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	router.GET("/colormixing/overview", s.c_overview)
	router.GET("/colormixing/overview/changedisplay/:type", s.co_changedisplay)
	router.POST("/colormixing/overview/searchbatch", s.co_searchbatch)
	router.POST("/colormixing/overview/filterbatch", s.co_filterbatch)
	router.POST("/colormixing/overview/batchitems/:batchno", s.co_batchitems)
	router.POST("/colormixing/overview/searchcolor", s.co_searchcolor)
	router.POST("/colormixing/overview/filtercolor", s.co_filtercolor)
	router.POST("/colormixing/overview/createstandard", s.co_createstandard)
	router.DELETE("/colormixing/overview/deletestandard/:name", s.co_deletestandard)

	router.GET("/colormixing/admin", withAuth(s.c_admin))
	router.GET("/colormixing/admin/loadbatchentry", s.ca_loadbatchentry)
	router.POST("/colormixing/admin/sendbatchentry", s.ca_sendmixingentry)
	router.GET("/colormixing/admin/loadpanelentry", s.ca_loadpanelentry)
	router.POST("/colormixing/admin/sendpanelentry", s.ca_sendpanelentry)
	router.DELETE("/colormixing/admin/deletepanel/:id", s.ca_deletepanel)
	router.GET("/colormixing/admin/panelupdateform/:id", s.ca_panelupdateform)
	router.PUT("/colormixing/admin/updatepanel/:id", s.ca_updatepanel)
	router.GET("/colormixing/admin/loadusingtimeform", s.ca_loadusingtimeform)
	router.GET("/colormixing/admin/loadinspectionform", s.ca_loadinspectionform)
	router.POST("/colormixing/admin/addinspection", s.ca_addinspection)
	router.GET("/colormixing/admin/loadmixingbatch", s.ca_loadmixingbatch)
	router.POST("/colormixing/admin/searchbatch", s.ca_searchbatch)
	router.GET("/colormixing/admin/loadcolorpanel", s.ca_loadcolorpanel)
	router.POST("/colormixing/admin/searchpanel", s.ca_searchpanel)
	router.DELETE("/colormixing/admin/deletemixing/:batchno", s.ca_deletemixing)
	router.GET("/colormixing/admin/batchupdateform/:batchno", s.ca_batchupdateform)
	router.PUT("/colormixing/admin/updatebatch/:batchno", s.ca_updatebatch)
	router.GET("/colormixing/admin/loadauditentry", s.ca_loadauditentry)
	router.POST("/colormixing/admin/failaudit/:id", s.ca_failaudit)
	router.POST("/colormixing/admin/passaudit/:id", s.ca_passaduti)
	// end Color Mixing

	////////////////////////////////////////////////////////////////////
	// Quality ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	router.GET("/quality/fastentry", withAuth(s.q_fastentry))
	router.GET("/quality/entry/loadform", s.q_loadform)
	router.POST("/quality/entry/sendentry", s.q_sendentry)
	// end Quality

	////////////////////////////////////////////////////////////////////
	// GNHH ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	router.GET("/gnhh/overview", s.g_overview)
	router.GET("/gnhh/overview/loadchart", s.go_loadchart)
	router.GET("/gnhh/overview/loadproducttree", s.go_loadproducttree)
	router.GET("/gnhh/overview/loadtimeline", s.go_loadtimeline)
	router.GET("/gnhh/overview/loaddetail", s.go_loaddetail)
	router.POST("/gnhh/overview/updatetimeline", s.go_updatetimeline)
	router.POST("/gnhh/overview/searchtimeline", s.go_searchtimeline)
	router.GET("/gnhh/overview/loadtree", s.go_loadtree)
	router.POST("/gnhh/overview/getproductcodes", s.go_getproductcodes)
	router.POST("/gnhh/overview/mofilter", s.go_mofilter)
	router.POST("/gnhh/overview/productfilter", s.go_productfilter)
	router.POST("/gnhh/overview/searchdetail", s.go_searchdetail)

	router.GET("/gnhh/entry/import", s.ge_import)
	router.POST("/gnhh/entry/importdata", s.ge_importdata)
	// end GNHH

	////////////////////////////////////////////////////////////////////
	// Safety ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	router.GET("/safety/entry", s.s_entry)
	router.POST("/safety/sendentry", s.s_sendentry)
	// end Safety

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
	// router.POST("/item/admin/additem", s.i_additem)
	router.POST("/item/admin/addpart", s.i_addpart)
	// end item --------------------------------------------------------

	router.GET("/test", s.handleGetTest)

	router.GET("/test/loadmain", s.testload)

	return router
}
