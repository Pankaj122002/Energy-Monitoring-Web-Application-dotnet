using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ComplaintMGT.Helpers;
using ComplaintMGT.Abstractions.DomainModels;
using ComplaintMTG.Core.Utils;
using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Entities.Configuration;
using ComplaintMGT.Core.CustomAttributes;

namespace ComplaintMGT.Controllers
{
    public class UserController : Controller
    {
        [CustomAuthorize]
        public IActionResult Index()
        {
            return View();
        }
        [CustomAuthorize]
        public IActionResult AllRoles()
        {
            return View();
        }
        [HttpPost]
        public JsonResult GetAllUserData(DataTableAjaxPostModel requestModel)
        {
            requestModel.CCode = this.User.GetCompanyCode();
            string input = JsonConvert.SerializeObject(requestModel);
            string endpoint = "api/User/GetAllUser";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();

            string Result = apiobj.PostRequestString(endpoint, input, HttpContext);
            JArray _lst = JArray.Parse(Result);
            IList<JToken> t = _lst.SelectTokens("$..TotalCount").ToList();
            int tt = 0;
            if (t.Count > 0)
            {
                tt = (int)t[0];
            }
            var response = new { data = _lst, recordsFiltered = tt, recordsTotal = tt };
            return Json(response);
        }

