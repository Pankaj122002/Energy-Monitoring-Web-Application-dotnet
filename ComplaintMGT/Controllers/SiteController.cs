using ComplaintMGT.Helpers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json.Linq;
using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Entities.Configuration;
using ComplaintMTG.Core.Utils;
using ComplaintMGT.Core.CustomAttributes;

namespace ComplaintMGT.Controllers
{
    public class SiteController : Controller
    {
        [CustomAuthorize]
        public IActionResult Site()
        {
            return View();
        }
        public IActionResult AddSite(string param)
        {

            try
            {
                SiteInfo obj = new SiteInfo();
                string CCode = this.User.GetCompanyCode();
                List<StateMasterinfo> State = new List<StateMasterinfo>();
                List<CityMasterinfo> City = new List<CityMasterinfo>();
                #region Cuntry
                string endpoint = "api/Configuration/GetAllCountry";
                HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
                string Result = apiobj.GetRequest(endpoint, HttpContext);
                List<CuntryMasterinfo> Cuntrylst = JsonConvert.DeserializeObject<List<CuntryMasterinfo>>(Result);
                ViewBag.cuntry = Cuntrylst;
                #endregion
                #region Coustmar
                string endpoint1 = "api/Configuration/GetAllCoustomer?CCode=" + CCode;
                HttpClientHelper<string> apiobj1 = new HttpClientHelper<string>();
                string Result1 = apiobj.GetRequest(endpoint1, HttpContext);
                List<CustmerInfo> Coustmarlst = JsonConvert.DeserializeObject<List<CustmerInfo>>(Result1);
                ViewBag.Custmer = Coustmarlst;
                #endregion
                if (!string.IsNullOrEmpty(param))
                {
                    int tempId = Convert.ToInt32(param);

                    string endpoint3 = "api/Site/GetSiteBySiteId?param=" + tempId;
                    HttpClientHelper<string> apiobj3 = new HttpClientHelper<string>();
                    string Result3 = apiobj3.GetRequest(endpoint3, HttpContext);
                    obj = JsonConvert.DeserializeObject<SiteInfo>(Result3);
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
                }
                ViewBag.CityLst = City;
                ViewBag.StateLst = State;
                return PartialView(obj);
            }
            catch (Exception ex)
            {
                return PartialView(CommonHelper.InvalidRequestMessage());
            }

        }
        [HttpPost]
        public JsonResult SaveandupdateSite(SiteInfo obj)
        {

            obj.CreateBy = this.User.GetUserId();
            string endpoint = "api/Site/AddOrUpdateSite";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            JObject _lst = JObject.Parse(output);
            return Json(_lst);
        }
        [HttpPost]
        public IActionResult GetAllSite()
        {
            string endpoint = "api/Site/GetAllSite";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject _lst = JObject.Parse(Result);
            return Json(_lst);

        }
        [HttpDelete]
        public JsonResult DeleteSite(string Id)
        {

            try
            {
                int tempId = Convert.ToInt32(Id);

                string endpoint3 = "api/Site/DeleteSite?Id=" + tempId;
                HttpClientHelper<string> apiobj3 = new HttpClientHelper<string>();
                string Result3 = apiobj3.DeleteRequest(endpoint3, HttpContext);
                JObject _lst = JObject.Parse(Result3);

                return Json(_lst);
            }
            catch
            {
                return Json(CommonHelper.InvalidRequestMessage());
            }
        }

        public IActionResult SiteOperatingRules()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GetAllSiteOperatingRules()
        {
            string endpoint = "api/Site/GetAllSiteOperatingRules";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject _lst = JObject.Parse(Result);
            return Json(_lst);

        }
        [HttpPost]
        public JsonResult AddOrUpdateSiteOperatingRules(SiteOperatingRulesInfo obj)
        {

            obj.CreateBy = this.User.GetUserId();
            string endpoint = "api/Site/AddOrUpdateSiteOperatingRules";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            JObject _lst = JObject.Parse(output);
            return Json(_lst);
        }

        [HttpDelete]
        public JsonResult DeleteSiteOperatingRules(string Id)
        {

            try
            {
                int tempId = Convert.ToInt32(Id);

                string endpoint3 = "api/Site/DeleteSiteOperatingRules?Id=" + tempId;
                HttpClientHelper<string> apiobj3 = new HttpClientHelper<string>();
                string Result3 = apiobj3.DeleteRequest(endpoint3, HttpContext);
                JObject _lst = JObject.Parse(Result3);

                return Json(_lst);
            }
            catch
            {
                return Json(CommonHelper.InvalidRequestMessage());
            }
        }
        public IActionResult SiteOperationWindow()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GetAllSiteOperationWindow()
        {
            string endpoint = "api/Site/GetAllSiteOperationWindow";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject _lst = JObject.Parse(Result);
            return Json(_lst);

        }
        [HttpPost]
        public JsonResult AddOrUpdateSiteOperationWindow(SiteOperationWindowInfo obj)
        {

            obj.CreateBy = this.User.GetUserId();
            string endpoint = "api/Site/AddOrUpdateSiteOperationWindow";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            JObject _lst = JObject.Parse(output);
            return Json(_lst);
        }

