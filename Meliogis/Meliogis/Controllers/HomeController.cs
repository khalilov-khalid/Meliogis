﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Meliogis.CopyModel;
using Meliogis.GetFilterClass;
using Meliogis.GetFilterResultClass;
using Meliogis.GetJsonModel;
using Meliogis.Models;
using Meliogis.ViewModels;

using DeltaProtocol;
using Protocol;




namespace Meliogis.Controllers
{
    [UserAuthenticationController]
    public class HomeController : Controller
    {
        MelorEntities db = new MelorEntities();
        //System.IntPtr hDMTDll;

        //delegate void DelegateClose(int conn_num);

        public ActionResult ArtRealData()
        {
            Plc dvpPLC = new Plc("5.191.38.48", 502);

            dvpPLC.Open();
            int[] isig = (int[])dvpPLC.Read("D82", VarType.DInt, 5);
            int[] su = (int[])dvpPLC.Read("D408", VarType.DInt, 5);
            dvpPLC.Close();
            ArtezianRealData data = new ArtezianRealData()
            {
                light = isig,
                water = su
            };
            //string strReq = "";
            //string strRes = "";


            //DelegateClose CloseModbus = new DelegateClose(CloseSerial);


            return Json(data, JsonRequestBehavior.AllowGet);

        }



        public ActionResult Index()
        {
            IndexViewModel vm = new IndexViewModel();
            vm._regions = db.REGIONS.Where(s => s.REGION_TYPE_ID == 1).Select(s => new CopyREGIONS()
            {
                OBJECTID=s.OBJECTID,
                NAME=s.Adi,
                REL_ID = (int)s.REL_ID,
                REGION_TYPE_ID = (int)s.REGION_TYPE_ID
            }).ToList();
            vm._covertypes = db.COVER_TYPES.ToList();
            vm._tehnicals = db.TECHNICAL_TYPE.ToList();
            vm._property = db.PROPERTies.ToList();
            vm._propertytypes = db.PROPERTY_TYPE.ToList();
            vm._activity = db.ACTIVITies.ToList();
            vm._kind = db.KINDs.ToList();
            vm._pumkind = db.PUMP_KIND.ToList();
            vm._pumtype = db.PUMP_TYPE.ToList();
            vm._brads = db.BRAND_OF_AGGREGATE.ToList();
            vm._materials = db.PIPELINE_MATERIAL.ToList();
            vm._assigment = db.ASSIGMENTs.ToList();
            vm._security = db.SECURITY_TYPE.ToList();
            vm._networktype = db.NETWORK_TYPE.ToList();
            vm._welltype = db.WELL_TYPE.ToList();
            vm._channeltype = db.CHANNEL_TYPES.ToList();
            //vm._sibs = db.SIBS.ToList();
            return View(vm);
        }

