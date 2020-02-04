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
    public class PUMPSTATIONsController : Controller
    {
        private MelorEntities db = new MelorEntities();

        // GET: MeliogisAdmin/PUMPSTATIONs
        public ActionResult Index(int? page)
        {
            USER logineduser = (USER)Session["LoginedUser"];

            var pUMPSTATIONs = db.PUMPSTATIONs.Where(p => p.SSI_ID == logineduser.REL_SIB_ID);
            var data = pUMPSTATIONs.ToList();
            var pageNumber = page ?? 1;
            var onepage = data.ToPagedList(pageNumber, 10);
            return View(onepage);
        }

        // GET: MeliogisAdmin/PUMPSTATIONs/Edit/5
        public ActionResult Edit(int? id)
        {
            USER logineduser = (USER)Session["LoginedUser"];
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PUMPSTATION pUMPSTATION = db.PUMPSTATIONs.Find(id);
            if (pUMPSTATION == null)
            {
                return HttpNotFound();
            }
            ViewBag.ASSIGMENT_ID =db.ASSIGMENTs;
            ViewBag.BRAND_OF_AGGREGATE_ID = db.BRAND_OF_AGGREGATE;
            ViewBag.ENGINE_BRAND_ID = db.ENGINE_BRAND;
            ViewBag.ENGINE_KIND_ID = db.ENGINE_KIND;
            ViewBag.PIPELINE_MATERIAL_ID = db.PIPELINE_MATERIAL;
            ViewBag.PLACED_SOURCE_ID = db.PLACED_SOURCE;
            ViewBag.PROPERTY_TYPE_ID = db.PROPERTY_TYPE;
            ViewBag.PUMP_KIND_ID =db.PUMP_KIND;
            ViewBag.PUMP_TYPE_ID =db.PUMP_TYPE;
            ViewBag.VILLAGE_ID = db.VILLAGEs.Where(w => w.REL_ID == pUMPSTATION.REGIONS_ID);
            ViewBag.REGIONS_ID = db.REGIONS.OrderBy(s => s.Adi);
            ViewBag.SIBS_ID = db.SIBS.Where(s => s.SSI_ID == logineduser.REL_SIB_ID);
            return View(pUMPSTATION);
        }

        // POST: MeliogisAdmin/PUMPSTATIONs/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "OBJECTID,POWER,PRODUCTIVITY,PURPOSEFUL,NAME,PIPELINE,PIPELINE_LENGHT,ENGINE_INSTALL_DATE,NOTE,VILLAGE_ID,SHAPE,PLACED_SOURCE_ID,PUMP_KIND_ID,PUMP_TYPE_ID,BRAND_OF_AGGREGATE_ID,PIPELINE_DIAMETER_ID,PIPELINE_MATERIAL_ID,ENGINE_BRAND_ID,ENGINE_KIND_ID,SSI_ID,PROPERTY_TYPE_ID,ASSIGMENT_ID,REGIONS_ID,SIBS_ID,EXPLONATION_DATE,SERVED_AREA,AGREGAT_SUM")] PUMPSTATION pUMPSTATION)
        {
            USER logineduser = (USER)Session["LoginedUser"];
            if (ModelState.IsValid)
            {
                db.Entry(pUMPSTATION).State = EntityState.Modified;
                db.Entry(pUMPSTATION).Property(c => c.SHAPE).IsModified = false;
                db.Entry(pUMPSTATION).Property(c => c.SSI_ID).IsModified = false;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.ASSIGMENT_ID = db.ASSIGMENTs;
            ViewBag.BRAND_OF_AGGREGATE_ID = db.BRAND_OF_AGGREGATE;
            ViewBag.ENGINE_BRAND_ID = db.ENGINE_BRAND;
            ViewBag.ENGINE_KIND_ID = db.ENGINE_KIND;
            ViewBag.PIPELINE_MATERIAL_ID = db.PIPELINE_MATERIAL;
            ViewBag.PLACED_SOURCE_ID = db.PLACED_SOURCE;
            ViewBag.PROPERTY_TYPE_ID = db.PROPERTY_TYPE;
            ViewBag.PUMP_KIND_ID = db.PUMP_KIND;
            ViewBag.PUMP_TYPE_ID = db.PUMP_TYPE;
            ViewBag.VILLAGE_ID = db.VILLAGEs.Where(w => w.REL_ID == pUMPSTATION.REGIONS_ID);
            ViewBag.REGIONS_ID = db.REGIONS.OrderBy(s => s.Adi);
            ViewBag.SIBS_ID = db.SIBS.Where(s => s.SSI_ID == logineduser.REL_SIB_ID);
            return View(pUMPSTATION);
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
