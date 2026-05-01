using Microsoft.AspNetCore.Mvc;

namespace ComplaintMGT.API.Controllers
{
    public class MapView : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
