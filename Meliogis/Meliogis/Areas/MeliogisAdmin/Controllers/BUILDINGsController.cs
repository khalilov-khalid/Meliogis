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
    public class BUILDINGsController : Controller
    {
        private MelorEntities db = new MelorEntities();

        // GET: MeliogisAdmin/BUILDINGs
        public ActionResult Index(int? page)
        {
            USER logineduser = (USER)Session["LoginedUser"];

            var bUILDINGS = db.BUILDINGS.Where(b => b.SSI_ID == logineduser.REL_SIB_ID);
            var data = bUILDINGS.ToList();
            var pageNumber = page ?? 1;
            var onepage = data.ToPagedList(pageNumber, 10);
            return View(onepage);
        }
        
        // GET: MeliogisAdmin/BUILDINGs/Edit/5
        public ActionResult Edit(int? id)
        {
            USER logineduser = (USER)Session["LoginedUser"];
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            BUILDING bUILDING = db.BUILDINGS.Find(id);
            if (bUILDING == null)
            {
                return HttpNotFound();
            }
            ViewBag.ASSIGMENT_ID = db.ASSIGMENTs;
            ViewBag.ACTIVITY_ID = db.ACTIVITies;
            ViewBag.PROPERTY_TYPE_ID = db.PROPERTY_TYPE;
            ViewBag.VILLAGE_ID = db.VILLAGEs.Where(w => w.REL_ID == bUILDING.REGIONS_ID);
            ViewBag.REGIONS_ID = db.REGIONS.OrderBy(s => s.Adi);
            ViewBag.SIBS_ID = db.SIBS.Where(s => s.SSI_ID == logineduser.REL_SIB_ID);
            return View(bUILDING);
        }

        // POST: MeliogisAdmin/BUILDINGs/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "OBJECTID,NAME,ACTION,ASSIGMENT_ID,PROTECTING,TOTAL_AREA,USING_MODE,SERVICE_AR,VILLAGE_ID,ACTIVITY_ID,PROPERTY_TYPE_ID,REGIONS_ID,SIBS_ID,EXPLONATION")] BUILDING bUILDING)
        {
            USER logineduser = (USER)Session["LoginedUser"];
            if (ModelState.IsValid)
            {
                db.Entry(bUILDING).State = EntityState.Modified;
                db.Entry(bUILDING).Property(c => c.SHAPE).IsModified = false;
                db.Entry(bUILDING).Property(c => c.SSI_ID).IsModified = false;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.ASSIGMENT_ID = db.ASSIGMENTs;
            ViewBag.ACTIVITY_ID = db.ACTIVITies;
            ViewBag.PROPERTY_TYPE_ID = db.PROPERTY_TYPE;
            ViewBag.VILLAGE_ID = db.VILLAGEs.Where(w => w.REL_ID == bUILDING.REGIONS_ID);
            ViewBag.REGIONS_ID = db.REGIONS.OrderBy(s => s.Adi);
            ViewBag.SIBS_ID = db.SIBS.Where(s => s.SSI_ID == logineduser.REL_SIB_ID);
            return View(bUILDING);
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
