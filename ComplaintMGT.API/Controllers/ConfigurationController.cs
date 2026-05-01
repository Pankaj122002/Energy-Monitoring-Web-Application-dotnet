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
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigurationController : ControllerBase
    {
        private IConfiguration<Menu, GResposnse,SubMenuInfo> _dataRepository;
        public ConfigurationController(IConfiguration<Menu, GResposnse,SubMenuInfo> dataRepository)
        {
            _dataRepository = dataRepository;
        }

        [HttpGet]
        [Route("GetAllMenuM")]
        public IActionResult GetAllMenuM(string ModelId)
        {
            object[] mparameters = { ModelId };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllMenuM, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetAllMenuMP")]
        public IActionResult GetAllMenuMP()
        {
            object[] mparameters = {};
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllMenuMP, mparameters);

            return Ok(_lst);
        }
        [HttpPost]
        [Route("AddOrUpdateMenu")]
        public IActionResult AddOrUpdateMenu(Menu obj)
        {
            string msg = string.Empty;

            object[] parameters = {
                                          obj.MenuId>0?obj.MenuId:0,
                                          obj.ParentId,
                                          obj.MenuName,
                                          obj.Order,
                                          !string.IsNullOrEmpty(obj.Icon)?obj.Icon:"icon-circle-small",
                                          obj.ModuleId,
                                          obj.IsActive,
                                         
                                        };
            GResposnse Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.SaveOrUpdateMenuMaster, parameters);

            return Ok(Result);
        }
        
        [HttpGet]
        [Route("GetALLMenuMasterByMenuId")]
        public IActionResult GetALLMenuMasterByMenuId(string MenuId)
        {
            string msg = string.Empty;

            object[] parameters = {Convert.ToInt32(MenuId)};
            Menu Result = _dataRepository.GetMenuById(StoredProcedureHelper.spGetALLMenuMasterByMenuId, parameters);

            return Ok(Result);
        }
        [HttpGet]
        [Route("GetAllSubMenuM")]
        public IActionResult GetAllSubMenuM()
        {
            object[] mparameters = {};
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllSubMenuM, mparameters);

            return Ok(_lst);
        }
      
        [HttpPost]
        [Route("AddOrUpdateSubMenu")]
        public IActionResult AddOrUpdateSubMenu(SubMenuInfo obj)
        {
            string msg = string.Empty;

            object[] parameters = {
                                          obj.fnSubMenuId>0?obj.fnSubMenuId:0,
                                          obj.fnMenuId,
                                          obj.ftSubMenuName,
                                          obj.ftControllerName,
                                          obj.ftActionName,
                                          obj.fnOrderId,
                                          !string.IsNullOrEmpty(obj.ftSCssIcon)?obj.ftSCssIcon:"icon-circle-small",
                                          obj.fbIsActive

                                        };
            GResposnse Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.SaveOrUpdateSubMenuMaster, parameters);

            return Ok(Result);
        }

        [HttpGet]
        [Route("GetALLSubMenuMasterByMenuId")]
        public IActionResult GetALLSubMenuMasterByMenuId(string SubMenuId)
        {
            string msg = string.Empty;

            object[] parameters = { Convert.ToInt32(SubMenuId) };
            SubMenuInfo Result = _dataRepository.GetSubMenuById(StoredProcedureHelper.spGetALLSubMenuMasterBySubMenuId, parameters);

            return Ok(Result);
        }
        [HttpPost]
        [Route("SaveandupdateCountry")]
        public IActionResult SaveandupdateCountry(CuntryMasterinfo obj)
        {


            string msg = string.Empty;

            object[] parameters = {
                                          obj.CountryId,
                                          obj.CountryName,
                                          obj.Active,

                                        };
            GResposnse Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.SaveandupdateCountry, parameters);

            return Ok(Result);
        }

        [Route("GetAllCountry")]
        [HttpGet]
        public IActionResult GetAllCountry()
        {
            string IsAlll = "YES";
            object[] mparameters = { IsAlll };
            string Result = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.GetAllCountry, mparameters);
            return Ok(Result);
        }
        [HttpPost]
        [Route("SaveandupdateState")]
        public IActionResult SaveandupdateState(StateMasterinfo obj)
        {


            string msg = string.Empty;

            object[] parameters = {
                                          obj.StateId,
                                          obj.CountryId,
                                          obj.StateName,
                                          obj.Active,

                                        };
            GResposnse Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.spSaveandupdateState, parameters);

            return Ok(Result);
        }
        [Route("GetAllState")]
        [HttpGet]
        public IActionResult GetAllState()
        {
            string IsAlll = "YES";
            object[] mparameters = { IsAlll };
            string Result = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.spGetAllState, mparameters);
            return Ok(Result);
        }
        [HttpPost]
        [Route("SaveandupdateCity")]
        public IActionResult SaveandupdateCity(CityMasterinfo obj)
        {


            string msg = string.Empty;

            object[] parameters = {
                                          obj.CityId,
                                          obj.StateId,
                                          obj.CityName,
                                          obj.Active,

                                        };
            GResposnse Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.spSaveandupdateCity, parameters);

            return Ok(Result);
        }

        [Route("GetAllCity")]
        [HttpPost]
        public IActionResult GetAllCity()
        {
            string IsAlll = "YES";
            object[] mparameters = { IsAlll };
            string Result = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.spGetAllCity, mparameters);
            return Ok(Result);
        }
        [HttpPost]
        [Route("SaveandupdateAddressType")]
        public IActionResult SaveandupdateAddressType(AddressTypeInfo obj)
        {


            string msg = string.Empty;

            object[] parameters = {
                                          obj.AddressTypeId,
                                          obj.Description,
                                          obj.IsActive,
                                          obj.CreateBy,
                                         DateTime.Now,
                                         obj.CreateBy,
                                         DateTime.Now

                                        };
            GResposnse Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.sp_saveAndUpdateAddressType, parameters);

            return Ok(Result);
        }

        [Route("GetAllAddressType")]
        [HttpGet]
        public IActionResult GetAllAddressType()
        {
            string IsAlll = "YES";
            object[] mparameters = {};
            string Result = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_AddressType, mparameters);
            return Ok(Result);
        }
        [HttpPost]
        [Route("DeleteAddressType")]
        public IActionResult DeleteAddressType(AddressTypeInfo obj)
        {


            string msg = string.Empty;

            object[] parameters = { obj.AddressTypeId };
            GResposnse Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.sp_DeleteAddressType, parameters);

            return Ok(Result);
        }
        [HttpGet]
        [Route("GetStateByCountry")]
        public IActionResult GetStateByCountry(int CountryId)
        {
           
            object[] mparameters = { CountryId };
            string Result = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetStateByCountry, mparameters);
            return Ok(Result);
        }
        [HttpGet]
        [Route("GetCityByStateId")]
        public IActionResult GetCityByStateId(int StateId)
        {
           
            object[] mparameters = { StateId };
            string Result = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetCityByStateId, mparameters);
            return Ok(Result);
        }
        [HttpPost]
        [Route("SaveandupdateCustomer")]
        public IActionResult SaveandupdateCustomer(JObject obj)
        {
            string JArrayval = obj.GetValue("JArrayval").Value<string>();
            string CCode = obj.GetValue("CCode").Value<string>();
            bool IsActive = Convert.ToBoolean(obj.GetValue("IsActive").Value<string>());
            string Name = obj.GetValue("Name").Value<string>();
            string CustomerId = obj.GetValue("CustomerId").Value<string>();
            string Description = obj.GetValue("Description").Value<string>();
            string Email = obj.GetValue("Email").Value<string>();
            string PhoneNumber = obj.GetValue("PhoneNumber").Value<string>();
            string MobileNumber = obj.GetValue("MobileNumber").Value<string>();
            string ContectPersonName = obj.GetValue("ContectPersonName").Value<string>();
            string CreateBy = obj.GetValue("CreateBy").Value<string>();

            var dattable = CommonHelper.toDataTable(JArrayval);
            SqlParameter[] mparameters = new SqlParameter[]
                {
                    new SqlParameter("@CustomerId",CustomerId),
                    new SqlParameter("@Name",Name),
                    new SqlParameter("@Description",Description),
                    new SqlParameter("@Email",Email),
                    new SqlParameter("@PhoneNumber",PhoneNumber),
                    new SqlParameter("@MobileNumber",MobileNumber),
                    new SqlParameter("@ContectPersonName",ContectPersonName),
                    new SqlParameter("@IsActive",IsActive),
                    new SqlParameter("@CreateBy",CreateBy),
                    new SqlParameter("@CreateDate",DateTime.UtcNow),
                    new SqlParameter("@CCode",CCode),
                    new SqlParameter("@tblCustmerType",dattable)
                };
            string _lst = _dataRepository.ExcuteDataTableRowSqlCommand(StoredProcedureHelper.spSaveNupdateCustmer, mparameters);

            return Ok(_lst);
        }

        [HttpGet]
        [Route("GetAllCoustomer")]
        public IActionResult GetAllCoustomer(string CCode)
        {

            object[] mparameters = { CCode };
            string Result = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAllCustomer, mparameters);
            return Ok(Result);
        }
        [HttpGet]
        [Route("GetAddressByCoustomerId")]
        public IActionResult GetAddressByCoustomerId(int CoustomerId)
        {

            object[] mparameters = { CoustomerId };
            string Result = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GetAddressByCustomerId, mparameters);
            return Ok(Result);
        }  
        [HttpGet]
        [Route("GetCoustmerByCoustomerId")]
        public IActionResult GetCoustmerByCoustomerId(int CoustomerId)
        {

            object[] mparameters = { CoustomerId };
            string Result = _dataRepository.ExcuteSingleRowSqlCommand(StoredProcedureHelper.sp_GetCustomerByCustomerId, mparameters);
            return Ok(Result);
        }
      
        [Route("DeleteCoustomer")]
        [HttpDelete]
        public IActionResult DeleteCoustomer(int ID)
        {


            string msg = string.Empty;

            object[] parameters = { ID };
            string Result = _dataRepository.ExcuteSingleRowSqlCommand(StoredProcedureHelper.sp_DeleteCoustomer, parameters);

            return Ok(Result);
        }

        [HttpPost]
        [Route("AddOrUpdateZone")]
        public IActionResult AddOrUpdateZone(JObject obj)
        {
            GResposnse Result = new GResposnse();
            try
            {
                string ZoneName = obj.GetValue("ZoneName").Value<string>();

                int ZoneId = Convert.ToInt32(obj.GetValue("ZoneId").Value<string>());
                int CityId = Convert.ToInt32(obj.GetValue("CityId").Value<string>());
                bool IsActive = Convert.ToBoolean(obj.GetValue("IsActive").Value<string>());

                string CreateBy = obj.GetValue("CreateBy").Value<string>();
                string msg = string.Empty;

                object[] parameters = {
                                          ZoneId>0?ZoneId:0,
                                          ZoneName,
                                          IsActive,
                                          CreateBy,
                                          CityId
                                        };
                Result = _dataRepository.AddAndUpdate(StoredProcedureHelper.sp_saveAndUpdateZone, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok(CommonHelper.InvalidRequestMessage());
            }


        }
        [HttpGet]
        [Route("GetAllZone")]
        public IActionResult GetAllZone()
        {

            try
            {

                object[] parameters = { };
                string Result = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GatAllZone, parameters);
                var response = new { data = Result, Status = 200 };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return Ok();
            }

        }

        [HttpDelete]
        [Route("DeleteZone")]
        public IActionResult DeleteZone(string Id)
        {
            if (!string.IsNullOrEmpty(Id))
            {
                try
                {
                    object[] parameters = {
                                         Id
                                        };
                    string Result = _dataRepository.ExcuteSingleRowSqlCommand(StoredProcedureHelper.sp_DeleteZone, parameters);
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
        [Route("GetZoneByCityId")]
        public IActionResult GetZoneByCityId(int CityId)
        {

            object[] mparameters = { CityId };
            string Result = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_GatAllZoneByCityId, mparameters);
            return Ok(Result);
        }
        [Route("getAppSetting")]
        [HttpPost]
        public IActionResult GetAllAppSetting()
        {
            object[] mparameters = { };
            string Result = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.GetAllAppSetting, mparameters);
            return Ok(Result);
        }
    }
}
