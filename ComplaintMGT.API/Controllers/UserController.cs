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
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using ComplaintMGT.Abstractions.Services;
using ComplaintMGT.Abstractions.Entities;
using ComplaintMTG.Core.Utils;
using ComplaintMGT.Abstractions.DomainModels;

namespace ComplaintMGTAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IConfiguration _config;
        private IUser<tbl_User, LoginResponse, GUserInfo, GResposnse> _dataRepository;
        private ILoggerService _logger;

        public UserController(IUser<tbl_User, LoginResponse, GUserInfo, GResposnse> dataRepository, IConfiguration config, ILoggerService logger)
        {
            _logger = logger;
            _dataRepository = dataRepository;
            _config = config;
        }
        [HttpGet]
        [Route("Login")]
        [AllowAnonymous]
        public IActionResult Login(string userName, string password)
        {
            try
            {
                _logger.LogInfo("Login API Called");
                _logger.LogInfo("User Name = " + userName + " password " + password);
                object[] parameters = { userName, PasswordHelper.EncryptPwd(password), CommonHelper.IndianStandard(DateTime.UtcNow) };
                LoginResponse usr = _dataRepository.Login(StoredProcedureHelper.spGetValidateLogin, parameters);
                _logger.LogInfo("user response = " + usr);
                string Key = Convert.ToString(Startup.StaticConfig.GetSection("Jwt").GetValue(typeof(string), "Key"));
                string Issuer = Convert.ToString(Startup.StaticConfig.GetSection("Jwt").GetValue(typeof(string), "Issuer"));
                string Audience = Convert.ToString(Startup.StaticConfig.GetSection("Jwt").GetValue(typeof(string), "Audience"));

                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Key));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var Sectoken = new JwtSecurityToken(
                    Issuer,
                    Audience,
                  GetClaims(usr),
                  expires: DateTime.Now.AddMinutes(120),
                  signingCredentials: credentials);

                var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);

                return Ok(token);
            }
            catch (Exception ex)
            {
                _logger.LogInfo("user response Error = " + ex.InnerException.Message);
                return Ok(ex.Message.ToString());
            }
        }

        private IList<Claim> GetClaims(LoginResponse userClaims)
        {
            List<Claim> claims = new List<Claim>();
            claims.Add(new Claim("FullName", userClaims.FullName != null ? userClaims.FullName : ""));
            claims.Add(new Claim("RoleId", userClaims.RoleId.ToString()));
            claims.Add(new Claim("LoginId", userClaims.LoginId != null ? userClaims.LoginId : ""));
            claims.Add(new Claim("RoleName", userClaims.RoleName != null ? userClaims.RoleName : ""));
            claims.Add(new Claim("CCode", userClaims.CCode != null ? userClaims.CCode : ""));
            claims.Add(new Claim("Msg", userClaims.Msg != null ? userClaims.Msg : ""));
            claims.Add(new Claim("Result", userClaims.Result.ToString()));
            return claims;
        }

        [HttpPost]
        [Route("Logout")]
        public IActionResult Logout()
        {
            var login = HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }
        [HttpPost]
        [Route("AccessDenied")]
        public IActionResult AccessDenied()
        {
            return Ok();
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
                    SortColumn = "Name";
                    break;
                case 2:
                    SortColumn = "UserName";
                    break;
                case 3:
                    SortColumn = "EmailId";
                    break;
                case 4:
                    SortColumn = "RoleName";
                    break;
                case 5:
                    SortColumn = "MobileNo";
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
                                        requestModel.CCode
                                        };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.GetAllUsers, parameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetAllRole")]
        public IActionResult GetAllRole(string CCode)
        {
            object[] mparameters = { CCode };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.spGetAllRoles, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetUserDataById")]
        public IActionResult GetUserDataById(int UserId)
        {
            object[] mparameters = { UserId };
            string _lst = _dataRepository.ExcuteSingleRowSqlCommand(StoredProcedureHelper.GetUserDataById, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetMenuByRole")]
        public IActionResult GetMenuByRole(string rolename)
        {
            object[] mparameters = { rolename };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.spGetMenuByRole, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetAllMenuMaster")]
        public IActionResult GetAllMenuMaster(int roleId)
        {
            object[] mparameters = { roleId };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.spGetALLMenuMaster, mparameters);
            string _lstSubMenu = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.spGetAllSubMenuMaster, mparameters);
            var response = new { data1 = _lst, data2 = _lstSubMenu };
            return Ok(response);
        }
        [HttpGet]
        [Route("GetSubMenuByRole")]
        public IActionResult GetSubMenuByRole(string rolename)
        {
            object[] mparameters = { rolename };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.spGetAllSubMenuByRole, mparameters);

            return Ok(_lst);
        }
        [HttpGet]
        [Route("GetSubMenuByRolev1")]
        public IActionResult GetSubMenuByRolev1(string rolename)
        {
            object[] mparameters = { rolename };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.spGetAllSubMenuByRoleV1, mparameters);

            return Ok(_lst);
        }
        [HttpPost]
        [Route("SaveandupdateMenu")]
        public IActionResult SaveandupdateMenu(JObject obj)
        {
            string JArrayval = obj.GetValue("JArrayval").Value<string>();
            string ccode = obj.GetValue("CCode").Value<string>();
            bool IsActive = Convert.ToBoolean(obj.GetValue("IsActive").Value<string>());
            string RoleName = obj.GetValue("RoleName").Value<string>();
            string RoleId = obj.GetValue("RoleId").Value<string>();

            var dattable = CommonHelper.toDataTable(JArrayval);
            SqlParameter[] mparameters = new SqlParameter[]
                {
                    new SqlParameter("@RoleId",RoleId),
                    new SqlParameter("@CCode",ccode),
                    new SqlParameter("@fbIsActive",IsActive),
                    new SqlParameter("@RoleName",RoleName),
                    new SqlParameter("@tblSubMneuType",dattable)
                };
            string _lst = _dataRepository.ExcuteDataTableRowSqlCommand(StoredProcedureHelper.spSaveNupdateRole, mparameters);

            return Ok(_lst);
        }
        [HttpPost]
        [Route("SaveandupdateUser")]
        public IActionResult SaveandupdateUser(JObject obj)
        {
            string JArrayval = obj.GetValue("JArrayval").Value<string>();

            string UserId = obj.GetValue("UserId").Value<string>();
            bool IsActive = Convert.ToBoolean(obj.GetValue("IsActive").Value<string>());
            string FullName = obj.GetValue("FullName").Value<string>();
            string EmailId = obj.GetValue("EmailId").Value<string>();
            string Pwd = obj.GetValue("Pwd").Value<string>();
            string Mobile = obj.GetValue("Mobile").Value<string>();
            string CCode = obj.GetValue("CCode").Value<string>();
            string CustCode = obj.GetValue("CustCode").Value<string>();
            string RoleId = obj.GetValue("RoleId").Value<string>();
            string UserName = obj.GetValue("UserName").Value<string>();
            string ImgUrl = obj.GetValue("ImgUrl").Value<string>();
            string Address = obj.GetValue("Address").Value<string>();
            string CreateBy = obj.GetValue("CreateBy").Value<string>();
            var dattable = CommonHelper.toDataTable(JArrayval);
            SqlParameter[] mparameters = new SqlParameter[]
                {
                    new SqlParameter("@UserId",UserId),
                    new SqlParameter("@FullName",FullName),
                    new SqlParameter("@EmailId",EmailId),
                    new SqlParameter("@Pwd",Pwd),
                    new SqlParameter("@Mobile",Mobile),
                    new SqlParameter("@IsActive",IsActive),
                    new SqlParameter("@CCode",CCode),
                    new SqlParameter("@CustCode",CustCode),
                    new SqlParameter("@RoleId",RoleId),
                    new SqlParameter("@UserName",UserName),
                    new SqlParameter("@ImgUrl",ImgUrl),
                    new SqlParameter("@Address",Address),
                    new SqlParameter("@CreateBy",CreateBy),
                    new SqlParameter("@UserArea",dattable)
                };
            string _lst = _dataRepository.ExcuteDataTableRowSqlCommand(StoredProcedureHelper.SaveandupdateUser, mparameters);

            return Ok(_lst);
        }
        [HttpPost]
        [Route("GetAllAssigendModule")]
        public IActionResult GetAllAssigendModule(JObject obj)
        {
            object[] mparameters1 = { obj.GetValue("Ccode").Value<string>(), };
            object[] mparameters = { obj.GetValue("Ccode").Value<string>(), obj.GetValue("LoginId").Value<string>() };
            string _lst = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.spGetALLCircleMaster, mparameters1);
            string _lstSubMenu = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.spGetAllCircleWardMaster, mparameters);
            var response = new { data1 = _lst, data2 = _lstSubMenu };
            return Ok(response);
        }
    }
}
