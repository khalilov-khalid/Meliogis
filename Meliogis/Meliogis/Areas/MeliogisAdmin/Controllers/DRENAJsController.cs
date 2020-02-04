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
    public class DRENAJsController : Controller
    {
        private MelorEntities db = new MelorEntities();

        // GET: MeliogisAdmin/DRENAJs
        public ActionResult Index(int? page, string type)
        {
            USER logineduser = (USER)Session["LoginedUser"];
            if (type == "M")
            {
                Session["IndexDenajParametr"] = "M";
                var drenaj = db.DRENAJs.Where(s => s.CHANNEL_TYPE_ID == 4 && s.SSI_ID == logineduser.REL_SIB_ID);
                ViewBag.Type = "M";
                var data = drenaj.ToList();
                var pageNumber = page ?? 1;
                var onepage = data.ToPagedList(pageNumber, 10);
                return View(onepage);
            }
            if (type == "I")
            {
                Session["IndexDenajParametr"] = "I";
                var drenaj = db.DRENAJs.Where(s => s.CHANNEL_TYPE_ID == 1 && s.SSI_ID == logineduser.REL_SIB_ID);
                ViewBag.Type = "I";
                var data = drenaj.ToList();
                var pageNumber = page ?? 1;
                var onepage = data.ToPagedList(pageNumber, 10);
                return View(onepage);
            }
            if (type == "II")
            {
                Session["IndexDenajParametr"] = "II";
                var drenaj = db.DRENAJs.Where(s => s.CHANNEL_TYPE_ID == 2 && s.SSI_ID == logineduser.REL_SIB_ID);
                ViewBag.Type = "II";
                var data = drenaj.ToList();
                var pageNumber = page ?? 1;
                var onepage = data.ToPagedList(pageNumber, 10);
                return View(onepage);
            }
            if (type == "III")
            {
                Session["IndexDenajParametr"] = "III";
                var drenaj = db.DRENAJs.Where(s => s.CHANNEL_TYPE_ID == 3 && s.SSI_ID == logineduser.REL_SIB_ID);
                ViewBag.Type = "III";
                var data = drenaj.ToList();
                var pageNumber = page ?? 1;
                var onepage = data.ToPagedList(pageNumber, 10);
                return View(onepage);
            }

            return RedirectToAction("NotFound", "Admin");
        }

        // GET: MeliogisAdmin/DRENAJs/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            DRENAJ dRENAJ = db.DRENAJs.Find(id);
            if (dRENAJ == null)
            {
                return HttpNotFound();
            }
            ViewBag.ACTIVITY_ID = db.ACTIVITies;
            ViewBag.ASSIGMENT_ID = db.ASSIGMENTs;
            ViewBag.CHANNEL_TYPE_ID = db.CHANNEL_TYPES;
            ViewBag.KIND_ID =db.KINDs;
            ViewBag.PROPERTY_TYPE_ID = db.PROPERTY_TYPE;
            ViewBag.VILLAGE_ID = db.VILLAGEs.Where(w => w.REL_ID == dRENAJ.REGIONS_ID);
            ViewBag.REGIONS_ID = db.REGIONS.OrderBy(s => s.Adi);
            ViewBag.TECHNICAL_CONDINITION_ID = db.TECHNICAL_TYPE;
            return View(dRENAJ);
        }

        // POST: MeliogisAdmin/DRENAJs/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "OBJECTID,WATERPROOF_WIDTH,SERVED_AREA,DEVICE_SUM,WATER_CAPABILITY,FACTICAL_LENGTH,NAME,WATER_CONSUPTION,GISLENGTH,NOTE,KIND_ID,CHANNEL_TYPE_ID,REGIONS_ID,TECHNICAL_CONDINITION_ID,PROPERTY_TYPE_ID,ACTIVITY_ID,ASSIGMENT_ID,VILLAGE_ID,EXPLONATION_DATE")] DRENAJ dRENAJ)
        {
            if (ModelState.IsValid)
            {
                db.Entry(dRENAJ).State = EntityState.Modified;
                db.Entry(dRENAJ).Property(c => c.SHAPE).IsModified = false;
                db.Entry(dRENAJ).Property(c => c.SSI_ID).IsModified = false;
                db.Entry(dRENAJ).Property(c => c.RECIVER_ID).IsModified = false;
                db.SaveChanges();
                string indexpar = (string)Session["IndexDenajParametr"];
                return RedirectToAction("Index", new { type = indexpar });
            }
            ViewBag.ACTIVITY_ID = db.ACTIVITies;
            ViewBag.ASSIGMENT_ID = db.ASSIGMENTs;
            ViewBag.CHANNEL_TYPE_ID = db.CHANNEL_TYPES;
            ViewBag.KIND_ID = db.KINDs;
            ViewBag.PROPERTY_TYPE_ID = db.PROPERTY_TYPE;
            ViewBag.VILLAGE_ID = db.VILLAGEs.Where(w => w.REL_ID == dRENAJ.REGIONS_ID);
            ViewBag.REGIONS_ID = db.REGIONS.OrderBy(s => s.Adi);
            ViewBag.TECHNICAL_CONDINITION_ID = db.TECHNICAL_TYPE;
            return View(dRENAJ);
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
