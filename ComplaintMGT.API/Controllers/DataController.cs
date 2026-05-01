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
    public class DataController : ControllerBase
    {
        private IData<GResposnse> _dataRepository;
        private ILoggerService _logger;
        public DataController(IData<GResposnse> dataRepository, ILoggerService logger)
        {
            _logger = logger;
            _dataRepository = dataRepository;
        }
        [HttpGet]
        [Route("Save")]
        public IActionResult PushTempSensorData(string p1, string p2, string p3, string p4, string p5, string p6, string p7, string p8, string p9, string p10, string p11, string p12, string p13, string p14, string p15, string p16, string p17, string p18, string p19, string p20, string p21, string p22, string p23, string p24, string p25, string p26, string p27, string p28, string p29, string p30, string p31, string p32, string p33, string p34, string p35, string p36, string p37, string p38, string p39, string p40, string p41, string p42)
        {

            try
            {
                object[] parameters = {
                                          p1,
                                          p2,
                                          p3,
                                          p4,
                                          p5,
                                          p6,
                                          p7,
                                          p8,
                                          p9,
                                          p10,
                                          p11,
                                          p12,
                                          p13,
                                          p14,
                                          p15,
                                          p16,
                                          p17,
                                          p18,
                                          p19,
                                          p20,
                                          p21,
                                          p22,
                                          p23,
                                          p24,
                                          p25,
                                          p26,
                                          p27,
                                          p28,
                                          p29,
                                          p30,
                                          p31,
                                          p32,
                                          p33,
                                          p34,
                                          p35,
                                          p36,
                                          p37,
                                          p38,
                                          p39,
                                          p40,
                                          p41,
                                          p42,
                                        };

                _logger.LogInfo("Energy meter API Called");
                var result = string.Join(",", parameters);
                _logger.LogInfo("Energy Parameter = " + result);

                GResposnse Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.sp_saveAndUpdateEnergyMeter, parameters);

                return Ok(true);
            }
            catch (Exception ex)
            {
                return Ok(false);
            }

        }
        [HttpGet]
        [Route("GetData")]
        public IActionResult GetTempSensorData()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAllRow(StoredProcedureHelper.sp_GetAllEnergyMeter, parameters);

                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok("\"FACK\"");
            }

        }
        [HttpGet]
        [Route("PushAQIData")]
        public IActionResult PushAQIData(string p1, string p2, string p3, string p4, string p5, string p6, string p7, string p8, string p9, string p10)
        {

            try
            {


                object[] parameters = {
                                          p1,
                                          p2,
                                          p3,
                                          p4,
                                          p5,
                                          p6,
                                          p7,
                                          p8,
                                          p9,
                                          p10

                                        };

                _logger.LogInfo("AQI API Called");
                var result = string.Join(",", parameters);
                _logger.LogInfo("AQI Parameter = " + result);

                GResposnse Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.sp_saveAndUpdateAQI, parameters);

                return Ok(true);
            }
            catch (Exception ex)
            {
                return Ok(false);
            }

        }
        [HttpGet]
        [Route("GetAQI")]
        public IActionResult GetAQI()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAllRow(StoredProcedureHelper.GetAllAQI, parameters);

                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok("\"FACK\"");
            }

        }
        [HttpGet]
        [Route("PushOdourData")]
        public IActionResult PushOdourData(string p1, string p2, string p3, string p4, string p5, string p6, string p7, string p8, string p9, string p10)
        {

            try
            {


                object[] parameters = {
                                          p1,
                                          p2,
                                          p3,
                                          p4,
                                          p5,
                                          p6,
                                          p7,
                                          p8,
                                          p9,
                                          p10

                                        };


                _logger.LogInfo("Odour API Called");
                var result = string.Join(",", parameters);
                _logger.LogInfo("Odour Parameter = " + result);

                GResposnse Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.sp_saveAndUpdateOdour, parameters);

                return Ok(true);
            }
            catch (Exception ex)
            {
                return Ok(false);
            }

        }
        [HttpGet]
        [Route("GetOdour")]
        public IActionResult GetOdour()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAllRow(StoredProcedureHelper.GetAllOdour, parameters);

                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok("\"FACK\"");
            }

        }
    }
}
