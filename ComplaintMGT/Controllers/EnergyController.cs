using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Threading.Tasks;
using ComplaintMGT.Core.CustomAttributes;
using ComplaintMGT.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ComplaintMGT.Controllers
{
   
    public class EnergyController : Controller
    {

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Reports()
        {
            return View();
        }

        public IActionResult Trends_Hot()
        {
            return View();
        }
        public IActionResult Trends_Warm()
        {
            return View();
        }
        public IActionResult Trends_Cold()
        {
            return View();
        }
       
        [HttpPost]
        public JsonResult GetEnergyConsumptionActual(string fromDate, string toDate)
        {
            string endpoint = "api/Energy/GetEnergyConsumptionActual?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult GetEnergyConsumptionCumulative(string fromDate, string toDate)
        {
            string endpoint = "api/Energy/GetEnergyConsumptionCumulative?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult GetEnergyConsumptionAvg(string fromDate, string toDate)
        {
            string endpoint = "api/Energy/GetEnergyConsumptionAvg?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult GetEnergyConsumptionActual_Dashboard(string TimeCategory)
        {
            string endpoint = "api/Energy/GetEnergyConsumptionActual_Dashboard?TimeCategory=" + TimeCategory;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult GetEnergyConsumptionAverage_Dashboard(string TimeCategory)
        {
           
            string endpoint = "api/Energy/GetEnergyConsumptionAverage_Dashboard?TimeCategory=" + TimeCategory;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult GetEnergyConsumption_TimeOfDay_Dashboard(string TimeCategory)
        {

            string endpoint = "api/Energy/GetEnergyConsumption_TimeOfDay_Dashboard?TimeCategory=" + TimeCategory;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult GetEnergyConsumptionCumulative_Dashboard()
        {
            string endpoint = "api/Energy/GetEnergyConsumptionCumulative_Dashboard";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetEnergyDistribution_EnergyDashboard(string fromDate, string toDate)
        {
            string endpoint = "api/Energy/GetEnergyDistribution_EnergyDashboard?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetPowerOutage_EnergyDashboard(string fromDate, string toDate)
        {
            string endpoint = "api/Energy/GetPowerOutage_EnergyDashboard?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult GetEnergyTrends_CumulativeEnergyConsumptionLive(string TimeCategory,string Meter , string MainMeter)
        {
            string endpoint = "api/Energy/GetEnergyTrends_CumulativeEnergyConsumptionLive?TimeCategory=" + TimeCategory + "&Meter=" + Meter + "&MainMeter=" + MainMeter;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        [HttpPost]
        public JsonResult GetEnergyTrends_EnergyConsumptionLive(string TimeCategory , string Meter)
        {
            string endpoint = "api/Energy/GetEnergyTrends_EnergyConsumptionLive?TimeCategory=" + TimeCategory + "&Meter=" + Meter;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult EnergyTrends_EnergyConsumptionAndTemperatureHourlyAverage(string TimeCategory, string Meter)
        {
            string endpoint = "api/Energy/EnergyTrends_EnergyConsumptionAndTemperatureHourlyAverage?TimeCategory=" + TimeCategory + "&Meter=" + Meter;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult EnergyTrends_EnergyConsumptionHourlyAverage(string TimeCategory, string Meter)
        {
            string endpoint = "api/Energy/EnergyTrends_EnergyConsumptionHourlyAverage?TimeCategory=" + TimeCategory + "&Meter=" + Meter;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult EnergyTrends_EnergyProfileHourlyAverage(string TimeCategory, string Meter)
        {
            string endpoint = "api/Energy/EnergyTrends_EnergyProfileHourlyAverage?TimeCategory=" + TimeCategory + "&Meter=" + Meter;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult EnergyTrends_EnergyConsumptionPeakHourlyAverage(string TimeCategory, string Meter)
        {
            string endpoint = "api/Energy/EnergyTrends_EnergyConsumptionPeakHourlyAverage?TimeCategory=" + TimeCategory + "&Meter=" + Meter;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }



        [HttpPost]
        public JsonResult EnergyTrends_EnergyProfileHourlyActual(string TimeCategory, string Meter)
        {
            string endpoint = "api/Energy/EnergyTrends_EnergyProfileHourlyActual?TimeCategory=" + TimeCategory + "&Meter=" + Meter;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult EnergyTrends_EnergyConsumptionPeakHourlyActual(string TimeCategory, string Meter)
        {
            string endpoint = "api/Energy/EnergyTrends_EnergyConsumptionPeakHourlyActual?TimeCategory=" + TimeCategory + "&Meter=" + Meter;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult EnergyTrends_EnergyConsumptionHourlyActual(string TimeCategory, string Meter)
        {
            string endpoint = "api/Energy/EnergyTrends_EnergyConsumptionHourlyActual?TimeCategory=" + TimeCategory + "&Meter=" + Meter;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetEnergyTrends_EnergyConsumptionAndTemperatureLive(string TimeCategory , string Meter)
        {
            string endpoint = "api/Energy/GetEnergyTrends_EnergyConsumptionAndTemperatureLive?TimeCategory=" + TimeCategory + "&Meter=" + Meter;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult EnergyTrends_EnergyConsumptionAndTemperatureHourlyActual(string TimeCategory, string Meter)
        {
            string endpoint = "api/Energy/EnergyTrends_EnergyConsumptionAndTemperatureHourlyActual?TimeCategory=" + TimeCategory + "&Meter=" + Meter;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult GetEnergyTrends_EnergyConsumptionPeak(string TimeCategory)
        {
            string endpoint = "api/Energy/GetEnergyTrends_EnergyConsumptionPeak?TimeCategory=" + TimeCategory;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetEnergyTrends_EnergyConsumptionKWHKVAHAndTemprature(string TimeCategory)
        {
            string endpoint = "api/Energy/GetEnergyTrends_EnergyConsumptionKWHKVAHAndTemprature?TimeCategory=" + TimeCategory;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetEnergyTrends_EnergyProfile(string TimeCategory)
        {
            string endpoint = "api/Energy/GetEnergyTrends_EnergyProfile?TimeCategory=" + TimeCategory;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult GetFilterbyMeter()
        {
            string endpoint = "api/Energy/GetFilterbyMeter";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


    }
}
