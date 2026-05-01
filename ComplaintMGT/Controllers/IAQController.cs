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
    public class IAQController : Controller
    {
        public IAQController()
        {

        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
