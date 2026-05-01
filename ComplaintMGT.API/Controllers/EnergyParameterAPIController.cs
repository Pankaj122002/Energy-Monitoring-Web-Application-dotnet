using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Services;
using ComplaintMTG.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using System;
using ComplaintMGT.Abstractions.Entities.Configuration;




namespace ComplaintMGT.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class EnergyParameterAPIController : ControllerBase
    {
        private IConfiguration<Menu, GResposnse, SubMenuInfo> _dataRepository;
        public EnergyParameterAPIController(IConfiguration<Menu, GResposnse, SubMenuInfo> dataRepository)
        {
            _dataRepository = dataRepository;
        }

        [HttpGet]
        [Route("GetMainMeter_Runhr")]
        public IActionResult GetMainMeter_Runhr()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetMainMeter_Runhr, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetSubMeter_Runhr")]
        public IActionResult GetSubMeter_Runhr()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetSubMeter_Runhr, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetDevice_AvgRunhr")]
        public IActionResult GetDevice_AvgRunhr(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetDevice_AvgRunhr, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetDevice_SumRunhr")]
        public IActionResult GetDevice_SumRunhr(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetDevice_SumRunhr, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetMainMeter_Voltage")]
        public IActionResult GetMainMeter_Voltage()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetMainMeter_Voltage, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetSubMeter_Voltage")]
        public IActionResult GetSubMeter_Voltage()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetSubMeter_Voltage, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetMainmeter_HourlyAvgVoltage_hot")]
        public IActionResult GetMainmeter_HourlyAvgVoltage_hot(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetMainmeter_HourlyAvgVoltage_hot, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetMainmeter_DailyAvgVoltage_warm")]
        public IActionResult GetMainmeter_DailyAvgVoltage_warm(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetMainmeter_DailyAvgVoltage_warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetMainmeter_WeeklyAvgVoltage_cold")]
        public IActionResult GetMainmeter_WeeklyAvgVoltage_cold(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetMainmeter_WeeklyAvgVoltage_cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetMainMeter_HighVoltage")]
        public IActionResult GetMainMeter_HighVoltage(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetMainMeter_HighVoltage, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetMainMeter_LowVoltage")]
        public IActionResult GetMainMeter_LowVoltage(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetMainMeter_LowVoltage, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetSubMeter_HighVoltage")]
        public IActionResult GetSubMeter_HighVoltage(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetSubMeter_HighVoltage, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetSubMeter_LowVoltage")]
        public IActionResult GetSubMeter_LowVoltage(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetSubMeter_LowVoltage, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetMainMeter_ActualVoltage")]
        public IActionResult GetMainMeter_ActualVoltage(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetMainMeter_ActualVoltage, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllMeters_ActualPowerfactor")]
        public IActionResult GetAllMeters_ActualPowerfactor(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllMeters_ActualPowerfactor, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllMeters_LastUpdated_Powerfactor")]
        public IActionResult GetAllMeters_LastUpdated_Powerfactor()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllMeters_LastUpdated_Powerfactor, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllmeter_DailyAvgPowerfactor_warm")]
        public IActionResult GetAllmeter_DailyAvgPowerfactor_warm(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllmeter_DailyAvgPowerfactor_warm, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllmeter_HourlyAvgPowerfactor_hot")]
        public IActionResult GetAllmeter_HourlyAvgPowerfactor_hot(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllmeter_HourlyAvgPowerfactor_hot, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllmeter_WeeklyAvgPowerfactor_cold")]
        public IActionResult GetAllmeter_WeeklyAvgPowerfactor_cold(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllmeter_WeeklyAvgPowerfactor_cold, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllmeter_AvgPowerfactor")]
        public IActionResult GetAllmeter_AvgPowerfactor(String fromDate, String toDate)
        {
            object[] mparameters = { fromDate, toDate };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllmeter_AvgPowerfactor, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllMeters_LastUpdated_Power")]
        public IActionResult GetAllMeters_LastUpdated_Power()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllMeters_LastUpdated_Power, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllMeters_LastUpdatedPower_piegraph")]
        public IActionResult GetAllMeters_LastUpdatedPower_piegraph()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllMeters_LastUpdatedPower_piegraph, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllMeters_AvgPower_Operationwise")]
        public IActionResult GetAllMeters_AvgPower_Operationwise( string Timecategory)
        {
            object[] mparameters = { Timecategory };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllMeters_AvgPower_Operationwise, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllmeter_ActualPower")]
        public IActionResult GetAllmeter_ActualPower(string Timecategory)
        {
            object[] mparameters = { Timecategory };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllmeter_ActualPower, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllmeter_AvgPower_bargraph")]
        public IActionResult GetAllmeter_AvgPower_bargraph(string Timecategory)
        {
            object[] mparameters = { Timecategory };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllmeter_AvgPower_bargraph, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllmeter_AvgPower")]
        public IActionResult GetAllmeter_AvgPower(string Timecategory)
        {
            object[] mparameters = { Timecategory };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllmeter_AvgPower, mparameters);

            return Ok(_lst);
        }




        //Current APIs

        [HttpGet]
        [Route("GetAllMeters_LastUpdated_Current")]
        public IActionResult GetAllMeters_LastUpdated_Current()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllMeters_LastUpdated_Current, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllMeters_LastUpdatedCurrent_piegraph")]
        public IActionResult GetAllMeters_LastUpdatedCurrent_piegraph()
        {
            object[] mparameters = { };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllMeters_LastUpdatedCurrent_piegraph, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllMeters_AvgCurrent_Operationwise")]
        public IActionResult GetAllMeters_AvgCurrent_Operationwise(string Timecategory)
        {
            object[] mparameters = { Timecategory };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllMeters_AvgCurrent_Operationwise, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllmeter_ActualCurrent")]
        public IActionResult GetAllmeter_ActualCurrent(string Timecategory)
        {
            object[] mparameters = { Timecategory };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllmeter_ActualCurrent, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllmeter_AvgCurrent_bargraph")]
        public IActionResult GetAllmeter_AvgCurrent_bargraph(string Timecategory)
        {
            object[] mparameters = { Timecategory };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllmeter_AvgCurrent_bargraph, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllmeter_AvgCurrent")]
        public IActionResult GetAllmeter_AvgCurrent(string Timecategory)
        {
            object[] mparameters = { Timecategory };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllmeter_AvgCurrent, mparameters);

            return Ok(_lst);
        }
    }

}
