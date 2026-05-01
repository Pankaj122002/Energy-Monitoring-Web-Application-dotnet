using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Helpers;
using ComplaintMTG.Core.Utils;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Session;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using OfficeOpenXml.FormulaParsing.LexicalAnalysis;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ComplaintMGT.Controllers
{
    public class AccountController : Controller
    {
        public AccountController() { }
        //private readonly IConfiguration _configuration; 
        //public AccountController(IConfiguration configuration)
        //{
        //    _configuration = configuration;
        //}
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(string userName, string password)
        {
            if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(password))
            {
                return View();
            }
            //var connectionString = _configuration.GetConnectionString("CKCENTITY");
            //using (SqlConnection conn = new SqlConnection(connectionString))
            //{
            //    conn.Open();
            //}

            ClaimsIdentity identity = null;
            bool isAuthenticated = false;
            string endpoint = "api/User/Login?userName=" + userName + "&password=" + password;

            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            var jwtToken = apiobj.GetSingleItemRequest(endpoint, HttpContext);

            var token = new JwtSecurityToken(jwtEncodedString: jwtToken);

            var usr = JWTTokenHelper.GetUserClaim(token);

            //set user detail to Session
            HttpContext.Session.SetObjectAsJson("UserDetails", usr);
            HttpContext.Session.SetString("JWTToken", jwtToken);

            //set user detail to Session
            var userDetails = HttpContext.Session.GetObjectFromJson<LoginResponse>("UserDetails");
            int RoleId = Convert.ToInt32(userDetails.RoleId);
            string LoginId = userDetails.LoginId;

            string endpoint2 = "api/User/GetSubMenuByRolev1?rolename=" + usr.RoleId;
            HttpClientHelper<string> apiobj2 = new HttpClientHelper<string>();
            string Result2 = apiobj2.GetRequest(endpoint2, HttpContext);

            string endpoint3 = "api/CompanyMaster/GetCompanyDetails?CCode=" + usr.CCode;
            HttpClientHelper<string> apiobj3 = new HttpClientHelper<string>();
            string Result3 = apiobj3.GetRequest(endpoint3, HttpContext);

            if (usr != null && usr.Result == 1)
            {
                identity = new ClaimsIdentity(new[] {
                            new Claim(ClaimTypes.Name, usr.FullName),
                            new Claim(ClaimTypes.NameIdentifier, usr.LoginId),
                            new Claim(ClaimTypes.Role, usr.RoleName),
                            new Claim(ClaimTypes.GroupSid, usr.RoleId.ToString()),
                            new Claim(ClaimTypes.PrimaryGroupSid, usr.CCode),
                            new Claim(ClaimTypes.HomePhone, Result2),
                            new Claim(ClaimTypes.WindowsUserClaim, Result3),
                        }, CookieAuthenticationDefaults.AuthenticationScheme);

                isAuthenticated = true;
            }
            else
                ViewBag.msg = usr.Msg;

            if (isAuthenticated)
            {
                var principal = new ClaimsPrincipal(identity);

                var roles = principal.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).FirstOrDefault();
                var login = HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    principal,
                    new AuthenticationProperties
                    {
                        ExpiresUtc = DateTime.UtcNow.AddHours(2),
                        IsPersistent = true
                    }
                    );

                return RedirectToAction("IndexNew", "Deshboard");

            }
            return View();

        }
        [HttpPost]
        public JsonResult GetAllMenu()
        {
            string RoleName = this.User.GetRoleId();
            string endpoint1 = "api/User/GetMenuByRole?rolename=" + RoleName;
            HttpClientHelper<string> apiobj1 = new HttpClientHelper<string>();
            string Result1 = apiobj1.GetRequest(endpoint1,HttpContext);

            string endpoint2 = "api/User/GetSubMenuByRole?rolename=" + RoleName;
            HttpClientHelper<string> apiobj2 = new HttpClientHelper<string>();
            string Result2 = apiobj2.GetRequest(endpoint2, HttpContext);





            JArray _lst1 = JArray.Parse(Result1);
            JArray _lst2 = JArray.Parse(Result2);


            var response = new { menu = _lst1, submenu = _lst2 };


            return Json(response);
        }


        [HttpPost]
        public JsonResult GetVerifiedMISReport(string date)
        {
            string endpoint3 = "api/User/GetConfirmReport?date=" + date;
            HttpClientHelper<string> apiobj3 = new HttpClientHelper<string>();
            string Result3 = apiobj3.GetRequest(endpoint3,HttpContext);
            JArray _lst3 = JArray.Parse(Result3);
            var response = new { confimrpt = _lst3 };


            return Json(response);
        }




        [HttpPost]
        public JsonResult GetAllSubMenu()
        {
            string RoleName = this.User.GetRoleId();
            string endpoint = "api/User/GetSubMenuByRole?rolename=" + RoleName;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        public IActionResult Logout()
        {
            var login = HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }
        public IActionResult AccessDenied()
        {
            return View();
        }


    }
}
