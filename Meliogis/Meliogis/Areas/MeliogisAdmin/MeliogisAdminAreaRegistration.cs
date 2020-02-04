using System.Web.Mvc;

namespace Meliogis.Areas.MeliogisAdmin
{
    public class MeliogisAdminAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "MeliogisAdmin";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "MeliogisAdmin_default",
                "MeliogisAdmin/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}