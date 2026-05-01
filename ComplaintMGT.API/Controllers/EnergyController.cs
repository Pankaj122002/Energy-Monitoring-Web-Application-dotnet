using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Data.SqlClient;
using ComplaintMGT.Abstractions.Services;
using ComplaintMGT.Abstractions.Entities.Configuration;
using ComplaintMGT.Abstractions.Entities;
using ComplaintMTG.Core.Utils;

namespace ComplaintMGTAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnergyController : ControllerBase
    {
        private IConfiguration<Menu, GResposnse, SubMenuInfo> _dataRepository;
        public EnergyController(IConfiguration<Menu, GResposnse, SubMenuInfo> dataRepository)
        {
            _dataRepository = dataRepository;
        }

        [HttpGet]
        [Route("GetEnergyConsumptionActual")]
        public IActionResult GetEnergyConsumptionActual(string fromDate,string toDate)
        {
            object[] mparameters = { Convert.ToDateTime(fromDate), Convert.ToDateTime(toDate) };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyConsumptionActual, mparameters);
        
            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetEnergyConsumptionCumulative")]
        public IActionResult GetEnergyConsumptionCumulative(string fromDate, string toDate)
        {
            object[] mparameters = { Convert.ToDateTime(fromDate), Convert.ToDateTime(toDate) };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyConsumptionCumulative, mparameters);
            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetEnergyConsumptionAvg")]
        public IActionResult GetEnergyConsumptionAvg(string fromDate, string toDate)
        {
            object[] mparameters = { Convert.ToDateTime(fromDate), Convert.ToDateTime(toDate) };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyConsumptionAvg, mparameters);
            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEnergyConsumptionActual_Dashboard")]
        public IActionResult GetEnergyConsumptionActual_Dashboard(string TimeCategory)
        {
            object[] mparameters = { TimeCategory };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyConsumptionActual_BarGraph_Dashboard, mparameters);
            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEnergyConsumptionAverage_Dashboard")]
        public IActionResult GetEnergyConsumptionAverage_Dashboard(string TimeCategory)
        {
            object[] mparameters = { TimeCategory };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyConsumptionAverage_BarGraph_Dashboard, mparameters);
            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEnergyConsumption_TimeOfDay_Dashboard")]
        public IActionResult GetEnergyConsumption_TimeOfDay_Dashboard(string TimeCategory)
        {
            
            object[] mparameters = { TimeCategory };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyConsumption_TimeOfDay_Dashboard, mparameters);
            return Ok(_lst);
        }



        [HttpGet]
        [Route("GetEnergyConsumptionCumulative_Dashboard")]
        public IActionResult GetEnergyConsumptionCumulative_Dashboard()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyConsumptionCumulative_Dashboard, mparameters);
            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEnergyDistribution_EnergyDashboard")]
        public IActionResult GetEnergyDistribution_EnergyDashboard(string fromDate, string toDate)
        {
            object[] mparameters = { Convert.ToDateTime(fromDate), Convert.ToDateTime(toDate) };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetEnergyDistribution_EnergyDashboard, mparameters);
            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetPowerOutage_EnergyDashboard")]
        public IActionResult GetPowerOutage_EnergyDashboard(string fromDate, string toDate)
        {
            object[] mparameters = { Convert.ToDateTime(fromDate), Convert.ToDateTime(toDate) };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetPowerOutage_EnergyDashboard, mparameters);
            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEnergyTrends_CumulativeEnergyConsumptionLive")]
        public IActionResult GetEnergyTrends_CumulativeEnergyConsumptionLive(string TimeCategory, string Meter , string MainMeter)
        {
            object[] mparameters = { TimeCategory, Meter , MainMeter };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyTrends_CumulativeEnergyConsumptionLive, mparameters);
            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetEnergyTrends_EnergyConsumptionLive")]
        public IActionResult GetEnergyTrends_EnergyConsumptionLive(string TimeCategory , string Meter)
        {
            object[] mparameters = { TimeCategory , Meter };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyTrends_EnergyConsumptionLive, mparameters);
            return Ok(_lst);
        }

        [HttpGet]
        [Route("EnergyTrends_EnergyConsumptionAndTemperatureHourlyAverage")]
        public IActionResult EnergyTrends_EnergyConsumptionAndTemperatureHourlyAverage(string TimeCategory, string Meter)
        {
            object[] mparameters = { TimeCategory, Meter };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyTrends_EnergyConsumptionAndTemperatureHourlyAverage, mparameters);
            return Ok(_lst);
        }

        [HttpGet]
        [Route("EnergyTrends_EnergyConsumptionHourlyAverage")]
        public IActionResult EnergyTrends_EnergyConsumptionHourlyAverage(string TimeCategory, string Meter)
        {
            object[] mparameters = { TimeCategory, Meter };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyTrends_EnergyConsumptionHourlyAverage, mparameters);
            return Ok(_lst);
        }

        [HttpGet]
        [Route("EnergyTrends_EnergyProfileHourlyAverage")]
        public IActionResult EnergyTrends_EnergyProfileHourlyAverage(string TimeCategory, string Meter)
        {
            object[] mparameters = { TimeCategory, Meter };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyTrends_EnergyProfileHourlyAverage, mparameters);
            return Ok(_lst);
        }

        [HttpGet]
        [Route("EnergyTrends_EnergyConsumptionPeakHourlyAverage")]
        public IActionResult EnergyTrends_EnergyConsumptionPeakHourlyAverage(string TimeCategory, string Meter)
        {
            object[] mparameters = { TimeCategory, Meter };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyTrends_EnergyConsumptionPeakHourlyAverage, mparameters);
            return Ok(_lst);
        }

        [HttpGet]
        [Route("EnergyTrends_EnergyProfileHourlyActual")]
        public IActionResult EnergyTrends_EnergyProfileHourlyActual(string TimeCategory, string Meter)
        {
            object[] mparameters = { TimeCategory, Meter };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyTrends_EnergyProfileHourlyActual, mparameters);
            return Ok(_lst);
        }

        [HttpGet]
        [Route("EnergyTrends_EnergyConsumptionPeakHourlyActual")]
        public IActionResult EnergyTrends_EnergyConsumptionPeakHourlyActual(string TimeCategory, string Meter)
        {
            object[] mparameters = { TimeCategory, Meter };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyTrends_EnergyConsumptionPeakHourlyActual, mparameters);
            return Ok(_lst);
        }

        [HttpGet]
        [Route("EnergyTrends_EnergyConsumptionHourlyActual")]
        public IActionResult EnergyTrends_EnergyConsumptionHourlyActual(string TimeCategory, string Meter)
        {
            object[] mparameters = { TimeCategory, Meter };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyTrends_EnergyConsumptionHourlyActual, mparameters);
            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetEnergyTrends_EnergyConsumptionAndTemperatureLive")]
        public IActionResult GetEnergyTrends_EnergyConsumptionAndTemperatureLive(string TimeCategory , string Meter)
        {
            object[] mparameters = { TimeCategory , Meter};
            string _lst = _dataRepository.ExcuteRowSqlCommandMultiResultSet(StoredProcedureHelper.sp_EnergyTrends_EnergyConsumptionAndTemperatureLive, mparameters);
            return Ok(_lst);
        }

        [HttpGet]

        
        [Route("EnergyTrends_EnergyConsumptionAndTemperatureHourlyActual")]
        public IActionResult EnergyTrends_EnergyConsumptionAndTemperatureHourlyActual(string TimeCategory, string Meter)
        {
            object[] mparameters = { TimeCategory, Meter };
            string _lst = _dataRepository.ExcuteRowSqlCommandMultiResultSet(StoredProcedureHelper.sp_EnergyTrends_EnergyConsumptionAndTemperatureHourlyActual, mparameters);
            return Ok(_lst);
        }


        [HttpGet]
        [Route("GetEnergyTrends_EnergyConsumptionPeak")]
        public IActionResult GetEnergyTrends_EnergyConsumptionPeak(string TimeCategory)    
        {
            object[] mparameters = { TimeCategory };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyTrends_EnergyConsumptionPeak, mparameters);
            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetEnergyTrends_EnergyConsumptionKWHKVAHAndTemprature")]
        public IActionResult GetEnergyTrends_EnergyConsumptionKWHKVAHAndTemprature(string TimeCategory)
        {
            object[] mparameters = { TimeCategory };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyTrends_EnergyConsumptionKWHKVAHAndTemprature, mparameters);
            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetEnergyTrends_EnergyProfile")]
        public IActionResult GetEnergyTrends_EnergyProfile(string TimeCategory)
        {
            object[] mparameters = { TimeCategory };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_EnergyTrends_EnergyProfile, mparameters);
            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetFilterbyMeter")]
        public IActionResult GetFilterbyMeter()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetFilterbyMeter, mparameters);
            return Ok(_lst);
        }

    }
}
