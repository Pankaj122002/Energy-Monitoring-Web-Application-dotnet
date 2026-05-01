using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Core.CustomAttributes;
using ComplaintMGT.Helpers;
using ComplaintMTG.Core.Utils;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Session;
using Newtonsoft.Json.Linq;
using NuGet.ContentModel;
using OfficeOpenXml.FormulaParsing.LexicalAnalysis;

namespace ComplaintMGT.Controllers
{

    public class ThermalController : Controller
    {

        [CustomAuthorize]
        public IActionResult HVAC()
        {
            return View();
        }

        public IActionResult HVAC_TrendsHot()
        {
            return View();
        }
        public IActionResult HVAC_TrendsCold()
        {
            return View();
        }
        public IActionResult HVAC_TrendsWarm()
        {
            return View();
        }

        public IActionResult ThermalWarm()
        {
            return View();
        }

        public IActionResult Kitchen()
        {
            return View();
        }

        public IActionResult Ambient_Thermal()
        {
            return View();
        }
        public IActionResult Ambient_Thermal_TrendsHot()
        {
            return View();
        }
        public IActionResult Ambient_Thermal_TrendsCold()
        {
            return View();
        }
        public IActionResult Ambient_Thermal_TrendsWarm()
        {
            return View();
        }
        public IActionResult Ambient_Thermal_Reports()
        {
            return View();
        }

        public IActionResult Ambient_Humidity()
        {
            return View();
        }
        public IActionResult Ambient_Humidity_TrendsHot()
        {
            return View();
        }
        public IActionResult Ambient_Humidity_TrendsCold()
        {
            return View();
        }
        public IActionResult Ambient_Humidity_TrendsWarm()
        {
            return View();
        }
        public IActionResult Ambient_Humidity_Reports()
        {
            return View();
        }
        public IActionResult Kitchen_TrendsHot()
        {
            return View();
        }
        public IActionResult Kitchen_TrendsCold()
        {
            return View();
        }
        public IActionResult Kitchen_TrendsWarm()
        {
            return View();
        }

        public IActionResult Hvac_Reports()
        {
            return View();
        }

        public IActionResult Hvac_ReportsHot()
        {
            return View();
        }

        public IActionResult Hvac_ReportsWarm()
        {
            return View();
        }

        public IActionResult Hvac_ReportsCold()
        {
            return View();
        }


        public IActionResult KitchnAsset_Reports()
        {
            return View();
        }


        public IActionResult KitchnAsset_ReportsHot()
        {
            return View();
        }

        public IActionResult KitchnAsset_ReportsWarm()
        {
            return View();
        }

        public IActionResult KitchnAsset_ReportsCold()
        {
            return View();
        }


        public IActionResult ThermalCold()
        {
            return View();
        }

        #region HVAC

