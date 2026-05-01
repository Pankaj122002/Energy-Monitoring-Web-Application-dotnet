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
using ComplaintMGT.Abstractions.Entities.Device;
using ComplaintMTG.Core.Utils;

namespace ComplaintMGTAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceController : ControllerBase
    {
        private IDevice<GResposnse,AssetInfo,DeviceInfo,AssetRulesInfo,AssetOverrideInfo> _dataRepository;
        public DeviceController(IDevice<GResposnse,AssetInfo, DeviceInfo, AssetRulesInfo,AssetOverrideInfo> dataRepository)
        {
            _dataRepository = dataRepository;
        }

        [HttpPost]
        [Route("AddOrUpdateAssetType")]
        public IActionResult AddOrUpdateAssetType(AssetTypeInfo obj)
        {
            GResposnse Result = new GResposnse();
            try
            {
                string msg = string.Empty;

                object[] parameters = {
                                          obj.AssetTypeId>0?obj.AssetTypeId:0,
                                          obj.Description,
                                          obj.IsActive,
                                          obj.CreateBy

                                        };
                 Result = _dataRepository.AddAndUpdateAssetType(StoredProcedureHelper.sp_saveAndUpdateAssetType, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch(Exception ex)
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }
           
            
        }
        [HttpGet]
        [Route("GetAllAssetType")]
        public IActionResult GetAllAssetType()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAllAssetType(StoredProcedureHelper.sp_AssetType, parameters);
                var response = new {data = Result, Status = 200};
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [HttpDelete]
        [Route("DeleteAssetType")]
        public IActionResult DeleteAssetType(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                try
                {
                    object[] parameters = {
                                         Id
                                        };
                    string Result = _dataRepository.DeleteAssetType(StoredProcedureHelper.sp_DeleteAssetTypeId, parameters);
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
        [HttpPost]
        [Route("AddOrUpdateAsset")]
        public IActionResult AddOrUpdateAsset(AssetInfo obj)
        {
            GResposnse Result = new GResposnse();
            try
            {
                string msg = string.Empty;

                object[] parameters = {
                                          obj.AssetId>0?obj.AssetId:0,
                                          obj.AssetTypeId,
                                          obj.Tag,
                                          obj.Name,
                                          obj.Description,
                                          obj.OEM,
                                          obj.Make,
                                          obj.Model,
                                          obj.SerialNo,
                                          obj.Quanitity,
                                          obj.Price,
                                          obj.IsActive,
                                          obj.CreateBy,
                                          obj.Asset_Rating,
                                          obj.Asset_Capacity

                                        };
                Result = _dataRepository.AddAndUpdateAssetType(StoredProcedureHelper.sp_saveAndUpdateAsset, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }


        }
        [HttpGet]
        [Route("GetAllAsset")]
        public IActionResult GetAllAsset()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAllAssetType(StoredProcedureHelper.sp_Asset, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }
        [HttpGet]
        [Route("GetAssetByAssetId")]
        public IActionResult GetAssetByAssetId(string param)
        {

            try
            {

                object[] parameters = { param };
                AssetInfo Result = _dataRepository.GetAssetById(StoredProcedureHelper.sp_GetAssetByAssetId, parameters);
               
                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [HttpDelete]
        [Route("DeleteAsset")]
        public IActionResult DeleteAsset(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                try
                {
                    object[] parameters = {
                                         Id
                                        };
                    string Result = _dataRepository.DeleteAssetType(StoredProcedureHelper.sp_DeleteAsset, parameters);
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
        [HttpPost]
        [Route("AddOrUpdateAssetPrameters")]
        public IActionResult AddOrUpdateAssetPrameters(AssetPrametersInfo obj)
        {
            GResposnse Result = new GResposnse();
            try
            {
                string msg = string.Empty;

                object[] parameters = {
                                          obj.AssetPrametersId>0?obj.AssetPrametersId:0,
                                          obj.AssetTypeId,
                                          obj.ParameterName,
                                          obj.MeasurementUnit,
                                          obj.Description,
                                          obj.IsActive,
                                          obj.CreateBy

                                        };
                Result = _dataRepository.AddAndUpdateAssetType(StoredProcedureHelper.sp_saveAndUpdateAssetPrameters, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }


        }
        [HttpGet]
        [Route("GetAllAssetPrameters")]
        public IActionResult GetAllAssetPrameters()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAllAssetType(StoredProcedureHelper.sp_AssetPrameters, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [HttpDelete]
        [Route("DeleteAssetPrameters")]
        public IActionResult DeleteAssetPrameters(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                try
                {
                    object[] parameters = {
                                         Id
                                        };
                    string Result = _dataRepository.DeleteAssetType(StoredProcedureHelper.sp_DeleteAssetPrameter, parameters);
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

        [HttpPost]
        [Route("AddOrUpdateDeviceStatus")]
        public IActionResult AddOrUpdateDeviceStatus(DeviceStatusInfo obj)
        {
            GResposnse Result = new GResposnse();
            try
            {
                string msg = string.Empty;

                object[] parameters = {
                                          obj.DeviceStatusId>0?obj.DeviceStatusId:0,
                                          obj.Description,
                                          obj.IsActive,
                                          obj.CreateBy

                                        };
                Result = _dataRepository.AddAndUpdateAssetType(StoredProcedureHelper.sp_saveAndUpdateDeviceStatus, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }


        }
        [HttpGet]
        [Route("GetAllDeviceStatus")]
        public IActionResult GetAllDeviceStatus()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAllAssetType(StoredProcedureHelper.sp_GetDeviceDeviceStatus, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [HttpDelete]
        [Route("DeleteDeviceStatus")]
        public IActionResult DeleteDeviceStatus(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                try
                {
                    object[] parameters = {
                                         Id
                                        };
                    string Result = _dataRepository.DeleteAssetType(StoredProcedureHelper.sp_DeleteDeviceStatus, parameters);
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
       
        [HttpPost]
        [Route("AddOrUpdateDeviceDetails")]
        public IActionResult AddOrUpdateDeviceDetails(DeviceInfo obj)
        {
            GResposnse Result = new GResposnse();
            try
            {
                string msg = string.Empty;

                object[] parameters = {
                                          obj.DeviceId>0?obj.DeviceId:0,
                                          obj.AssetId,
                                          obj.CustomerId,
                                          obj.SiteId,
                                          obj.DeviceStatusId,
                                          obj.AssetTag,
                                          obj.ImeiNo,
                                          obj.DeviceIdForExternal,
                                          obj.DispalyName,
                                          obj.IsActive,
                                          obj.CreateBy,
                                          obj.DeviceTypeId,
                                          obj.FirmwareVersion,
                                          obj.Accesskey,
                                          obj.Upgradeavailable

                                        };
                Result = _dataRepository.AddAndUpdateAssetType(StoredProcedureHelper.sp_saveAndUpdateDeviceDetails, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }


        }
        [HttpGet]
        [Route("GetAllDeviceDetails")]
        public IActionResult GetAllDeviceDetails()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAllAssetType(StoredProcedureHelper.sp_GetAllDeviceDetails, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [HttpDelete]
        [Route("DeleteDeviceDetails")]
        public IActionResult DeleteDeviceDetails(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                try
                {
                    object[] parameters = {
                                         Id
                                        };
                    string Result = _dataRepository.DeleteAssetType(StoredProcedureHelper.sp_DeleteDeviceDetails, parameters);
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
        [Route("GetDeviceDetailsByDeviceId")]
        public IActionResult GetDeviceDetailsByDeviceId(string param)
        {

            try
            {

                object[] parameters = { param };
                DeviceInfo Result = _dataRepository.GetDeviceDetailsByDeviceId(StoredProcedureHelper.sp_GetDeviceDetailsByDeviceId, parameters);

                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }
        [HttpPost]
        [Route("AddOrUpdateDeviceType")]
        public IActionResult AddOrUpdateDeviceType(DeviceTypeInfo obj)
        {
            GResposnse Result = new GResposnse();
            try
            {
                string msg = string.Empty;

                object[] parameters = {
                                          obj.DeviceTypeId>0?obj.DeviceTypeId:0,
                                          obj.DeviceType,
                                          obj.IsActive,
                                          obj.CreateBy

                                        };
                Result = _dataRepository.AddAndUpdateAssetType(StoredProcedureHelper.sp_saveAndUpdateDeviceType, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }


        }
        [HttpGet]
        [Route("GetAllDeviceType")]
        public IActionResult GetAllDeviceType()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAllAssetType(StoredProcedureHelper.sp_GetAllDeviceType, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [HttpDelete]
        [Route("DeleteDeviceType")]
        public IActionResult DeleteDeviceType(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                try
                {
                    object[] parameters = {
                                         Id
                                        };
                    string Result = _dataRepository.DeleteAssetType(StoredProcedureHelper.sp_DeleteDeviceType, parameters);
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
        [HttpPost]
        [Route("AddOrUpdateAssetRules")]
        public IActionResult AddOrUpdateAssetRules(AssetRulesInfo obj)
        {
            GResposnse Result = new GResposnse();
            try
            {
                string msg = string.Empty;

                object[] parameters = {
                                          obj.AssetRulesId>0?obj.AssetRulesId:0,
                                          obj.RuleName,
                                          obj.AssetId,
                                          obj.LCL,
                                          obj.UCL,
                                          obj.Measurement,
                                          obj.CreateBy                                          
                                        };
                Result = _dataRepository.AddAndUpdateAssetType(StoredProcedureHelper.sp_saveAndUpdateAssetRules, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }


        }
        [HttpGet]
        [Route("GetAllAssetRules")]
        public IActionResult GetAllAssetRules()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAllAssetType(StoredProcedureHelper.sp_GetAllAssetRules, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }
        [HttpGet]
        [Route("GetAssetRulesByAsseRulestId")]
        public IActionResult GetAssetRulesByAsseRulestId(string param)
        {

            try
            {

                object[] parameters = { param };
                AssetRulesInfo Result = _dataRepository.GetAssetRulesByAssetRulesId(StoredProcedureHelper.sp_GetAllAssetRulesById, parameters);

                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [HttpDelete]
        [Route("DeleteAssetRules")]
        public IActionResult DeleteAssetRules(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                try

                {
                    object[] parameters = {
                                         Id
                                        };
                    string Result = _dataRepository.DeleteAssetType(StoredProcedureHelper.sp_DeleteAssetRues, parameters);
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
        [HttpPost]
        [Route("AddOrUpdateStatus")]
        public IActionResult AddOrUpdateStatus(StatusInfo obj)
        {
            GResposnse Result = new GResposnse();
            try
            {
                string msg = string.Empty;

                object[] parameters = {
                                          obj.StatusId>0?obj.StatusId:0,
                                          obj.Description,
                                          obj.IsActive,
                                          obj.CreateBy

                                        };
                Result = _dataRepository.AddAndUpdateAssetType(StoredProcedureHelper.sp_saveAndUpdateStatus, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }


        }
        [HttpGet]
        [Route("GetAllStatus")]
        public IActionResult GetAllStatus()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAllAssetType(StoredProcedureHelper.sp_GetStatus, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [HttpDelete]
        [Route("DeleteStatus")]
        public IActionResult DeleteStatus(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                try
                {
                    object[] parameters = {
                                         Id
                                        };
                    string Result = _dataRepository.DeleteAssetType(StoredProcedureHelper.sp_DeleteStatus, parameters);
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
        [HttpPost]
        [Route("AddOrUpdateAssetOverride")]
        public IActionResult AddOrUpdateAssetOverride(AssetOverrideInfo obj)
        {
            GResposnse Result = new GResposnse();
            try
            {
                string msg = string.Empty;

                object[] parameters = {
                                          obj.AssetOverrideId>0?obj.AssetOverrideId:0,
                                          obj.AssetId,
                                          obj.CustomerId,
                                          obj.SiteId,
                                          obj.StartDateTime,
                                          obj.EndADateTime,
                                          obj.IsActive,
                                          obj.CreateBy
                                        };
                Result = _dataRepository.AddAndUpdateAssetType(StoredProcedureHelper.sp_saveAndUpdateAssetOverride, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }


        }
        [HttpGet]
        [Route("GetAllAssetOverride")]
        public IActionResult GetAllAssetOverride()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.GetAllAssetType(StoredProcedureHelper.sp_GetAssetOverride, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }
        [HttpGet]
        [Route("GetAssetRulesByAssetOverrideId")]
        public IActionResult GetAssetRulesByAssetOverrideId(string param)
        {

            try
            {

                object[] parameters = { param };
                AssetOverrideInfo Result = _dataRepository.GetAssetOverrideByAssetOverrideId(StoredProcedureHelper.sp_GetAssetOverrideByAssetOverrideId, parameters);

                return Ok(Result);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [HttpDelete]
        [Route("DeleteAssetOverride")]
        public IActionResult DeleteAssetOverride(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                try

                {
                    object[] parameters = {
                                         Id
                                        };
                    string Result = _dataRepository.DeleteAssetType(StoredProcedureHelper.sp_DeleteAssetOverride, parameters);
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
