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
    public class WINTERPASTUREsController : Controller
    {
        private MelorEntities db = new MelorEntities();

        
        // GET: MeliogisAdmin/WINTERPASTUREs
        public ActionResult Index(int? page)
        {
            USER logineduser = (USER)Session["LoginedUser"];

            var wINTERPASTURES = db.WINTERPASTURES.Where(w => w.SSI_ID == logineduser.REL_SIB_ID);
            var data = wINTERPASTURES.ToList();
            var pageNumber = page ?? 1;
            var onepage = data.ToPagedList(pageNumber, 10);
            return View(onepage);
        }

        // GET: MeliogisAdmin/WINTERPASTUREs/Edit/5
        public ActionResult Edit(int? id)
        {
            USER logineduser = (USER)Session["LoginedUser"];
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            WINTERPASTURE wINTERPASTURE = db.WINTERPASTURES.Find(id);
            if (wINTERPASTURE == null)
            {
                return HttpNotFound();
            }
            ViewBag.PROPERTY_TYPE_ID = db.PROPERTY_TYPE;
            ViewBag.VILLAGE_ID = db.VILLAGEs.Where(r => r.REGION_TYPE_ID != 1 && r.REL_ID == wINTERPASTURE.REGIONS_ID);
            ViewBag.REGIONS_ID = db.REGIONS.Where(r => r.REGION_TYPE_ID == 1);
            ViewBag.SIBS_ID = db.SIBS.Where(s => s.SSI_ID == logineduser.REL_SIB_ID);

            return View(wINTERPASTURE);
        }

        // POST: MeliogisAdmin/WINTERPASTUREs/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "OBJECTID,NAME,DEVICE_SUM,WATER_PIPE,VILLAGE_ID,PROPERTY_TYPE_ID,REGIONS_ID,SIBS_ID,SERVED_AREA,DEVICE_SUMM")] WINTERPASTURE wINTERPASTURE)
        {
            USER logineduser = (USER)Session["LoginedUser"];
            if (ModelState.IsValid)
            {
                db.Entry(wINTERPASTURE).State = EntityState.Modified;
                db.Entry(wINTERPASTURE).Property(c => c.SHAPE).IsModified = false;
                db.Entry(wINTERPASTURE).Property(c => c.SSI_ID).IsModified = false;
                db.SaveChanges();
                return RedirectToAction("Index");
            }            
            ViewBag.PROPERTY_TYPE_ID = db.PROPERTY_TYPE;
            ViewBag.VILLAGE_ID = db.VILLAGEs.Where(r => r.REGION_TYPE_ID != 1 && r.REL_ID == wINTERPASTURE.REGIONS_ID);
            ViewBag.REGIONS_ID = db.REGIONS.Where(r => r.REGION_TYPE_ID == 1);
            ViewBag.SIBS_ID = db.SIBS.Where(s => s.SSI_ID == logineduser.REL_SIB_ID);

            return View(wINTERPASTURE);
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
