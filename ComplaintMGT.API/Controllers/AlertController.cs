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
    public class AlertController : ControllerBase
    {
        private IData<GResposnse> _dataRepository;
        private ILoggerService _logger;
        public AlertController(IData<GResposnse> dataRepository, ILoggerService logger)
        {
            _logger = logger;
            _dataRepository = dataRepository;
        }
        [HttpGet]
        [Route("GetAlertData")]
        public IActionResult GetAlertData(string From, string To, int Pageno, int Pagesize)
        {

            try
            {

                object[] parameters = { From,
                                        To,
                                        Pageno,
                                        Pagesize};
                string Result = _dataRepository.GetAllRow(StoredProcedureHelper.sp_GetAlertDataByDateTime, parameters);

                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok("\"FACK\"");
            }

        }
        [HttpGet]
        [Route("GetAlertCountByDateTime_Hot")]
        public IActionResult GetAlertCountByDateTime_Hot(string From, string To)
        {

            try
            {

                object[] parameters = { From,
                                        To };
                string Result = _dataRepository.GetAllRow(StoredProcedureHelper.sp_GetAlertCountByDateTime_Hot, parameters);


                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok("\"FACK\"");
            }
        }

        [HttpGet]
        [Route("GetAlertCountByDateTime_Warm")]
        public IActionResult GetAlertCountByDateTime_Warm(string From, string To)
        {

            try
            {

                object[] parameters = { From,
                                        To };
                string Result = _dataRepository.GetAllRow(StoredProcedureHelper.sp_GetAlertCountByDateTime_Warm, parameters);


                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok("\"FACK\"");
            }
        }

        [HttpGet]
        [Route("GetAlertCountByDateTime_Cold")]
        public IActionResult GetAlertCountByDateTime_Cold(string From, string To)
        {

            try
            {

                object[] parameters = { From,
                                        To };
                string Result = _dataRepository.GetAllRow(StoredProcedureHelper.sp_GetAlertCountByDateTime_Cold, parameters);


                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok("\"FACK\"");
            }
        }
        [HttpGet]
        [Route("GetSiteOperation")]
        public IActionResult GetSiteOperation(string From, string To)
        {

            try
            {

                object[] parameters = { From,
                                        To };
                string Result = _dataRepository.GetAllRow(StoredProcedureHelper.sp_GetSiteOperationWindow, parameters);


                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok("\"FACK\"");
            }
        }

        [HttpGet]
        [Route("GetOperationsWiseCompliance_Hot")]
        public IActionResult GetOperationsWiseCompliance_Hot(string fromDate, string toDate)
        {

            try
            {

                object[] parameters = { fromDate,
                                toDate };
                string Result = _dataRepository.GetAllRow(StoredProcedureHelper.sp_GetOperationsWiseCompliance_Hot, parameters);


                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok("\"FACK\"");
            }
        }

        [HttpGet]
        [Route("GetOperationsWiseCompliance_Warm")]
        public IActionResult GetOperationsWiseCompliance_Warm(string fromDate, string toDate)
        {

            try
            {

                object[] parameters = { fromDate,
                                toDate };
                string Result = _dataRepository.GetAllRow(StoredProcedureHelper.sp_GetOperationsWiseCompliance_Warm, parameters);


                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok("\"FACK\"");
            }
        }

        [HttpGet]
        [Route("GetOperationsWiseCompliance_Cold")]
        public IActionResult GetOperationsWiseCompliance_Cold(string fromDate, string toDate)
        {

            try
            {

                object[] parameters = { fromDate,
                                toDate };
                string Result = _dataRepository.GetAllRow(StoredProcedureHelper.sp_GetOperationsWiseCompliance_Cold, parameters);


                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok("\"FACK\"");
            }
        }
    }
}
