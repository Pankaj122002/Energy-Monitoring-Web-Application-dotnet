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
    public class SiteController : ControllerBase
    {
        private ISite<GResposnse,SiteInfo, SiteInformationInfo,SiteInformationBaselineInfo> _dataRepository;
        public SiteController(ISite<GResposnse, SiteInfo, SiteInformationInfo,SiteInformationBaselineInfo> dataRepository)
        {
            _dataRepository = dataRepository;
        }

        [Route("AddOrUpdateSite")]
        [HttpPost]
        public IActionResult AddOrUpdateSite(SiteInfo obj)
        {
            GResposnse Result = new GResposnse();
            try
            {
                string msg = string.Empty;

                object[] parameters = {
                                          obj.SiteId>0?obj.SiteId:0,
                                          obj.CustomerId,
                                          obj.CountryId,
                                          obj.StateId,
                                          obj.CityId,
                                          obj.Name,
                                          obj.AddressLine1,
                                          obj.AddressLine2,
                                          obj.PinCode,
                                          obj.IsDSTEnabled,
                                          obj.IsActive,
                                          obj.CreateBy

                                        };
                Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.sp_saveAndUpdateSite, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }


        }
        [HttpGet]
        [Route("GetAllSite")]
        public IActionResult GetAllSite()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAll(StoredProcedureHelper.sp_Site, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [HttpDelete]
        [Route("DeleteSite")]
        public IActionResult DeleteSite(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                try
                {
                    object[] parameters = {
                                         Id
                                        };
                    string Result = _dataRepository.Delete(StoredProcedureHelper.sp_DeleteSite, parameters);
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
        [HttpGet]
        [Route("GetSiteBySiteId")]
        public IActionResult GetSiteBySiteId(string param)
        {

            try
            {

                object[] parameters = { param };
                SiteInfo Result = _dataRepository.GetSiteById(StoredProcedureHelper.sp_GetSiteBySiteId, parameters);

                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [Route("AddOrUpdateSiteOperatingRules")]
        [HttpPost]
        public IActionResult AddOrUpdateSiteOperatingRules(SiteOperatingRulesInfo obj)
        {
            GResposnse Result = new GResposnse();
            try
            {
                string msg = string.Empty;

                object[] parameters = {
                                          obj.OperatingParameterId>0?obj.OperatingParameterId:0,
                                          obj.SiteId,
                                          obj.Rules,
                                          obj.IsActive,
                                          obj.CreateBy

                                        };
                Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.sp_saveAndUpdateSiteOperatingRules, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }


        }
        [HttpGet]
        [Route("GetAllSiteOperatingRules")]
        public IActionResult GetAllSiteOperatingRules()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAll(StoredProcedureHelper.GetAllSiteOperatingRules, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [HttpDelete]
        [Route("DeleteSiteOperatingRules")]
        public IActionResult DeleteSiteOperatingRules(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                try
                {
                    object[] parameters = {
                                         Id
                                        };
                    string Result = _dataRepository.Delete(StoredProcedureHelper.sp_DeleteSiteOperatingRules, parameters);
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
        [Route("AddOrUpdateSiteOperationWindow")]
        [HttpPost]
        public IActionResult AddOrUpdateSiteOperationWindow(SiteOperationWindowInfo obj)
        {
            GResposnse Result = new GResposnse();
            try
            {
                string msg = string.Empty;

                object[] parameters = {
                                          obj.SiteOperationWindowId>0?obj.SiteOperationWindowId:0,
                                          obj.SiteId,
                                          obj.StartTime,
                                          obj.EndTime,
                                          obj.DayOfWeek,
                                          obj.IsActive,
                                          obj.CreateBy,
                                          obj.SiteOperationWindow

                                        };
                Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.sp_saveAndUpdateSiteOperationWindow, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }


        }
        [HttpGet]
        [Route("GetAllSiteOperationWindow")]
        public IActionResult GetAllSiteOperationWindow()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAll(StoredProcedureHelper.GetAllSiteOperationWindow, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [HttpDelete]
        [Route("DeleteSiteOperationWindow")]
        public IActionResult DeleteSiteOperationWindow(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                try
                {
                    object[] parameters = {
                                         Id
                                        };
                    string Result = _dataRepository.Delete(StoredProcedureHelper.sp_DeleteSiteOperationWindow, parameters);
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

        [Route("AddOrUpdateSiteInformation")]
        [HttpPost]
        public IActionResult AddOrUpdateSiteInformation(SiteInformationInfo obj)
        {
            GResposnse Result = new GResposnse();
            try
            {
                string msg = string.Empty;

                object[] parameters = {
                                          obj.SiteInformationId>0?obj.SiteInformationId:0,
                                          obj.SiteId,
                                          obj.ICStartTime,
                                          obj.ICEndTime,
                                          obj.ICSignOffFlag,
                                          obj.ICSignOffTime,
                                          obj.ICSignOffGivenBy,
                                          obj.IsActive,
                                          obj.CreateBy

                                        };
                Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.sp_saveAndUpdateSiteInformation, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }


        }
        [HttpGet]
        [Route("GetAllSiteInformation")]
        public IActionResult GetAllSiteInformation()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAll(StoredProcedureHelper.sp_GetAllSiteInformation, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [HttpDelete]
        [Route("DeleteSiteInformation")]
        public IActionResult DeleteSiteInformation(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                try
                {
                    object[] parameters = {
                                         Id
                                        };
                    string Result = _dataRepository.Delete(StoredProcedureHelper.sp_DeleteSiteInformation, parameters);
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
        [HttpGet]
        [Route("GetSiteInformationBySiteInformationId")]
        public IActionResult GetSiteInformationBySiteInformationId(string param)
        {

            try
            {

                object[] parameters = { param };
                SiteInformationInfo Result = _dataRepository.GetSiteInformationBySiteInformationId(StoredProcedureHelper.sp_GetSiteInformationBySiteInformationId, parameters);

                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [HttpPost]
        [Route("AddOrUpdateSiteInformationBaseline")]
        public IActionResult AddOrUpdateSiteInformationBaseline(SiteInformationBaselineInfo obj)
        {
            GResposnse Result = new GResposnse();
            try
            {
                string msg = string.Empty;

                object[] parameters = {
                                          obj.SiteInformationBaselineId>0?obj.SiteInformationBaselineId:0,
                                          obj.SiteId,
                                          obj.BaselineStartTime,
                                          obj.BaselineEndTime,
                                          obj.BaselineSignOffFlag,
                                          obj.BaselineSignOffTime,
                                          obj.BaselineSignOffGivenBy,
                                          obj.IsActive,
                                          obj.CreateBy

                                        };
                Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.sp_saveAndUpdateSiteInformationBaseline, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }


        }
        [HttpGet]
        [Route("GetAllSiteInformationBaseline")]
        public IActionResult GetAllSiteInformationBaseline()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAll(StoredProcedureHelper.sp_GetAllSiteInformationBaseline, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [HttpDelete]
        [Route("DeleteSiteInformationBaseline")]
        public IActionResult DeleteSiteInformationBaseline(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                try
                {
                    object[] parameters = {
                                         Id
                                        };
                    string Result = _dataRepository.Delete(StoredProcedureHelper.sp_DeleteSiteInformationBaseline, parameters);
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
        [HttpGet]
        [Route("GetSiteInformationBaselineBySiteInformationBaselineId")]
        public IActionResult GetSiteInformationBaselineBySiteInformationBaselineId(string param)
        {

            try
            {

                object[] parameters = { param };
                SiteInformationBaselineInfo Result = _dataRepository.GetSiteInformationBaselineBySiteInformationBaselineId(StoredProcedureHelper.sp_GetSiteInformatioBaselinenBySiteInformationBaselineId, parameters);

                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }
    }
}
