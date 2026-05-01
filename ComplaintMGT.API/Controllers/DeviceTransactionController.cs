using ComplaintMGT.Abstractions.DomainModels;
using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Services;
using ComplaintMTG.Core.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComplaintMGTAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceTransactionController : ControllerBase
    {
        private IDeviceTransaction<GResposnse> _dataRepository;
        private ILoggerService _logger;
        public DeviceTransactionController(IDeviceTransaction<GResposnse> dataRepository, ILoggerService logger)
        {
            _logger = logger;
            _dataRepository = dataRepository;
        }
        [HttpGet]
        [Route("PushTempSensorData")]
        public IActionResult PushTempSensorData(string InputData)
        {

            try
            {
                string[] broken_str = InputData.Split(',');

                object[] parameters = {
                                          broken_str[0],
                                          broken_str[1],
                                          broken_str[2],
                                          broken_str[3],

                                        };

                _logger.LogInfo("TempSensorData API Called");
                var result = string.Join(",", parameters);
                _logger.LogInfo("TempSensorData Parameter = " + result);

                GResposnse Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.sp_saveAndUpdateTransactionTempSensor, parameters);

                return Ok("\"PACK\"");
            }
            catch (Exception ex)
            {
                return Ok("\"FACK\"");
            }

        }

        [HttpGet]
        [Route("GetTempSensorData")]
        public IActionResult GetTempSensorData()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAllRow(StoredProcedureHelper.sp_GetAlltransactionTempSensor, parameters);

                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok("\"FACK\"");
            }

        }

        [HttpPost]
        [Route("PushTempAndHumiditySensorData")]
        public IActionResult AddTempAndHumiditySensorData(TemperatureHumidityModel obj)
        {
            object[] parameters = { obj.Temperature, obj.Humidity, obj.DeviceID, obj.ReserveValue, obj.Timestamp };

            _logger.LogInfo("TempAndHumiditySensorData API Called");
            var result = string.Join(",", parameters);
            _logger.LogInfo("TempAndHumiditySensorData Parameter = " + result);

            GResposnse Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.sp_saveTempAndHumidityMonitoringSensor, parameters);
            return Ok(Result);
        }

        [HttpGet]
        [Route("GetTempAndHumiditySensorData")]
        public IActionResult GetTempAndHumiditySensorData()
        {
            try
            {
                object[] parameters = { };
                string Result = _dataRepository.GetAllRow(StoredProcedureHelper.sp_GetTempAndHumidityMonitoringSensor, parameters);

                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok(ex.InnerException.Message);
            }

        }

        [HttpPost]
        [Route("PushDeviceHandlingSensor")]
        public IActionResult AddPushDeviceHandlingSensor(DeviceHandlingSensorModel obj)
        {
            object[] parameters = { obj.mac_addr, obj.human, obj.pir_detected, obj.door_closed };

            _logger.LogInfo("WashrroomSensorData API Called");
            var result = string.Join(",", parameters);
            _logger.LogInfo("WashrroomSensorData Parameter = " + result);

            GResposnse Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.sp_PushDeviceHandlingMonitoringSensor, parameters);
            return Ok(Result);
        }

        [HttpGet]
        [Route("GetPushDeviceHandlingSensor")]
        public IActionResult GetPushDeviceHandlingSensor()
        {
            try
            {
                object[] parameters = { };
                string Result = _dataRepository.GetAllRow(StoredProcedureHelper.sp_GetDeviceHandlingMonitoringSensor, parameters);

                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok(ex.InnerException.Message);
            }
        }
    }

}

