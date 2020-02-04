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

    public class WELLsController : Controller
    {
        private MelorEntities db = new MelorEntities();

        // GET: MeliogisAdmin/WELLs
        public ActionResult Index(int? page)
        {
            USER logineduser = (USER)Session["LoginedUser"];

            var wELLs = db.WELLs.Where(w => w.SSI_ID == logineduser.REL_SIB_ID);
            var data = wELLs.ToList();
            var pageNumber = page ?? 1;
            var onepage = data.ToPagedList(pageNumber, 10);
            return View(onepage);
        }

        // GET: MeliogisAdmin/WELLs/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            WELL wELL = db.WELLs.Find(id);
            if (wELL == null)
            {
                return HttpNotFound();
            }
            ViewBag.ACTIVITY_ID = new SelectList(db.ACTIVITies, "OBJECTID", "NAME", wELL.ACTIVITY_ID);
            ViewBag.ASSIGMENT_ID = new SelectList(db.ASSIGMENTs, "OBJECTID", "NAME", wELL.ASSIGMENT_ID);
            ViewBag.PROPERTY_TYPE_ID = new SelectList(db.PROPERTY_TYPE, "OBJECTID", "NAME", wELL.PROPERTY_TYPE_ID);
            ViewBag.VILLAGE_ID = new SelectList(db.REGIONS, "OBJECTID", "Adi", wELL.VILLAGE_ID);
            ViewBag.REGIONS_ID = new SelectList(db.REGIONS, "OBJECTID", "Adi", wELL.REGIONS_ID);
            ViewBag.SIBS_ID = new SelectList(db.SIBS, "OBJECTID", "NAME", wELL.SIBS_ID);
            ViewBag.TECHNICAL_TYPE_ID = new SelectList(db.TECHNICAL_TYPE, "OBJECTID", "NAME", wELL.TECHNICAL_TYPE_ID);
            ViewBag.WELL_TYPE_ID = new SelectList(db.WELL_TYPE, "OBJECTID", "NAME", wELL.WELL_TYPE_ID);
            return View(wELL);
        }

        // POST: MeliogisAdmin/WELLs/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "OBJECTID,NAME,IRRIGATED_AREA,DEPTH,NUMBER_,PRODUCTIVITY,SECURITY_TYPE_ID,NOTE,WELL_TYPE_ID,ASSIGMENT_ID,SIBS_ID,ACTIVITY_ID,TECHNICAL_TYPE_ID,PROPERTY_TYPE_ID,REGIONS_ID,VILLAGE_ID,EXPLONATION_DATE")] WELL wELL)
        {
            if (ModelState.IsValid)
            {
                db.Entry(wELL).State = EntityState.Modified;
                db.Entry(wELL).Property(c => c.SSI_ID).IsModified = false;
                db.Entry(wELL).Property(c => c.SHAPE).IsModified = false;

                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.ACTIVITY_ID = new SelectList(db.ACTIVITies, "OBJECTID", "NAME", wELL.ACTIVITY_ID);
            ViewBag.ASSIGMENT_ID = new SelectList(db.ASSIGMENTs, "OBJECTID", "NAME", wELL.ASSIGMENT_ID);
            ViewBag.PROPERTY_TYPE_ID = new SelectList(db.PROPERTY_TYPE, "OBJECTID", "NAME", wELL.PROPERTY_TYPE_ID);
            ViewBag.VILLAGE_ID = new SelectList(db.REGIONS, "OBJECTID", "Adi", wELL.VILLAGE_ID);
            ViewBag.REGIONS_ID = new SelectList(db.REGIONS, "OBJECTID", "Adi", wELL.REGIONS_ID);
            ViewBag.SIBS_ID = new SelectList(db.SIBS, "OBJECTID", "NAME", wELL.SIBS_ID);
            ViewBag.TECHNICAL_TYPE_ID = new SelectList(db.TECHNICAL_TYPE, "OBJECTID", "NAME", wELL.TECHNICAL_TYPE_ID);
            ViewBag.WELL_TYPE_ID = new SelectList(db.WELL_TYPE, "OBJECTID", "NAME", wELL.WELL_TYPE_ID);
            return View(wELL);
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
