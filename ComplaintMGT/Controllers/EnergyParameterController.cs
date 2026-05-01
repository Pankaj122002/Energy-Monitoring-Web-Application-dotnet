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
using ComplaintMGT.Core.CustomAttributes;
namespace ComplaintMGT.Controllers
{
    public class EnergyParameterController : Controller
    {
        [CustomAuthorize]
        public ActionResult PowerFactorCold()
        {
            return View();
        }

        public ActionResult PowerFactorWarm()
        {
            return View();
        }

        public ActionResult PowerFactorHot()
        {
            return View();
        }

        public IActionResult Power()
        {
            return View();
        }

        public IActionResult PowerWarm()
        {
            return View();
        }

        public IActionResult PowerCold()
        {
            return View();
        }

        public IActionResult RunHr()
        {
            return View();
        }

        public IActionResult RunHrWarm()
        {
            return View();
        }

        public IActionResult RunHrCold()
        {
            return View();
        }

        public IActionResult VoltageHot()
        {
            return View();
        }


        public IActionResult VoltageWarm()
        {
            return View();
        }

        public IActionResult VoltageCold()
        {
            return View();
        }

        public IActionResult Current()
        {
            return View();
        }

        public IActionResult CurrentCold()
        {
            return View();
        }

        public IActionResult CurrentWarm()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetMainMeter_Runhr()
        {
            string endpoint = "api/EnergyParameterAPI/GetMainMeter_Runhr";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpGet]
        public JsonResult GetSubMeter_Runhr()
        {
            string endpoint = "api/EnergyParameterAPI/GetSubMeter_Runhr";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetDevice_AvgRunhr(String fromDate, String toDate)
        {
            string endpoint = "api/EnergyParameterAPI/GetDevice_AvgRunhr?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetDevice_SumRunhr(String fromDate, String toDate)
        {
            string endpoint = "api/EnergyParameterAPI/GetDevice_SumRunhr?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetMainMeter_Voltage()
        {
            string endpoint = "api/EnergyParameterAPI/GetMainMeter_Voltage";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetSubMeter_Voltage()
        {
            string endpoint = "api/EnergyParameterAPI/GetSubMeter_Voltage";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetMainmeter_HourlyAvgVoltage_hot(String fromDate, String toDate)
        {
            string endpoint = "api/EnergyParameterAPI/GetMainmeter_HourlyAvgVoltage_hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetMainmeter_DailyAvgVoltage_warm(String fromDate, String toDate)
        {
            string endpoint = "api/EnergyParameterAPI/GetMainmeter_DailyAvgVoltage_warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetMainmeter_WeeklyAvgVoltage_cold(String fromDate, String toDate)
        {
            string endpoint = "api/EnergyParameterAPI/GetMainmeter_WeeklyAvgVoltage_cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        public JsonResult GetMainMeter_HighVoltage(String fromDate, String toDate)
        {
            string endpoint = "api/EnergyParameterAPI/GetMainMeter_HighVoltage?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetMainMeter_LowVoltage(String fromDate, String toDate)
        {
            string endpoint = "api/EnergyParameterAPI/GetMainMeter_LowVoltage?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetSubMeter_HighVoltage(String fromDate, String toDate)
        {
            string endpoint = "api/EnergyParameterAPI/GetSubMeter_HighVoltage?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetSubMeter_LowVoltage(String fromDate, String toDate)
        {
            string endpoint = "api/EnergyParameterAPI/GetSubMeter_LowVoltage?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        public JsonResult GetMainMeter_ActualVoltage(String fromDate, String toDate)
        {
            string endpoint = "api/EnergyParameterAPI/GetMainMeter_ActualVoltage?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetAllMeters_ActualPowerfactor(String fromDate, String toDate)
        {
            string endpoint = "api/EnergyParameterAPI/GetAllMeters_ActualPowerfactor?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetAllMeters_LastUpdated_Powerfactor()
        {
            string endpoint = "api/EnergyParameterAPI/GetAllMeters_LastUpdated_Powerfactor";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetAllmeter_DailyAvgPowerfactor_warm(String fromDate, String toDate)
        {
            string endpoint = "api/EnergyParameterAPI/GetAllmeter_DailyAvgPowerfactor_warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetAllmeter_HourlyAvgPowerfactor_hot(String fromDate, String toDate)
        {
            string endpoint = "api/EnergyParameterAPI/GetAllmeter_HourlyAvgPowerfactor_hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetAllmeter_WeeklyAvgPowerfactor_cold(String fromDate, String toDate)
        {
            string endpoint = "api/EnergyParameterAPI/GetAllmeter_WeeklyAvgPowerfactor_cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetAllmeter_AvgPowerfactor(String fromDate, String toDate)
        {
            string endpoint = "api/EnergyParameterAPI/GetAllmeter_AvgPowerfactor?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        #region Power
        public JsonResult GetAllMeters_LastUpdated_Power()
        {
            string endpoint = "api/EnergyParameterAPI/GetAllMeters_LastUpdated_Power";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetAllMeters_LastUpdatedPower_piegraph()
        {
            string endpoint = "api/EnergyParameterAPI/GetAllMeters_LastUpdatedPower_piegraph";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetAllMeters_AvgPower_Operationwise( string Timecategory)
        {
            string endpoint = "api/EnergyParameterAPI/GetAllMeters_AvgPower_Operationwise?Timecategory=" + Timecategory;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetAllmeter_AvgPower(string Timecategory)
        {
            string endpoint = "api/EnergyParameterAPI/GetAllmeter_AvgPower?Timecategory=" + Timecategory;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetAllmeter_AvgPower_bargraph(string Timecategory)
        {
            string endpoint = "api/EnergyParameterAPI/GetAllmeter_AvgPower_bargraph?Timecategory=" + Timecategory;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetAllmeter_ActualPower(string Timecategory)
        {
            string endpoint = "api/EnergyParameterAPI/GetAllmeter_ActualPower?Timecategory=" + Timecategory;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        #endregion


        #region Current
        public JsonResult GetAllMeters_LastUpdated_Current()
        {
            string endpoint = "api/EnergyParameterAPI/GetAllMeters_LastUpdated_Current";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetAllMeters_LastUpdatedCurrent_piegraph()
        {
            string endpoint = "api/EnergyParameterAPI/GetAllMeters_LastUpdatedCurrent_piegraph";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetAllMeters_AvgCurrent_Operationwise(string Timecategory)
        {
            string endpoint = "api/EnergyParameterAPI/GetAllMeters_AvgCurrent_Operationwise?Timecategory=" + Timecategory;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetAllmeter_AvgCurrent(string Timecategory)
        {
            string endpoint = "api/EnergyParameterAPI/GetAllmeter_AvgCurrent?Timecategory=" + Timecategory;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetAllmeter_AvgCurrent_bargraph(string Timecategory)
        {
            string endpoint = "api/EnergyParameterAPI/GetAllmeter_AvgCurrent_bargraph?Timecategory=" + Timecategory;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetAllmeter_ActualCurrent(string Timecategory)
        {
            string endpoint = "api/EnergyParameterAPI/GetAllmeter_ActualCurrent?Timecategory=" + Timecategory;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        #endregion
    }
}
