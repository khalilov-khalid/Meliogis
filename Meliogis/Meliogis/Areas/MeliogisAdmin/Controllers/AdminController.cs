using Meliogis.CopyModel;
using Meliogis.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace Meliogis.Areas.MeliogisAdmin.Controllers
{
    [AdminAuthenticationController]
    public class AdminController : Controller
    {
        private MelorEntities db = new MelorEntities();

        // GET: MeliogisAdmin/Admin
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetVillageForEdit(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            List<CopyREGIONS> Villagelist = db.VILLAGEs.Where(v => v.REL_ID == id).Select(s=> new CopyREGIONS() {
                OBJECTID=s.OBJECTID,
                NAME=s.NAME,
                REL_ID=(int)s.REL_ID,
                REGION_TYPE_ID=(int)s.REGION_TYPE_ID
            }).ToList();
            return Json(Villagelist, JsonRequestBehavior.AllowGet);
        }

        public ActionResult NotFound()
        {
            return View();
        }
    }
}