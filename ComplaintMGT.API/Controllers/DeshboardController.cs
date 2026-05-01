using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Entities.Configuration;
using ComplaintMGT.Abstractions.Services;
using ComplaintMTG.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using System;

namespace ComplaintMGTAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeshboardController : ControllerBase
    {
        private IConfiguration<Menu, GResposnse, SubMenuInfo> _dataRepository;
        public DeshboardController(IConfiguration<Menu, GResposnse, SubMenuInfo> dataRepository)
        {
            _dataRepository = dataRepository;
        }
        [HttpGet]
        [Route("GetAllDevie")]
        public IActionResult GetAllDevie(int DType)
        {
            object[] mparameters = { DType };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllDevie, mparameters);
            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetDeshHVACAlerts")]
        public IActionResult GetDeshHVACAlerts(string Type)
        {
            object[] mparameters = { Type };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DeshHVACAlerts, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetAlerts")]
        public IActionResult GetAlerts()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAlerts, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetAllOverallComplianceofStore")]
        public IActionResult GetAllOverallComplianceofStore()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_AllOverallComplianceofStore, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetAllDeviationOverallComplianceofStore")]
        public IActionResult GetAllDeviationOverallComplianceofStore()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllDeviationOverallComplianceofStore, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllDeviationOverallComplianceofStore_Summary")]
        public IActionResult GetAllDeviationOverallComplianceofStore_Summary()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllDeviationOverallComplianceofStore_Summary, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetSiteOperationWindowofcompliance")]
        public IActionResult GetSiteOperationWindowofcompliance(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetSiteOperationWindowofcompliance, mparameters);

            return Ok(_lst);
        }



        [HttpGet]
        [Route("ComplianceDashboardAllOverall_Hot")]
        public IActionResult ComplianceDashboardAllOverall_Hot(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ComplianceDashboardAllOverall_Hot, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("ComplianceDashboardAllOverall_Warm")]
        public IActionResult ComplianceDashboardAllOverall_Warm(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ComplianceDashboardAllOverall_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("ComplianceDashboardAllOverall_Cold")]
        public IActionResult ComplianceDashboardAllOverall_Cold(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ComplianceDashboardAllOverall_Cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("DeviceWiseComplicanceofStore_Hot")]
        public IActionResult DeviceWiseComplicanceofStore_Hot(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DeviceWiseComplicanceofStore_Hot, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("DeviceWiseComplicanceofStore_Warm")]
        public IActionResult DeviceWiseComplicanceofStore_Warm(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DeviceWiseComplicanceofStore_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("DeviceWiseComplicanceofStore_Cold")]
        public IActionResult DeviceWiseComplicanceofStore_Cold(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DeviceWiseComplicanceofStore_Cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("DeviceWiseComplicanceofStoreNonOps_Hot")]
        public IActionResult DeviceWiseComplicanceofStoreNonOps_Hot(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DeviceWiseComplicanceofStoreNonOps_Hot, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("DeviceWiseComplicanceofStoreNonOps_Warm")]
        public IActionResult DeviceWiseComplicanceofStoreNonOps_Warm(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DeviceWiseComplicanceofStoreNonOps_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("DeviceWiseComplicanceofStoreNonOps_Cold")]
        public IActionResult DeviceWiseComplicanceofStoreNonOps_Cold(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DeviceWiseComplicanceofStoreNonOps_Cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("DeviceWiseComplicanceofStoreOps_Hot")]
        public IActionResult DeviceWiseComplicanceofStoreOps_Hot(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DeviceWiseComplicanceofStoreOps_Hot, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("DeviceWiseComplicanceofStoreOps_Warm")]
        public IActionResult DeviceWiseComplicanceofStoreOps_Warm(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DeviceWiseComplicanceofStoreOps_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("DeviceWiseComplicanceofStoreOps_Cold")]
        public IActionResult DeviceWiseComplicanceofStoreOps_Cold(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DeviceWiseComplicanceofStoreOps_Cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("ComplianceDashboardAllOverallNonOps_Hot")]
        public IActionResult ComplianceDashboardAllOverallNonOps_Hot(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ComplianceDashboardAllOverallNonOps_Hot, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("ComplianceDashboardAllOverallNonOps_Warm")]
        public IActionResult ComplianceDashboardAllOverallNonOps_Warm(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ComplianceDashboardAllOverallNonOps_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("ComplianceDashboardAllOverallNonOps_Cold")]
        public IActionResult ComplianceDashboardAllOverallNonOps_Cold(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ComplianceDashboardAllOverallNonOps_Cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("ComplianceDashboardAllOverallOps_Hot")]
        public IActionResult ComplianceDashboardAllOverallOps_Hot(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ComplianceDashboardAllOverallOps_Hot, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("ComplianceDashboardAllOverallOps_Warm")]
        public IActionResult ComplianceDashboardAllOverallOps_Warm(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ComplianceDashboardAllOverallOps_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("ComplianceDashboardAllOverallOps_Cold")]
        public IActionResult ComplianceDashboardAllOverallOps_Cold(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ComplianceDashboardAllOverallOps_Cold, mparameters);

            return Ok(_lst);
        }



        [HttpGet]
        [Route("DeshAlerts")]
        public IActionResult DeshAlerts()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DeshAlerts, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEnergyMeterRealtimeBARCHART")]
        public IActionResult GetEnergyMeterRealtimeBARCHART(string type, string Menu, string subMenu, string SubRedioMenu)
        {
            object[] mparameters = { type, Menu, subMenu, SubRedioMenu };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyMeterRealtimeBARCHART, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetEnergyMeterByDateBARCHART")]
        public IActionResult GetEnergyMeterByDateBARCHART(string FromDate, string Todate)
        {
            object[] mparameters = { FromDate, Todate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyMeterByDateBARCHART, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("EnergyConsumptionAverage")]
        public IActionResult EnergyConsumptionAverage()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyConsumptionAverage, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("ThermalMonitoringHVACAvg")]
        public IActionResult ThermalMonitoringHVACAvg(string devicetype)
        {
            object[] mparameters = { devicetype };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ThermalMonitoringHVACAvg, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("TimeofDayENERGYCONSUMPTION")]
        public IActionResult TimeofDayENERGYCONSUMPTION()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_TimeofDayENERGYCONSUMPTION, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("EnergyConsumptiontotal")]
        public IActionResult EnergyConsumptiontotal()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyConsumptiontotal, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("ELECTRICALHEALTHAverage")]
        public IActionResult ELECTRICALHEALTHAverage()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ELECTRICALHEALTHAverage, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetTopValueMeter")]
        public IActionResult GetTopValueMeter()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetTopValueMeter, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetTopValuetransactionTempSensor")]
        public IActionResult GetTopValuetransactionTempSensor(String DType)
        {
            object[] mparameters = { DType };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.GetTopValuetransactionTempSensor, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetTopValuetransactionTempHumidSensor")]
        public IActionResult GetTopValuetransactionTempHumidSensor(String DType)
        {
            object[] mparameters = { DType };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.GetTopValuetransactionTempHumidSensor, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllTimeForChart")]
        public IActionResult GetAllTimeForChart(string DeviceType)
        {
            try
            {
                object[] mparameters = { };
                string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetTimeForChart, mparameters);
                object[] mparameters1 = { DeviceType };
                string _lst1 = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_transactionTempSensorForChart, mparameters1);
                var response = new { Time = _lst, ac1 = _lst1 };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }
        }
        //[HttpGet]
        //[Route("GetAlltransactionTempSensorForChart")]
        //public IActionResult GetAlltransactionTempSensorForChart()
        //{


        //    return Ok(_lst);
        //}



        [HttpGet]
        [Route("Getallmainmeterdetails_hot")]
        public IActionResult Getallmainmeterdetails_hot(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Getallmainmeterdetails_hot, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("Getallmainmeterdetails_warm")]
        public IActionResult Getallmainmeterdetails_warm(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Getallmainmeterdetails_warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("Getallmainmeterdetails_cold")]
        public IActionResult Getallmainmeterdetails_cold(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Getallmainmeterdetails_cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("Getallmeterdetailsbymetername")]
        public IActionResult Getallmeterdetailsbymetername(string Device)
        {
            object[] mparameters = { Device };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Getallmeterdetailsbymetername, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetallmeterdetailsbymeternameChart")]
        public IActionResult GetallmeterdetailsbymeternameChart(string Device, string Per)
        {
            object[] mparameters = { Device, Per };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetallmeterdetailsbymeternameChart, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetallmeterdetailsbymeternameChartByDate")]
        public IActionResult GetallmeterdetailsbymeternameChartByDate(string Device, string Per, string Fdate, string Tdate)
        {
            object[] mparameters = { Device, Per, Fdate, Tdate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetallmeterdetailsbymeternameChartByDate, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetMapDetials")]
        public IActionResult GetMapDetials()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.MapDeatils, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetAlltransactionTempSensorByDateTime")]
        public IActionResult GetAlltransactionTempSensorByDateTime(string FromDate, string Todate, string DeviceId)
        {

            object[] mparameters1 = { FromDate, Todate, DeviceId };
            string _lst1 = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAlltransactionTempSensorByDateTime, mparameters1);


            return Ok(_lst1);
        }
        [HttpGet]
        [Route("GetAllSiteByCustomerId")]
        public IActionResult GetAllSiteByCustomerId(int CustomerId)
        {
            object[] mparameters = { CustomerId };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllSiteByCustomerId, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetAllAssetBySiteId")]
        public IActionResult GetAllAssetBySiteId(int SiteId, string DeviceType)
        {
            object[] mparameters = { SiteId, DeviceType };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllAssetBySiteId, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllAQI_Dashboard")]
        public IActionResult GetAllAQIDataDashboard(string fromdate, string todate)
        {
            object[] mparameters = { fromdate, todate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllAQI_Dashboard, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetAllAQI_TimeOfDay")]
        public IActionResult GetAllAQI_TimeOfDay()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllAQI_TimeOfDay, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetEnergyDistributionDashboard")]
        public IActionResult GetEnergyDistributionDashboard()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEnergyDistributionDashboard, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetEmployeeGuestComfortDashboard_Hot")]
        public IActionResult GetEmployeeGuestComfortDashboard_Hot(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestComfortDashboard_Hot, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEmployeeGuestComfortDashboard_Warm")]
        public IActionResult GetEmployeeGuestComfortDashboard_Warm(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestComfortDashboard_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEmployeeGuestComfortDashboard_Cold")]
        public IActionResult GetEmployeeGuestComfortDashboard_Cold(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestComfortDashboard_Cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEmployeeGuestComfortDashboardOps_Hot")]
        public IActionResult GetEmployeeGuestComfortDashboardOps_Hot(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestComfortDashboardOps_Hot, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEmployeeGuestComfortDashboardOps_Warm")]
        public IActionResult GetEmployeeGuestComfortDashboardOps_Warm(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestComfortDashboardOps_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEmployeeGuestComfortDashboardOps_Cold")]
        public IActionResult GetEmployeeGuestComfortDashboardOps_Cold(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestComfortDashboardOps_Cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEmployeeGuestComfortDashboardNonOps_Hot")]
        public IActionResult GetEmployeeGuestComfortDashboardNonOps_Hot(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestComfortDashboardNonOps_Hot, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEmployeeGuestComfortDashboardNonOps_Warm")]
        public IActionResult GetEmployeeGuestComfortDashboardNonOps_Warm(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestComfortDashboardNonOps_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEmployeeGuestComfortDashboardNonOps_Cold")]
        public IActionResult GetEmployeeGuestComfortDashboardNonOps_Cold(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestComfortDashboardNonOps_Cold, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetEmployeeGuestComfortDashboardDetail_Hot")]
        public IActionResult GetEmployeeGuestComfortDashboardDetail_Hot(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestComfortDashboardDetail_Hot, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEmployeeGuestComfortDashboardDetail_Warm")]
        public IActionResult GetEmployeeGuestComfortDashboardDetail_Warm(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestComfortDashboardDetail_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEmployeeGuestComfortDashboardDetail_Cold")]
        public IActionResult GetEmployeeGuestComfortDashboardDetail_Cold(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestComfortDashboardDetail_Cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEmployeeGuestComfortDashboardDetailOps_Hot")]
        public IActionResult GetEmployeeGuestComfortDashboardDetailOps_Hot(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestComfortDashboardDetailOps_Hot, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEmployeeGuestComfortDashboardDetailOps_Warm")]
        public IActionResult GetEmployeeGuestComfortDashboardDetailOps_Warm(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestComfortDashboardDetailOps_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEmployeeGuestComfortDashboardDetailOps_Cold")]
        public IActionResult GetEmployeeGuestComfortDashboardDetailOps_Cold(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestComfortDashboardDetailOps_Cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEmployeeGuestComfortDashboardDetailNonOps_Hot")]
        public IActionResult GetEmployeeGuestComfortDashboardDetailNonOps_Hot(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestComfortDashboardDetailNonOps_Hot, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEmployeeGuestComfortDashboardDetailNonOps_Warm")]
        public IActionResult GetEmployeeGuestComfortDashboardDetailNonOps_Warm(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestComfortDashboardDetailNonOps_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEmployeeGuestComfortDashboardDetailNonOps_Cold")]
        public IActionResult GetEmployeeGuestComfortDashboardDetailNonOps_Cold(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestComfortDashboardDetailNonOps_Cold, mparameters);

            return Ok(_lst);
        }


        [HttpGet]
        [Route("GetEmployeeGuestConfortDashboard")]
        public IActionResult GetEmployeeGuestConfortDashboard()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestConfort_Dashboard, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEmployeeGuestConfortDetailDashboard")]
        public IActionResult GetEmployeeGuestConfortDetailDashboard()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEmployeeGuestConfortDetail_Dashboard, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetUPS_Energy_Dashboard")]
        public IActionResult GetUPS_Energy_Dashboard()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetUPS_Energy_Dashboard, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("Get_Gas_Consumption")]
        public IActionResult Get_Gas_Consumption()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Gas_Consumption, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("Get_GasConsumption_TimeOfDay")]
        public IActionResult Get_GasConsumption_TimeOfDay()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_GasConsumption_TimeOfDay, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("Get_Customer_Footfall")]
        public IActionResult Get_Customer_Footfall()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Customer_Footfall, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("Get_Customer_Footfall_TimeOfDay")]
        public IActionResult Get_Customer_Footfall_TimeOfDay()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_Customer_Footfall_TimeOfDay, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("Get_EV_Health_Dashboard")]
        public IActionResult Get_EV_Health_Dashboard()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_Get_EV_Health_Dashboard, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllAQI_Dashboard_Ext")]
        public IActionResult GetAllAQI_Dashboard_Ext(string fromDate, string toDate)
        {
            object[] mparameters = {fromDate,toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllAQI_Dashboard_Ext, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllAQI_TimeOfDay_Ext")]
        public IActionResult GetAllAQI_TimeOfDay_Ext(string fromDate, string toDate)
        {
            object[] mparameters = {fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllAQI_TimeOfDay_Ext, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAQIAlerts_Dashboard")]
        public IActionResult GetAQIAlerts_Dashboard(string fromDate, string toDate)
        {
            object[] mparameters = { Convert.ToDateTime(fromDate), Convert.ToDateTime(toDate) };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_AQIAlerts_Dashboard, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllOverallAQICompliance_Dashboard")]
        public IActionResult GetAllOverallAQICompliance_Dashboard(string fromDate, string toDate)
        {
            object[] mparameters = {fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_AllOverallAQICompliance_Dashboard, mparameters);

            return Ok(_lst);
        }




        [HttpGet]
        [Route("GetAlertCount_OpsNonOpsPercentage")]
        public IActionResult GetAlertCount_OpsNonOpsPercentage(String from, String to)
        {
            object[] mparameters = { from, to };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAlertCount_OpsNonOpsPercentage, mparameters);

            return Ok(_lst);
        }


        [HttpGet]
        [Route("GetOperationsWiseAlerts_Cold")]
        public IActionResult GetOperationsWiseAlerts_Cold(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetOperationsWiseAlerts_Cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetOperationsWiseAlerts_Warm")]
        public IActionResult GetOperationsWiseAlerts_Warm(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetOperationsWiseAlerts_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetOperationsWiseAlerts_Hot")]
        public IActionResult GetOperationsWiseAlerts_hot(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetOperationsWiseAlerts_Hot, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("DiningWiseComplicanceofStore_Cold")]
        public IActionResult DiningWiseComplicanceofStore_Cold(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DiningWiseComplicanceofStore_Cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("DiningWiseComplicanceofStore_Warm")]
        public IActionResult DiningWiseComplicanceofStore_Warm(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DiningWiseComplicanceofStore_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("DiningWiseComplicanceofStore_Hot")]
        public IActionResult DiningWiseComplicanceofStore_Hot(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DiningWiseComplicanceofStore_Hot, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("DiningWiseComplicanceofStoreNonOps_Cold")]
        public IActionResult DiningWiseComplicanceofStoreNonOps_Cold(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DiningWiseComplicanceofStoreNonOps_Cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("DiningWiseComplicanceofStoreNonOps_Warm")]
        public IActionResult DiningWiseComplicanceofStoreNonOps_Warm(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DiningWiseComplicanceofStoreNonOps_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("DiningWiseComplicanceofStoreNonOps_Hot")]
        public IActionResult DiningWiseComplicanceofStoreNonOps_Hot(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DiningWiseComplicanceofStoreNonOps_Hot, mparameters);

            return Ok(_lst);
        }


        [HttpGet]
        [Route("DiningWiseComplicanceofStoreOps_Cold")]
        public IActionResult DiningWiseComplicanceofStoreOps_Cold(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DiningWiseComplicanceofStoreOps_Cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("DiningWiseComplicanceofStoreOps_Warm")]
        public IActionResult DiningWiseComplicanceofStoreOps_Warm(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DiningWiseComplicanceofStoreOps_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("DiningWiseComplicanceofStoreOps_Hot")]
        public IActionResult DiningWiseComplicanceofStoreOps_Hot(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_DiningWiseComplicanceofStoreOps_Hot, mparameters);

            return Ok(_lst);
        }


        [HttpGet]
        [Route("ProductionWiseComplicanceofStore_Cold")]
        public IActionResult ProductionWiseComplicanceofStore_Cold(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ProductionWiseComplicanceofStore_Cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("ProductionWiseComplicanceofStore_Warm")]
        public IActionResult ProductionWiseComplicanceofStore_Warm(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ProductionWiseComplicanceofStore_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("ProductionWiseComplicanceofStore_Hot")]
        public IActionResult ProductionWiseComplicanceofStore_Hot(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ProductionWiseComplicanceofStore_Hot, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("ProductionWiseComplicanceofStoreNonOps_Cold")]
        public IActionResult ProductionWiseComplicanceofStoreNonOps_Cold(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ProductionWiseComplicanceofStoreNonOps_Cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("ProductionWiseComplicanceofStoreNonOps_Warm")]
        public IActionResult ProductionWiseComplicanceofStoreNonOps_Warm(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ProductionWiseComplicanceofStoreNonOps_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("ProductionWiseComplicanceofStoreNonOps_Hot")]
        public IActionResult ProductionWiseComplicanceofStoreNonOps_Hot(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ProductionWiseComplicanceofStoreNonOps_Hot, mparameters);

            return Ok(_lst);
        }


        [HttpGet]
        [Route("ProductionWiseComplicanceofStoreOps_Warm")]
        public IActionResult ProductionWiseComplicanceofStoreOps_Warm(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ProductionWiseComplicanceofStoreOps_Warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("ProductionWiseComplicanceofStoreOps_Cold")]
        public IActionResult ProductionWiseComplicanceofStoreOps_Cold(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ProductionWiseComplicanceofStoreOps_Cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("ProductionWiseComplicanceofStoreOps_Hot")]
        public IActionResult ProductionWiseComplicanceofStoreOps_Hot(string fromDate, string toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_ProductionWiseComplicanceofStoreOps_Hot, mparameters);

            return Ok(_lst);
        }




    }
}
