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
using ComplaintMGT.Abstractions.Entities;
using ComplaintMTG.Core.Utils;

namespace ComplaintMGTAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MasterController : ControllerBase
    {
        private IMaster<GResposnse> _dataRepository;
        public MasterController(IMaster<GResposnse> dataRepository)
        {
            _dataRepository = dataRepository;
        }

        [HttpPost]
        [Route("AddOrUpdateDesignation")]
        public IActionResult AddOrUpdateDesignation(JObject obj)
        {
            GResposnse Result = new GResposnse();
            try
            {
                string DesignationName = obj.GetValue("DesignationName").Value<string>();

                int DesignationId = Convert.ToInt32(obj.GetValue("DesignationId").Value<string>());
                bool IsActive = Convert.ToBoolean(obj.GetValue("IsActive").Value<string>());
                
                string CreateBy = obj.GetValue("CreateBy").Value<string>();
                string msg = string.Empty;

                object[] parameters = {
                                          DesignationId>0?DesignationId:0,
                                          DesignationName,
                                          IsActive,
                                          CreateBy

                                        };
                Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.sp_saveAndUpdateDesignation, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }


        }
        [HttpGet]
        [Route("GetAllDesignation")]
        public IActionResult GetAllDesignation()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAll(StoredProcedureHelper.sp_GatAllDesignation, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [HttpDelete]
        [Route("DeleteDesignation")]
        public IActionResult DeleteDesignation(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                try
                {
                    object[] parameters = {
                                         Id
                                        };
                    string Result = _dataRepository.Delete(StoredProcedureHelper.sp_DeleteDesignation, parameters);
                    var response = new { data = Result, Status = 200 };
                    return Ok(response);
                }
                catch (Exception e)
                {
                    return Ok(CommonHelper.InvalidRequestMessage());
                }
            }
            else
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }
        }
    }
}
