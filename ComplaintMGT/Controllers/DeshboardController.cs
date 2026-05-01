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
    public class DeshboardController : Controller
    {
        [CustomAuthorize]
        public IActionResult Index()
        {
            return View();
        }
        [CustomAuthorize]
        public IActionResult IndexNew()
        {
            return View();
        }
        [CustomAuthorize]
        public IActionResult Meter()
        {
            return View();
        }
        [CustomAuthorize]
        public IActionResult HVAC()
        {
            return View();
        }
        [CustomAuthorize]
        public IActionResult Equipments()
        {
            return View();
        }
        [CustomAuthorize]
        public IActionResult RealMeter()
        {
            return View();
        }
        [CustomAuthorize]
        public IActionResult RealHVAC()
        {
            return View();
        }
        [CustomAuthorize]
        public IActionResult RealEquipments()
        {
            return View();
        }
        [HttpPost]
        public JsonResult GetAllDevice(string DType)
        {
            string endpoint = "api/Deshboard/GetAllDevie?DType=" + DType;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult DeshHVACAlerts(string DType)
        {
            string endpoint = "api/Deshboard/GetDeshHVACAlerts?Type=" + DType;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetAlerts()
        {
            string endpoint = "api/Deshboard/GetAlerts";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetAllOverallComplianceofStore()
        {
            string endpoint = "api/Deshboard/GetAllOverallComplianceofStore";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetAllDeviationOverallComplianceofStore()
        {
            string endpoint = "api/Deshboard/GetAllDeviationOverallComplianceofStore";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetAllDeviationOverallComplianceofStore_Summary()
        {
            string endpoint = "api/Deshboard/GetAllDeviationOverallComplianceofStore_Summary";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult DeshAlerts()
        {
            string endpoint = "api/Deshboard/DeshAlerts";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult DeshEmployeeGuestConfort()
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestConfortDashboard";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetEmployeeGuestConfortDetailDashboard()
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestConfortDetailDashboard";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetEnergyMeterRealtimeBARCHART(string type, string Menu, string subMenu, string SubRedioMenu)
        {
            string endpoint = "api/Deshboard/GetEnergyMeterRealtimeBARCHART?type=" + type + "&Menu=" + Menu + "&subMenu=" + subMenu + "&SubRedioMenu=" + SubRedioMenu;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetEnergyMeterByDateBARCHART(string FromDate, string Todate)
        {
            string endpoint = "api/Deshboard/GetEnergyMeterByDateBARCHART?FromDate=" + FromDate + "&Todate=" + Todate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult EnergyConsumptionAverage()
        {
            string endpoint = "api/Deshboard/EnergyConsumptionAverage";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult ThermalMonitoringHVACAvg(string devicetype)
        {
            string endpoint = "api/Deshboard/ThermalMonitoringHVACAvg?devicetype=" + devicetype;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult EnergyConsumptiontotal()
        {
            string endpoint = "api/Deshboard/EnergyConsumptiontotal";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult ELECTRICALHEALTHAverage()
        {
            string endpoint = "api/Deshboard/ELECTRICALHEALTHAverage";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult TimeofDayENERGYCONSUMPTION()
        {
            string endpoint = "api/Deshboard/TimeofDayENERGYCONSUMPTION";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult GetTopValueMeter()
        {
            string endpoint = "api/Deshboard/GetTopValueMeter";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetTopValuetransactionTempSensor(string DType)
        {
            string endpoint = "api/Deshboard/GetTopValuetransactionTempSensor?DType=" + DType;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult GetTopValuetransactionTempHumidSensor(string DType)
        {
            string endpoint = "api/Deshboard/GetTopValuetransactionTempHumidSensor?DType=" + DType;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult GetAllTimeForChart(string DeviceType)
        {
            string endpoint = "api/Deshboard/GetAllTimeForChart?DeviceType=" + DeviceType;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            JObject _lst = JObject.Parse(Result);
            return Json(_lst);
        }
        [HttpPost]
        public JsonResult GetAlltransactionTempSensorByDateTime(string FromDate, string Todate, string DeviceId)
        {
            string endpoint = "api/Deshboard/GetAlltransactionTempSensorByDateTime?FromDate=" + FromDate + "&Todate=" + Todate + "&DeviceId=" + DeviceId;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);

            return Json(Result);
        }
        //[HttpPost]
        //public JsonResult GetAlltransactionTempSensorForChart()
        //{
        //    string endpoint = "api/Deshboard/GetAlltransactionTempSensorForChart";
        //    HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
        //    string Result = apiobj.GetRequest(endpoint);
        //    return Json(Result);
        //}

        [HttpPost]
        public JsonResult Getallmeterdetailsbymetername(string Device)
        {
            string endpoint = "api/Deshboard/Getallmeterdetailsbymetername?Device=" + Device;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetallmeterdetailsbymeternameChart(string Device, string Per)
        {
            string endpoint = "api/Deshboard/GetallmeterdetailsbymeternameChart?Device=" + Device + "&Per=" + Per;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetallmeterdetailsbymeternameChartByDate(string Device, string Per, string Fdate, string Tdate)
        {
            string endpoint = "api/Deshboard/GetallmeterdetailsbymeternameChartByDate?Device=" + Device + "&Per=" + Per + "&Fdate=" + Fdate + "&Tdate=" + Tdate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult Get_Customer_Footfall()
        {
            string endpoint = "api/Deshboard/Get_Customer_Footfall";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult Get_Customer_Footfall_TimeOfDay()
        {
            string endpoint = "api/Deshboard/Get_Customer_Footfall_TimeOfDay";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        public IActionResult CpLoaction()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetMapDetials()
        {
            string endpoint = "api/Deshboard/GetMapDetials";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        [HttpPost]
        public JsonResult GetAllSiteByCustomerId(string CustomerId)
        {
            string endpoint = "api/Deshboard/GetAllSiteByCustomerId?CustomerId=" + CustomerId;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetAllAssetBySiteId(string SiteId, string DeviceType)
        {
            string endpoint = "api/Deshboard/GetAllAssetBySiteId?SiteId=" + SiteId + "&DeviceType=" + DeviceType;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetAllAQIDataDashboard()
        {
            string endpoint = "api/Deshboard/GetAllAQI_Dashboard";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetEnergyDistributionDashboard()
        {
            string endpoint = "api/Deshboard/GetEnergyDistributionDashboard";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetUPSEnergyDashboard()
        {
            string endpoint = "api/Deshboard/GetUPS_Energy_Dashboard";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetGasConsumption()
        {
            string endpoint = "api/Deshboard/Get_Gas_Consumption";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetGasConsumptionTimeOfDay()
        {
            string endpoint = "api/Deshboard/Get_GasConsumption_TimeOfDay";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }
        [HttpPost]
        public JsonResult GetEVHealthDashboard()
        {
            string endpoint = "api/Deshboard/Get_EV_Health_Dashboard";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpPost]
        public JsonResult GetPushDeviceHandlingSensor()
        {
            string endpoint = "api/DeviceTransaction/GetPushDeviceHandlingSensor";
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpGet]
        public JsonResult GetAlertCountByDateTime_Hot(String from, String to)
        {
            string endpoint = "api/Alert/GetAlertCountByDateTime_Hot?From=" + from + "&To=" + to;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpGet]
        public JsonResult GetAlertCountByDateTime_Warm(String from, String to)
        {
            string endpoint = "api/Alert/GetAlertCountByDateTime_Warm?From=" + from + "&To=" + to;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpGet]
        public JsonResult GetAlertCountByDateTime_Cold(String from, String to)
        {
            string endpoint = "api/Alert/GetAlertCountByDateTime_Cold?From=" + from + "&To=" + to;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpGet]
        public JsonResult GetSiteOperation(String from, String to)
        {
            string endpoint = "api/Alert/GetSiteOperation?From=" + from + "&To=" + to;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        [HttpGet]
        public JsonResult AllOverallComplianceofStore_Summary(String from, String to)
        {
            string endpoint = "api/Alert/AllOverallComplianceofStore_Summary?From=" + from + "&To=" + to;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        

        [HttpGet]
        public JsonResult GetSiteOperationWindowofcompliance(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetSiteOperationWindowofcompliance?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetOperationsWiseCompliance_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Alert/GetOperationsWiseCompliance_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetOperationsWiseCompliance_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Alert/GetOperationsWiseCompliance_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetOperationsWiseCompliance_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Alert/GetOperationsWiseCompliance_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        public JsonResult ComplianceDashboardAllOverall_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/ComplianceDashboardAllOverall_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult ComplianceDashboardAllOverall_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/ComplianceDashboardAllOverall_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult ComplianceDashboardAllOverall_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/ComplianceDashboardAllOverall_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult DeviceWiseComplicanceofStore_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/DeviceWiseComplicanceofStore_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult DeviceWiseComplicanceofStore_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/DeviceWiseComplicanceofStore_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult DeviceWiseComplicanceofStore_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/DeviceWiseComplicanceofStore_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult DeviceWiseComplicanceofStoreNonOps_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/DeviceWiseComplicanceofStoreNonOps_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult DeviceWiseComplicanceofStoreNonOps_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/DeviceWiseComplicanceofStoreNonOps_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult DeviceWiseComplicanceofStoreNonOps_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/DeviceWiseComplicanceofStoreNonOps_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult DeviceWiseComplicanceofStoreOps_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/DeviceWiseComplicanceofStoreOps_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult DeviceWiseComplicanceofStoreOps_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/DeviceWiseComplicanceofStoreOps_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult DeviceWiseComplicanceofStoreOps_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/DeviceWiseComplicanceofStoreOps_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult ComplianceDashboardAllOverallNonOps_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/ComplianceDashboardAllOverallNonOps_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult ComplianceDashboardAllOverallNonOps_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/ComplianceDashboardAllOverallNonOps_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult ComplianceDashboardAllOverallNonOps_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/ComplianceDashboardAllOverallNonOps_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult ComplianceDashboardAllOverallOps_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/ComplianceDashboardAllOverallOps_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult ComplianceDashboardAllOverallOps_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/ComplianceDashboardAllOverallOps_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult ComplianceDashboardAllOverallOps_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/ComplianceDashboardAllOverallOps_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

      
        public JsonResult GetEmployeeGuestComfortDashboard_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestComfortDashboard_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

       
        public JsonResult GetEmployeeGuestComfortDashboard_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestComfortDashboard_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetEmployeeGuestComfortDashboard_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestComfortDashboard_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetEmployeeGuestComfortDashboardOps_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestComfortDashboardOps_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        public JsonResult GetEmployeeGuestComfortDashboardOps_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestComfortDashboardOps_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetEmployeeGuestComfortDashboardOps_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestComfortDashboardOps_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetEmployeeGuestComfortDashboardNonOps_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestComfortDashboardNonOps_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        public JsonResult GetEmployeeGuestComfortDashboardNonOps_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestComfortDashboardNonOps_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetEmployeeGuestComfortDashboardNonOps_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestComfortDashboardNonOps_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetEmployeeGuestComfortDashboardDetail_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestComfortDashboardDetail_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

       
        public JsonResult GetEmployeeGuestComfortDashboardDetail_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestComfortDashboardDetail_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

       
        public JsonResult GetEmployeeGuestComfortDashboardDetail_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestComfortDashboardDetail_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetEmployeeGuestComfortDashboardDetailOps_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestComfortDashboardDetailOps_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        public JsonResult GetEmployeeGuestComfortDashboardDetailOps_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestComfortDashboardDetailOps_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        public JsonResult GetEmployeeGuestComfortDashboardDetailOps_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestComfortDashboardDetailOps_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetEmployeeGuestComfortDashboardDetailNonOps_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestComfortDashboardDetailNonOps_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        public JsonResult GetEmployeeGuestComfortDashboardDetailNonOps_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestComfortDashboardDetailNonOps_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        public JsonResult GetEmployeeGuestComfortDashboardDetailNonOps_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetEmployeeGuestComfortDashboardDetailNonOps_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        public JsonResult Getallmainmeterdetails_hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/Getallmainmeterdetails_hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult Getallmainmeterdetails_warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/Getallmainmeterdetails_warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult Getallmainmeterdetails_cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/Getallmainmeterdetails_cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        

        public JsonResult GetAlertCount_OpsNonOpsPercentage(String from, String to)
        {
            string endpoint = "api/Deshboard/GetAlertCount_OpsNonOpsPercentage?from=" + from + "&to=" + to;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetOperationsWiseAlerts_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetOperationsWiseAlerts_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        public JsonResult GetOperationsWiseAlerts_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetOperationsWiseAlerts_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult GetOperationsWiseAlerts_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/GetOperationsWiseAlerts_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult DiningWiseComplicanceofStore_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/DiningWiseComplicanceofStore_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        public JsonResult DiningWiseComplicanceofStore_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/DiningWiseComplicanceofStore_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult DiningWiseComplicanceofStore_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/DiningWiseComplicanceofStore_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult DiningWiseComplicanceofStoreNonOps_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/DiningWiseComplicanceofStoreNonOps_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        public JsonResult DiningWiseComplicanceofStoreNonOps_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/DiningWiseComplicanceofStoreNonOps_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult DiningWiseComplicanceofStoreNonOps_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/DiningWiseComplicanceofStoreNonOps_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult DiningWiseComplicanceofStoreOps_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/DiningWiseComplicanceofStoreOps_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        public JsonResult DiningWiseComplicanceofStoreOps_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/DiningWiseComplicanceofStoreOps_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult DiningWiseComplicanceofStoreOps_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/DiningWiseComplicanceofStoreOps_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult ProductionWiseComplicanceofStore_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/ProductionWiseComplicanceofStore_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        public JsonResult ProductionWiseComplicanceofStore_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/ProductionWiseComplicanceofStore_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult ProductionWiseComplicanceofStore_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/ProductionWiseComplicanceofStore_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult ProductionWiseComplicanceofStoreNonOps_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/ProductionWiseComplicanceofStoreNonOps_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        public JsonResult ProductionWiseComplicanceofStoreNonOps_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/ProductionWiseComplicanceofStoreNonOps_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult ProductionWiseComplicanceofStoreNonOps_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/ProductionWiseComplicanceofStoreNonOps_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        public JsonResult ProductionWiseComplicanceofStoreOps_Warm(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/ProductionWiseComplicanceofStoreOps_Warm?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }


        public JsonResult ProductionWiseComplicanceofStoreOps_Hot(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/ProductionWiseComplicanceofStoreOps_Hot?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        public JsonResult ProductionWiseComplicanceofStoreOps_Cold(String fromDate, String toDate)
        {
            string endpoint = "api/Deshboard/ProductionWiseComplicanceofStoreOps_Cold?fromDate=" + fromDate + "&toDate=" + toDate;
            HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
            string Result = apiobj.GetRequest(endpoint, HttpContext);
            return Json(Result);
        }

        


        public IActionResult Override()
        {
            return View();
        }

        public IActionResult OverrideWarm()
        {
            return View();
        }

        public IActionResult OverrideCold()
        {
            return View();
        }
        public IActionResult ControlEnablement()
        {
            return View();
        }

        public IActionResult ControlEnablementWarm()
        {
            return View();
        }

        public IActionResult ControlEnablementCold()
        {
            return View();
        }
        public IActionResult IAQ()
        {
            return View();
        }
        public IActionResult Alerts()
        {
            return View();
        }
       
        public IActionResult ElectricalHealth()
        {
            return View();
        }
        public IActionResult HistoryElectricalHealth()
        {
            return View();
        }


        public IActionResult StoreControl()
        {
            return View();
        }

        public IActionResult StoreControlWarm()
        {
            return View();
        }

        public IActionResult StoreControlCold()
        {
            return View();
        }

        public IActionResult Consumption()
        {
            return View();
        }

        public IActionResult ConsumptionWarm()
        {
            return View();
        }

        public IActionResult ConsumptionCold()
        {
            return View();
        }

       

       
    }
}
