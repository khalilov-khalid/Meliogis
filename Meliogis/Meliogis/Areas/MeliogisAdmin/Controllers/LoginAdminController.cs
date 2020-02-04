using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Meliogis.Models;

namespace Meliogis.Areas.MeliogisAdmin.Controllers
{
    public class LoginAdminController : Controller
    {
        MelorEntities db = new MelorEntities();

        // GET: MeliogisAdmin/Login
        public ActionResult Index()
        {
            return View();
        }

        public  ActionResult Login(string username, string password)
        {
            var login = db.USERS.Where(s => s.USERNAME == username && s.PASSWORD == password).FirstOrDefault();
            if (login!=null)
            {
                Session["LoginedUser"] = login;
                return RedirectToAction("Index", "Admin");
            }            
            return RedirectToAction("Index", "LoginAdmin");
        }

        public  ActionResult Logout()
        {
            Session["LoginedUser"] = null;
            return RedirectToAction("Index", "LoginAdmin");
        }
    }
}