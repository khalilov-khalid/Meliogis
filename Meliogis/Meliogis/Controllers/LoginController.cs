using Meliogis.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Meliogis.Controllers
{
    public class LoginController : Controller
    {
        MelorEntities db = new MelorEntities();
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult LoginMainPage(string username, string password)
        {

            var login = db.USERSMAINPAGES.Where(s => s.USERNAME == username && s.PASSWORD == password).FirstOrDefault();
            if (login != null)
            {
                Session["LoginMainPage"] = login;
                return RedirectToAction("Index", "Home");
            }            
            return RedirectToAction("Index", "Login");
        }

        public ActionResult LogoutMainPage()
        {
            Session["LoginMainPage"] = null;
            return RedirectToAction("Index");
        }
    }
}