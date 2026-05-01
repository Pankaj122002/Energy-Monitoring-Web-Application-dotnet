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
using OfficeOpenXml.FormulaParsing.Excel.Functions.Text;
using ComplaintMGT.Abstractions.Entities.Configuration;
using ComplaintMGT.Abstractions.Entities;
using ComplaintMTG.Core.Utils;
using ComplaintMGT.Core.CustomAttributes;

namespace ComplaintMGT.Controllers
{
    public class ConfigurationController : Controller
    {
        public ConfigurationController()
        {
        }
        [CustomAuthorize]
        public IActionResult GetAllMenu()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetAllMenuM()
        {
            string endpoint1 = "api/Configuration/GetAllMenuM?ModelId=1";
            HttpClientHelper<string> apiobj1 = new HttpClientHelper<string>();
            string Result1 = apiobj1.GetRequest(endpoint1, HttpContext);

            return Json(Result1);
        }
        [HttpPost]
        public JsonResult GetAllMenuMP()
        {
            string endpoint1 = "api/Configuration/GetAllMenuMP";
            HttpClientHelper<string> apiobj1 = new HttpClientHelper<string>();
            string Result1 = apiobj1.GetRequest(endpoint1, HttpContext);

            return Json(Result1);
        }
        [HttpPost]
        public JsonResult AddOrUpdateMenu(Menu obj)
        {
            string msg = string.Empty;
            string input = JsonConvert.SerializeObject(obj);
            string endpoint = "api/Configuration/AddOrUpdateMenu";
            HttpClientHelper<GResposnse> apiobj = new HttpClientHelper<GResposnse>();

            GResposnse Result = apiobj.PostRequest(endpoint, input, HttpContext);

            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetMenuById(string Id)
        {
            string endpoint1 = "api/Configuration/GetALLMenuMasterByMenuId?MenuId=" + Id;
            HttpClientHelper<string> apiobj1 = new HttpClientHelper<string>();
            string Result1 = apiobj1.GetRequest(endpoint1, HttpContext);

            return Json(Result1);
        }
        [CustomAuthorize]
        public IActionResult GetAllSubMenu()
        {
            return View();
        }
        [HttpPost]
        public JsonResult GetAllSubMenuM()
        {
            string endpoint1 = "api/Configuration/GetAllSubMenuM";
            HttpClientHelper<string> apiobj1 = new HttpClientHelper<string>();
            string Result1 = apiobj1.GetRequest(endpoint1, HttpContext);

            return Json(Result1);
        }
        [HttpPost]
        public JsonResult AddOrUpdateSubMenu(SubMenuInfo obj)
        {
            string msg = string.Empty;
            string input = JsonConvert.SerializeObject(obj);
            string endpoint = "api/Configuration/AddOrUpdateSubMenu";
            HttpClientHelper<GResposnse> apiobj = new HttpClientHelper<GResposnse>();

            GResposnse Result = apiobj.PostRequest(endpoint, input, HttpContext);

            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetSubMenuById(string Id)
        {
            string endpoint1 = "api/Configuration/GetALLSubMenuMasterByMenuId?SubMenuId=" + Id;
            HttpClientHelper<string> apiobj1 = new HttpClientHelper<string>();
            string Result1 = apiobj1.GetRequest(endpoint1, HttpContext);

            return Json(Result1);
        }

        public IActionResult AllCountry()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SaveandupdateCountry(string CountryName, string CountryId, string IsActive)
        {

            var obj = new
            {
                CountryName = CountryName,
                CountryId = CountryId,
                Active = IsActive,
            };
            string endpoint = "api/Configuration/SaveandupdateCountry";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            return Json(output);
        }
        [HttpPost]
        public JsonResult GetAllCountry()
        {
            string endpoint = "api/Configuration/GetAllCountry";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        public IActionResult AllState()
        {
            return View();
        }
        [HttpPost]
        public JsonResult SaveandupdateState(string StateId, string StateName, string CountryId, string IsActive)
        {

            var obj = new
            {
                StateId = StateId,
                CountryId = CountryId,
                StateName = StateName,
                Active = IsActive,
            };
            string endpoint = "api/Configuration/SaveandupdateState";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            return Json(output);
        }

        [HttpPost]
        public JsonResult GetAllState()
        {
            string endpoint = "api/Configuration/GetAllState";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        public IActionResult AllCity()
        {
            return View();
        }
        [HttpPost]
        public JsonResult SaveandupdateCity(string CityId, string CityName, string StateId, string IsActive)
        {

            var obj = new
            {
                CityId = CityId,
                StateId = StateId,
                CityName = CityName,
                Active = IsActive,
            };
            string endpoint = "api/Configuration/SaveandupdateCity";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            return Json(output);
        }
        [HttpPost]
        public JsonResult GetAllCity()
        {
            string endpoint = "api/Configuration/GetAllCity";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        public IActionResult AddressType()
        {
            return View();
        }
        [HttpPost]
        public JsonResult SaveandupdateAddressType(AddressTypeInfo obj)
        {

            obj.CreateBy = this.User.GetUserId();
            string endpoint = "api/Configuration/SaveandupdateAddressType";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            return Json(output);
        }
        [HttpPost]
        public JsonResult GetAllAddressType()
        {
            string endpoint = "api/Configuration/GetAllAddressType";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult DeleteAddressType(string AddressTypeId)
        {

            var obj = new
            {
                AddressTypeId = AddressTypeId,

            };
            string endpoint = "api/Configuration/DeleteAddressType";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            return Json(output);
        }
        public IActionResult Customer()
        {
            return View();
        }
        public IActionResult AddCutomer()
        {
            return PartialView();
        }

        public JsonResult GetStateByCountry(string CountryId)
        {

            string endpoint = "api/Configuration/GetStateByCountry?CountryId=" + CountryId;

            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetCityByStateId(string StateId)
        {

            string endpoint = "api/Configuration/GetCityByStateId?StateId=" + StateId;

            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult SaveandupdateCustomer(CustmerInfo Obj)
        {

            var obj = new
            {
                CustomerId = Obj.CustomerId,
                Name = Obj.Name,
                Description = Obj.Description,
                Email = Obj.Email,
                PhoneNumber = Obj.PhoneNumber,
                MobileNumber = Obj.MobileNumber,
                ContectPersonName = Obj.ContectPersonName,
                IsActive = Obj.IsActive,
                CreateBy = this.User.GetUserId(),
                CCode = this.User.GetCompanyCode(),
                JArrayval = Obj.JArrayval
            };
            string endpoint = "api/Configuration/SaveandupdateCustomer";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            return Json(output);
        }
        [HttpPost]
        public JsonResult GetAllCoustomer()
        {
            string CCode = this.User.GetCompanyCode();
            string endpoint = "api/Configuration/GetAllCoustomer?CCode=" + CCode;

            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JArray _lst = JArray.Parse(Result);
            var response = new { data = _lst };
            return Json(response);
        }
        [HttpPost]
        public JsonResult GetAddressByCoustomerId(string CoustomerId)
        {

            string endpoint = "api/Configuration/GetAddressByCoustomerId?CoustomerId=" + CoustomerId;

            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetCoustomerByCoustomerId(string CoustomerId)
        {
            string endpoint = "api/Configuration/GetCoustmerByCoustomerId?CoustomerId=" + CoustomerId;

            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            string endpoint1 = "api/Configuration/GetAddressByCoustomerId?CoustomerId=" + CoustomerId;

            HttpClientHelper<string> apiobj1 = new HttpClientHelper<string>();
            string Result1 = apiobj1.GetRequest(endpoint1, HttpContext);
            CustmerInfo obj = JsonConvert.DeserializeObject<CustmerInfo>(Result);
            obj.JArrayval = Result1;
            return Json(obj);
        }

        public JsonResult DeleteCoustomer(string CoustomerId)
        {
            string endpoint = "api/Configuration/DeleteCoustomer?ID=" + CoustomerId;

            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);

        }

        [CustomAuthorize]
        public IActionResult Zone()
        {
            return View();
        }
        [HttpPost]
        public IActionResult GetAllZone()
        {
            string endpoint = "api/Configuration/GetAllZone";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject _lst = JObject.Parse(Result);
            return Json(_lst);

        }
        [HttpPost]
        public JsonResult AddOrUpdateZone(string ZoneName, string ZoneId, bool IsActive, int CityId)
        {

            string CreateBy = this.User.GetUserId();

            var obj = new { ZoneName = ZoneName, ZoneId = ZoneId, IsActive = IsActive, CreateBy = CreateBy, CityId = CityId };
            string endpoint = "api/Configuration/AddOrUpdateZone";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            JObject _lst = JObject.Parse(output);
            return Json(_lst);
        }
        [HttpDelete]
        public JsonResult DeleteZone(string Id)
        {

            try
            {
                int tempId = Convert.ToInt32(Id);

                string endpoint3 = "api/Configuration/DeleteZone?Id=" + tempId;
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
        public JsonResult GetZoneByCityId(string CityId)
        {

            string endpoint = "api/Configuration/GetZoneByCityId?CityId=" + CityId;

            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
    }
}
