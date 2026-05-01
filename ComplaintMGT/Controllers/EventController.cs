using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using ComplaintMGT.Helpers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using OfficeOpenXml.FormulaParsing.LexicalAnalysis;
using Microsoft.AspNetCore.Session;
using Microsoft.AspNetCore.Http;
using ComplaintMGT.Abstractions.Entities;
using ComplaintMTG.Core.Utils;
using ComplaintMGT.Core.CustomAttributes;

namespace ComplaintMGT.Controllers
{
    [CustomAuthorize]
    public class EventController : Controller
    {
        public EventController()
        {

        }
        public IActionResult Alarm()
        {
            return View();
        }

        public IActionResult AlarmWarm()
        {
            return View();
        }

        public IActionResult AlarmCold()
        {
            return View();
        }

        public IActionResult Compliance()
        {
            return View();
        }

        public IActionResult ComplianceWarm()
        {
            return View();
        }

        public IActionResult ComplianceCold()
        {
            return View();
        }

        public IActionResult EmployeeAndGuestComfort()
        {
            return View();
        }

        public IActionResult EmployeeAndGuestComfortWarm()
        {
            return View();
        }

        public IActionResult EmployeeAndGuestComfortCold()
        {
            return View();
        }

    }
}
