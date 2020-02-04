using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Meliogis.Models;
using X.PagedList;

namespace Meliogis.Areas.MeliogisAdmin.Controllers
{
    [AdminAuthenticationController]

    public class ARTEZIAN_WELLController : Controller
    {
        private MelorEntities db = new MelorEntities();

        // GET: MeliogisAdmin/ARTEZIAN_WELL
        public ActionResult Index(int? page)
        {
            USER logineduser = (USER)Session["LoginedUser"];

            var aRTEZIAN_WELL = db.ARTEZIAN_WELL.Where(a => a.SSI_ID == logineduser.REL_SIB_ID);
            var data = aRTEZIAN_WELL.ToList();
            var pageNumber = page ?? 1;
            var onepage = data.ToPagedList(pageNumber, 10);
            return View(onepage);
        }

        // GET: MeliogisAdmin/ARTEZIAN_WELL/Edit/5
        public ActionResult Edit(int? id)
        {
            USER logineduser = (USER)Session["LoginedUser"];
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ARTEZIAN_WELL aRTEZIAN_WELL = db.ARTEZIAN_WELL.Find(id);
            if (aRTEZIAN_WELL == null)
            {
                return HttpNotFound();
            }
            ViewBag.ACTIVITY_ID = db.ACTIVITies;
            ViewBag.ASSIGMENT_ID = db.ASSIGMENTs;
            ViewBag.SSI_ID = db.PROPERTies;
            ViewBag.PROPERTY_TYPE_ID = db.PROPERTY_TYPE;
            ViewBag.PUMPSTATION_BRAND_ID = db.PUMPSTATION_BRAND;
            ViewBag.VILLAGE_ID = db.VILLAGEs.Where(w => w.REL_ID == aRTEZIAN_WELL.REGIONS_ID);
            ViewBag.REGIONS_ID = db.REGIONS.OrderBy(s => s.Adi);
            ViewBag.SIBS_ID = db.SIBS.Where(s => s.SSI_ID == logineduser.REL_SIB_ID);
            ViewBag.WELL_TYPE_ID = db.WELL_TYPE;
            return View(aRTEZIAN_WELL);
        }

        // POST: MeliogisAdmin/ARTEZIAN_WELL/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "OBJECTID,REPER_NO,IRRIGATED_AREA,DEPTH,WATER_CAPABILITY,PRODUCTIVITY,WELL_TYPE_ID,ASSIGMENT_ID,ACTIVITY_ID,PROPERTY_TYPE_ID,PUMPSTATION_BRAND_ID,VILLAGE_ID,REGIONS_ID,EXPLONATION_DATE,SIB_ID,POINT_X,POINT_Y,POINT_Z,POINT_M")] ARTEZIAN_WELL aRTEZIAN_WELL)
        {
            USER logineduser = (USER)Session["LoginedUser"];
            if (ModelState.IsValid)
            {
                db.Entry(aRTEZIAN_WELL).State = EntityState.Modified;
                db.Entry(aRTEZIAN_WELL).Property(c => c.SHAPE).IsModified = false;
                db.Entry(aRTEZIAN_WELL).Property(c => c.SSI_ID).IsModified = false;
                db.Entry(aRTEZIAN_WELL).Property(c => c.NUMBER_).IsModified = false;
                db.Entry(aRTEZIAN_WELL).Property(c => c.X).IsModified = false;
                db.Entry(aRTEZIAN_WELL).Property(c => c.Y).IsModified = false;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.ACTIVITY_ID = db.ACTIVITies;
            ViewBag.ASSIGMENT_ID = db.ASSIGMENTs;
            ViewBag.SSI_ID = db.PROPERTies;
            ViewBag.PROPERTY_TYPE_ID = db.PROPERTY_TYPE;
            ViewBag.PUMPSTATION_BRAND_ID = db.PUMPSTATION_BRAND;
            ViewBag.VILLAGE_ID = db.VILLAGEs.Where(w => w.REL_ID == aRTEZIAN_WELL.REGIONS_ID);
            ViewBag.REGIONS_ID = db.REGIONS.OrderBy(s => s.Adi);
            ViewBag.SIBS_ID = db.SIBS.Where(s => s.SSI_ID == logineduser.REL_SIB_ID);
            ViewBag.WELL_TYPE_ID = db.WELL_TYPE;
            return View(aRTEZIAN_WELL);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
