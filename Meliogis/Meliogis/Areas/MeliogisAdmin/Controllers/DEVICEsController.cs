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
    public class DEVICEsController : Controller
    {
        private MelorEntities db = new MelorEntities();

        // GET: MeliogisAdmin/DEVICEs
        public ActionResult Index(int? page)
        {
            USER logineduser = (USER)Session["LoginedUser"];

            var dEVICEs = db.DEVICEs.Where(d => d.SSI_ID == logineduser.REL_SIB_ID);
            var data = dEVICEs.ToList();
            var pageNumber = page ?? 1;
            var onepage = data.ToPagedList(pageNumber, 10);
            return View(onepage);
        }

        // GET: MeliogisAdmin/DEVICEs/Edit/5
        public ActionResult Edit(int? id)
        {
            USER logineduser = (USER)Session["LoginedUser"];
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            DEVICE dEVICE = db.DEVICEs.Find(id);
            if (dEVICE == null)
            {
                return HttpNotFound();
            }
            ViewBag.ACTIVITY_ID =db.ACTIVITies;
            ViewBag.NETWORK_TYPE_ID = db.NETWORK_TYPE;
            ViewBag.PROPERTY_TYPE_ID = db.PROPERTY_TYPE;
            ViewBag.REGIONS_ID = db.REGIONS.OrderBy(s=>s.Adi);
            ViewBag.VILLAGE_ID = db.VILLAGEs.Where(w => w.REL_ID == dEVICE.REGIONS_ID);
            ViewBag.TECHNICAL_TYPE_ID = db.TECHNICAL_TYPE;
            ViewBag.SECURITY_TYPE_ID = db.SECURITY_TYPE;
            ViewBag.SIBS_ID = db.SIBS.Where(s => s.SSI_ID == logineduser.REL_SIB_ID);
            return View(dEVICE);
        }

        // POST: MeliogisAdmin/DEVICEs/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "OBJECTID,NAME,WATER_CAPABILITY,SERVED_AREA,NOTE,ACTIVITY_ID,PROPERTY_TYPE_ID,TECHNICAL_TYPE_ID,SECURITY_TYPE_ID,REGIONS_ID,VILLAGE_ID,SIBS_ID,EXPLONATION_DATE,NETWORK_TYPE_ID,CHANNEL_ID")] DEVICE dEVICE)
        {
            USER logineduser = (USER)Session["LoginedUser"];
            if (ModelState.IsValid)
            {
                db.Entry(dEVICE).State = EntityState.Modified;
                db.Entry(dEVICE).Property(c => c.SHAPE).IsModified = false;
                db.Entry(dEVICE).Property(c => c.SSI_ID).IsModified = false;
                db.Entry(dEVICE).Property(c => c.CHANNEL_ID).IsModified = false;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.ACTIVITY_ID = db.ACTIVITies;
            ViewBag.NETWORK_TYPE_ID = db.NETWORK_TYPE;
            ViewBag.PROPERTY_TYPE_ID = db.PROPERTY_TYPE;
            ViewBag.REGIONS_ID = db.REGIONS.OrderBy(s => s.Adi);
            ViewBag.VILLAGE_ID = db.VILLAGEs.Where(w => w.REL_ID == dEVICE.REGIONS_ID);
            ViewBag.TECHNICAL_TYPE_ID = db.TECHNICAL_TYPE;
            ViewBag.SECURITY_TYPE_ID = db.SECURITY_TYPE;
            ViewBag.SIBS_ID = db.SIBS.Where(s => s.SSI_ID == logineduser.REL_SIB_ID);
            return View(dEVICE);
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