        [HttpDelete]
        public JsonResult DeleteSiteOperationWindow(string Id)
        {

            try
            {
                int tempId = Convert.ToInt32(Id);

                string endpoint3 = "api/Site/DeleteSiteOperationWindow?Id=" + tempId;
                HttpClientHelper<string> apiobj3 = new HttpClientHelper<string>();
                string Result3 = apiobj3.DeleteRequest(endpoint3, HttpContext);
                JObject _lst = JObject.Parse(Result3);

                return Json(_lst);
            }
            catch
            {
                return Json(CommonHelper.InvalidRequestMessage());
            }
        }
        [CustomAuthorize]
        public IActionResult SiteInformation()
        {
            return View();
        }
        public IActionResult AddSiteInformation(string param)
        {
            try
            {
                string CCode = this.User.GetCompanyCode();
                SiteInformationInfo obj = new SiteInformationInfo();
               
                #region Site
                string endpointSite = "api/Site/GetAllSite";
                HttpClientHelper<string> apiobjSite = new HttpClientHelper<string>();
                string ResultSite = apiobjSite.GetRequest(endpointSite, HttpContext);
                var _lstSite = JObject.Parse(ResultSite);

                List<SiteInfo> Site = JsonConvert.DeserializeObject<List<SiteInfo>>(_lstSite["data"].ToString());
                ViewBag.Site = Site;
                #endregion
               
                if (!string.IsNullOrEmpty(param))
                {
                    int tempId = Convert.ToInt32(param);

                    string endpoint3 = "api/Site/GetSiteInformationBySiteInformationId?param=" + tempId;
                    HttpClientHelper<string> apiobj3 = new HttpClientHelper<string>();
                    string Result3 = apiobj3.GetRequest(endpoint3, HttpContext);
                    obj = JsonConvert.DeserializeObject<SiteInformationInfo>(Result3);
                }
                return PartialView(obj);
            }
            catch
            {
                return PartialView();
            }

        }
        [HttpPost]
        public IActionResult GetAllSiteInformation()
        {
            string endpoint = "api/Site/GetAllSiteInformation";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject _lst = JObject.Parse(Result);
            return Json(_lst);

        }
        [HttpPost]
        public JsonResult SaveandupdateSiteInformation(SiteInformationInfo obj)
        {

            obj.CreateBy = this.User.GetUserId();
            string endpoint = "api/Site/AddOrUpdateSiteInformation";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            JObject _lst = JObject.Parse(output);
            return Json(_lst);
        }
        [HttpDelete]
        public JsonResult DeleteSiteInformation(string Id)
        {

            try
            {
                int tempId = Convert.ToInt32(Id);

                string endpoint3 = "api/Site/DeleteSiteInformation?Id=" + tempId;
                HttpClientHelper<string> apiobj3 = new HttpClientHelper<string>();
                string Result3 = apiobj3.DeleteRequest(endpoint3, HttpContext);
                JObject _lst = JObject.Parse(Result3);

                return Json(_lst);
            }
            catch
            {
                return Json(CommonHelper.InvalidRequestMessage());
            }
        }
        [CustomAuthorize]
        public IActionResult SiteInformationBaseline()
        {
            return View();
        }
        public IActionResult AddSiteInformationBaseline(string param)
        {
            try
            {
                string CCode = this.User.GetCompanyCode();
                SiteInformationBaselineInfo obj = new SiteInformationBaselineInfo();

                #region Site
                string endpointSite = "api/Site/GetAllSite";
                HttpClientHelper<string> apiobjSite = new HttpClientHelper<string>();
                string ResultSite = apiobjSite.GetRequest(endpointSite, HttpContext);
                var _lstSite = JObject.Parse(ResultSite);

                List<SiteInfo> Site = JsonConvert.DeserializeObject<List<SiteInfo>>(_lstSite["data"].ToString());
                ViewBag.Site = Site;
                #endregion

                if (!string.IsNullOrEmpty(param))
                {
                    int tempId = Convert.ToInt32(param);

                    string endpoint3 = "api/Site/GetSiteInformationBaselineBySiteInformationBaselineId?param=" + tempId;
                    HttpClientHelper<string> apiobj3 = new HttpClientHelper<string>();
                    string Result3 = apiobj3.GetRequest(endpoint3, HttpContext);
                    obj = JsonConvert.DeserializeObject<SiteInformationBaselineInfo>(Result3);
                }
                return PartialView(obj);
            }
            catch
            {
                return PartialView();
            }

        }
        [HttpPost]
        public IActionResult GetAllSiteInformationBaseline()
        {
            string endpoint = "api/Site/GetAllSiteInformationBaseline";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject _lst = JObject.Parse(Result);
            return Json(_lst);

        }
        [HttpPost]
        public JsonResult SaveandupdateSiteInformationBaseline(SiteInformationBaselineInfo obj)
        {

            obj.CreateBy = this.User.GetUserId();
            string endpoint = "api/Site/AddOrUpdateSiteInformationBaseline";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            JObject _lst = JObject.Parse(output);
            return Json(_lst);
        }
        [HttpDelete]
        public JsonResult DeleteSiteInformationBaseline(string Id)
        {

            try
            {
                int tempId = Convert.ToInt32(Id);

                string endpoint3 = "api/Site/DeleteSiteInformationBaseline?Id=" + tempId;
                HttpClientHelper<string> apiobj3 = new HttpClientHelper<string>();
                string Result3 = apiobj3.DeleteRequest(endpoint3, HttpContext);
                JObject _lst = JObject.Parse(Result3);

                return Json(_lst);
            }
            catch
            {
                return Json(CommonHelper.InvalidRequestMessage());
            }
        }
    }
}