        [HttpPost]
        public JsonResult GetUserDataById(String UserId)
        {
            string endpoint = "api/User/GetUserDataById?UserId=" + UserId;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject myjson = JObject.Parse(Result);
            string pwd = (string)myjson["Pwd"];
            myjson["Pwd"] = PasswordHelper.DecryptPwd(pwd);
            return Json(myjson);
        }
        public IActionResult AddUser(string param)
        {
            //string endpoint = "api/User/GetUserDataById?UserId=" + param;
            //HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            //string Result = apiobj.GetRequest(endpoint);
            //JObject myjson = JObject.Parse(Result);
            //string pwd = (string)myjson["Pwd"];
            // myjson["Pwd"] = PasswordHelper.DecryptPwd(pwd);
            try
            {
                UserInfo obj = new UserInfo();
                string CCode = this.User.GetCompanyCode();
                List<StateMasterinfo> State = new List<StateMasterinfo>();
                List<CityMasterinfo> City = new List<CityMasterinfo>();
                List<ZoneMasterinfo> Zone = new List<ZoneMasterinfo>();
                #region Role
                string endpointRole = "api/User/GetAllRole?CCode=" + CCode;
                HttpClientHelper<string> apiobjRole = new HttpClientHelper<string>();
                string ResultRole = apiobjRole.GetRequest(endpointRole, HttpContext);
                List<RoleInfo> Rolelst = JsonConvert.DeserializeObject<List<RoleInfo>>(ResultRole);
                ViewBag.Role = Rolelst;
                #endregion
                #region Cuntry
                string endpointy = "api/Configuration/GetAllCountry";
                HttpClientHelper<string> apiobjy = new HttpClientHelper<string>();
                string Resulty = apiobjy.GetRequest(endpointy, HttpContext);
                List<CuntryMasterinfo> Cuntrylst = JsonConvert.DeserializeObject<List<CuntryMasterinfo>>(Resulty);
                ViewBag.cuntry = Cuntrylst;
                #endregion
                #region Coustmar
                string endpoint1 = "api/Configuration/GetAllCoustomer?CCode=" + CCode;
                HttpClientHelper<string> apiobj1 = new HttpClientHelper<string>();
                string Result1 = apiobj1.GetRequest(endpoint1, HttpContext);
                List<CustmerInfo> Coustmarlst = JsonConvert.DeserializeObject<List<CustmerInfo>>(Result1);
                ViewBag.Custmer = Coustmarlst;
                #endregion
                if (!string.IsNullOrEmpty(param))
                {
                    int tempId = Convert.ToInt32(param);

                    string endpoint3 = "api/User/GetUserDataById?UserId=" + tempId;
                    HttpClientHelper<string> apiobj3 = new HttpClientHelper<string>();
                    string Result3 = apiobj3.GetRequest(endpoint3, HttpContext);
                    obj = JsonConvert.DeserializeObject<UserInfo>(Result3);
                    obj.Password = PasswordHelper.DecryptPwd(obj.Password);
                    #region State
                    string endpoints = "api/Configuration/GetStateByCountry?CountryId=" + obj.CountryId;

                    HttpClientHelper<string> apiobjs = new HttpClientHelper<string>();
                    string Resultstate = apiobjs.GetRequest(endpoints, HttpContext);
                    State = JsonConvert.DeserializeObject<List<StateMasterinfo>>(Resultstate);
                    #endregion
                    #region City
                    string endpointCity = "api/Configuration/GetCityByStateId?StateId=" + obj.StateId;

                    HttpClientHelper<string> apiobjCity = new HttpClientHelper<string>();
                    string ResultCity = apiobjCity.GetRequest(endpointCity, HttpContext);
                    City = JsonConvert.DeserializeObject<List<CityMasterinfo>>(ResultCity);
                    #endregion
                    #region Zone
                    string endpointZone = "api/Configuration/GetZoneByCityId?CityId=" + obj.CityId;

                    HttpClientHelper<string> apiobjZone = new HttpClientHelper<string>();
                    string ResultZone = apiobjZone.GetRequest(endpointZone, HttpContext);
                    Zone = JsonConvert.DeserializeObject<List<ZoneMasterinfo>>(ResultZone);
                    #endregion
                }
                ViewBag.CityLst = City;
                ViewBag.StateLst = State;
                ViewBag.Zone = Zone;
                return PartialView(obj);
            }
            catch (Exception ex)
            {
                return PartialView(CommonHelper.InvalidRequestMessage());
            }


        }
        public IActionResult AddRoles()
        {
            return PartialView();
        }
        [HttpPost]
        public JsonResult GetAllRoles()
        {
            string endpoint = "api/User/GetAllRole?CCode=" + this.User.GetCompanyCode();
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetAllMenuMaster(int roleId)
        {
            string endpoint1 = "api/User/GetAllMenuMaster?roleId=" + roleId;
            HttpClientHelper<string> apiobj1 = new HttpClientHelper<string>();
            string Result1 = apiobj1.GetRequest(endpoint1, HttpContext);

            return Json(Result1);
        }
        [HttpPost]
        public JsonResult SaveandupdateMenu(string roleName, string JArrayval, string roleId, string IsActive)
        {

            var obj = new
            {
                RoleName = roleName,
                RoleId = roleId,
                IsActive = IsActive,
                CCode = this.User.GetCompanyCode(),
                JArrayval = JArrayval
            };
            string endpoint = "api/User/SaveandupdateMenu";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            return Json(output);
        }
        [HttpPost]
        public JsonResult SaveandupdateUser(string jobj, string JArrayval)
        {
            dynamic dresult = JObject.Parse(jobj);
            string pddd = dresult.Pwd;
            string EncrptedPWD = PasswordHelper.EncryptPwd(pddd);
            var obj = new
            {
                UserId = dresult.UserId,
                FullName = dresult.FullName,
                EmailId = dresult.EmailId,
                Pwd = EncrptedPWD,
                Mobile = dresult.Mobile,
                IsActive = dresult.IsActive,
                CCode = this.User.GetCompanyCode(),
                CustCode = dresult.CustCode,
                RoleId = dresult.RoleId,
                UserName = dresult.UserName,
                ImgUrl = dresult.filename,
                Address = dresult.Address,
                CreateBy = this.User.GetUserId(),
                JArrayval = JArrayval
            };
            string endpoint = "api/User/SaveandupdateUser";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            return Json(output);
        }

        void GetAllPassword()
        {
            List<string> NewString = new List<string>();
            List<string> OldString = new List<string> { };
            foreach (string item in OldString)
            {
                string EncrptedPWD = PasswordHelper.EncryptPwd(item);
                NewString.Add(EncrptedPWD);
            }
            //string str = String.Join(',', NewString);
        }

        [HttpPost]
        public JsonResult GetAllAssigendModule(string loginId)
        {
            var obj = new
            {
                Ccode = this.User.GetCompanyCode(),
                LoginId = loginId
            };
            string endpoint = "api/User/GetAllAssigendModule";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);

            return Json(output);
        }
    }
}
