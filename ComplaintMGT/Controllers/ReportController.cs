using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using ComplaintMGT.Helpers;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Hosting;
using ComplaintMGT.Core.Utils.Report;
using ComplaintMGT.Abstractions.DomainModels;
//using DocumentFormat.OpenXml.Spreadsheet;

namespace ComplaintMGT.Controllers
{
    public class ReportController : Controller
    {
        private ExcelReport _report;
        private PdfReport _pdfReport;
        private readonly IWebHostEnvironment HostingEnvironment;
        public ReportController(ExcelReport report, PdfReport PReport, IWebHostEnvironment hostingEnvironment)
        {
            this._report = report;
            this._pdfReport = PReport;
            this.HostingEnvironment = hostingEnvironment;

        }
        public IActionResult HVACReport()
        {

            return View();
        }
        [HttpPost]
        public FileResult ExportGeHVACData(string FromDate, string Todate, string DeviceId, string FType, string FName)
        {
            string RowData = "";
            try
            {
                string endpoint = "api/Report/GetAlltransactionTempSensorByDateTimeReport?FromDate=" + FromDate + "&Todate=" + Todate + "&DeviceId=" + DeviceId;
                HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
                RowData = apiobj.GetRequest(endpoint, HttpContext);
            }
            catch
            {

            }
            byte[] filearray = null;
            string filePath = Path.Combine(HostingEnvironment.WebRootPath + "/REPORTTEMPLATE/Report_Format.html");
            string ContentType = string.Empty;
            DateTime ReportTime = DateTime.Now;
            string Name = "HVAC Report " + FName;
            string filename = string.Empty;
            if (FType == "Excel")
            {
                ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                filename = Name + ReportTime.ToShortDateString() + ".xlsx";
                filearray = _report.ExportGetHVACData(RowData, Name);
            }
            else
            {
                JArray jresult = JArray.Parse(RowData);
                ContentType = "application/pdf";
                filename = Name + ReportTime.ToShortDateString() + ".pdf";
                int RCount = 1;

                string txttbl = string.Empty;
                txttbl += "<thead><tr><th>Sr. No</th><th>Country</th><th>State</th><th>City</th><th>Zone</th><th>Site</th><th>Asset</th><th>Date</th><th>Time</th><th>Temperature</th></tr></thead>";

                txttbl += "<tbody>";
                foreach (JObject item in jresult)
                {

                    txttbl += "<tr><td>" + RCount + "</td>" + "" +
                                 "<td> " + "" + " </td> " +
                                 "<td> " + "" + " </td> " +
                                 "<td> </td> " +
                                 "<td> " + "" + " </td> " +
                                 "<td> " + item.GetValue("SiteName").ToString() + " </td> " +
                                 "<td> " + item.GetValue("Asset").ToString() + " </td> " +
                                 "<td> " + item.GetValue("TDAte").ToString() + " </td> " +
                                 "<td> " + item.GetValue("TTime").ToString() + " </td> " +
                                 "<td> " + item.GetValue("Temp_in_degree").ToString() + " </td> " +
                             "</tr>";
                    RCount++;
                }
                // txttbl += "<tr><th colspan='3'>Total</th><th colspan='2'>ONLOAD(InKgs)</th><th>" + GrossWeight + "</th><th>OFFLOAD(InKgs)</th><th>" + vehicleWeightInKg + "</th><th>LOADCOLLECTED(In Kgs)</th><th>" + NetWaste + "</th></tr>";
                txttbl += "</tbody>";

                filearray = _pdfReport.ExportToPdfData(txttbl, Name, filePath);


            }
            return File(filearray, ContentType, filename);
        }

