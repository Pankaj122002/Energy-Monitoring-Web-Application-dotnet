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
using ComplaintMGT.Abstractions.DomainModels;

namespace ComplaintMGTAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private IConfiguration<Menu, GResposnse, SubMenuInfo> _dataRepository;
        public ReportController(IConfiguration<Menu, GResposnse, SubMenuInfo> dataRepository)
        {
            _dataRepository = dataRepository;
        }
        [HttpGet]
        [Route("GetAlltransactionTempSensorByDateTimeReport")]
        public IActionResult GetAlltransactionTempSensorByDateTimeReport(string FromDate, string Todate, string DeviceId,string DeviceType)
        {

            object[] mparameters1 = { FromDate, Todate, DeviceId, DeviceType };
            string _lst1 = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAlltransactionTempSensorByDateTimeReport, mparameters1);


            return Ok(_lst1);
        }
        [HttpPost]
        [Route("GetAllUser")]
        public IActionResult GetAllUser(DataTableAjaxPostModel requestModel)
        {
            Order _order = new Order();
            string SearchTXT = requestModel.search.value;
            int draw = requestModel.draw;
            int start = requestModel.start;
            int length = requestModel.length;
            string str = string.Empty;
            if (SearchTXT != null)
                str = SearchTXT.Trim();

            string SortColumn = string.Empty;
            string SortDir = requestModel.order[0].dir;
            switch (requestModel.order[0].column)
            {

                case 1:
                    SortColumn = "Temperature";
                    break;
               

                default:
                    SortDir = String.Empty;
                    SortColumn = string.Empty;
                    break;
            }
            object[] parameters = {
                                          str,
                                          SortColumn,
                                          SortDir,
                                          start,
                                          length,
                                        requestModel.FDate,
                                        requestModel.TDate,
                                        requestModel.DeviceId,
                                        requestModel.DeviceType,
                                        };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllGetAlltransactionTempSensorByDateTimeReportPaging, parameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetallmeterdetailsbymeternameByDateAndTime")]
        public IActionResult GetallmeterdetailsbymeternameByDateAndTime(string FromDate, string Todate, string DeviceId)
        {

            object[] mparameters1 = { FromDate, Todate, DeviceId };
            string _lst1 = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetallmeterdetailsbymeternameByDateAndTime, mparameters1);


            return Ok(_lst1);
        }
        [HttpGet]
        [Route("GetallmeterdetailsbymeternameByDateAndTimeV2")]
        public IActionResult GetallmeterdetailsbymeternameByDateAndTimeV2(string FromDate, string Todate, string DeviceId)
        {

            object[] mparameters1 = { FromDate, Todate, DeviceId };
            string _lst1 = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetallmeterdetailsbymeternameByDateAndTimeV2, mparameters1);


            return Ok(_lst1);
        }
        [HttpGet]
        [Route("GetAlltransactionTempSensorByRealTimeReport")]
        public IActionResult GetAlltransactionTempSensorByRealTimeReport(string DeviceType)
        {

            object[] mparameters1 = {DeviceType};
            string _lst1 = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAlltransactionTempSensorByRealTimeReport, mparameters1);
            var response = new { data = _lst1, Status = 200 };

            return Ok(response);
        }
        [HttpPost]
        [Route("GetAllEnergy")]
        public IActionResult GetAllEnergy(DataTableAjaxPostModel requestModel)
        {
            Order _order = new Order();
            string SearchTXT = requestModel.search.value;
            int draw = requestModel.draw;
            int start = requestModel.start;
            int length = requestModel.length;
            string str = string.Empty;
            if (SearchTXT != null)
                str = SearchTXT.Trim();

            string SortColumn = string.Empty;
            string SortDir = requestModel.order[0].dir;
            switch (requestModel.order[0].column)
            {

                


                default:
                    SortDir = String.Empty;
                    SortColumn = string.Empty;
                    break;
            }
            object[] parameters = {
                                          str,
                                          SortColumn,
                                          SortDir,
                                          start,
                                          length,
                                        requestModel.FDate,
                                        requestModel.TDate,
                                        requestModel.DeviceId,
                                        };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllGetAllmeterByDateTimeReportPaging, parameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetFirstAndLastRowEnergyDetails")]
        public IActionResult GetFirstAndLastRowEnergyDetails(string FromDate, string DeviceId)
        {

            object[] mparameters1 = { DeviceId, FromDate };
            string _lst1 = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetFirstAndLastRowEnergyDetails, mparameters1);


            return Ok(_lst1);
        }
    }
}