        public ActionResult GetVilliage(List<int> _regions)
        {
            List<CopyREGIONS> _sendingRegion = new List<CopyREGIONS>();
            if (_regions.Contains(0))
            {
                _sendingRegion = db.VILLAGEs.Select(s => new CopyREGIONS() {
                    OBJECTID=s.OBJECTID,
                    NAME=s.NAME +" ("+ db.REGIONS.Where(w=>w.OBJECTID==s.REL_ID).FirstOrDefault().Adi+")",
                    REL_ID=(int)s.REL_ID,
                    REGION_TYPE_ID=(int)s.REGION_TYPE_ID
                }).ToList();
            }
            else
            {
                _sendingRegion = db.VILLAGEs.Where(s => _regions.Contains((int)s.REL_ID)).Select(s => new CopyREGIONS()
                {
                    OBJECTID = s.OBJECTID,
                    NAME = s.NAME + " (" + db.REGIONS.Where(w => w.OBJECTID == s.REL_ID).FirstOrDefault().Adi + ")",
                    REL_ID = (int)s.REL_ID,
                    REGION_TYPE_ID = (int)s.REGION_TYPE_ID
                }).ToList();
            }

            return Json(_sendingRegion, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetSibs(List<int> _propery)
        {
            List<copySIBS> _sendingsibs = new List<copySIBS>();
            if (_propery.Contains(0))
            {
                _sendingsibs = db.SIBS.Select(s => new copySIBS()
                {
                    OBJECTID = s.OBJECTID,
                    NAME = s.NAME + " (" + db.PROPERTies.Where(w => w.OBJECTID == s.SSI_ID).FirstOrDefault().NAME + ")",
                }).ToList();
            }
            else
            {
                _sendingsibs = db.SIBS.Where(s => _propery.Contains((int)s.SSI_ID)).Select(s => new copySIBS()
                {
                    OBJECTID = s.OBJECTID,
                    NAME = s.NAME + " (" + db.PROPERTies.Where(w => w.OBJECTID == s.SSI_ID).FirstOrDefault().NAME + ")",
                }).ToList();
            }

            return Json(_sendingsibs, JsonRequestBehavior.AllowGet);
        }




        public ActionResult DetalsFilter(List<int> list,int? page, string dataname)
        {
            var pageNumber = page ?? 0;
            int skippage = (pageNumber * 10);
            List<int> currentlist = list.Skip(skippage).Take(10).ToList();
            string querylist = "";
            ViewBag.CP = page + 1;
            ViewBag.PC = Math.Ceiling(Decimal.Divide(list.Count(),10));

            for (int i = 0; i < currentlist.Count; i++)
            {
                querylist += currentlist[i] + ",";
            }
            querylist = querylist.Remove(querylist.Length - 1);

            if (dataname== "ACH" || dataname== "ACHM" || dataname == "ACHI" || dataname== "ACHII"|| dataname== "ACHIII" || dataname == "QCH" || dataname == "QCHM" || dataname == "QCHI" || dataname == "QCHII" || dataname == "QCHIII")
            {          
                string query = "select * from CHANNELS where OBJECTID in (" + querylist + ")";

                List<ChannelsModel> channellist = db.Database.SqlQuery<CHANNEL>(query).Select(s => new ChannelsModel()
                {
                    OBJECTID = s.OBJECTID,
                    NAME = (s.NAME == null) ? "" : s.NAME.ToString(),
                    WATER_CAPABILITY = (s.WATER_CAPABILITY == null) ? "" : s.WATER_CAPABILITY.ToString(),
                    WATERPROOF_WIDTH = (s.WATERPROOF_WIDTH == null) ? "" : s.WATERPROOF_WIDTH.ToString(),
                    DEVICE_SUM = (s.DEVICE_SUM == null) ? "" : s.DEVICE_SUM.ToString(),
                    FACTICAL_LENGTH = (s.FACTICAL_LENGTH == null) ? "" : s.FACTICAL_LENGTH.ToString(),
                    GIS_LENGTH = (s.GIS_LENGTH == null) ? "" : s.GIS_LENGTH.ToString(),
                    NOTE = (s.NOTE == null) ? "" : s.NOTE.ToString(),
                    SERVED_AREAHA = (s.SERVED_AREAHA == null) ? "" : s.SERVED_AREAHA.ToString(),
                    SHAPE_STLength__ = (s.SHAPE_STLength__ == null) ? "" : s.SHAPE_STLength__.ToString(),
                    TYPE_NAME = (s.TYPE_ID == null) ? "" : db.CHANNEL_TYPES.Where(w => w.OBJECTID == s.TYPE_ID).FirstOrDefault().NAME,
                    ASSIGMENT_NAME = (s.ASSIGMENT_ID == null) ? "" : db.ASSIGMENTs.Where(w => w.OBJECTID == s.ASSIGMENT_ID).FirstOrDefault().NAME,
                    ACTIVITY_NAME = (s.ACTIVITY_ID == null) ? "" : db.ACTIVITies.Where(w => w.OBJECTID == s.ACTIVITY_ID).FirstOrDefault().NAME,
                    PROPERTY_TYPE_NAME = (s.PROPERTY_TYPE_ID == null) ? "" : db.PROPERTY_TYPE.Where(w => w.OBJECTID == s.PROPERTY_TYPE_ID).FirstOrDefault().NAME,
                    TECHNICAL_NAME = (s.TECHNICAL_ID == null) ? "" : db.TECHNICAL_TYPE.Where(w => w.OBJECTID == s.TECHNICAL_ID).FirstOrDefault().NAME,
                    SERVED_REGION_NAME = (s.SERVED_REGION_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.SERVED_REGION_ID).FirstOrDefault().Adi,
                    KIND_NAME = (s.KIND_ID == null) ? "" : db.KINDs.Where(w => w.OBJECTID == s.KIND_ID).FirstOrDefault().NAME,
                    COVER_TYPE_NAME = (s.COVER_TYPE_ID == null) ? "" : db.COVER_TYPES.Where(w => w.OBJECTID == s.COVER_TYPE_ID).FirstOrDefault().NAME,
                    REGIONS_NAME = (s.REGIONS_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.REGIONS_ID).FirstOrDefault().Adi,
                    VILLAGE_NAME = (s.VILLAGE_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.VILLAGE_ID).FirstOrDefault().Adi,
                    SOURCE_NAME = (s.SOURCE_ID == null) ? "" : (db.CHANNELS.Where(w => w.OBJECTID == s.SOURCE_ID).FirstOrDefault()==null)? "": db.CHANNELS.Where(w => w.OBJECTID == s.SOURCE_ID).FirstOrDefault().NAME,
                    SSI_NAME = (s.SSI_ID == null) ? "" : db.PROPERTies.Where(w => w.OBJECTID == s.SSI_ID).FirstOrDefault().NAME,
                    EXPLONATION_DATE = (s.EXPLONATION_DATE == null) ? "" : s.EXPLONATION_DATE.ToString(),
                    DataName = dataname
                }).ToList();
                return PartialView("CHANNELPARTIAL", channellist);
            }
            if (dataname == "DR" || dataname == "MDR" || dataname == "KDR" || dataname == "IDR" || dataname == "IIDR")
            {
                string query = "select * from DRENAJ where OBJECTID in (" + querylist + ")";

                List<DRENAJMODEL> drenajlist = db.Database.SqlQuery<DRENAJ>(query).Select(s => new DRENAJMODEL()
                {
                    OBJECTID = s.OBJECTID,
                    WATERPROOF_WIDTH = (s.WATERPROOF_WIDTH == null) ? "" : s.WATERPROOF_WIDTH.ToString(),
                    SERVED_AREA = (s.SERVED_AREA == null) ? "" : s.SERVED_AREA.ToString(),
                    DEVICE_SUM = (s.DEVICE_SUM == null) ? "" : s.DEVICE_SUM.ToString(),
                    WATER_CAPABILITY = (s.WATER_CAPABILITY == null) ? "" : s.WATER_CAPABILITY.ToString(),
                    FACTICAL_LENGTH = (s.FACTICAL_LENGTH == null) ? "" : s.FACTICAL_LENGTH.ToString(),
                    NAME = (s.NAME == null) ? "" : s.NAME.ToString(),
                    WATER_CONSUPTION= (s.WATER_CONSUPTION == null) ? "" : s.WATER_CONSUPTION.ToString(),
                    GISLENGTH = (s.GISLENGTH == null) ? "" : s.GISLENGTH.ToString(),
                    NOTE = (s.NOTE == null) ? "" : s.NOTE.ToString(),
                    KIND_NAME = (s.KIND_ID == null) ? "" : db.KINDs.Where(w => w.OBJECTID == s.KIND_ID).FirstOrDefault().NAME,
                    CHANNEL_TYPE_NAME = (s.CHANNEL_TYPE_ID == null) ? "" : db.CHANNEL_TYPES.Where(w => w.OBJECTID == s.CHANNEL_TYPE_ID).FirstOrDefault().NAME,
                    REGIONS_NAME = (s.REGIONS_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.REGIONS_ID).FirstOrDefault().Adi,
                    TECHNICAL_CONDINITION_NAME = (s.TECHNICAL_CONDINITION_ID == null) ? "" : db.TECHNICAL_TYPE.Where(w => w.OBJECTID == s.TECHNICAL_CONDINITION_ID).FirstOrDefault().NAME,
                    PROPERTY_TYPE_NAME = (s.PROPERTY_TYPE_ID == null) ? "" : db.PROPERTY_TYPE.Where(w => w.OBJECTID == s.PROPERTY_TYPE_ID).FirstOrDefault().NAME,
                    ACTIVITY_NAME = (s.ACTIVITY_ID == null) ? "" : db.ACTIVITies.Where(w => w.OBJECTID == s.ACTIVITY_ID).FirstOrDefault().NAME,
                    ASSIGMENT_NAME = (s.ASSIGMENT_ID == null) ? "" : db.ASSIGMENTs.Where(w => w.OBJECTID == s.ASSIGMENT_ID).FirstOrDefault().NAME,
                    RECIVER_NAME =(s.RECIVER_ID==null)? "" : db.DRENAJs.Where(w=>w.OBJECTID==s.RECIVER_ID).FirstOrDefault().NAME,
                    VILLAGE_NAME = (s.VILLAGE_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.VILLAGE_ID).FirstOrDefault().Adi,
                    SSI_NAME = (s.SSI_ID == null) ? "" : db.PROPERTies.Where(w => w.OBJECTID == s.SSI_ID).FirstOrDefault().NAME,
                    EXPLONATION_DATE = (s.EXPLONATION_DATE == null) ? "" : s.EXPLONATION_DATE.ToString(),
                    DataName = dataname
                }).ToList();
                return PartialView("DRENAJPARTIAL", drenajlist);
            }
            if (dataname== "DEV")
            {                
                string query = "select * from DEVICE where OBJECTID in (" + querylist + ")";
                List<DEVICEMODEL> devicelist = db.Database.SqlQuery<DEVICE>(query).Select(s => new DEVICEMODEL()
                {
                    OBJECTID = s.OBJECTID,
                    NAME = (s.NAME == null) ? "" : s.NAME.ToString(),
                    NOTE = (s.NOTE == null) ? "" : s.NOTE.ToString(),
                    ACTIVITY_NAME = (s.ACTIVITY_ID == null) ? "" : db.ACTIVITies.Where(w => w.OBJECTID == s.ACTIVITY_ID).FirstOrDefault().NAME,
                    PROPERTY_TYPE_NAME = (s.PROPERTY_TYPE_ID == null) ? "" : db.PROPERTY_TYPE.Where(w => w.OBJECTID == s.PROPERTY_TYPE_ID).FirstOrDefault().NAME,
                    SSI_NAME = (s.SSI_ID == null) ? "" : db.PROPERTies.Where(w => w.OBJECTID == s.SSI_ID).FirstOrDefault().NAME,
                    TECHNICAL_TYPE_NAME = (s.TECHNICAL_TYPE_ID == null) ? "" : db.TECHNICAL_TYPE.Where(w => w.OBJECTID == s.TECHNICAL_TYPE_ID).FirstOrDefault().NAME,
                    SECURITY_TYPE_NAME = (s.SECURITY_TYPE_ID == null) ? "" : db.SECURITY_TYPE.Where(w => w.OBJECTID == s.SECURITY_TYPE_ID).FirstOrDefault().NAME,
                    REGIONS_NAME = (s.REGIONS_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.REGIONS_ID).FirstOrDefault().Adi,
                    VILLAGE_NAME = (s.VILLAGE_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.VILLAGE_ID).FirstOrDefault().Adi,
                    SIBS_NAME = (s.SIBS_ID == null) ? "" : db.SIBS.Where(w => w.OBJECTID == s.SIBS_ID).FirstOrDefault().NAME,
                    EXPLONATION_DATE = (s.EXPLONATION_DATE == null) ? "" : s.EXPLONATION_DATE.ToString(),
                    NETWORK_TYPE_NAME = (s.NETWORK_TYPE_ID == null) ? "" : db.NETWORK_TYPE.Where(w => w.OBJECTID == s.NETWORK_TYPE_ID).FirstOrDefault().NAME,
                    WATER_CAPABILITY = (s.WATER_CAPABILITY == null) ? "" : s.WATER_CAPABILITY.ToString(),
                    SERVED_AREA = (s.SERVED_AREA == null) ? "" : s.SERVED_AREA.ToString(),
                    CHANNEL_NAME = (s.CHANNEL_ID == null) ? "" : db.CHANNELS.Where(w => w.OBJECTID == s.CHANNEL_ID).FirstOrDefault().NAME,
                    DataName = dataname
                }).ToList();
                return PartialView("DEVICEPARTIAL", devicelist);
            }
            if (dataname=="ART")
            {
                string query = "select * from ARTEZIAN_WELL where OBJECTID in (" + querylist + ")";
                List<ATEZIANWELLMODEL> artezianlist = db.Database.SqlQuery<ARTEZIAN_WELL>(query).Select(s => new ATEZIANWELLMODEL()
                {
                    OBJECTID = s.OBJECTID,
                    REPER_NO= (s.REPER_NO == null) ? "" : s.REPER_NO.ToString(),
                    IRRIGATED_AREA= (s.IRRIGATED_AREA == null) ? "" : s.IRRIGATED_AREA.ToString(),
                    DEPTH= (s.DEPTH == null) ? "" : s.DEPTH.ToString(),
                    WATER_CAPABILITY = (s.WATER_CAPABILITY == null) ? "" : s.WATER_CAPABILITY.ToString(),
                    PRODUCTIVITY= (s.PRODUCTIVITY == null) ? "" : s.PRODUCTIVITY.ToString(),
                    WELL_TYPE_NAME= (s.WELL_TYPE_ID == null) ? "" : db.WELL_TYPE.Where(w => w.OBJECTID == s.WELL_TYPE_ID).FirstOrDefault().NAME,
                    ASSIGMENT_NAME= (s.ASSIGMENT_ID == null) ? "" : db.ASSIGMENTs.Where(w => w.OBJECTID == s.ASSIGMENT_ID).FirstOrDefault().NAME,
                    ACTIVITY_NAME = (s.ACTIVITY_ID == null) ? "" : db.ACTIVITies.Where(w => w.OBJECTID == s.ACTIVITY_ID).FirstOrDefault().NAME,
                    PROPERTY_TYPE_NAME = (s.PROPERTY_TYPE_ID == null) ? "" : db.PROPERTY_TYPE.Where(w => w.OBJECTID == s.PROPERTY_TYPE_ID).FirstOrDefault().NAME,
                    PUMPSTATION_BRAND_NAME= (s.PUMPSTATION_BRAND_ID == null) ? "" : db.PUMPSTATION_BRAND.Where(w => w.OBJECTID == s.PUMPSTATION_BRAND_ID).FirstOrDefault().NAME,
                    VILLAGE_NAME = (s.VILLAGE_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.VILLAGE_ID).FirstOrDefault().Adi,
                    SSI_NAME = (s.SSI_ID == null) ? "" : db.PROPERTies.Where(w => w.OBJECTID == s.SSI_ID).FirstOrDefault().NAME,
                    REGIONS_NAME = (s.REGIONS_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.REGIONS_ID).FirstOrDefault().Adi,
                    EXPLONATION_DATE = (s.EXPLONATION_DATE == null) ? "" : s.EXPLONATION_DATE.ToString(),
                    SIB_NAME = (s.SIB_ID == null) ? "" : db.SIBS.Where(w => w.OBJECTID == s.SIB_ID).FirstOrDefault().NAME,
                    DataName = dataname
                }).ToList();
                return PartialView("ARTEZIANWELLPARTIAL", artezianlist);
            }
            if (dataname == "WLL")
            {
                string query = "select * from WELL where OBJECTID in (" + querylist + ")";
                List<WELLMODEL> welllist = db.Database.SqlQuery<WELL>(query).Select(s => new WELLMODEL()
                {
                    OBJECTID = s.OBJECTID,
                    NAME = (s.NAME == null) ? "" : s.NAME.ToString(),
                    NUMBER_ = (s.NUMBER_ == null) ? "" : s.NUMBER_.ToString(),
                    PRODUCTIVITY = (s.PRODUCTIVITY == null) ? "" : s.PRODUCTIVITY.ToString(),
                    NOTE = (s.NOTE == null) ? "" : s.NOTE.ToString(),
                    WELL_TYPE_NAME = (s.WELL_TYPE_ID == null) ? "" : db.WELL_TYPE.Where(w => w.OBJECTID == s.WELL_TYPE_ID).FirstOrDefault().NAME,
                    ASSIGMENT_NAME = (s.ASSIGMENT_ID == null) ? "" : db.ASSIGMENTs.Where(w => w.OBJECTID == s.ASSIGMENT_ID).FirstOrDefault().NAME,
                    SIBS_NAME = "",//(s.SIBS_ID == null) ? "" : db.SIBS.Where(w => w.OBJECTID == s.SIBS_ID).FirstOrDefault().NAME,
                    ACTIVITY_NAME = (s.ACTIVITY_ID == null) ? "" : db.ACTIVITies.Where(w => w.OBJECTID == s.ACTIVITY_ID).FirstOrDefault().NAME,
                    TECHNICAL_TYPE_NAME = (s.TECHNICAL_TYPE_ID == null) ? "" : db.TECHNICAL_TYPE.Where(w => w.OBJECTID == s.TECHNICAL_TYPE_ID).FirstOrDefault().NAME,
                    SSI_NAME = (s.SSI_ID == null) ? "" : db.PROPERTies.Where(w => w.OBJECTID == s.SSI_ID).FirstOrDefault().NAME,
                    PROPERTY_TYPE_NAME = (s.PROPERTY_TYPE_ID == null) ? "" : db.PROPERTY_TYPE.Where(w => w.OBJECTID == s.PROPERTY_TYPE_ID).FirstOrDefault().NAME,
                    REGIONS_NAME = (s.REGIONS_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.REGIONS_ID).FirstOrDefault().Adi,
                    VILLAGE_NAME = (s.VILLAGE_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.VILLAGE_ID).FirstOrDefault().Adi,
                    DEPTH = (s.DEPTH == null) ? "" : s.DEPTH.ToString(),
                    EXPLONATION_DATE = (s.EXPLONATION_DATE == null) ? "" : s.EXPLONATION_DATE.ToString(),
                    IRRIGATED_AREA = (s.IRRIGATED_AREA == null) ? "" : s.IRRIGATED_AREA.ToString(),
                    SECURITY_TYPE_ID = (s.SECURITY_TYPE_ID == null) ? "" : db.SECURITY_TYPE.Where(w => w.OBJECTID == s.SECURITY_TYPE_ID).FirstOrDefault().NAME,
                    DataName = dataname
                }).ToList();
                return PartialView("WELLPARTIAL", welllist);
            }
            if (dataname=="PMB")
            {
                string query = "select * from PUMPSTATION where OBJECTID in (" + querylist + ")";
                List<PUMBSTATIONMODEL> pumblist = db.Database.SqlQuery<PUMPSTATION>(query).Select(s => new PUMBSTATIONMODEL()
                {
                    OBJECTID = s.OBJECTID,
                    POWER = (s.POWER == null) ? "" : s.POWER.ToString(),
                    PRODUCTIVITY = (s.PRODUCTIVITY == null) ? "" : s.PRODUCTIVITY.ToString(),
                    PURPOSEFUL=(s.PURPOSEFUL == null) ? "" : s.PURPOSEFUL.ToString(),
                    NAME = (s.NAME == null) ? "" : s.NAME.ToString(),
                    PIPELINE = (s.PIPELINE == null) ? "" : s.PIPELINE.ToString(),
                    PIPELINE_LENGHT = (s.PIPELINE_LENGHT == null) ? "" : s.PIPELINE_LENGHT.ToString(),
                    ENGINE_INSTALL_DATE=(s.ENGINE_INSTALL_DATE == null) ? "" : s.ENGINE_INSTALL_DATE.ToString(),
                    NOTE = (s.NOTE == null) ? "" : s.NOTE.ToString(),
                    VILLAGE_NAME = (s.VILLAGE_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.VILLAGE_ID).FirstOrDefault().Adi,
                    PLACED_SOURCE_NAME= (s.PLACED_SOURCE_ID == null) ? "" : db.PLACED_SOURCE.Where(w => w.OBJECTID == s.PLACED_SOURCE_ID).FirstOrDefault().NAME,
                    PUMP_KIND_NAME= (s.PUMP_KIND_ID == null) ? "" : db.PUMP_KIND.Where(w => w.OBJECTID == s.PUMP_KIND_ID).FirstOrDefault().NAME,
                    PUMP_TYPE_NAME= (s.PUMP_TYPE_ID == null) ? "" : db.PUMP_TYPE.Where(w => w.OBJECTID == s.PUMP_TYPE_ID).FirstOrDefault().NAME,
                    BRAND_OF_AGGREGATE_NAME= (s.BRAND_OF_AGGREGATE_ID == null) ? "" : db.BRAND_OF_AGGREGATE.Where(w => w.OBJECTID == s.BRAND_OF_AGGREGATE_ID).FirstOrDefault().NAME,
                    PIPELINE_DIAMETER_NAME= (s.PIPELINE_DIAMETER_ID == null) ? "" : s.PIPELINE_DIAMETER_ID.ToString(),
                    PIPELINE_MATERIAL_NAME= (s.PIPELINE_MATERIAL_ID == null) ? "" : db.PIPELINE_MATERIAL.Where(w => w.OBJECTID == s.PIPELINE_MATERIAL_ID).FirstOrDefault().NAME,
                    ENGINE_BRAND_NAME= (s.ENGINE_BRAND_ID == null) ? "" : db.ENGINE_BRAND.Where(w => w.OBJECTID == s.ENGINE_BRAND_ID).FirstOrDefault().NAME,
                    ENGINE_KIND_NAME= (s.ENGINE_KIND_ID == null) ? "" : db.ENGINE_KIND.Where(w => w.OBJECTID == s.ENGINE_KIND_ID).FirstOrDefault().NAME,
                    SSI_NAME = (s.SSI_ID == null) ? "" : db.PROPERTies.Where(w => w.OBJECTID == s.SSI_ID).FirstOrDefault().NAME,
                    PROPERTY_TYPE_NAME = (s.PROPERTY_TYPE_ID == null) ? "" : db.PROPERTY_TYPE.Where(w => w.OBJECTID == s.PROPERTY_TYPE_ID).FirstOrDefault().NAME,
                    ASSIGMENT_NAME = (s.ASSIGMENT_ID == null) ? "" : db.ASSIGMENTs.Where(w => w.OBJECTID == s.ASSIGMENT_ID).FirstOrDefault().NAME,
                    REGIONS_NAME = (s.REGIONS_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.REGIONS_ID).FirstOrDefault().Adi,
                    SIBS_NAME = "",//(s.SIBS_ID == null) ? "" : db.SIBS.Where(w => w.OBJECTID == s.SIBS_ID).FirstOrDefault().NAME,
                    EXPLONATION_DATE = (s.EXPLONATION_DATE == null) ? "" : s.EXPLONATION_DATE.ToString(),
                    SERVED_AREA = (s.SERVED_AREA == null) ? "" : s.SERVED_AREA.ToString(),
                    AGREGAT_SUM = (s.AGREGAT_SUM == null) ? "" : s.AGREGAT_SUM.ToString(),
                    DataName = dataname
                }).ToList();
                return PartialView("PUMSTATIONPARTIAL", pumblist);
            }
            if (dataname== "WTP")
            {
                string query = "select * from WINTERPASTURES where OBJECTID in (" + querylist + ")";
                List<WINTERPASTURESMODEL> winterlist = db.Database.SqlQuery<WINTERPASTURE>(query).Select(s => new WINTERPASTURESMODEL()
                {
                    OBJECTID = s.OBJECTID,
                    NAME = (s.NAME == null) ? "" : s.NAME.ToString(),
                    DEVICE_SUM = (s.DEVICE_SUM == null) ? "" : s.DEVICE_SUM.ToString(),
                    WATER_PIPE = (s.WATER_PIPE == null) ? "" : s.WATER_PIPE.ToString(),
                    SSI_NAME = (s.SSI_ID == null) ? "" : db.PROPERTies.Where(w => w.OBJECTID == s.SSI_ID).FirstOrDefault().NAME,
                    PROPERTY_TYPE_NAME = (s.PROPERTY_TYPE_ID == null) ? "" : db.PROPERTY_TYPE.Where(w => w.OBJECTID == s.PROPERTY_TYPE_ID).FirstOrDefault().NAME,
                    REGIONS_NAME = (s.REGIONS_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.REGIONS_ID).FirstOrDefault().Adi,
                    SIBS_NAME = "",//(s.SIBS_ID == null) ? "" : db.SIBS.Where(w => w.OBJECTID == s.SIBS_ID).FirstOrDefault().NAME,
                    SERVED_AREA = (s.SERVED_AREA == null) ? "" : s.SERVED_AREA.ToString(),
                    VILLAGE_NAME = (s.VILLAGE_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.VILLAGE_ID).FirstOrDefault().Adi,
                    DataName = dataname
                }).ToList();
                return PartialView("WINTERPASTUREPARTIAL", winterlist);
            }
            if (dataname== "RVB")
            {
                string query = "select * from RIVERBAND where OBJECTID in (" + querylist + ")";
                List<RIVERBANDMODEL> riverbandlist = db.Database.SqlQuery<RIVERBAND>(query).Select(s => new RIVERBANDMODEL()
                {
                    OBJECTID = s.OBJECTID,
                    NAME = (s.NAME == null) ? "" : s.NAME.ToString(),
                    HEIGHT = (s.HEIGHT == null) ? "" : s.HEIGHT.ToString(),
                    LENGTH = (s.LENGTH == null) ? "" : s.LENGTH.ToString(),
                    NOTE = (s.NOTE == null) ? "" : s.NOTE.ToString(),
                    VILLAGE_NAME = (s.VILLAGE_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.VILLAGE_ID).FirstOrDefault().Adi,
                    COVER_TYPE_NAME = (s.COVER_TYPE_ID == null) ? "" : db.COVER_TYPES.Where(w => w.OBJECTID == s.COVER_TYPE_ID).FirstOrDefault().NAME,
                    TECHNICAL_TYPE_NAME = (s.TECHNICAL_TYPE_ID == null) ? "" : db.TECHNICAL_TYPE.Where(w => w.OBJECTID == s.TECHNICAL_TYPE_ID).FirstOrDefault().NAME,
                    PROPERTY_TYPE_NAME = (s.PROPERTY_TYPE_ID == null) ? "" : db.PROPERTY_TYPE.Where(w => w.OBJECTID == s.PROPERTY_TYPE_ID).FirstOrDefault().NAME,
                    SSI_NAME = (s.SSI_ID == null) ? "" : db.PROPERTies.Where(w => w.OBJECTID == s.SSI_ID).FirstOrDefault().NAME,
                    ASSIGMENT_NAME = (s.ASSIGMENT_ID == null) ? "" : db.ASSIGMENTs.Where(w => w.OBJECTID == s.ASSIGMENT_ID).FirstOrDefault().NAME,
                    PLACED_SOURCE_NAME = (s.PLACED_SOURCE_ID == null) ? "" : db.PLACED_SOURCE.Where(w => w.OBJECTID == s.PLACED_SOURCE_ID).FirstOrDefault().NAME,
                    REGIONS_NAME = (s.REGIONS_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.REGIONS_ID).FirstOrDefault().Adi,
                    SIBS_NAME = "",//(s.SIBS_ID == null) ? "" : db.SIBS.Where(w => w.OBJECTID == s.SIBS_ID).FirstOrDefault().NAME,
                    EXPLONATION_DATE = (s.EXPLONATION_DATE == null) ? "" : s.EXPLONATION_DATE.ToString(),
                    SECURITY_TYPE_NAME = (s.SECURITY_TYPE_ID == null) ? "" : db.SECURITY_TYPE.Where(w => w.OBJECTID == s.SECURITY_TYPE_ID).FirstOrDefault().NAME,
                    DataName = dataname
                }).ToList();
                return PartialView("RIVERBANDPARTIAL", riverbandlist);
            }
            if (dataname== "BLD")
            {
                string query = "select * from BUILDINGS where OBJECTID in (" + querylist + ")";
                List<BUlDINGMODEL> building = db.Database.SqlQuery<BUILDING>(query).Select(s => new BUlDINGMODEL()
                {
                    OBJECTID = s.OBJECTID,
                    NAME = (s.NAME == null) ? "" : s.NAME.ToString(),
                    ACTION = (s.ACTION == null) ? "" : s.ACTION.ToString(),
                    PROTECTING = (s.PROTECTING == null) ? "" : s.PROTECTING.ToString(),
                    TOTAL_AREA = (s.TOTAL_AREA == null) ? "" : s.TOTAL_AREA.ToString(),
                    USING_MODE = (s.USING_MODE == null) ? "" : s.USING_MODE.ToString(),
                    SERVICE_AR = (s.SERVICE_AR == null) ? "" : s.SERVICE_AR.ToString(),
                    VILLAGE_NAME = (s.VILLAGE_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.VILLAGE_ID).FirstOrDefault().Adi,
                    ACTIVITY_NAME = (s.ACTIVITY_ID == null) ? "" : db.ACTIVITies.Where(w => w.OBJECTID == s.ACTIVITY_ID).FirstOrDefault().NAME,
                    PROPERTY_TYPE_NAME = (s.PROPERTY_TYPE_ID == null) ? "" : db.PROPERTY_TYPE.Where(w => w.OBJECTID == s.PROPERTY_TYPE_ID).FirstOrDefault().NAME,
                    SSI_NAME = (s.SSI_ID == null) ? "" : db.PROPERTies.Where(w => w.OBJECTID == s.SSI_ID).FirstOrDefault().NAME,
                    REGIONS_NAME = (s.REGIONS_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.REGIONS_ID).FirstOrDefault().Adi,
                    SIBS_NAME = "",//(s.SIBS_ID == null) ? "" : db.SIBS.Where(w => w.OBJECTID == s.SIBS_ID).FirstOrDefault().NAME,
                    ASSIGMENT_NAME = (s.ASSIGMENT_ID == null) ? "" : db.ASSIGMENTs.Where(w => w.OBJECTID == s.ASSIGMENT_ID).FirstOrDefault().NAME,
                    EXPLONATION = (s.EXPLONATION == null) ? "" : s.EXPLONATION.ToString(),
                    DataName = dataname
                }).ToList();
                return PartialView("BUILDINGPARTIAL", building);
            }
            if (dataname== "EXP")
            {
                string query = "select * from EXPLOITATION_ROAD where OBJECTID in (" + querylist + ")";
                List<EXPLOITATIONROADMODEL> expolist = db.Database.SqlQuery<EXPLOITATION_ROAD>(query).Select(s => new EXPLOITATIONROADMODEL()
                {
                    OBJECTID = s.OBJECTID,
                    NAME = (s.NAME == null) ? "" : s.NAME.ToString(),
                    LENGHT = (s.LENGHT == null) ? "" : s.LENGHT.ToString(),
                    VILLAGE_NAME = (s.VILLAGE_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.VILLAGE_ID).FirstOrDefault().Adi,
                    COVER_TYPE_NAME = (s.COVER_TYPE_ID == null) ? "" : db.COVER_TYPES.Where(w => w.OBJECTID == s.COVER_TYPE_ID).FirstOrDefault().NAME,
                    PROPERTY_TYPE_NAME = (s.PROPERTY_TYPE_ID == null) ? "" : db.PROPERTY_TYPE.Where(w => w.OBJECTID == s.PROPERTY_TYPE_ID).FirstOrDefault().NAME,
                    SSI_NAME = (s.SSI_ID == null) ? "" : db.PROPERTies.Where(w => w.OBJECTID == s.SSI_ID).FirstOrDefault().NAME,
                    REGIONS_NAME = (s.REGIONS_ID == null) ? "" : db.REGIONS.Where(w => w.OBJECTID == s.REGIONS_ID).FirstOrDefault().Adi,                   
                    DataName = dataname
                }).ToList();
                return PartialView("EXPLOITATIONROADPARTIAL", expolist);
            }

            return Json("", JsonRequestBehavior.AllowGet);
        }

        



        //Filter 
        public ActionResult Filter(CHECKEDPARAMETRS FILCHECK, FilterStrings FILTER)
        {
            TotalResult vm = new TotalResult();
            if (FILCHECK.CHANNEL.CH)
            {
                // magistral kanallar
                if (FILCHECK.CHANNEL.CHANNELFILDS.CHM)
                {
                    //string querycount = "select Count(distinct CHANNELS.[NAME]) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =4 and " + FILTER.OCHM;
                    //string querylengnt = "select SUM(CHANNELS.GIS_LENGTH) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =4 and " + FILTER.OCHM;
                    //string querycapability = "select SUM(CHANNELS.WATER_CAPABILITY) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =4 and " + FILTER.OCHM;
                    //string queryservedarea = "select SUM(CHANNELS.SERVED_AREAHA) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =4 and " + FILTER.OCHM;
                    //string querydevicesum = "select SUM(CHANNELS.DEVICE_SUM) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =4 and " + FILTER.OCHM;
                    //string querywitdh = "select SUM(CHANNELS.FACTICAL_LENGTH) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =4 and " + FILTER.OCHM;
                    //string queryid= "select CHANNELS.OBJECTID from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =4 and " + FILTER.OCHM;


                    string RegionQuery = "";
                    if (!FILTER.OCHM.Contains("REGIONS_ID") && !FILTER.OCHM.Contains("SSI_ID"))
                    {
                        RegionQuery = " and REGIONS_ID > 0 ";
                    }

                    string querycount = "select SUM(STATISTIC.CountCH0) from STATISTIC WHERE " + FILTER.OCHM + RegionQuery;
                    string querylengnt = "select SUM(STATISTIC.CHANNEL0) from STATISTIC WHERE " + FILTER.OCHM + RegionQuery;
                    string queryservedarea = "select SUM(STATISTIC.CHANNELAREA) from STATISTIC WHERE " + FILTER.OCHM + RegionQuery;
                    string querydevicesum = "select SUM(STATISTIC.DEVICESCH) from STATISTIC WHERE " + FILTER.OCHM + RegionQuery; 

                    string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.OCHM;



                    vm.CHM_Count = db.Database.SqlQuery<int>(querycount).First();
                    vm.CHM_Lenght = (db.Database.SqlQuery<decimal?>(querylengnt).First()==null)? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylengnt).First()), 2);
                    vm.CHM_WATERCAPABILITY = 0; //(db.Database.SqlQuery<decimal?>(querycapability).First()==null)? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycapability).First()), 2);
                    vm.CHM_ServedArea = (db.Database.SqlQuery<decimal?>(queryservedarea).First()==null)? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea).First()), 2);
                    vm.CHM_DEVICESUM = (db.Database.SqlQuery<decimal?>(querydevicesum).First()==null)? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum).First()), 2);
                    vm.CHM_WITDH = 0; //(db.Database.SqlQuery<decimal?>(querywitdh).First()==null)? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querywitdh).First()), 2);
                    vm.CHM_CHECK = true;
                    vm.CHM_ID = db.Database.SqlQuery<int>(queryid).ToList();
                }
                // I dereceli kanallar
                if (FILCHECK.CHANNEL.CHANNELFILDS.CHI)
                {
                    //string querycount = "select Count(distinct CHANNELS.[NAME]) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =1 and " + FILTER.OCHI;
                    //string querylenght = "select SUM(CHANNELS.GIS_LENGTH) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =1 and " + FILTER.OCHI;
                    //string querycapability = "select SUM(CHANNELS.WATER_CAPABILITY) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =1 and " + FILTER.OCHI;
                    //string queryservedarea = "select SUM(CHANNELS.SERVED_AREAHA) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =1 and " + FILTER.OCHI;
                    //string querydevicesum = "select SUM(CHANNELS.DEVICE_SUM) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =1 and " + FILTER.OCHI;
                    //string querywitdh = "select SUM(CHANNELS.FACTICAL_LENGTH) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =1 and " + FILTER.OCHI;
                    //string queryid = "select CHANNELS.OBJECTID from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =1 and " + FILTER.OCHI;

                    string RegionQuery = "";
                    if (!FILTER.OCHI.Contains("REGIONS_ID") && !FILTER.OCHI.Contains("SSI_ID"))
                    {
                        RegionQuery = " and REGIONS_ID > 0 ";
                    }

                    string querycount = "select SUM(STATISTIC.CountCH1) from STATISTIC WHERE " + FILTER.OCHI + RegionQuery;
                    string querylenght = "select SUM(STATISTIC.CHANNEL1) from STATISTIC WHERE " + FILTER.OCHI + RegionQuery;
                    string queryservedarea = "select SUM(STATISTIC.CHANNELAREA1) from STATISTIC WHERE " + FILTER.OCHI + RegionQuery;
                    string querydevicesum = "select SUM(STATISTIC.DEVICESCH1) from STATISTIC WHERE " + FILTER.OCHI + RegionQuery;

                    string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.OCHI;


                    vm.CHI_Count = db.Database.SqlQuery<int>(querycount).First(); ;
                    vm.CHI_Lenght = (db.Database.SqlQuery<decimal?>(querylenght).First()==null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght).First()), 2);
                    vm.CHI_WATERCAPABILITY = 0;// (db.Database.SqlQuery<decimal?>(querycapability).First()==null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycapability).First()), 2);
                    vm.CHI_ServedArea = (db.Database.SqlQuery<decimal?>(queryservedarea).First()==null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea).First()), 2);
                    vm.CHI_DEVICESUM =(db.Database.SqlQuery<decimal?>(querydevicesum).First()==null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum).First()), 2);
                    vm.CHI_WITDH = 0;// (db.Database.SqlQuery<decimal?>(querywitdh).First()==null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querywitdh).First()), 2);
                    vm.CHI_CHECK = true;
                    vm.CHI_ID = db.Database.SqlQuery<int>(queryid).ToList();
                }
                // II dereceli kanallar
                if (FILCHECK.CHANNEL.CHANNELFILDS.CHII)
                {
                    //string querycount = "select Count(distinct CHANNELS.[NAME]) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =2 and " + FILTER.OCHII;
                    //string querylenght = "select SUM(CHANNELS.GIS_LENGTH) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =2 and " + FILTER.OCHII;
                    //string querycapability = "select SUM(CHANNELS.WATER_CAPABILITY) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =2 and " + FILTER.OCHII;
                    //string queryservedarea = "select SUM(CHANNELS.SERVED_AREAHA) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =2 and " + FILTER.OCHII;
                    //string querydevicesum = "select SUM(CHANNELS.DEVICE_SUM) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =2 and " + FILTER.OCHII;
                    //string querywitdh = "select SUM(CHANNELS.FACTICAL_LENGTH) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =2 and " + FILTER.OCHII;
                    //string queryids = "select CHANNELS.OBJECTID from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID = 2 and " + FILTER.OCHII;

                    string RegionQuery = "";
                    if (!FILTER.OCHII.Contains("REGIONS_ID") && !FILTER.OCHII.Contains("SSI_ID"))
                    {
                        RegionQuery = " and REGIONS_ID > 0 ";
                    }
                    string querycount = "select SUM(STATISTIC.CountCH2) from STATISTIC WHERE " + FILTER.OCHII + RegionQuery;
                    string querylenght = "select SUM(STATISTIC.CHANNEL2) from STATISTIC WHERE " + FILTER.OCHII + RegionQuery;
                    string queryservedarea = "select SUM(STATISTIC.CHANNELAREA2) from STATISTIC WHERE " + FILTER.OCHII + RegionQuery;
                    string querydevicesum = "select SUM(STATISTIC.DEVICESCH2) from STATISTIC WHERE " + FILTER.OCHII + RegionQuery;
                    string queryids = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.OCHII;



                    vm.CHII_Count = db.Database.SqlQuery<int>(querycount).First();
                    vm.CHII_Lenght = (db.Database.SqlQuery<decimal?>(querylenght).First()==null) ? 0 :  (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght).First()), 2);
                    vm.CHII_WATERCAPABILITY = 0; //(db.Database.SqlQuery<decimal?>(querycapability).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycapability).First()), 2);
                    vm.CHII_ServedArea = (db.Database.SqlQuery<decimal?>(queryservedarea).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea).First()), 2);
                    vm.CHII_DEVICESUM =(db.Database.SqlQuery<decimal?>(querydevicesum).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum).First()), 2);
                    vm.CHII_WITDH = 0; //(db.Database.SqlQuery<decimal?>(querywitdh).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querywitdh).First()), 2);
                    vm.CHII_CHECK = true;
                    vm.CHII_ID = db.Database.SqlQuery<int>(queryids).ToList();
                }
                // III dereceli kanallar
                if (FILCHECK.CHANNEL.CHANNELFILDS.CHIII)
                {
                    //string querycount = "select Count(distinct CHANNELS.[NAME]) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =3 and " + FILTER.OCHIII;
                    //string querylenght = "select SUM(CHANNELS.GIS_LENGTH) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =3 and " + FILTER.OCHIII;
                    //string querycapability = "select SUM(CHANNELS.WATER_CAPABILITY) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =3 and " + FILTER.OCHIII;
                    //string queryservedarea = "select SUM(CHANNELS.SERVED_AREAHA) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =3 and " + FILTER.OCHIII;
                    //string querydevicesum = "select SUM(CHANNELS.DEVICE_SUM) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =3 and " + FILTER.OCHIII;
                    //string querywitdh = "select SUM(CHANNELS.FACTICAL_LENGTH) from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =3 and " + FILTER.OCHIII;
                    //string queryids= "select CHANNELS.OBJECTID from CHANNELS WHERE KIND_ID=1 and CHANNELS.TYPE_ID =3 and " + FILTER.OCHIII;


                    string RegionQuery = "";
                    if (!FILTER.OCHIII.Contains("REGIONS_ID") && !FILTER.OCHIII.Contains("SSI_ID"))
                    {
                        RegionQuery = " and REGIONS_ID > 0 ";
                    }
                    string querycount = "select SUM(STATISTIC.CountCH3) from STATISTIC WHERE " + FILTER.OCHIII + RegionQuery;
                    string querylenght = "select SUM(STATISTIC.CHANNEL3) from STATISTIC WHERE " + FILTER.OCHIII + RegionQuery;
                    string queryservedarea = "select SUM(STATISTIC.CHANNELAREA3) from STATISTIC WHERE " + FILTER.OCHIII + RegionQuery;
                    string querydevicesum = "select SUM(STATISTIC.DEVICESCH3) from STATISTIC WHERE " + FILTER.OCHIII + RegionQuery;
                    string queryids = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.OCHIII;


                    vm.CHIII_Count = db.Database.SqlQuery<int>(querycount).First();
                    vm.CHIII_Lenght = (db.Database.SqlQuery<decimal?>(querylenght).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght).First()), 2);
                    vm.CHIII_WATERCAPABILITY = 0;// (db.Database.SqlQuery<decimal?>(querycapability).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycapability).First()), 2);
                    vm.CHIII_ServedArea = (db.Database.SqlQuery<decimal?>(queryservedarea).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea).First()), 2);
                    vm.CHIII_DEVICESUM = (db.Database.SqlQuery<decimal?>(querydevicesum).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum).First()), 2);
                    vm.CHIII_WITDH = 0;// (db.Database.SqlQuery<decimal?>(querywitdh).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querywitdh).First()), 2);
                    vm.CHIII_CHECK = true;
                    vm.CHIII_ID = db.Database.SqlQuery<int>(queryids).ToList();
                }
                //butun aciq kanallar
                if (!FILCHECK.CHANNEL.CHANNELFILDS.CHM && !FILCHECK.CHANNEL.CHANNELFILDS.CHI && !FILCHECK.CHANNEL.CHANNELFILDS.CHII && !FILCHECK.CHANNEL.CHANNELFILDS.CHIII)
                {
                    //string queryCount = "select Count(distinct CHANNELS.[NAME]) from CHANNELS WHERE KIND_ID=1 and " + FILTER.OCH;
                    //string queryLenght = "select SUM(CHANNELS.GIS_LENGTH) from CHANNELS WHERE KIND_ID=1 and " + FILTER.OCH;
                    //string querycapability = "select SUM(CHANNELS.WATER_CAPABILITY) from CHANNELS WHERE KIND_ID=1 and " + FILTER.OCH;
                    //string queryservedarea = "select SUM(CHANNELS.SERVED_AREAHA) from CHANNELS WHERE KIND_ID=1 and " + FILTER.OCH;
                    //string querydevicesum = "select SUM(CHANNELS.DEVICE_SUM) from CHANNELS WHERE KIND_ID=1 and " + FILTER.OCH;
                    //string querywitdh = "select SUM(CHANNELS.FACTICAL_LENGTH) from CHANNELS WHERE KIND_ID=1 and " + FILTER.OCH;
                    //string queryids = "select CHANNELS.OBJECTID from CHANNELS WHERE KIND_ID=1 and " + FILTER.OCH;


                    string RegionQuery = "";
                    if (!FILTER.OCH.Contains("REGIONS_ID") && !FILTER.OCH.Contains("SSI_ID"))
                    {
                        RegionQuery = " and REGIONS_ID > 0 ";
                    }

                    string querycount0 = "select SUM(STATISTIC.CountCH0) from STATISTIC WHERE " + FILTER.OCH + RegionQuery;
                    string querycount1 = "select SUM(STATISTIC.CountCH1) from STATISTIC WHERE " + FILTER.OCH + RegionQuery;
                    string querycount2 = "select SUM(STATISTIC.CountCH2) from STATISTIC WHERE " + FILTER.OCH + RegionQuery;
                    string querycount3 = "select SUM(STATISTIC.CountCH3) from STATISTIC WHERE " + FILTER.OCH + RegionQuery;

                    string querylenght0 = "select SUM(STATISTIC.CHANNEL0) from STATISTIC WHERE " + FILTER.OCH + RegionQuery;
                    string querylenght1 = "select SUM(STATISTIC.CHANNEL1) from STATISTIC WHERE " + FILTER.OCH + RegionQuery;
                    string querylenght2 = "select SUM(STATISTIC.CHANNEL2) from STATISTIC WHERE " + FILTER.OCH + RegionQuery;
                    string querylenght3 = "select SUM(STATISTIC.CHANNEL3) from STATISTIC WHERE " + FILTER.OCH + RegionQuery;


                    string queryservedarea = "select SUM(STATISTIC.CHANNELAREA) from STATISTIC WHERE " + FILTER.OCH + RegionQuery;
                    string queryservedarea1 = "select SUM(STATISTIC.CHANNELAREA1) from STATISTIC WHERE " + FILTER.OCH + RegionQuery;
                    string queryservedarea2 = "select SUM(STATISTIC.CHANNELAREA2) from STATISTIC WHERE " + FILTER.OCH + RegionQuery;
                    string queryservedarea3 = "select SUM(STATISTIC.CHANNELAREA3) from STATISTIC WHERE " + FILTER.OCH + RegionQuery;

                    string querydevicesum = "select SUM(STATISTIC.DEVICESCH) from STATISTIC WHERE " + FILTER.OCH + RegionQuery;
                    string querydevicesum1 = "select SUM(STATISTIC.DEVICESCH1) from STATISTIC WHERE " + FILTER.OCH + RegionQuery;
                    string querydevicesum2 = "select SUM(STATISTIC.DEVICESCH2) from STATISTIC WHERE " + FILTER.OCH + RegionQuery;
                    string querydevicesum3 = "select SUM(STATISTIC.DEVICESCH3) from STATISTIC WHERE " + FILTER.OCH + RegionQuery;

                    string queryids = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.OCH;



                    int chcount0 =db.Database.SqlQuery<int>(querycount0).First();
                    int chcount1 =db.Database.SqlQuery<int>(querycount1).First();
                    int chcount2 =db.Database.SqlQuery<int>(querycount2).First();
                    int chcount3 =db.Database.SqlQuery<int>(querycount3).First();

                    decimal channelarea = (db.Database.SqlQuery<decimal?>(queryservedarea).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea).First()), 2);
                    decimal channelarea1 = (db.Database.SqlQuery<decimal?>(queryservedarea1).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea1).First()), 2);
                    decimal channelarea2 = (db.Database.SqlQuery<decimal?>(queryservedarea2).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea2).First()), 2);
                    decimal channelarea3 = (db.Database.SqlQuery<decimal?>(queryservedarea3).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea3).First()), 2);

                    decimal ch0= (db.Database.SqlQuery<decimal?>(querylenght0).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght0).First()), 2);
                    decimal ch1 = (db.Database.SqlQuery<decimal?>(querylenght1).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght1).First()), 2);
                    decimal ch2 = (db.Database.SqlQuery<decimal?>(querylenght2).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght2).First()), 2);
                    decimal ch3 = (db.Database.SqlQuery<decimal?>(querylenght3).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght3).First()), 2);

                    decimal devcount = (db.Database.SqlQuery<decimal?>(querydevicesum).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum).First()), 2);
                    decimal devcount1 = (db.Database.SqlQuery<decimal?>(querydevicesum1).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum1).First()), 2);
                    decimal devcount2 = (db.Database.SqlQuery<decimal?>(querydevicesum2).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum2).First()), 2);
                    decimal devcount3 = (db.Database.SqlQuery<decimal?>(querydevicesum3).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum3).First()), 2);

                    vm.CH_Count = chcount0+chcount1+chcount2+chcount3; //db.Database.SqlQuery<int>(queryCount).First();
                    vm.CH_Lenght = ch0 + ch1 + ch2 + ch3; //(db.Database.SqlQuery<decimal?>(queryLenght).First()==null)? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryLenght).First()), 2);
                    vm.CH_WATERCAPABILITY = 0;// (db.Database.SqlQuery<decimal?>(querycapability).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycapability).First()), 2);
                    vm.CH_ServedArea = channelarea + channelarea1 + channelarea2 + channelarea3;
                    vm.CH_DEVICESUM = devcount + devcount1 + devcount2 + devcount3;
                    vm.CH_WITDH = 0;// (db.Database.SqlQuery<decimal?>(querywitdh).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querywitdh).First()), 2);
                    vm.CH_CHECK = true;
                    vm.CH_ID= db.Database.SqlQuery<int>(queryids).ToList();
                }                
            }

            //qapali suvarma sebekeleri
            if (FILCHECK.QCHANNEL.QCH == true)
            {
                //magistral qapali suvarma sebekeleri
                if (FILCHECK.QCHANNEL.QCHANNELFILDS.QCHM)
                {
                    //string querycount = "select Count(distinct CHANNELS.[NAME]) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =4 and " + FILTER.QCHM;
                    //string querylenght = "select SUM(CHANNELS.GIS_LENGTH) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =4 and " + FILTER.QCHM;
                    //string querycapability = "select SUM(CHANNELS.WATER_CAPABILITY) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =4 and " + FILTER.QCHM;
                    //string queryservedarea = "select SUM(CHANNELS.SERVED_AREAHA) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =4 and " + FILTER.QCHM;
                    //string querydevicesum = "select SUM(CHANNELS.DEVICE_SUM) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =4 and " + FILTER.QCHM;
                    //string querywitdh = "select SUM(CHANNELS.FACTICAL_LENGTH) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =4 and " + FILTER.QCHM;
                    //string queryid = "select CHANNELS.OBJECTID from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =4 and " + FILTER.QCHM;

                    string RegionQuery = "";
                    if (!FILTER.QCHM.Contains("REGIONS_ID") && !FILTER.QCHM.Contains("SSI_ID"))
                    {
                        RegionQuery = " and REGIONS_ID > 0 ";
                    }
                    string querycount = "select SUM(STATISTIC.CountClosed0) from STATISTIC WHERE " + FILTER.QCHM + RegionQuery;
                    string querylenght = "select SUM(STATISTIC.CLOSED0) from STATISTIC WHERE " + FILTER.QCHM + RegionQuery;
                    string queryservedarea = "select SUM(STATISTIC.CLOSEDAREA) from STATISTIC WHERE " + FILTER.QCHM + RegionQuery;
                    string querydevicesum = "select SUM(STATISTIC.DEVICESCH) from STATISTIC WHERE " + FILTER.QCHM + RegionQuery;
                    string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.QCHM + RegionQuery;


                    vm.QCHM_Count = db.Database.SqlQuery<int>(querycount).First();
                    vm.QCHM_Lenght = (db.Database.SqlQuery<decimal?>(querylenght).First()==null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght).First()), 2);
                    vm.QCHM_WATERCAPABILITY = 0;// (db.Database.SqlQuery<decimal?>(querycapability).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycapability).First()), 2);
                    vm.QCHM_ServedArea = (db.Database.SqlQuery<decimal?>(queryservedarea).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea).First()), 2);
                    vm.QCHM_DEVICESUM =(db.Database.SqlQuery<decimal?>(querydevicesum).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum).First()), 2);
                    vm.QCHM_WITDH = 0;// (db.Database.SqlQuery<decimal?>(querywitdh).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querywitdh).First()), 2);
                    vm.QCHM_CHECK = true;
                    vm.QCHM_ID = db.Database.SqlQuery<int>(queryid).ToList();
                }
                //i decereceli qapali suvarma sebeleleri
                if (FILCHECK.QCHANNEL.QCHANNELFILDS.QCHI)
                {
                    //string querycount = "select Count(distinct CHANNELS.[NAME]) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =1 and " + FILTER.QCHI;
                    //string querylenght = "select SUM(CHANNELS.GIS_LENGTH) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =1 and " + FILTER.QCHI;
                    //string querycapability = "select SUM(CHANNELS.WATER_CAPABILITY) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =1 and " + FILTER.QCHI;
                    //string queryservedarea = "select SUM(CHANNELS.SERVED_AREAHA) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =1 and " + FILTER.QCHI;
                    //string querydevicesum = "select SUM(CHANNELS.DEVICE_SUM) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =1 and " + FILTER.QCHI;
                    //string querywitdh = "select SUM(CHANNELS.FACTICAL_LENGTH) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =1 and " + FILTER.QCHI;
                    //string queryid = "select CHANNELS.OBJECTID from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =1 and " + FILTER.QCHI;

                    string RegionQuery = "";
                    if (!FILTER.QCHI.Contains("REGIONS_ID") && !FILTER.QCHI.Contains("SSI_ID"))
                    {
                        RegionQuery = " and REGIONS_ID > 0 ";
                    }
                    string querycount = "select SUM(STATISTIC.CountCLOSED1) from STATISTIC WHERE " + FILTER.QCHI + RegionQuery;
                    string querylenght = "select SUM(STATISTIC.CLOSED1) from STATISTIC WHERE " + FILTER.QCHI + RegionQuery;
                    string queryservedarea = "select SUM(STATISTIC.CLOSEDAREA) from STATISTIC WHERE " + FILTER.QCHI + RegionQuery;
                    string querydevicesum = "select SUM(STATISTIC.DEVICESCH) from STATISTIC WHERE " + FILTER.QCHI + RegionQuery;
                    string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.QCHI + RegionQuery;


                    vm.QCHI_Count = db.Database.SqlQuery<int>(querycount).First();
                    vm.QCHI_Lenght = (db.Database.SqlQuery<decimal?>(querylenght).First()==null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght).First()), 2);
                    vm.QCHI_WATERCAPABILITY = 0;// (db.Database.SqlQuery<decimal?>(querycapability).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycapability).First()), 2);
                    vm.QCHI_ServedArea = (db.Database.SqlQuery<decimal?>(queryservedarea).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea).First()), 2);
                    vm.QCHI_DEVICESUM = (db.Database.SqlQuery<decimal?>(querydevicesum).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum).First()), 2);
                    vm.QCHI_WITDH = 0;// (db.Database.SqlQuery<decimal?>(querywitdh).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querywitdh).First()), 2);
                    vm.QCHI_CHECK = true;
                    vm.QCHI_ID = db.Database.SqlQuery<int>(queryid).ToList();
                }
                //II dececeli qapali suvarma sebekeleri
                if (FILCHECK.QCHANNEL.QCHANNELFILDS.QCHII)
                {
                    //string querycount = "select Count(distinct CHANNELS.[NAME]) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =2 and " + FILTER.QCHII;
                    //string querylenght = "select SUM(CHANNELS.GIS_LENGTH) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =2 and " + FILTER.QCHII;
                    //string querycapability = "select SUM(CHANNELS.WATER_CAPABILITY) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =2 and " + FILTER.QCHII;
                    //string queryservedarea = "select SUM(CHANNELS.SERVED_AREAHA) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =2 and " + FILTER.QCHII;
                    //string querydevicesum = "select SUM(CHANNELS.DEVICE_SUM) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =2 and " + FILTER.QCHII;
                    //string querywitdh = "select SUM(CHANNELS.FACTICAL_LENGTH) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =2 and " + FILTER.QCHII;
                    //string queryid = "select CHANNELS.OBJECTID from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =2 and " + FILTER.QCHII;

                    string RegionQuery = "";
                    if (!FILTER.QCHII.Contains("REGIONS_ID") && !FILTER.QCHII.Contains("SSI_ID"))
                    {
                        RegionQuery = " and REGIONS_ID > 0 ";
                    }
                    string querycount = "select SUM(STATISTIC.CountCLOSED2) from STATISTIC WHERE " + FILTER.QCHII + RegionQuery;
                    string querylenght = "select SUM(STATISTIC.CLOSED2) from STATISTIC WHERE " + FILTER.QCHII + RegionQuery;
                    string queryservedarea = "select SUM(STATISTIC.CLOSEDAREA) from STATISTIC WHERE " + FILTER.QCHII + RegionQuery;
                    string querydevicesum = "select SUM(STATISTIC.DEVICESCH) from STATISTIC WHERE " + FILTER.QCHII + RegionQuery;
                    string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.QCHII + RegionQuery;


                    vm.QCHII_Count =db.Database.SqlQuery<int>(querycount).First();
                    vm.QCHII_Lenght = (db.Database.SqlQuery<decimal?>(querylenght).First()==null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght).First()), 2);
                    vm.QCHII_WATERCAPABILITY = 0;// (db.Database.SqlQuery<decimal?>(querycapability).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycapability).First()), 2);
                    vm.QCHII_ServedArea = (db.Database.SqlQuery<decimal?>(queryservedarea).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea).First()), 2);
                    vm.QCHII_DEVICESUM =  (db.Database.SqlQuery<decimal?>(querydevicesum).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum).First()), 2);
                    vm.QCHII_WITDH = 0;// (db.Database.SqlQuery<decimal?>(querywitdh).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querywitdh).First()), 2);
                    vm.QCHII_CHECK = true;
                    vm.QCHII_ID = db.Database.SqlQuery<int>(queryid).ToList();
                }
                //III dereceli qapali suvarma sebekeleri
                if (FILCHECK.QCHANNEL.QCHANNELFILDS.QCHIII)
                {
                    //string querycount = "select Count(distinct CHANNELS.[NAME]) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =3 and " + FILTER.QCHIII;
                    //string querylenght = "select SUM(CHANNELS.GIS_LENGTH) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =3 and " + FILTER.QCHIII;
                    //string querycapability = "select SUM(CHANNELS.WATER_CAPABILITY) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =3 and " + FILTER.QCHIII;
                    //string queryservedarea = "select SUM(CHANNELS.SERVED_AREAHA) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =3 and " + FILTER.QCHIII;
                    //string querydevicesum = "select SUM(CHANNELS.DEVICE_SUM) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =3 and " + FILTER.QCHIII;
                    //string querywitdh = "select SUM(CHANNELS.FACTICAL_LENGTH) from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =3 and " + FILTER.QCHIII;
                    //string queryid = "select CHANNELS.OBJECTID from CHANNELS WHERE KIND_ID=2 and CHANNELS.TYPE_ID =3 and " + FILTER.QCHIII;

                    string RegionQuery = "";
                    if (!FILTER.QCHIII.Contains("REGIONS_ID") && !FILTER.QCHIII.Contains("SSI_ID"))
                    {
                        RegionQuery = " and REGIONS_ID > 0 ";
                    }
                    string querycount = "select SUM(STATISTIC.CountCLOSED3) from STATISTIC WHERE " + FILTER.QCHIII + RegionQuery;
                    string querylenght = "select SUM(STATISTIC.CLOSED3) from STATISTIC WHERE " + FILTER.QCHIII + RegionQuery;
                    string queryservedarea = "select SUM(STATISTIC.CLOSEDAREA) from STATISTIC WHERE " + FILTER.QCHIII + RegionQuery;
                    string querydevicesum = "select SUM(STATISTIC.DEVICESCH) from STATISTIC WHERE " + FILTER.QCHIII + RegionQuery;
                    string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.QCHIII + RegionQuery;



                    vm.QCHIII_Count = db.Database.SqlQuery<int>(querycount).First();
                    vm.QCHIII_Lenght = (db.Database.SqlQuery<decimal?>(querylenght).First()==null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght).First()), 2);
                    vm.QCHIII_WATERCAPABILITY = 0;// (db.Database.SqlQuery<decimal?>(querycapability).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycapability).First()), 2);
                    vm.QCHIII_ServedArea = (db.Database.SqlQuery<decimal?>(queryservedarea).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea).First()), 2);
                    vm.QCHIII_DEVICESUM = (db.Database.SqlQuery<decimal?>(querydevicesum).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum).First()), 2);
                    vm.QCHIII_WITDH = 0;// (db.Database.SqlQuery<decimal?>(querywitdh).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querywitdh).First()), 2);
                    vm.QCHIII_CHECK = true;
                    vm.QCHIII_ID = db.Database.SqlQuery<int>(queryid).ToList();
                }
                //butun qapali suvarma sebekeleri
                if (!FILCHECK.QCHANNEL.QCHANNELFILDS.QCHM && !FILCHECK.QCHANNEL.QCHANNELFILDS.QCHI && !FILCHECK.QCHANNEL.QCHANNELFILDS.QCHII && !FILCHECK.QCHANNEL.QCHANNELFILDS.QCHIII)
                {
                    //string queryCount = "select Count(distinct CHANNELS.[NAME]) from CHANNELS WHERE KIND_ID=2 and " + FILTER.QCH;
                    //string queryLenght = "select SUM(CHANNELS.GIS_LENGTH) from CHANNELS WHERE KIND_ID=2 and " + FILTER.QCH;
                    //string querycapability = "select SUM(CHANNELS.WATER_CAPABILITY) from CHANNELS WHERE KIND_ID=2 and " + FILTER.QCH;
                    //string queryservedarea = "select SUM(CHANNELS.SERVED_AREAHA) from CHANNELS WHERE KIND_ID=2 and " + FILTER.QCH;
                    //string querydevicesum = "select SUM(CHANNELS.DEVICE_SUM) from CHANNELS WHERE KIND_ID=2 and " + FILTER.QCH;
                    //string querywitdh = "select SUM(CHANNELS.FACTICAL_LENGTH) from CHANNELS WHERE KIND_ID=2 and " + FILTER.QCH;
                    //string queryid = "select CHANNELS.OBJECTID from CHANNELS WHERE KIND_ID=2 and " + FILTER.QCH;

                    string RegionQuery = "";
                    if (!FILTER.QCH.Contains("REGIONS_ID") && !FILTER.QCH.Contains("SSI_ID"))
                    {
                        RegionQuery = " and REGIONS_ID > 0 ";
                    }
                    string querycount0 = "select SUM(STATISTIC.CountClosed0) from STATISTIC WHERE " + FILTER.QCH + RegionQuery;
                    string querycount1 = "select SUM(STATISTIC.CountCLOSED1) from STATISTIC WHERE " + FILTER.QCH + RegionQuery;
                    string querycount2 = "select SUM(STATISTIC.CountCLOSED2) from STATISTIC WHERE " + FILTER.QCH + RegionQuery;
                    string querycount3 = "select SUM(STATISTIC.CountCLOSED3) from STATISTIC WHERE " + FILTER.QCH + RegionQuery;

                    int count0 = db.Database.SqlQuery<int>(querycount0).First();
                    int count1 = db.Database.SqlQuery<int>(querycount1).First();
                    int count2 = db.Database.SqlQuery<int>(querycount2).First();
                    int count3 = db.Database.SqlQuery<int>(querycount3).First();

                    string querylenght0 = "select SUM(STATISTIC.CLOSED0) from STATISTIC WHERE " + FILTER.QCH + RegionQuery;
                    string querylenght1 = "select SUM(STATISTIC.CLOSED1) from STATISTIC WHERE " + FILTER.QCH + RegionQuery;
                    string querylenght2 = "select SUM(STATISTIC.CLOSED2) from STATISTIC WHERE " + FILTER.QCH + RegionQuery;
                    string querylenght3 = "select SUM(STATISTIC.CLOSED3) from STATISTIC WHERE " + FILTER.QCH + RegionQuery;

                    string queryservedarea = "select SUM(STATISTIC.CLOSEDAREA) from STATISTIC WHERE " + FILTER.QCH + RegionQuery;

                    decimal ch0 = (db.Database.SqlQuery<decimal?>(querylenght0).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght0).First()), 2);
                    decimal ch1 = (db.Database.SqlQuery<decimal?>(querylenght1).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght1).First()), 2);
                    decimal ch2 = (db.Database.SqlQuery<decimal?>(querylenght2).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght2).First()), 2);
                    decimal ch3 = (db.Database.SqlQuery<decimal?>(querylenght3).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght3).First()), 2);

                    string querydevicesum = "select SUM(STATISTIC.DEVICESCH) from STATISTIC WHERE " + FILTER.QCH;
                    string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.QCH;


                    vm.QCH_Count =count0 + count1 + count2+ count3;// db.Database.SqlQuery<int>(queryCount).First();
                    vm.QCH_Lenght = ch0 + ch1 + ch2 + ch3; //(db.Database.SqlQuery<decimal?>(queryLenght).First()==null)? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryLenght).First()), 2);
                    vm.QCH_WATERCAPABILITY = 0;// (db.Database.SqlQuery<decimal?>(querycapability).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycapability).First()), 2);
                    vm.QCH_ServedArea = (db.Database.SqlQuery<decimal?>(queryservedarea).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea).First()), 2);
                    vm.QCH_DEVICESUM = (db.Database.SqlQuery<decimal?>(querydevicesum).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum).First()), 2);
                    vm.QCH_WITDH = 0;// (db.Database.SqlQuery<decimal?>(querywitdh).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querywitdh).First()), 2);
                    vm.QCH_CHECK = true;
                    vm.QCH_ID = db.Database.SqlQuery<int>(queryid).ToList();
                }


            }

            // drenajlar
            if (FILCHECK.DRENAJ.DREN)
            {
                //magistral drenajlar
                if (FILCHECK.DRENAJ.DRENAJFILDS.DRENAJM)
                {
                    //string querycount = "select Count(*) from DRENAJ where  CHANNEL_TYPE_ID=4 and " + FILTER.DRENAJM;
                    //string querylenght = "select SUM(GISLENGTH) from DRENAJ where  CHANNEL_TYPE_ID=4 and " + FILTER.DRENAJM;
                    //string querycapability = "select SUM(WATER_CAPABILITY) from DRENAJ where  CHANNEL_TYPE_ID=4 and " + FILTER.DRENAJM;
                    //string queryservedarea = "select SUM(SERVED_AREA) from DRENAJ where  CHANNEL_TYPE_ID=4 and " + FILTER.DRENAJM;
                    //string querydevicesum = "select SUM(DEVICE_SUM) from DRENAJ where  CHANNEL_TYPE_ID=4 and " + FILTER.DRENAJM;
                    //string querywitdh = "select SUM(FACTICAL_LENGTH) from DRENAJ where  CHANNEL_TYPE_ID=4 and " + FILTER.DRENAJM;
                    //string queryid = "select DRENAJ.OBJECTID from DRENAJ WHERE  CHANNEL_TYPE_ID=4 and " + FILTER.DRENAJM;

                    string RegionQuery = "";
                    if (!FILTER.DRENAJM.Contains("REGIONS_ID") && !FILTER.DRENAJM.Contains("SSI_ID"))
                    {
                        RegionQuery = " and REGIONS_ID > 0 ";
                    }
                    string querycount = "select STATISTIC.CountDREN0 from STATISTIC WHERE " + FILTER.DRENAJM + RegionQuery;
                    string querylenght = "select SUM(STATISTIC.DREN0) from STATISTIC WHERE " + FILTER.DRENAJM + RegionQuery;
                    string queryservedarea = "select SUM(STATISTIC.DREANAREA) from STATISTIC WHERE " + FILTER.DRENAJM + RegionQuery;
                    string querydevicesum = "select SUM(STATISTIC.DEVICEDREN) from STATISTIC WHERE " + FILTER.DRENAJM + RegionQuery;
                    string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.DRENAJM + RegionQuery;


                    vm.DRENAJM_Count = db.Database.SqlQuery<int>(querycount).First();
                    vm.DRENAJM_Lenght = (db.Database.SqlQuery<decimal?>(querylenght).First()==null)? 0 :(decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght).First()), 2);
                    vm.DRENAJM_WATERCAPABILITY = 0;// (db.Database.SqlQuery<decimal?>(querycapability).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycapability).First()), 2);
                    vm.DRENAJM_ServedArea = (db.Database.SqlQuery<decimal?>(queryservedarea).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea).First()), 2);
                    vm.DRENAJM_DEVICESUM = (db.Database.SqlQuery<decimal?>(querydevicesum).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum).First()), 2);
                    vm.DRENAJM_WITDH = 0;// (db.Database.SqlQuery<decimal?>(querywitdh).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querywitdh).First()), 2);
                    vm.DRENAJM_CHECK = true;
                    vm.DRENAJM_ID = db.Database.SqlQuery<int>(queryid).ToList();

                }
                //I dereceli drenajlar
                if (FILCHECK.DRENAJ.DRENAJFILDS.DRENAJI)
                {
                    //string querycount = "select Count(*) from DRENAJ where  CHANNEL_TYPE_ID=1 and " + FILTER.DRENAJI;
                    //string querylenght = "select SUM(GISLENGTH) from DRENAJ where  CHANNEL_TYPE_ID=1 and " + FILTER.DRENAJI;
                    //string querycapability = "select SUM(WATER_CAPABILITY) from DRENAJ where  CHANNEL_TYPE_ID=1 and " + FILTER.DRENAJI;
                    //string queryservedarea = "select SUM(SERVED_AREA) from DRENAJ where  CHANNEL_TYPE_ID=1 and " + FILTER.DRENAJI;
                    //string querydevicesum = "select SUM(DEVICE_SUM) from DRENAJ where  CHANNEL_TYPE_ID=1 and " + FILTER.DRENAJI;
                    //string querywitdh = "select SUM(FACTICAL_LENGTH) from DRENAJ where  CHANNEL_TYPE_ID=1 and " + FILTER.DRENAJI;
                    //string queryid = "select DRENAJ.OBJECTID from DRENAJ where  CHANNEL_TYPE_ID=1 and " + FILTER.DRENAJI;

                    string RegionQuery = "";
                    if (!FILTER.DRENAJI.Contains("REGIONS_ID") && !FILTER.DRENAJI.Contains("SSI_ID"))
                    {
                        RegionQuery = " and REGIONS_ID > 0 ";
                    }
                    string querycount = "select STATISTIC.CountDREN1 from STATISTIC WHERE " + FILTER.DRENAJI + RegionQuery;
                    string querylenght = "select SUM(STATISTIC.DREN1) from STATISTIC WHERE " + FILTER.DRENAJI + RegionQuery;
                    string queryservedarea = "select SUM(STATISTIC.DREANAREA) from STATISTIC WHERE " + FILTER.DRENAJI + RegionQuery;
                    string querydevicesum = "select SUM(STATISTIC.DEVICEDREN) from STATISTIC WHERE " + FILTER.DRENAJI + RegionQuery;
                    string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.DRENAJI + RegionQuery;


                    vm.DRENAJI_Count =  db.Database.SqlQuery<int>(querycount).First();
                    vm.DRENAJI_Lenght = (db.Database.SqlQuery<decimal?>(querylenght).First()==null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght).First()), 2);
                    vm.DRENAJI_WATERCAPABILITY = 0;// (db.Database.SqlQuery<decimal?>(querycapability).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycapability).First()), 2);
                    vm.DRENAJI_ServedArea = (db.Database.SqlQuery<decimal?>(queryservedarea).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea).First()), 2);
                    vm.DRENAJI_DEVICESUM = (db.Database.SqlQuery<decimal?>(querydevicesum).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum).First()), 2);
                    vm.DRENAJI_WITDH = 0;// (db.Database.SqlQuery<decimal?>(querywitdh).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querywitdh).First()), 2);
                    vm.DRENAJI_CHECK = true;
                    vm.DRENAJI_ID = db.Database.SqlQuery<int>(queryid).ToList();

                }
                //II dereceli drenajlar
                if (FILCHECK.DRENAJ.DRENAJFILDS.DRENAJII)
                {
                    //string querycount = "select Count(*) from DRENAJ where  CHANNEL_TYPE_ID=2 and " + FILTER.DRENAJII;
                    //string querylenght = "select SUM(GISLENGTH) from DRENAJ where  CHANNEL_TYPE_ID=2 and " + FILTER.DRENAJII;
                    //string querycapability = "select SUM(WATER_CAPABILITY) from DRENAJ where  CHANNEL_TYPE_ID=2 and " + FILTER.DRENAJII;
                    //string queryservedarea = "select SUM(SERVED_AREA) from DRENAJ where  CHANNEL_TYPE_ID=2 and " + FILTER.DRENAJII;
                    //string querydevicesum = "select SUM(DEVICE_SUM) from DRENAJ where  CHANNEL_TYPE_ID=2 and " + FILTER.DRENAJII;
                    //string querywitdh = "select SUM(FACTICAL_LENGTH) from DRENAJ where  CHANNEL_TYPE_ID=2 and " + FILTER.DRENAJII;
                    //string queryid = "select DRENAJ.OBJECTID from DRENAJ where  CHANNEL_TYPE_ID=2 and " + FILTER.DRENAJII;

                    string RegionQuery = "";
                    if (!FILTER.DRENAJII.Contains("REGIONS_ID") && !FILTER.DRENAJII.Contains("SSI_ID"))
                    {
                        RegionQuery = " and REGIONS_ID > 0 ";
                    }
                    string querycount = "select STATISTIC.CountDREN2 from STATISTIC WHERE " + FILTER.DRENAJII + RegionQuery;
                    string querylenght = "select SUM(STATISTIC.DREN2) from STATISTIC WHERE " + FILTER.DRENAJII + RegionQuery;
                    string queryservedarea = "select SUM(STATISTIC.DREANAREA) from STATISTIC WHERE " + FILTER.DRENAJII + RegionQuery;
                    string querydevicesum = "select SUM(STATISTIC.DEVICEDREN) from STATISTIC WHERE " + FILTER.DRENAJII + RegionQuery;
                    string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.DRENAJII + RegionQuery;


                    vm.DRENAJII_Count =  db.Database.SqlQuery<int>(querycount).First();
                    vm.DRENAJII_Lenght = (db.Database.SqlQuery<decimal?>(querylenght).First()==null)? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght).First()), 2);
                    vm.DRENAJII_WATERCAPABILITY = 0;// (db.Database.SqlQuery<decimal?>(querycapability).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycapability).First()), 2);
                    vm.DRENAJII_ServedArea = (db.Database.SqlQuery<decimal?>(queryservedarea).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea).First()), 2);
                    vm.DRENAJII_DEVICESUM = (db.Database.SqlQuery<decimal?>(querydevicesum).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum).First()), 2);
                    vm.DRENAJII_WITDH = 0;// (db.Database.SqlQuery<decimal?>(querywitdh).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querywitdh).First()), 2);
                    vm.DRENAJII_CHECK = true;
                    vm.DRENAJII_ID = db.Database.SqlQuery<int>(queryid).ToList();
                }
                // ilkin drenaklar 
                if (FILCHECK.DRENAJ.DRENAJFILDS.DRENAJK)
                {
                    //string querycount = "select Count(*) from DRENAJ where  CHANNEL_TYPE_ID=3 and " + FILTER.DRENAJK;
                    //string querylenght = "select SUM(GISLENGTH) from DRENAJ where  CHANNEL_TYPE_ID=3 and " + FILTER.DRENAJK;
                    //string querycapability = "select SUM(WATER_CAPABILITY) from DRENAJ where  CHANNEL_TYPE_ID=3 and " + FILTER.DRENAJK;
                    //string queryservedarea = "select SUM(SERVED_AREA) from DRENAJ where  CHANNEL_TYPE_ID=3 and " + FILTER.DRENAJK;
                    //string querydevicesum = "select SUM(DEVICE_SUM) from DRENAJ where  CHANNEL_TYPE_ID=3 and " + FILTER.DRENAJK;
                    //string querywitdh = "select SUM(FACTICAL_LENGTH) from DRENAJ where  CHANNEL_TYPE_ID=3 and " + FILTER.DRENAJK;
                    //string queryid = "select DRENAJ.OBJECTID from DRENAJ where  CHANNEL_TYPE_ID=3 and " + FILTER.DRENAJK;

                    string RegionQuery = "";
                    if (!FILTER.DRENAJK.Contains("REGIONS_ID") && !FILTER.DRENAJK.Contains("SSI_ID"))
                    {
                        RegionQuery = " and REGIONS_ID > 0 ";
                    }
                    string querycount = "select STATISTIC.CountDREN3 from STATISTIC WHERE " + FILTER.DRENAJK + RegionQuery;
                    string querylenght = "select SUM(STATISTIC.DREN3) from STATISTIC WHERE " + FILTER.DRENAJK + RegionQuery;
                    string queryservedarea = "select SUM(STATISTIC.DREANAREA) from STATISTIC WHERE " + FILTER.DRENAJK + RegionQuery;
                    string querydevicesum = "select SUM(STATISTIC.DEVICEDREN) from STATISTIC WHERE " + FILTER.DRENAJK + RegionQuery;
                    string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.DRENAJK + RegionQuery;


                    vm.DRENAJK_Count = db.Database.SqlQuery<int>(querycount).First();
                    vm.DRENAJK_Lenght = (db.Database.SqlQuery<decimal?>(querylenght).First()==null)? 0 :(decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght).First()), 2);
                    vm.DRENAJK_WATERCAPABILITY = 0;// (db.Database.SqlQuery<decimal?>(querycapability).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycapability).First()), 2);
                    vm.DRENAJK_ServedArea = (db.Database.SqlQuery<decimal?>(queryservedarea).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea).First()), 2);
                    vm.DRENAJK_DEVICESUM = (db.Database.SqlQuery<decimal?>(querydevicesum).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum).First()), 2);
                    vm.DRENAJK_WITDH = 0;// (db.Database.SqlQuery<decimal?>(querywitdh).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querywitdh).First()), 2);
                    vm.DRENAJK_CHECK = true;
                    vm.DRENAJK_ID = db.Database.SqlQuery<int>(queryid).ToList();
                }
                // drenajlarin hamisi
                if (!FILCHECK.DRENAJ.DRENAJFILDS.DRENAJM && !FILCHECK.DRENAJ.DRENAJFILDS.DRENAJI && !FILCHECK.DRENAJ.DRENAJFILDS.DRENAJII && !FILCHECK.DRENAJ.DRENAJFILDS.DRENAJK)
                {
                    //string querycount = "select Count(*) from DRENAJ where " + FILTER.DRENAJ;
                    //string querylengnt = "select SUM(GISLENGTH) from DRENAJ where " + FILTER.DRENAJ;
                    //string querycapability = "select SUM(WATER_CAPABILITY) from DRENAJ where " + FILTER.DRENAJ;
                    //string queryservedarea = "select SUM(SERVED_AREA) from DRENAJ where " + FILTER.DRENAJ;
                    //string querydevicesum = "select SUM(DEVICE_SUM) from DRENAJ where " + FILTER.DRENAJ;
                    //string querywitdh = "select SUM(FACTICAL_LENGTH) from DRENAJ where " + FILTER.DRENAJ;
                    //string queryid = "select DRENAJ.OBJECTID from DRENAJ where " + FILTER.DRENAJ;

                    string RegionQuery = "";
                    if (!FILTER.DRENAJ.Contains("REGIONS_ID") && !FILTER.DRENAJ.Contains("SSI_ID"))
                    {
                        RegionQuery = " and REGIONS_ID > 0 ";
                    }
                    string querylenght0 = "select SUM(STATISTIC.DREN0) from STATISTIC WHERE " + FILTER.DRENAJ + RegionQuery;
                    string querylenght1 = "select SUM(STATISTIC.DREN1) from STATISTIC WHERE " + FILTER.DRENAJ + RegionQuery;
                    string querylenght2 = "select SUM(STATISTIC.DREN2) from STATISTIC WHERE " + FILTER.DRENAJ + RegionQuery;
                    string querylenght3 = "select SUM(STATISTIC.DREN3) from STATISTIC WHERE " + FILTER.DRENAJ + RegionQuery;
                    string queryservedarea = "select SUM(STATISTIC.DREANAREA) from STATISTIC WHERE " + FILTER.DRENAJ + RegionQuery;

                    string querycount0 = "select SUM(STATISTIC.CountDREN0) from STATISTIC WHERE " + FILTER.DRENAJ + RegionQuery;
                    string querycount1 = "select SUM(STATISTIC.CountDREN1) from STATISTIC WHERE " + FILTER.DRENAJ + RegionQuery;
                    string querycount2 = "select SUM(STATISTIC.CountDREN2) from STATISTIC WHERE " + FILTER.DRENAJ + RegionQuery;
                    string querycount3 = "select SUM(STATISTIC.CountDREN3) from STATISTIC WHERE " + FILTER.DRENAJ + RegionQuery;

                    string querydevicesum = "select SUM(STATISTIC.DEVICEDREN) from STATISTIC WHERE " + FILTER.DRENAJ + RegionQuery;
                    string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.DRENAJ + RegionQuery;


                    int chcount0 = db.Database.SqlQuery<int>(querycount0).First();
                    int chcount1 = db.Database.SqlQuery<int>(querycount1).First();
                    int chcount2 = db.Database.SqlQuery<int>(querycount2).First();
                    int chcount3 = db.Database.SqlQuery<int>(querycount3).First();

                    decimal dr0 = (db.Database.SqlQuery<decimal?>(querylenght0).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght0).First()), 2);
                    decimal dr1 = (db.Database.SqlQuery<decimal?>(querylenght1).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght1).First()), 2);
                    decimal dr2 = (db.Database.SqlQuery<decimal?>(querylenght2).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght2).First()), 2);
                    decimal dr3 = (db.Database.SqlQuery<decimal?>(querylenght3).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylenght3).First()), 2);


                    vm.DRENAJ_Count = chcount0 + chcount1 + chcount2 + chcount3;// db.Database.SqlQuery<int>(querycount).First();
                    vm.DRENAJ_Lenght = dr0 + dr1 + dr2 + dr3;// (db.Database.SqlQuery<decimal?>(querylengnt).First()==null)? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylengnt).First()), 2);
                    vm.DRENAJ_WATERCAPABILITY = 0;// (db.Database.SqlQuery<decimal?>(querycapability).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycapability).First()), 2);
                    vm.DRENAJ_ServedArea = (db.Database.SqlQuery<decimal?>(queryservedarea).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea).First()), 2);
                    vm.DRENAJ_DEVICESUM = (db.Database.SqlQuery<decimal?>(querydevicesum).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum).First()), 2);
                    vm.DRENAJ_WITDH = 0;// (db.Database.SqlQuery<decimal?>(querywitdh).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querywitdh).First()), 2);
                    vm.DRENAJ_CHECK = true;
                    vm.DRENAJ_ID = db.Database.SqlQuery<int>(queryid).ToList();
                }
            }

            //DEVICE Hidrotexniki qurğular.
            if (FILCHECK.DEVICE)
            {
                if (FILTER.DEVICE.Contains("REGIONS_ID"))
                {
                    FILTER.DEVICE = FILTER.DEVICE.Replace("REGIONS_ID", "DEVICE.REGIONS_ID");
                }

                //string querycount = "select Count(*) from DEVICE left join CHANNELS on CHANNELS.OBJECTID = DEVICE.CHANNEL_ID left join DRENAJ on DRENAJ.OBJECTID= DEVICE.CHANNEL_ID WHERE " + FILTER.DEVICE;
                //string queryservedarea = "select SUM(DEVICE.SERVED_AREA) from DEVICE left join CHANNELS on CHANNELS.OBJECTID = DEVICE.CHANNEL_ID left join DRENAJ on DRENAJ.OBJECTID= DEVICE.CHANNEL_ID WHERE " + FILTER.DEVICE;
                //string querycapability = "select SUM(DEVICE.WATER_CAPABILITY) from DEVICE left join CHANNELS on CHANNELS.OBJECTID = DEVICE.CHANNEL_ID left join DRENAJ on DRENAJ.OBJECTID= DEVICE.CHANNEL_ID WHERE " + FILTER.DEVICE;
                //string queryid = "select DEVICE.OBJECTID from DEVICE left join CHANNELS on CHANNELS.OBJECTID = DEVICE.CHANNEL_ID left join DRENAJ on DRENAJ.OBJECTID= DEVICE.CHANNEL_ID WHERE " + FILTER.DEVICE;

                string RegionQuery = "";
                if (!FILTER.DEVICE.Contains("REGIONS_ID") && !FILTER.DEVICE.Contains("SSI_ID"))
                {
                    RegionQuery = " and REGIONS_ID > 0 ";
                }
                string devicech = "select SUM(STATISTIC.DEVICESCH) from STATISTIC WHERE " + FILTER.DEVICE + RegionQuery;
                string devicedr = "select SUM(STATISTIC.DEVICEDREN) from STATISTIC WHERE " + FILTER.DEVICE + RegionQuery;

                int devch = (db.Database.SqlQuery<decimal?>(devicech).First() == null) ? 0 : Convert.ToInt32(Convert.ToDouble(db.Database.SqlQuery<decimal?>(devicech).First()));
                int devdr = (db.Database.SqlQuery<decimal?>(devicedr).First() == null) ? 0 : Convert.ToInt32(Convert.ToDouble(db.Database.SqlQuery<decimal?>(devicedr).First()));


                string queryservedareach = "select SUM(STATISTIC.DEVICESCHAREA) from STATISTIC WHERE " + FILTER.DEVICE + RegionQuery;
                string queryservedareadr = "select SUM(STATISTIC.DEVICEDRENAREA) from STATISTIC WHERE " + FILTER.DEVICE + RegionQuery;

                decimal areach = (db.Database.SqlQuery<decimal?>(queryservedareach).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedareach).First()), 2);
                decimal areadr = (db.Database.SqlQuery<decimal?>(queryservedareadr).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedareadr).First()), 2);

                string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.DEVICE + RegionQuery;


                vm.DEVICE_count = devch+ devdr;// db.Database.SqlQuery<int>(querycount).First();
                vm.DEVICE_lenght = 0;
                vm.DEVICE_ServedArea = areach + areadr;
                vm.DEVICE_WATERCAPABILITY = 0;// (db.Database.SqlQuery<decimal?>(querycapability).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycapability).First()), 2);
                vm.DEVICE_DEVICESUM = 0;
                vm.DEVICE_WITDH = 0;
                vm.DEVICE_CHECK = true;
                vm.DEVICE_ID = db.Database.SqlQuery<int>(queryid).ToList();
                
            }

            //ARTEZIAN WELL
            if (FILCHECK.ARTEZIANWELL)
            {
                //string querycount = "select Count(*) from ARTEZIAN_WELL WHERE " + FILTER.ARTEZIANWELL;
                //string querycapability = "select SUM(WATER_CAPABILITY) from ARTEZIAN_WELL WHERE " + FILTER.ARTEZIANWELL;
                //string queryid = "select ARTEZIAN_WELL.OBJECTID from ARTEZIAN_WELL WHERE " + FILTER.ARTEZIANWELL;

                string RegionQuery = "";
                if (!FILTER.ARTEZIANWELL.Contains("REGIONS_ID") && !FILTER.ARTEZIANWELL.Contains("SSI_ID"))
                {
                    RegionQuery = " and REGIONS_ID > 0 ";
                }
                string querycount = "select SUM(STATISTIC.ARTESIAN) from STATISTIC WHERE " + FILTER.ARTEZIANWELL + RegionQuery;
                string queryarea = "select SUM(STATISTIC.ARTESIAN_AREA) from STATISTIC WHERE " + FILTER.ARTEZIANWELL + RegionQuery;
                string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.ARTEZIANWELL + RegionQuery;


                int count = (db.Database.SqlQuery<decimal?>(querycount).First() == null) ? 0 : (int)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycount).First()),0);
                decimal area = (db.Database.SqlQuery<decimal?>(queryarea).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryarea).First()),2);

                vm.ARTEZIAN_COUNT = count;// db.Database.SqlQuery<int>(querycount).First();
                vm.ARTEZIAN_lenght = 0;
                vm.ARTEZIAN_ServedArea = area;
                vm.ARTEZIAN_DEVICESUM = 0;
                vm.ARTEZIAN_WITDH = 0;
                vm.ARTEZIAN_WATERCAPABILITY = 0;// (db.Database.SqlQuery<decimal?>(querycapability).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycapability).First()), 2);
                vm.ARTEZIAN_CHECK = true;
                vm.ARTEZIAN_ID = db.Database.SqlQuery<int>(queryid).ToList();
                
            }

            //WELL
            if (FILCHECK.WELL)
            {
                //string querycount = "select Count(*) from WELL WHERE " + FILTER.WELL;
                //string queryid = "select WELL.OBJECTID from WELL WHERE " + FILTER.WELL;

                string RegionQuery = "";
                if (!FILTER.WELL.Contains("REGIONS_ID") && !FILTER.WELL.Contains("SSI_ID"))
                {
                    RegionQuery = " and REGIONS_ID > 0 ";
                }
                string querycount = "select SUM(STATISTIC.WELLCOUNT) from STATISTIC WHERE " + FILTER.WELL + RegionQuery;
                string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.WELL + RegionQuery;


                int count = (db.Database.SqlQuery<decimal?>(querycount).First() == null) ? 0 : (int)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycount).First()), 0);

                vm.WELL_Count = count;// db.Database.SqlQuery<int>(querycount).First();
                vm.WELL_lenght = 0;
                vm.WELL_ServedArea = 0;
                vm.WELL_WATERCAPABILITY = 0;
                vm.WELL_DEVICESUM = 0;
                vm.WELL_WITDH = 0;
                vm.WELL_CHECK = true;
                vm.WELL_ID= db.Database.SqlQuery<int>(queryid).ToList();
            }

            //PUMPSTATION Nasos stansiyaları.
            if (FILCHECK.PUMPSTATION)
            {
                //string querycount = "select Count(*) from PUMPSTATION WHERE " + FILTER.PUMPSTATION;
                //string queryservedarea = "select  SUM(SERVED_AREA) from PUMPSTATION WHERE " + FILTER.PUMPSTATION;
                //string querycapability = "select  SUM(PRODUCTIVITY) from PUMPSTATION WHERE " + FILTER.PUMPSTATION;
                //string queryid = "select PUMPSTATION.OBJECTID from PUMPSTATION WHERE " + FILTER.PUMPSTATION;

                string RegionQuery = "";
                if (!FILTER.PUMPSTATION.Contains("REGIONS_ID") && !FILTER.PUMPSTATION.Contains("SSI_ID"))
                {
                    RegionQuery = " and REGIONS_ID > 0 ";
                }
                string querychcount = "select SUM(STATISTIC.PUMPSTATIONCH) from STATISTIC WHERE " + FILTER.PUMPSTATION + RegionQuery;
                string querydrcount = "select SUM(STATISTIC.PUMPSTATIONDREN) from STATISTIC WHERE " + FILTER.PUMPSTATION + RegionQuery;
                string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.PUMPSTATION + RegionQuery;

                int countch = (db.Database.SqlQuery<decimal?>(querychcount).First() == null) ? 0 : (int)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querychcount).First()), 0);
                int countdr = (db.Database.SqlQuery<decimal?>(querydrcount).First() == null) ? 0 : (int)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydrcount).First()), 0);

                string queryservedareach = "select  SUM(STATISTIC.PUMPSTATIONCHAREA) from STATISTIC WHERE " + FILTER.PUMPSTATION;
                string queryservedareadr = "select  SUM(STATISTIC.PUMPSTATIONDRENAREA) from STATISTIC WHERE " + FILTER.PUMPSTATION;

                decimal areach = (db.Database.SqlQuery<decimal?>(queryservedareach).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedareach).First()), 2);
                decimal areadr = (db.Database.SqlQuery<decimal?>(queryservedareadr).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedareadr).First()), 2);

                vm.PUMPSTATION_Count = countch + countdr;// db.Database.SqlQuery<int>(querycount).First();
                vm.PUMPSTATION_lenght = 0;
                vm.PUMPSTATION_DEVICESUM = 0;
                vm.PUMPSTATION_WATERCAPABILITY = 0;// (db.Database.SqlQuery<decimal?>(querycapability).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycapability).First()), 2);
                vm.PUMPSTATION_WITDH = 0;
                vm.PUMPSTATION_ServedArea = areach + areadr;// (db.Database.SqlQuery<decimal?>(queryservedarea).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea).First()), 2);
                vm.PUMPSTATION_CHECK = true;
                vm.PUMPSTATION_ID= db.Database.SqlQuery<int>(queryid).ToList();
            }

            //WINTERPASTURES Qış otlaqlarının su təminatı sistemləri
            if (FILCHECK.WINTERPASTURES)
            {
                //string querycount = "select Count(*) from WINTERPASTURES WHERE " + FILTER.WINTERPASTURES;
                //string queryservedarea = "select SUM(SERVED_AREA) from WINTERPASTURES WHERE " + FILTER.WINTERPASTURES;
                //string querydevicesum = "select SUM(DEVICE_SUMM) from WINTERPASTURES WHERE " + FILTER.WINTERPASTURES;
                //string queryid = "select WINTERPASTURES.OBJECTID from WINTERPASTURES WHERE " + FILTER.WINTERPASTURES;

                string RegionQuery = "";
                if (!FILTER.WINTERPASTURES.Contains("REGIONS_ID") && !FILTER.WINTERPASTURES.Contains("SSI_ID"))
                {
                    RegionQuery = " and REGIONS_ID > 0 ";
                }
                string querycount = "select SUM(STATISTIC.PASTURESCOUNT) from STATISTIC WHERE " + FILTER.WINTERPASTURES + RegionQuery;
                string queryservedarea = "select SUM(STATISTIC.PASTURESAREA) from STATISTIC WHERE " + FILTER.WINTERPASTURES;
                string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.WINTERPASTURES + RegionQuery;

                int count = (db.Database.SqlQuery<decimal?>(querycount).First() == null) ? 0 : (int)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycount).First()), 0);


                vm.WINTERPASTURES_count = count;// db.Database.SqlQuery<int>(querycount).First();
                vm.WINTERPASTURES_length = 0;
                vm.WINTERPASTURES_WATERCAPABILITY = 0;
                vm.WINTERPASTURES_WITDH = 0;
                vm.WINTERPASTURES_ServedArea = (db.Database.SqlQuery<decimal?>(queryservedarea).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea).First()), 2);
                vm.WINTERPASTURES_DEVICESUM = 0;// (db.Database.SqlQuery<decimal?>(querydevicesum).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querydevicesum).First()), 2);
                vm.WINTERPASTURES_CHECK = true;
                vm.WINTERPASTURES_ID= db.Database.SqlQuery<int>(queryid).ToList();
            }

            if (FILCHECK.RIVERBAND)
            {
                //string querycount = "select Count(*) from RIVERBAND WHERE " + FILTER.RIVERBAND;
                //string querylengnt = "select SUM(RIVERBAND.LENGTH) from RIVERBAND WHERE " + FILTER.RIVERBAND;
                //string queryid = "select RIVERBAND.OBJECTID from RIVERBAND WHERE " + FILTER.RIVERBAND;

                string RegionQuery = "";
                if (!FILTER.RIVERBAND.Contains("REGIONS_ID") && !FILTER.RIVERBAND.Contains("SSI_ID"))
                {
                    RegionQuery = " and REGIONS_ID > 0 ";
                }
                string querylengnt = "select SUM(STATISTIC.RIVERBANDCOUNT) from STATISTIC WHERE " + FILTER.RIVERBAND + RegionQuery;
                string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.RIVERBAND + RegionQuery;



                vm.RIVERBAND_count = 0;// db.Database.SqlQuery<int>(querycount).First();
                vm.RIVERBAND_lenght = (db.Database.SqlQuery<decimal?>(querylengnt).First()==null)? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylengnt).First()), 2);
                vm.RIVERBAND_WATERCAPABILITY = 0;
                vm.RIVERBAND_ServedArea = 0;
                vm.RIVERBAND_DEVICESUM = 0;
                vm.RIVERBAND_WITDH = 0;
                vm.RIVERBAND_CHECK = true;
                vm.RIVERBAND_ID = db.Database.SqlQuery<int>(queryid).ToList();
            }

            if (FILCHECK.BUILDINGS)
            {
                //string querycount = "select Count(*) from BUILDINGS WHERE " + FILTER.BUILDINGS;
                //string queryservedarea = "select SUM(SERVED_AREA) from BUILDINGS WHERE " + FILTER.BUILDINGS;
                //string queryid = "select BUILDINGS.OBJECTID from BUILDINGS WHERE " + FILTER.BUILDINGS;

                string RegionQuery = "";
                if (!FILTER.BUILDINGS.Contains("REGIONS_ID") && !FILTER.BUILDINGS.Contains("SSI_ID"))
                {
                    RegionQuery = " and REGIONS_ID > 0 ";
                }
                string querycount = "select SUM(STATISTIC.BUILDINGCOUNT) from STATISTIC WHERE " + FILTER.BUILDINGS + RegionQuery;
                string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.BUILDINGS + RegionQuery;

                int count = (db.Database.SqlQuery<decimal?>(querycount).First() == null) ? 0 : (int)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querycount).First()), 0);


                vm.BUILDINGS_count = count;// db.Database.SqlQuery<int>(querycount).First();
                vm.BUILDINGS_lenght = 0;
                vm.BUILDINGS_WATERCAPABILITY = 0;
                vm.BUILDINGS_WITDH = 0;
                vm.BUILDINGS_DEVICESUM = 0;
                vm.BUILDINGS_ServedArea = 0;// (db.Database.SqlQuery<decimal?>(queryservedarea).First() == null) ? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(queryservedarea).First()), 2);
                vm.BUILDINGS_CHECK = true;
                vm.BUILDINGS_ID =db.Database.SqlQuery<int>(queryid).ToList();
            }

            if (FILCHECK.EXPLONATION_ROAD)
            {
                //string querycount = "select Count(*) from EXPLOITATION_ROAD WHERE " + FILTER.EXPLONATION_ROAD;
                //string querylengnt = "select SUM(LENGHT) from EXPLOITATION_ROAD WHERE " + FILTER.EXPLONATION_ROAD;
                //string queryid = "select EXPLOITATION_ROAD.OBJECTID from EXPLOITATION_ROAD WHERE " + FILTER.EXPLONATION_ROAD;

                string RegionQuery = "";
                if (!FILTER.EXPLONATION_ROAD.Contains("REGIONS_ID") && !FILTER.EXPLONATION_ROAD.Contains("SSI_ID"))
                {
                    RegionQuery = " and REGIONS_ID > 0 ";
                }
                string querylengnt = "select SUM(STATISTIC.ROADSCOUNT) from STATISTIC WHERE " + FILTER.EXPLONATION_ROAD + RegionQuery;
                string queryid = "select STATISTIC.OBJECTID from STATISTIC WHERE " + FILTER.EXPLONATION_ROAD + RegionQuery;


                vm.EXPLONATION_ROAD_count = 0;// db.Database.SqlQuery<int>(querycount).First();
                vm.EXPLONATION_ROAD_lenght = (db.Database.SqlQuery<decimal?>(querylengnt).First()==null)? 0 : (decimal)Math.Round(Convert.ToDouble(db.Database.SqlQuery<decimal?>(querylengnt).First()), 2);
                vm.EXPLONATION_ROAD_WATERCAPABILITY = 0;
                vm.EXPLONATION_ROAD_ServedArea = 0;
                vm.EXPLONATION_ROAD_DEVICESUM = 0;
                vm.EXPLONATION_ROAD_WITDH = 0;
                vm.EXPLONATION_ROAD_CHECK = true;
                vm.EXPLONATION_ROAD_ID = db.Database.SqlQuery<int>(queryid).ToList();
            }


            return Json(vm, JsonRequestBehavior.AllowGet);
        }



        //search
        public ActionResult Search(string name)
        {
            //var sqlquery = "select NAME from CHANNELS where NAME like '" + name + "%'";
            //var channel = db.Database.SqlQuery<string>(sqlquery).ToList();
            //var sqlquerydrenaj = "select NAME from DRENAJ where NAME like '" + name + "%'";
            //var drenaj = db.Database.SqlQuery<string>(sqlquerydrenaj).ToList();
            
            IEnumerable<SearchResult> query = db.CHANNELS.Where(x => x.NAME != null && x.NAME.ToLower().StartsWith(name.ToLower())).Select(ch =>new SearchResult() { NAME = ch.NAME , TABLENAME = "KANAL" })
                .Concat(db.DRENAJs.Where(x => x.NAME != null && x.NAME.ToLower().StartsWith(name.ToLower())).Select(drj => new SearchResult() { NAME = drj.NAME, TABLENAME = "DRENAJ" }))
                .Concat(db.DEVICEs.Where(x => x.NAME != null && x.NAME.ToLower().StartsWith(name.ToLower())).Select(dev => new SearchResult() { NAME = dev.NAME, TABLENAME = "DEVICE" }))
                .Concat(db.ARTEZIAN_WELL.Where(x => x.REPER_NO != null && x.REPER_NO.ToLower().StartsWith(name.ToLower())).Select(sw => new SearchResult() { NAME = sw.REPER_NO, TABLENAME = "ARTEZIAN" }))
                .Concat(db.WELLs.Where(x => x.NAME != null && x.NAME.ToLower().StartsWith(name.ToLower())).Select(w => new SearchResult() { NAME = w.NAME, TABLENAME = "WELL" }))
                .Concat(db.PUMPSTATIONs.Where(x => x.NAME != null && x.NAME.ToLower().StartsWith(name.ToLower())).Select(p => new SearchResult() { NAME = p.NAME, TABLENAME = "PUMSTATION" }))
                .Concat(db.WINTERPASTURES.Where(x => x.NAME != null && x.NAME.ToLower().StartsWith(name.ToLower())).Select(win => new SearchResult() { NAME = win.NAME, TABLENAME = "WINTERPASTURES" }))
                .Concat(db.RIVERBANDs.Where(x => x.NAME != null && x.NAME.ToLower().StartsWith(name.ToLower())).Select(riv => new SearchResult() { NAME = riv.NAME, TABLENAME = "RIVERBAND" }))
                .Concat(db.BUILDINGS.Where(x => x.NAME != null && x.NAME.ToLower().StartsWith(name.ToLower())).Select(b => new SearchResult() { NAME = b.NAME, TABLENAME = "BUILDINGS" }))
                .Concat(db.EXPLOITATION_ROAD.Where(x => x.NAME != null && x.NAME.ToLower().StartsWith(name.ToLower())).Select(ex => new SearchResult() { NAME = ex.NAME, TABLENAME = "EXPLOITATION_ROAD" }));


            if (query.Count() >= 15)
            {
                query = query.Take(15);
            }

            return Json(query, JsonRequestBehavior.AllowGet);
        }


        //var movies = _db.Movies.Where(p => p.Genres.Intersect(listOfGenres).Any());



        //demo test 
        public ActionResult test()
        {
            string queryString = "select * from REGIONS";

            db.Database.SqlQuery<List<REGION>>(queryString);

            
            return Json("", JsonRequestBehavior.AllowGet);
        }



    }
}

