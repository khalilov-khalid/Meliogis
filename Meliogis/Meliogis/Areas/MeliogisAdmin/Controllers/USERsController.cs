using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Meliogis.Models;

namespace Meliogis.Areas.MeliogisAdmin.Controllers
{
    [AdminAuthenticationController]
    public class USERsController : Controller
    {
        private MelorEntities db = new MelorEntities();

        // GET: MeliogisAdmin/USERs
        public ActionResult Index()
        {
            var uSERS = db.USERS.Where(s=>s.ROLE_ID==2).Include(u => u.PROPERTY);
            return View(uSERS.ToList());
        }

        // GET: MeliogisAdmin/USERs/Create
        public ActionResult Create()
        {
            ViewBag.REL_SIB_ID = new SelectList(db.PROPERTies, "OBJECTID", "NAME");
            return View();
        }

        // POST: MeliogisAdmin/USERs/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "OBJECTID,USERNAME,PASSWORD,REL_SIB_ID")] USER uSER)
        {
            if (ModelState.IsValid)
            {
                uSER.ROLE_ID = 2;
                db.USERS.Add(uSER);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.REL_SIB_ID = new SelectList(db.PROPERTies, "OBJECTID", "NAME", uSER.REL_SIB_ID);
            return View(uSER);
        }

        // GET: MeliogisAdmin/USERs/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            USER uSER = db.USERS.Find(id);
            if (uSER == null)
            {
                return HttpNotFound();
            }
            ViewBag.REL_SIB_ID = new SelectList(db.PROPERTies, "OBJECTID", "NAME", uSER.REL_SIB_ID);
            return View(uSER);
        }

        // POST: MeliogisAdmin/USERs/Edit/5        
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "OBJECTID,USERNAME,REL_SIB_ID")] USER uSER)
        {
            if (ModelState.IsValid)
            {
                uSER.ROLE_ID = 2;
                db.Entry(uSER).State = EntityState.Modified;
                db.Entry(uSER).Property(c => c.PASSWORD).IsModified = false;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.REL_SIB_ID = new SelectList(db.PROPERTies, "OBJECTID", "NAME", uSER.REL_SIB_ID);
            return View(uSER);
        }

        // GET: MeliogisAdmin/USERs/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            USER uSER = db.USERS.Find(id);
            if (uSER == null)
            {
                return HttpNotFound();
            }
            return View(uSER);
        }

        // POST: MeliogisAdmin/USERs/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            USER uSER = db.USERS.Find(id);
            db.USERS.Remove(uSER);
            db.SaveChanges();
            return RedirectToAction("Index");
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
