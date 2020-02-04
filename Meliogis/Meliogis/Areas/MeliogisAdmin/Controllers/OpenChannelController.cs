using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Meliogis.Areas.MeliogisAdmin.AdminViewClass;
using Meliogis.Models;
using X.PagedList;

namespace Meliogis.Areas.MeliogisAdmin.Controllers
{
    [AdminAuthenticationController]
    public class OpenChannelController : Controller
    {
        MelorEntities db = new MelorEntities();

        // GET: MeliogisAdmin/OpenChannel
        public ActionResult Index(int? page , string type)
        {
            USER logineduser = (USER)Session["LoginedUser"];
            if (type=="M")
            {
                Session["IndexParametr"] = "M";
                var cHANNELS = db.CHANNELS.Where(s => s.KIND_ID == 1 && s.TYPE_ID == 4 && s.SSI_ID == logineduser.REL_SIB_ID);
                ViewBag.Type = "M";
                var data = cHANNELS.ToList();
                var pageNumber = page ?? 1;
                var onepage = data.ToPagedList(pageNumber, 10);
                return View(onepage);
            }
            if (type == "I")
            {
                Session["IndexParametr"] = "I";
                var cHANNELS = db.CHANNELS.Where(s => s.KIND_ID == 1 && s.TYPE_ID == 1 && s.SSI_ID == logineduser.REL_SIB_ID);
                ViewBag.Type = "I";
                var data = cHANNELS.ToList();
                var pageNumber = page ?? 1;
                var onepage = data.ToPagedList(pageNumber, 10);
                return View(onepage);
            }
            if (type == "II")
            {
                Session["IndexParametr"] = "II";
                var cHANNELS = db.CHANNELS.Where(s => s.KIND_ID == 1 && s.TYPE_ID == 2 && s.SSI_ID == logineduser.REL_SIB_ID);
                ViewBag.Type = "II";
                var data = cHANNELS.ToList();
                var pageNumber = page ?? 1;
                var onepage = data.ToPagedList(pageNumber, 10);
                return View(onepage);
            }
            if (type == "III")
            {
                Session["IndexParametr"] = "III";
                var cHANNELS = db.CHANNELS.Where(s => s.KIND_ID == 1 && s.TYPE_ID == 3 && s.SSI_ID == logineduser.REL_SIB_ID);
                ViewBag.Type = "III";
                var data = cHANNELS.ToList();
                var pageNumber = page ?? 1;
                var onepage = data.ToPagedList(pageNumber, 10);
                return View(onepage);
            }
            if (type == "QM")
            {
                Session["IndexParametr"] = "QM";
                var cHANNELS = db.CHANNELS.Where(s => s.KIND_ID == 2 && s.TYPE_ID == 3 && s.SSI_ID == logineduser.REL_SIB_ID);
                ViewBag.Type = "QM";
                var data = cHANNELS.ToList();
                var pageNumber = page ?? 1;
                var onepage = data.ToPagedList(pageNumber, 10);
                return View(onepage);
            }
            if (type == "QI")
            {
                Session["IndexParametr"] = "QI";
                var cHANNELS = db.CHANNELS.Where(s => s.KIND_ID == 2 && s.TYPE_ID == 3 && s.SSI_ID == logineduser.REL_SIB_ID);
                ViewBag.Type = "QI";
                var data = cHANNELS.ToList();
                var pageNumber = page ?? 1;
                var onepage = data.ToPagedList(pageNumber, 10);
                return View(onepage);
            }
            if (type == "QII")
            {
                Session["IndexParametr"] = "QII";
                var cHANNELS = db.CHANNELS.Where(s => s.KIND_ID == 2 && s.TYPE_ID == 3 && s.SSI_ID == logineduser.REL_SIB_ID);
                ViewBag.Type = "QII";
                var data = cHANNELS.ToList();
                var pageNumber = page ?? 1;
                var onepage = data.ToPagedList(pageNumber, 10);
                return View(onepage);
            }
            if (type == "QIII")
            {
                Session["IndexParametr"] = "QIII";
                var cHANNELS = db.CHANNELS.Where(s => s.KIND_ID == 2 && s.TYPE_ID == 3 && s.SSI_ID == logineduser.REL_SIB_ID);
                ViewBag.Type = "QIII";
                var data = cHANNELS.ToList();
                var pageNumber = page ?? 1;
                var onepage = data.ToPagedList(pageNumber, 10);
                return View(onepage);
            }

            return RedirectToAction("NotFound", "Admin");
        }

        //Edit magistral
        public ActionResult Edit(int? id)
        {
            if (id==null)
            {
                return RedirectToAction("NotFound", "Admin");
            }
            CHANNEL cHANNEL = db.CHANNELS.Find(id);
            if (cHANNEL == null)
            {
                return RedirectToAction("NotFound", "Admin");
            }

            EditViewModel vm = new EditViewModel();
            vm._activity = db.ACTIVITies.ToList();
            vm._assigment = db.ASSIGMENTs.ToList();
            vm._types = db.CHANNEL_TYPES.ToList();
            vm._covertypes = db.COVER_TYPES.ToList();
            vm._kind = db.KINDs.ToList();
            vm._propery_type = db.PROPERTY_TYPE.ToList();
            vm._regions = db.REGIONS.Where(s => s.REGION_TYPE_ID == 1 || s.REGION_TYPE_ID == 4).ToList();
            ViewBag.VILLAGE_ID = db.VILLAGEs.Where(w => w.REL_ID == cHANNEL.REGIONS_ID);
            vm._technical = db.TECHNICAL_TYPE.ToList();

            vm._editedchannel = cHANNEL;

            return View(vm);
        }

        [HttpPost]
        public ActionResult Edit(CHANNEL cHANNEL)
        {
            //deyisilmiyecek columlar :shape, SOURCE_ID,SSI_ID
            if (ModelState.IsValid)
            {
                db.Entry(cHANNEL).State = EntityState.Modified;
                db.Entry(cHANNEL).Property(c => c.Shape).IsModified = false;
                db.Entry(cHANNEL).Property(c => c.SOURCE_ID).IsModified = false;
                db.Entry(cHANNEL).Property(c => c.SSI_ID).IsModified = false;
                db.SaveChanges();
                string indexpar = (string)Session["IndexParametr"];
                return RedirectToAction("Index", new { type = indexpar });                
            }
            EditViewModel vm = new EditViewModel();
            vm._activity = db.ACTIVITies.ToList();
            vm._assigment = db.ASSIGMENTs.ToList();
            vm._types = db.CHANNEL_TYPES.ToList();
            vm._covertypes = db.COVER_TYPES.ToList();
            vm._kind = db.KINDs.ToList();
            vm._propery_type = db.PROPERTY_TYPE.ToList();
            vm._regions = db.REGIONS.Where(s => s.REGION_TYPE_ID == 1 || s.REGION_TYPE_ID == 4).ToList();
            ViewBag.VILLAGE_ID = db.VILLAGEs.Where(w => w.REL_ID == cHANNEL.REGIONS_ID);
            vm._technical = db.TECHNICAL_TYPE.ToList();

            vm._editedchannel = cHANNEL;
            return View(vm);
        }
    }
}