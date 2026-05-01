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
using ComplaintMGT.Abstractions.Entities.Device;
using ComplaintMTG.Core.Utils;
using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Entities.Configuration;
using ComplaintMGT.Core.CustomAttributes;

namespace ComplaintMGT.Controllers
{
    public class DeviceController : Controller
    {
        [CustomAuthorize]
        public IActionResult AssetType()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GetAllAssetType()
        {
            string endpoint = "api/Device/GetAllAssetType";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject _lst = JObject.Parse(Result);
            return Json(_lst);

        }
        [HttpPost]
        public JsonResult SaveandupdateAssetType(AssetTypeInfo obj)
        {

            obj.CreateBy = this.User.GetUserId();
            string endpoint = "api/Device/AddOrUpdateAssetType";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            JObject _lst = JObject.Parse(output);
            return Json(_lst);
        }
        [HttpDelete]
        public JsonResult DeleteAssetType(string Id)
        {

            try
            {
                int tempId = Convert.ToInt32(Id);

                string endpoint3 = "api/Device/DeleteAssetType?Id=" + tempId;
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
        public IActionResult Asset()
        {
            return View();
        }

        public IActionResult AddAsset(string param)
        {
            try
            {
                AssetInfo obj = new AssetInfo();
                #region AssetType
                string endpoint = "api/Device/GetAllAssetType";
                HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
                string Result = apiobj.GetRequest(endpoint, HttpContext);
                var _lst = JObject.Parse(Result);

                List<AssetTypeInfo> AssetType = JsonConvert.DeserializeObject<List<AssetTypeInfo>>(_lst["data"].ToString());
                ViewBag.AssetType = AssetType;
                #endregion
                if (!string.IsNullOrEmpty(param))
                {
                    int tempId = Convert.ToInt32(param);

                    string endpoint3 = "api/Device/GetAssetByAssetId?param=" + tempId;
                    HttpClientHelper<string> apiobj3 = new HttpClientHelper<string>();
                    string Result3 = apiobj3.GetRequest(endpoint3, HttpContext);
                    obj = JsonConvert.DeserializeObject<AssetInfo>(Result3);
                }
                return PartialView(obj);
            }
            catch
            {
                return PartialView();
            }

        }
        [HttpPost]
        public IActionResult GetAllAsset()
        {
            string endpoint = "api/Device/GetAllAsset";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject _lst = JObject.Parse(Result);
            return Json(_lst);

        }
        [HttpPost]
        public JsonResult SaveandupdateAsset(AssetInfo obj)
        {

            obj.CreateBy = this.User.GetUserId();
            string endpoint = "api/Device/AddOrUpdateAsset";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            JObject _lst = JObject.Parse(output);
            return Json(_lst);
        }
        [HttpDelete]
        public JsonResult DeleteAsset(string Id)
        {

            try
            {
                int tempId = Convert.ToInt32(Id);

                string endpoint3 = "api/Device/DeleteAsset?Id=" + tempId;
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

        public IActionResult AssetPrameters()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GetAllAssetPrameters()
        {
            string endpoint = "api/Device/GetAllAssetPrameters";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject _lst = JObject.Parse(Result);
            return Json(_lst);

        }
        [HttpPost]
        public JsonResult SaveandupdateAssetPrameters(AssetPrametersInfo obj)
        {

            obj.CreateBy = this.User.GetUserId();
            string endpoint = "api/Device/AddOrUpdateAssetPrameters";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            JObject _lst = JObject.Parse(output);
            return Json(_lst);
        }
        [HttpDelete]
        public JsonResult DeleteAssetPrameters(string Id)
        {

            try
            {
                int tempId = Convert.ToInt32(Id);

                string endpoint3 = "api/Device/DeleteAssetPrameters?Id=" + tempId;
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
        public IActionResult DeviceStatus()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GetAllDeviceStatus()
        {
            string endpoint = "api/Device/GetAllDeviceStatus";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject _lst = JObject.Parse(Result);
            return Json(_lst);

        }
        [HttpPost]
        public JsonResult SaveandupdateDeviceStatus(DeviceStatusInfo obj)
        {

            obj.CreateBy = this.User.GetUserId();
            string endpoint = "api/Device/AddOrUpdateDeviceStatus";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            JObject _lst = JObject.Parse(output);
            return Json(_lst);
        }
        [HttpDelete]
        public JsonResult DeleteDeviceStatus(string Id)
        {

            try
            {
                int tempId = Convert.ToInt32(Id);

                string endpoint3 = "api/Device/DeleteDeviceStatus?Id=" + tempId;
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
        public IActionResult DeviceDetails()
        {
            return View();
        }

        public IActionResult AddDeviceDetails(string param)
        {
            try
            {
                DeviceInfo obj = new DeviceInfo();
                string CCode = this.User.GetCompanyCode();
                List<SiteInfo> Site = new List<SiteInfo>();
                List<DeviceStatusInfo> DeviceStatus = new List<DeviceStatusInfo>();
                #region Asset
                string endpoint = "api/Device/GetAllAsset";
                HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
                string Result = apiobj.GetRequest(endpoint, HttpContext);
                var _lst = JObject.Parse(Result);

                List<AssetInfo> Asset = JsonConvert.DeserializeObject<List<AssetInfo>>(_lst["data"].ToString());
                ViewBag.Asset = Asset;
                #endregion
                #region DeviceType
                string endpointDeviceType = "api/Device/GetAllDeviceType";
                HttpClientHelper<string> apiobjDeviceType = new HttpClientHelper<string>();
                string ResultDeviceType = apiobjDeviceType.GetRequest(endpointDeviceType, HttpContext);
                var _lstDeviceType = JObject.Parse(ResultDeviceType);

                List<DeviceTypeInfo> DeviceType = JsonConvert.DeserializeObject<List<DeviceTypeInfo>>(_lstDeviceType["data"].ToString());
                ViewBag.DeviceType = DeviceType;
                #endregion
                #region Coustmar
                string endpoint1 = "api/Configuration/GetAllCoustomer?CCode=" + CCode;
                HttpClientHelper<string> apiobj1 = new HttpClientHelper<string>();
                string Result1 = apiobj.GetRequest(endpoint1, HttpContext);
                List<CustmerInfo> Coustmarlst = JsonConvert.DeserializeObject<List<CustmerInfo>>(Result1);
                ViewBag.Custmer = Coustmarlst;
                #endregion
                #region Site
                string endpoints = "api/Site/GetAllSite";

                HttpClientHelper<string> apiobjs = new HttpClientHelper<string>();
                string ResultSite = apiobjs.GetRequest(endpoints, HttpContext);
                var _lstSite = JObject.Parse(ResultSite);
                Site = JsonConvert.DeserializeObject<List<SiteInfo>>(_lstSite["data"].ToString());
                #endregion
                #region DeviceStatus
                string endpointCity = "api/Device/GetAllDeviceStatus";

                HttpClientHelper<string> apiobjCity = new HttpClientHelper<string>();
                string ResultDeviceStatus = apiobjCity.GetRequest(endpointCity, HttpContext);
                var _lstDeviceStatus = JObject.Parse(ResultDeviceStatus);
                DeviceStatus = JsonConvert.DeserializeObject<List<DeviceStatusInfo>>(_lstDeviceStatus["data"].ToString());
                #endregion
                if (!string.IsNullOrEmpty(param))
                {
                    int tempId = Convert.ToInt32(param);

                    string endpoint3 = "api/Device/GetDeviceDetailsByDeviceId?param=" + tempId;
                    HttpClientHelper<string> apiobj3 = new HttpClientHelper<string>();
                    string Result3 = apiobj3.GetRequest(endpoint3, HttpContext);
                    obj = JsonConvert.DeserializeObject<DeviceInfo>(Result3);

                }
                ViewBag.DeviceStatusLst = DeviceStatus;
                ViewBag.SiteLst = Site;
                return PartialView(obj);
            }
            catch (Exception ex)
            {
                return PartialView(CommonHelper.InvalidRequestMessage());
            }
        }
        [HttpPost]
        public IActionResult GetAllDeviceDetails()
        {
            string endpoint = "api/Device/GetAllDeviceDetails";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject _lst = JObject.Parse(Result);
            return Json(_lst);

        }
        [HttpPost]
        public JsonResult SaveandupdateDeviceDetails(DeviceInfo obj)
        {

            obj.CreateBy = this.User.GetUserId();
            string endpoint = "api/Device/AddOrUpdateDeviceDetails";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            JObject _lst = JObject.Parse(output);
            return Json(_lst);
        }
        [HttpDelete]
        public JsonResult DeleteDeviceDetails(string Id)
        {

            try
            {
                int tempId = Convert.ToInt32(Id);

                string endpoint3 = "api/Device/DeleteDeviceDetails?Id=" + tempId;
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
        public IActionResult DeviceType()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GetAllDeviceType()
        {
            string endpoint = "api/Device/GetAllDeviceType";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject _lst = JObject.Parse(Result);
            return Json(_lst);

        }
        [HttpPost]
        public JsonResult SaveandupdateDeviceType(DeviceTypeInfo obj)
        {

            obj.CreateBy = this.User.GetUserId();
            string endpoint = "api/Device/AddOrUpdateDeviceType";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            JObject _lst = JObject.Parse(output);
            return Json(_lst);
        }
        [HttpDelete]
        public JsonResult DeleteDeviceType(string Id)
        {

            try
            {
                int tempId = Convert.ToInt32(Id);

                string endpoint3 = "api/Device/DeleteDeviceType?Id=" + tempId;
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
        public IActionResult AssetRules()
        {
            return View();
        }

        public IActionResult AddAssetRules(string param)
        {
            try
            {
                AssetRulesInfo obj = new AssetRulesInfo();
                #region AssetType
                string endpoint = "api/Device/GetAllAsset";
                HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
                string Result = apiobj.GetRequest(endpoint, HttpContext);
                var _lst = JObject.Parse(Result);

                List<AssetInfo> AssetType = JsonConvert.DeserializeObject<List<AssetInfo>>(_lst["data"].ToString());
                ViewBag.AssetType = AssetType;
                #endregion
                if (!string.IsNullOrEmpty(param))
                {
                    int tempId = Convert.ToInt32(param);

                    string endpoint3 = "api/Device/GetAssetRulesByAsseRulestId?param=" + tempId;
                    HttpClientHelper<string> apiobj3 = new HttpClientHelper<string>();
                    string Result3 = apiobj3.GetRequest(endpoint3, HttpContext);
                    obj = JsonConvert.DeserializeObject<AssetRulesInfo>(Result3);
                }
                return PartialView(obj);
            }
            catch
            {
                return PartialView();
            }

        }
        [HttpPost]
        public IActionResult GetAllAssetRules()
        {
            string endpoint = "api/Device/GetAllAssetRules";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject _lst = JObject.Parse(Result);
            return Json(_lst);

        }
        [HttpPost]
        public JsonResult SaveandupdateAssetRules(AssetRulesInfo obj)
        {

            obj.CreateBy = this.User.GetUserId();
            string endpoint = "api/Device/AddOrUpdateAssetRules";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            JObject _lst = JObject.Parse(output);
            return Json(_lst);
        }
        [HttpDelete]
        public JsonResult DeleteAssetRules(string Id)
        {

            try
            {
                int tempId = Convert.ToInt32(Id);

                string endpoint3 = "api/Device/DeleteAssetRules?Id=" + tempId;
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

        public IActionResult Status()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GetAllStatus()
        {
            string endpoint = "api/Device/GetAllStatus";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject _lst = JObject.Parse(Result);
            return Json(_lst);

        }
        [HttpPost]
        public JsonResult SaveandupdateStatus(StatusInfo obj)
        {

            obj.CreateBy = this.User.GetUserId();
            string endpoint = "api/Device/AddOrUpdateStatus";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            JObject _lst = JObject.Parse(output);
            return Json(_lst);
        }
        [HttpDelete]
        public JsonResult DeleteStatus(string Id)
        {

            try
            {
                int tempId = Convert.ToInt32(Id);

                string endpoint3 = "api/Device/DeleteStatus?Id=" + tempId;
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
        public IActionResult AssetOverride()
        {
            return View();
        }
        public IActionResult AddAssetOverride(string param)
        {
            try
            {
                string CCode = this.User.GetCompanyCode();
                AssetOverrideInfo obj = new AssetOverrideInfo();
                #region Customer
                string endpointCustomer = "api/Configuration/GetAllCoustomer?CCode=" + CCode;
                HttpClientHelper<string> apiobjCustomer = new HttpClientHelper<string>();
                string ResultCustomer = apiobjCustomer.GetRequest(endpointCustomer, HttpContext);


                List<CustmerInfo> Customer = JsonConvert.DeserializeObject<List<CustmerInfo>>(ResultCustomer);
                ViewBag.Customer = Customer;
                #endregion
                #region Site
                string endpointSite = "api/Site/GetAllSite";
                HttpClientHelper<string> apiobjSite = new HttpClientHelper<string>();
                string ResultSite = apiobjSite.GetRequest(endpointSite, HttpContext);
                var _lstSite = JObject.Parse(ResultSite);

                List<SiteInfo> Site = JsonConvert.DeserializeObject<List<SiteInfo>>(_lstSite["data"].ToString());
                ViewBag.Site = Site;
                #endregion
                #region Asset
                string endpoint = "api/Device/GetAllAsset";
                HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
                string Result = apiobj.GetRequest(endpoint, HttpContext);
                var _lst = JObject.Parse(Result);

                List<AssetInfo> Asset = JsonConvert.DeserializeObject<List<AssetInfo>>(_lst["data"].ToString());
                ViewBag.Asset = Asset;
                #endregion

                if (!string.IsNullOrEmpty(param))
                {
                    int tempId = Convert.ToInt32(param);

                    string endpoint3 = "api/Device/GetAssetRulesByAssetOverrideId?param=" + tempId;
                    HttpClientHelper<string> apiobj3 = new HttpClientHelper<string>();
                    string Result3 = apiobj3.GetRequest(endpoint3, HttpContext);
                    obj = JsonConvert.DeserializeObject<AssetOverrideInfo>(Result3);
                }
                return PartialView(obj);
            }
            catch
            {
                return PartialView();
            }

        }
        [HttpPost]
        public IActionResult GetAllAssetOverride()
        {
            string endpoint = "api/Device/GetAllAssetOverride";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject _lst = JObject.Parse(Result);
            return Json(_lst);

        }
        [HttpPost]
        public JsonResult SaveandupdateAssetOverride(AssetOverrideInfo obj)
        {

            obj.CreateBy = this.User.GetUserId();
            string endpoint = "api/Device/AddOrUpdateAssetOverride";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            JObject _lst = JObject.Parse(output);
            return Json(_lst);
        }
        [HttpDelete]
        public JsonResult DeleteAssetOverride(string Id)
        {

            try
            {
                int tempId = Convert.ToInt32(Id);

                string endpoint3 = "api/Device/DeleteAssetOverride?Id=" + tempId;
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
