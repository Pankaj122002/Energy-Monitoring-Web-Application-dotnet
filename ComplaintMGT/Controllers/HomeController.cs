using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ComplaintMGT.Helpers;
using ComplaintMTG.Core.Utils;
using ComplaintMGT.Abstractions.DomainModels;
using ComplaintMGT.Core.CustomAttributes;

namespace ComplaintMGT.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }
        [CustomAuthorize]
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        public JsonResult GetCurrentUserInfo()
        {
            var obj = new
            {
                UserName = this.User.GetUserName(),
                RoleName = this.User.GetRoleName(),
            };
            return Json(obj);
        }
        public IActionResult Error404()
        {
            return View();
        }

        public IActionResult Error401()
        {
            return View();
        }

        public IActionResult Error500()
        {
            return View();
        }
    }
}