        [HttpPost]
        public async Task<JsonResult> GetHVACDashboardAlerts(string days = "0")
        {
            string endpoint = "api/Thermal/GetHVACDashboardAlerts?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }


        //[HttpPost]
        //public ActionResult GetHVACDashboardAlert(string days = "0")
        //{
        //    string endpoint = "api/Thermal/GetHVACDashboardAlert?duration=" + days;
        //    HttpClientHelper<string> apiobj = new HttpClientHelper<string>();

        //    // Result is ALREADY a JSON string from the API
        //    string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);

        //    // BAD: return Json(Result);  <-- causing double serialization

        //    // GOOD: Return the string as-is, telling the browser it is JSON
        //    return Content(Result, "application/json");
        //}

        [HttpPost]
        public async Task<JsonResult> GetHVACDashboardCompliance(string days = "0")
        {
            string endpoint = "api/Thermal/GetHVACDashboardCompliance?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetHVACDashboardThermalMonitoriting(string days = "0")
        {
            string endpoint = "api/Thermal/GetHVACDashboardThermalMonitoriting?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetHVACOpsThermalMonitoring(string days = "0")
        {
            string endpoint = "api/Thermal/GetHVACOpsThermalMonitoring?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetHVACThermalMonitoringSeries(string days = "0")
        {
            string endpoint = "api/Thermal/GetHVACThermalMonitoringSeries?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        #endregion


        #region AMBIENT
        [HttpPost]
        public async Task<JsonResult> AmbientHumidityDashboardAlerts(string days = "0")
        {
            string endpoint = "api/Thermal/ambient/GetHumidityDashboardAlerts?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetAmbientHumidityDashboardCompliance(string days = "0")
        {
            string endpoint = "api/Thermal/GetAmbientHumidityDashboardCompliance?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetAmbientHumidityMonitoringOpsInfo(string days = "0")
        {
            string endpoint = "api/Thermal/GetAmbientHumidityMonitoringOpsInfo?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetAmbientOpsThermalMonitoring(string days = "0")
        {
            string endpoint = "api/Thermal/ambient/GetAmbientOpsThermalMonitoring?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetThermalDashboardCompliance(string days = "0")
        {
            string endpoint = "api/Thermal/ambient/GetThermalDashboardCompliance?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> AmbientHumidityMonitoring(string days = "0")
        {
            string endpoint = "api/Thermal/ambient/GetHumidityMonitoring?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }


        [HttpPost]
        public async Task<JsonResult> AmbientHumidityMonitoringSeries(string days = "0")
        {
            string endpoint = "api/Thermal/ambient/GetHumidityMonitoringSeries?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> AmbientThermalDashboardAlerts(string days = "0")
        {
            string endpoint = "api/Thermal/ambient/GetThermalDashboardAlerts?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> AmbientThermalMonitoring(string days = "0")
        {
            string endpoint = "api/Thermal/ambient/GetThermalMonitoring?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }


        [HttpPost]
        public async Task<JsonResult> AmbientThermalMonitoringSeries(string days = "0")
        {
            string endpoint = "api/Thermal/ambient/GetThermalMonitoringSeries?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        #endregion

        #region Kitchen Asset

        [HttpPost]
        public async Task<JsonResult> KitchenAssetDeshAlerts(string days = "0")
        {
            string endpoint = "api/Thermal/kitchenasset/GetDashboardAlert?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> KitchenAssetCompliance(string days = "0")
        {
            string endpoint = "api/Thermal/kitchenasset/GetComplianace?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> KitchenAssetThermalMonitoring(string days = "0")
        {
            string endpoint = "api/Thermal/kitchenasset/GetThermalMonitoring?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> KitchenAssetThermalMonitoringOps(string days = "0")
        {
            string endpoint = "api/Thermal/kitchenasset/GetThermalMonitoringOpsData?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> KitchenAssetThermalRefregerationMonitoringOps(string days = "0")
        {
            string endpoint = "api/Thermal/kitchenasset/GetThermalMonitoringRefrigerationOpsData?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> KitchenAssetThermalMonitoringSeries(string days = "0")
        {
            string endpoint = "api/Thermal/kitchenasset/GetThermalMonitoringSeries?days=" + days;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        #endregion

        #region Trends & Report

        [HttpPost]
        public async Task<JsonResult> GetHVACThermalAssets()
        {
            string endpoint = "api/Thermal/hvac/GetAssetList";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetAmbientThermalAssets()
        {
            string endpoint = "api/Thermal/ambient/GetAssetList";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetKitchenThermalAssets()
        {
            string endpoint = "api/Thermal/kitchenasset/GetAssetList";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetHotThermalMonitoringSeries(string assetid)
        {
            string endpoint = "api/Thermal/tends/HotThermalMonitoring-?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetAmbientHotThermalMonitoringSeries(string assetid)
        {
            string endpoint = "api/Thermal/tends/AmbientHotThermalMonitoring?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetAmbientTempHotThermalMonitoringSeries(string assetid)
        {
            string endpoint = "api/Thermal/tends/AmbientTempHotThermalMonitoring?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetWarmThermalMonitoringSeries(string assetid)
        {
            string endpoint = "api/Thermal/tends/WarmThermalMonitoring?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetAmbientTempWarmThermalMonitoringSeries(string assetid)
        {
            string endpoint = "api/Thermal/tends/AmbientTempWarmThermalMonitoring?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetAmbientWarmThermalMonitoringSeries(string assetid)
        {
            string endpoint = "api/Thermal/tends/AmbientWarmThermalMonitoring?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetColdThermalMonitoringSeries(string assetid)
        {
            string endpoint = "api/Thermal/tends/ColdThermalMonitoring?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetAmbientColdThermalMonitoringSeries(string assetid)
        {
            string endpoint = "api/Thermal/tends/AmbientColdThermalMonitoring?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetAmbientTempColdThermalMonitoringSeries(string assetid)
        {
            string endpoint = "api/Thermal/tends/AmbientTempColdThermalMonitoring?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> ConsolidatedThermalMonitoringHot()
        {
            string endpoint = "api/Thermal/tends/ConsolidatedThermalMonitoringHot";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public async Task<JsonResult> AmbientConsolidatedThermalMonitoringHot()
        {
            string endpoint = "api/Thermal/tends/AmbientConsolidatedThermalMonitoringHot";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> AmbientTempConsolidatedThermalMonitoringHot()
        {
            string endpoint = "api/Thermal/tends/AmbientTempConsolidatedThermalMonitoringHot";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> ConsolidatedThermalMonitoringWarm()
        {
            string endpoint = "api/Thermal/tends/ConsolidatedThermalMonitoringWarm";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public async Task<JsonResult> AmbientConsolidatedThermalMonitoringWarm()
        {
            string endpoint = "api/Thermal/tends/AmbientConsolidatedThermalMonitoringWarm";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> AmbientTempConsolidatedThermalMonitoringWarm()
        {
            string endpoint = "api/Thermal/tends/AmbientTempConsolidatedThermalMonitoringWarm";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> ConsolidatedThermalMonitoringCold()
        {
            string endpoint = "api/Thermal/tends/ConsolidatedThermalMonitoringCold";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> AmbientConsolidatedThermalMonitoringCold()
        {
            string endpoint = "api/Thermal/tends/AmbientConsolidatedThermalMonitoringCold";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> AmbientTempConsolidatedThermalMonitoringCold()
        {
            string endpoint = "api/Thermal/tends/AmbientTempConsolidatedThermalMonitoringCold";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }


        [HttpPost]
        public async Task<JsonResult> ThermalMonitoringHeatMapHot(string assetid)
        {
            string endpoint = "api/Thermal/tends/ThermalMonitoringHeatMapHot?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> AmbientThermalMonitoringHeatMapHot(string assetid)
        {
            string endpoint = "api/Thermal/tends/AmbientThermalMonitoringHeatMapHot?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> AmbientTempThermalMonitoringHeatMapHot(string assetid)
        {
            string endpoint = "api/Thermal/tends/AmbientTempThermalMonitoringHeatMapHot?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> AmbientThermalMonitoringHeatMapCold(string assetid)
        {
            string endpoint = "api/Thermal/tends/AmbientThermalMonitoringHeatMapCold?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> AmbientTempThermalMonitoringHeatMapCold(string assetid)
        {
            string endpoint = "api/Thermal/tends/AmbientTempThermalMonitoringHeatMapCold?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> AmbientThermalMonitoringHeatMapWarm(string assetid)
        {
            string endpoint = "api/Thermal/tends/AmbientThermalMonitoringHeatMapWarm?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> AmbientTempThermalMonitoringHeatMapWarm(string assetid)
        {
            string endpoint = "api/Thermal/tends/AmbientTempThermalMonitoringHeatMapWarm?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> ThermalMonitoringHeatMapWarm(string assetid)
        {
            string endpoint = "api/Thermal/tends/ThermalMonitoringHeatMapWarm?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> ThermalMonitoringHeatMapCold(string assetid)
        {
            string endpoint = "api/Thermal/tends/ThermalMonitoringHeatMapCold?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }


        [HttpPost]
        public async Task<JsonResult> ThermalMonitoringContinuousSeries(string assetid)
        {
            string endpoint = "api/Thermal/tends/ThermalMonitoringContinuousSeries?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }


        [HttpPost]
        public async Task<JsonResult> EnergyConsumptionHot()
        {
            string endpoint = "api/Thermal/tends/EnergyConsumptionHot";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> EnergyConsumptionWarm()
        {
            string endpoint = "api/Thermal/tends/EnergyConsumptionWarm";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> EnergyConsumptionCold()
        {
            string endpoint = "api/Thermal/tends/EnergyConsumptionCold";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> ConsolidatedThermalMonitoringKitchenAssetHot()
        {
            string endpoint = "api/Thermal/tends/ConsolidatedThermalMonitoringKitchenAssetHot";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }


        [HttpPost]
        public async Task<JsonResult> ConsolidatedThermalMonitoringKitchenAssetWarm()
        {
            string endpoint = "api/Thermal/tends/ConsolidatedThermalMonitoringKitchenAssetWarm";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }


        [HttpPost]
        public async Task<JsonResult> ConsolidatedThermalMonitoringKitchenAssetCold()
        {
            string endpoint = "api/Thermal/tends/ConsolidatedThermalMonitoringKitchenAssetCold";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> ThermalMonitoringAssetRules(string assetid)
        {
            string endpoint = "api/Thermal/tends/ThermalMonitoringAssetRules?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetHVACReport()
        {
            string endpoint = "api/Thermal/reports/hvac";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetAmbientReport()
        {
            string endpoint = "api/Thermal/reports/ambient";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetKitchenAssetReport()
        {
            string endpoint = "api/Thermal/reports/kitchenasset";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }


        [HttpPost]
        public async Task<JsonResult> GetSiteNameByAssetId(string assetid)
        {
            string endpoint = "api/Thermal/GetSiteName?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        #endregion

        #region Hvac thermal trends

        [HttpPost]
        public async Task<JsonResult> GetHVACAssetLists()
        {
            string endpoint = "api/Thermal/GetHVACAssetLists";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetThermalMonitoringHVAC_AverageTrends_Hot(string assetid)
        {
            string endpoint = "api/Thermal/GetThermalMonitoringHVAC_AverageTrends_Hot?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetThermalMonitoringHVAC_live_ByAssetId(string assetid)
        {
            string endpoint = "api/Thermal/GetThermalMonitoringHVAC_live_ByAssetId?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetThermalMonitoringHVAC_live_ByAssetId_warm(string assetid)
        {
            string endpoint = "api/Thermal/GetThermalMonitoringHVAC_live_ByAssetId_warm?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetThermalMonitoringHVAC_live_ByAssetId_cold(string assetid)
        {
            string endpoint = "api/Thermal/GetThermalMonitoringHVAC_live_ByAssetId_cold?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetThermalMonitoringHVAC_AverageTrends_cold(string assetid)
        {
            string endpoint = "api/Thermal/GetThermalMonitoringHVAC_AverageTrends_cold?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetThermalMonitoringHVAC_AverageTrends_warm(string assetid)
        {
            string endpoint = "api/Thermal/GetThermalMonitoringHVAC_AverageTrends_warm?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }



        #endregion

        #region Ambient thermal trends

        [HttpPost]
        public async Task<JsonResult> GetAmbientThermalAssetList()
        {
            string endpoint = "api/Thermal/GetAmbientThermalAssetList";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetThermalMonitoringAmbient_AverageTrends_cold(string assetid)
        {
            string endpoint = "api/Thermal/GetThermalMonitoringAmbient_AverageTrends_cold?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetThermalMonitoringAmbient_AverageTrends_warm(string assetid)
        {
            string endpoint = "api/Thermal/GetThermalMonitoringAmbient_AverageTrends_warm?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetThermalMonitoringAmbient_AverageTrends_Hot(string assetid)
        {
            string endpoint = "api/Thermal/GetThermalMonitoringAmbient_AverageTrends_Hot?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetThermalMonitoringAmbient_live_ByAssetId_warm(string assetid)
        {
            string endpoint = "api/Thermal/GetThermalMonitoringAmbient_live_ByAssetId_warm?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetThermalMonitoringAmbient_live_ByAssetId_cold(string assetid)
        {
            string endpoint = "api/Thermal/GetThermalMonitoringAmbient_live_ByAssetId_cold?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetThermalMonitoringAmbient_live_ByAssetId(string assetid)
        {
            string endpoint = "api/Thermal/GetThermalMonitoringAmbient_live_ByAssetId?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }



        #endregion

        #region ambient humidity trends

        [HttpPost]
        public async Task<JsonResult> GetHumidityMonitoringAmbient_AverageTrends_cold(string assetid)
        {
            string endpoint = "api/Thermal/GetHumidityMonitoringAmbient_AverageTrends_cold?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetHumidityMonitoringAmbient_AverageTrends_warm(string assetid)
        {
            string endpoint = "api/Thermal/GetHumidityMonitoringAmbient_AverageTrends_warm?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetHumidityMonitoringAmbient_AverageTrends_Hot(string assetid)
        {
            string endpoint = "api/Thermal/GetHumidityMonitoringAmbient_AverageTrends_Hot?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetHumidityMonitoringAmbient_live_ByAssetId_cold(string assetid)
        {
            string endpoint = "api/Thermal/GetHumidityMonitoringAmbient_live_ByAssetId_cold?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetHumidityMonitoringAmbient_live_ByAssetId_warm(string assetid)
        {
            string endpoint = "api/Thermal/GetHumidityMonitoringAmbient_live_ByAssetId_warm?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetHumidityMonitoringAmbient_live_ByAssetId(string assetid)
        {
            string endpoint = "api/Thermal/GetHumidityMonitoringAmbient_live_ByAssetId?assetid=" + assetid;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = await apiobj.GetRequestAsync(endpoint, HttpContext);
            return Json(Result);
        }



        #endregion
    }
}