        public IActionResult KitchenReport()
        {

            return View();
        }
        [HttpPost]
        public FileResult ExportGeKitchenData(string FromDate, string Todate, string DeviceId, string FType, string FName, string DeviceType)
        {
            string RowData = "";
            try
            {
                string endpoint = "api/Report/GetAlltransactionTempSensorByDateTimeReport?FromDate=" + FromDate + "&Todate=" + Todate + "&DeviceId=" + DeviceId + "&DeviceType=" + DeviceType;
                HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
                RowData = apiobj.GetRequest(endpoint, HttpContext);
            }
            catch
            {

            }
            byte[] filearray = null;
            string filePath = Path.Combine(HostingEnvironment.WebRootPath + "/REPORTTEMPLATE/Report_Format.html");
            string ContentType = string.Empty;
            DateTime ReportTime = DateTime.Now;
            string Name = "Kitchen Report " + FName;
            string filename = string.Empty;
            if (FType == "Excel")
            {
                ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                filename = Name + ReportTime.ToShortDateString() + ".xlsx";
                filearray = _report.ExportGetHVACData(RowData, Name);
            }
            else
            {
                JArray jresult = JArray.Parse(RowData);
                ContentType = "application/pdf";
                filename = Name + ReportTime.ToShortDateString() + ".pdf";
                int RCount = 1;

                string txttbl = string.Empty;
                txttbl += "<thead><tr><th>Sr. No</th><th>Country</th><th>State</th><th>City</th><th>Zone</th><th>Site</th><th>Asset</th><th>Date</th><th>Time</th><th>Temperature</th></tr></thead>";

                txttbl += "<tbody>";
                foreach (JObject item in jresult)
                {

                    txttbl += "<tr><td>" + RCount + "</td>" + "" +
                                 "<td> " + "" + " </td> " +
                                 "<td> " + "" + " </td> " +
                                 "<td> </td> " +
                                 "<td> " + "" + " </td> " +
                                 "<td> " + item.GetValue("SiteName").ToString() + " </td> " +
                                 "<td> " + item.GetValue("Asset").ToString() + " </td> " +
                                 "<td> " + item.GetValue("TDAte").ToString() + " </td> " +
                                 "<td> " + item.GetValue("TTime").ToString() + " </td> " +
                                 "<td> " + item.GetValue("Temp_in_degree").ToString() + " </td> " +
                             "</tr>";
                    RCount++;
                }
                // txttbl += "<tr><th colspan='3'>Total</th><th colspan='2'>ONLOAD(InKgs)</th><th>" + GrossWeight + "</th><th>OFFLOAD(InKgs)</th><th>" + vehicleWeightInKg + "</th><th>LOADCOLLECTED(In Kgs)</th><th>" + NetWaste + "</th></tr>";
                txttbl += "</tbody>";

                filearray = _pdfReport.ExportToPdfData(txttbl, Name, filePath);


            }
            return File(filearray, ContentType, filename);
        }
        public JsonResult GetAllUserData(DataTableAjaxPostModel requestModel, string FDate, string TDate, string DeviceId, string DeviceType)
        {
            requestModel.FDate = FDate;
            requestModel.TDate = TDate;
            requestModel.DeviceId = DeviceId;
            requestModel.DeviceType = DeviceType;
            string input = JsonConvert.SerializeObject(requestModel);
            string endpoint = "api/Report/GetAllUser";
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

        public IActionResult Energyreport()
        {
            return View();
        }
        public IActionResult RealEnergyreport()
        {
            return View();
        }
        [HttpPost]
        public FileResult ExportGeEnergyData(string FromDate, string Todate, string DeviceId, string FType, string FName)
        {
            string RowData = "";

            try
            {
                string endpoint = "api/Report/GetallmeterdetailsbymeternameByDateAndTimeV2?FromDate=" + FromDate + "&Todate=" + Todate + "&DeviceId=" + DeviceId;
                HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
                RowData = apiobj.GetRequest(endpoint, HttpContext);
            }
            catch
            {

            }
            byte[] filearray = null;
            string filePath = Path.Combine(HostingEnvironment.WebRootPath + "/REPORTTEMPLATE/Report_Format.html");
            string ContentType = string.Empty;
            DateTime ReportTime = DateTime.Now;
            string Name = "Energy Report " + FName;
            string filename = string.Empty;
            if (FType == "Excel")
            {
                ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                filename = Name + ReportTime.ToShortDateString() + ".xlsx";

                filearray = _report.ExportGetEnergyData(RowData, Name);
            }
            else
            {
                JArray jresult = JArray.Parse(RowData);
                ContentType = "application/pdf";
                filename = Name + ReportTime.ToShortDateString() + ".pdf";
                int RCount = 1;

                string txttbl = string.Empty;
                txttbl += "<thead><tr><th>Sr. No</th><th>Country</th><th>State</th><th>City</th><th>Zone</th><th>Date</th><th>Outlet Name</th><th>Asset</th><th>Opnening Reading</th><th>Closing Reading</th><th>Cumulative Energy(KWH)</th><th>Power Factor</th><th>KVAH</th><th>Run Hrs(HR)</th><th>Total Power(KW)</th></tr></thead>";

                txttbl += "<tbody>";
                foreach (JObject item in jresult)
                {

                    txttbl += "<tr><td>" + RCount + "</td>" + "" +
                                 "<td> " + "" + " </td> " +
                                 "<td> " + "" + " </td> " +
                                 "<td> </td> " +
                                 "<td> " + "" + " </td> " +
                                 "<td> " + item.GetValue("TDAte").ToString() + " </td> " +
                                 "<td> " + item.GetValue("SiteName").ToString() + " </td> " +
                                 "<td> " + item.GetValue("DeviceName").ToString() + " </td> " +
                                 "<td> " + item.GetValue("First_cumm_en").ToString() + " </td> " +
                                 "<td> " + item.GetValue("Last_cumm_en").ToString() + " </td> " +
                                 "<td> " + item.GetValue("toaltCumm").ToString() + " </td> " +
                                 "<td> " + item.GetValue("pow_fac").ToString() + " </td> " +
                                 "<td> " + item.GetValue("calc_kvah").ToString() + " </td> " +

                                 "<td> " + item.GetValue("run_hrs").ToString() + " </td> " +
                                 "<td> " + item.GetValue("total_pow").ToString() + " </td> " +

                             // "<td> " + item.GetValue("TTime").ToString() + " </td> " +

                             "</tr>";
                    RCount++;
                }
                // txttbl += "<tr><th colspan='3'>Total</th><th colspan='2'>ONLOAD(InKgs)</th><th>" + GrossWeight + "</th><th>OFFLOAD(InKgs)</th><th>" + vehicleWeightInKg + "</th><th>LOADCOLLECTED(In Kgs)</th><th>" + NetWaste + "</th></tr>";
                txttbl += "</tbody>";

                filearray = _pdfReport.ExportToPdfData(txttbl, Name, filePath);


            }
            return File(filearray, ContentType, filename);
        }

        [HttpPost]
        public FileResult ExportGeEnergyDataDetails(string FromDate, string Todate, string DeviceId, string FType, string FName)
        {
            string RowData = "";

            try
            {
                string endpoint = "api/Report/GetallmeterdetailsbymeternameByDateAndTime?FromDate=" + FromDate + "&Todate=" + Todate + "&DeviceId=" + DeviceId;
                HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
                RowData = apiobj.GetRequest(endpoint, HttpContext);
            }
            catch
            {

            }
            byte[] filearray = null;
            string filePath = Path.Combine(HostingEnvironment.WebRootPath + "/REPORTTEMPLATE/Report_Format.html");
            string ContentType = string.Empty;
            DateTime ReportTime = DateTime.Now;
            string Name = "Energy Report " + FName;
            string filename = string.Empty;
            if (FType == "Excel")
            {
                ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                filename = Name + ReportTime.ToShortDateString() + ".xlsx";

                filearray = _report.ExportGetEnergyDataDetails(RowData, Name);
            }
            else
            {
                JArray jresult = JArray.Parse(RowData);
                ContentType = "application/pdf";
                filename = Name + ReportTime.ToShortDateString() + ".pdf";
                int RCount = 1;

                string txttbl = string.Empty;
                txttbl += "<thead><tr><th>Sr. No</th><th>Country</th><th>State</th><th>City</th><th>Zone</th><th>Date</th><th>Outlet Name</th><th>Asset</th><th>Cumulative Energy(KWH)</th><th>KVAH</th><th>Run Hrs(HR)</th><th>Total Power(KW)</th></tr></thead>";

                txttbl += "<tbody>";
                foreach (JObject item in jresult)
                {

                    txttbl += "<tr><td>" + RCount + "</td>" + "" +
                                 "<td> " + "" + " </td> " +
                                 "<td> " + "" + " </td> " +
                                 "<td> </td> " +
                                 "<td> " + "" + " </td> " +
                                 "<td> " + item.GetValue("TDAte").ToString() + " </td> " +
                                 "<td> " + item.GetValue("SiteName").ToString() + " </td> " +
                                 "<td> " + item.GetValue("DeviceName").ToString() + " </td> " +
                                 "<td> " + item.GetValue("cumm_en").ToString() + " </td> " +

                                 "<td> " + item.GetValue("calc_kvah").ToString() + " </td> " +

                                 "<td> " + item.GetValue("run_hrs").ToString() + " </td> " +
                                 "<td> " + item.GetValue("total_pow").ToString() + " </td> " +

                             // "<td> " + item.GetValue("TTime").ToString() + " </td> " +

                             "</tr>";
                    RCount++;
                }
                // txttbl += "<tr><th colspan='3'>Total</th><th colspan='2'>ONLOAD(InKgs)</th><th>" + GrossWeight + "</th><th>OFFLOAD(InKgs)</th><th>" + vehicleWeightInKg + "</th><th>LOADCOLLECTED(In Kgs)</th><th>" + NetWaste + "</th></tr>";
                txttbl += "</tbody>";

                filearray = _pdfReport.ExportToPdfData(txttbl, Name, filePath);


            }
            return File(filearray, ContentType, filename);
        }

        public JsonResult GetAllEnergyData(DataTableAjaxPostModel requestModel, string FDate, string TDate, string DeviceId)
        {
            requestModel.FDate = FDate;
            requestModel.TDate = TDate;
            requestModel.DeviceId = DeviceId;
            string input = JsonConvert.SerializeObject(requestModel);
            string endpoint = "api/Report/GetAllEnergy";
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
        public IActionResult RealHVACReport()
        {

            return View();
        }

        public JsonResult RealHVACReportdate(string DevicveType)
        {
            string RowData = "";
            try
            {
                string endpoint = "api/Report/GetAlltransactionTempSensorByRealTimeReport?DeviceType=" + DevicveType;
                HttpClientHelper<string> apiobj = new HttpClientHelper<string>();
                RowData = apiobj.GetRequest(endpoint, HttpContext);
            }
            catch
            {

            }
            JObject _lst = JObject.Parse(RowData);
            return Json(_lst);
        }
        public IActionResult RealKitchenReport()
        {

            return View();
        }
    }



}
