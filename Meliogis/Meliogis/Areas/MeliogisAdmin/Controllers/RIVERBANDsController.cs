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
    public class RIVERBANDsController : Controller
    {
        private MelorEntities db = new MelorEntities();

        // GET: MeliogisAdmin/RIVERBANDs
        public ActionResult Index(int? page)
        {
            USER logineduser = (USER)Session["LoginedUser"];

            var rIVERBANDs = db.RIVERBANDs.Where(r => r.SSI_ID == logineduser.REL_SIB_ID);
            var data = rIVERBANDs.ToList();
            var pageNumber = page ?? 1;
            var onepage = data.ToPagedList(pageNumber, 10);
            return View(onepage);
        }

        // GET: MeliogisAdmin/RIVERBANDs/Edit/5
        public ActionResult Edit(int? id)
        {
            USER logineduser = (USER)Session["LoginedUser"];
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            RIVERBAND rIVERBAND = db.RIVERBANDs.Find(id);
            if (rIVERBAND == null)
            {
                return HttpNotFound();
            }
            ViewBag.ASSIGMENT_ID = db.ASSIGMENTs;
            ViewBag.COVER_TYPE_ID = db.COVER_TYPES;
            ViewBag.PLACED_SOURCE_ID = db.PLACED_SOURCE;
            ViewBag.PROPERTY_TYPE_ID = db.PROPERTY_TYPE;
            ViewBag.VILLAGE_ID = db.VILLAGEs.Where(w => w.REL_ID == rIVERBAND.REGIONS_ID);
            ViewBag.REGIONS_ID = db.REGIONS.OrderBy(s=>s.Adi);
            ViewBag.TECHNICAL_TYPE_ID = db.TECHNICAL_TYPE;
            ViewBag.SIBS_ID = db.SIBS.Where(s => s.SSI_ID == logineduser.REL_SIB_ID);
            return View(rIVERBAND);
        }

        // POST: MeliogisAdmin/RIVERBANDs/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "OBJECTID,NAME,HEIGHT,LENGTH,NOTE,SECURITY_TYPE_ID,VILLAGE_ID,COVER_TYPE_ID,TECHNICAL_TYPE_ID,PROPERTY_TYPE_ID,ASSIGMENT_ID,PLACED_SOURCE_ID,REGIONS_ID,SIBS_ID,EXPLONATION_DATE")] RIVERBAND rIVERBAND)
        {
            USER logineduser = (USER)Session["LoginedUser"];
            if (ModelState.IsValid)
            {
                db.Entry(rIVERBAND).State = EntityState.Modified;
                db.Entry(rIVERBAND).Property(c => c.SHAPE).IsModified = false;
                db.Entry(rIVERBAND).Property(c => c.SSI_ID).IsModified = false;
                db.Entry(rIVERBAND).Property(c => c.PLACED_SOURCE_ID).IsModified = false;

                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.ASSIGMENT_ID = db.ASSIGMENTs;
            ViewBag.COVER_TYPE_ID = db.COVER_TYPES;
            ViewBag.PLACED_SOURCE_ID = db.PLACED_SOURCE;
            ViewBag.PROPERTY_TYPE_ID = db.PROPERTY_TYPE;
            ViewBag.VILLAGE_ID = db.VILLAGEs.Where(w=>w.REL_ID==rIVERBAND.REGIONS_ID);
            ViewBag.REGIONS_ID = db.REGIONS;
            ViewBag.TECHNICAL_TYPE_ID = db.TECHNICAL_TYPE;
            ViewBag.SIBS_ID = db.SIBS.Where(s => s.SSI_ID == logineduser.REL_SIB_ID);
            return View(rIVERBAND);
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
