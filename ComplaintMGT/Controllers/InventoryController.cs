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
using ComplaintMGT.Abstractions.Entities.Inventory;
using ComplaintMGT.Abstractions.Entities.Configuration;
using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Entities.Device;
using ComplaintMTG.Core.Utils;
using ComplaintMGT.Core.CustomAttributes;


namespace ComplaintMGT.Controllers
{
    public class InventoryController : Controller
    {
        [CustomAuthorize]
        public IActionResult Order()
        {
            return View();
        }
        public IActionResult AddOrder(string param)
        {
            try
            {
                string CCode = this.User.GetCompanyCode();
                OrderInfo obj = new OrderInfo();
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
                #region Status
                string endpointStatus = "api/Device/GetAllStatus";
                HttpClientHelper<string> apiobjStatus = new HttpClientHelper<string>();
                string ResultStatus = apiobjStatus.GetRequest(endpointStatus, HttpContext);
                var _lstStatus = JObject.Parse(ResultStatus);

                List<StatusInfo> Status = JsonConvert.DeserializeObject<List<StatusInfo>>(_lstStatus["data"].ToString());
                ViewBag.Status = Status;
                #endregion
                if (!string.IsNullOrEmpty(param))
                {
                    int tempId = Convert.ToInt32(param);

                    string endpoint3 = "api/Inventory/GetOrderByOrderId?param=" + tempId;
                    HttpClientHelper<string> apiobj3 = new HttpClientHelper<string>();
                    string Result3 = apiobj3.GetRequest(endpoint3, HttpContext);
                    obj = JsonConvert.DeserializeObject<OrderInfo>(Result3);
                }
                return PartialView(obj);
            }
            catch
            {
                return PartialView();
            }

        }
        [HttpPost]
        public IActionResult GetAllOrder()
        {
            string endpoint = "api/Inventory/GetAllOrder";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject _lst = JObject.Parse(Result);
            return Json(_lst);

        }
        [HttpPost]
        public JsonResult SaveandupdateOrder(OrderInfo obj)
        {

            obj.CreateBy = this.User.GetUserId();
            string endpoint = "api/Inventory/AddOrUpdateOrder";
            string input = JsonConvert.SerializeObject(obj);
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string output = apiobj.PostRequestString(endpoint, input, HttpContext);
            JObject _lst = JObject.Parse(output);
            return Json(_lst);
        }
        [HttpDelete]
        public JsonResult DeleteOrder(string Id)
        {

            try
            {
                int tempId = Convert.ToInt32(Id);

                string endpoint3 = "api/Inventory/DeleteOrder?Id=" + tempId;
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
