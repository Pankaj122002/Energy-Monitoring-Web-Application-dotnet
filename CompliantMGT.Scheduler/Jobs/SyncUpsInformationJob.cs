using ComplaintMGT.Abstractions.Entities.Configuration;
using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Quartz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using ComplaintMTG.Core.Utils;

namespace CompliantMGT.Scheduler
{
    public class SyncUpsInformationJob : IJob
    {
        //private readonly ILogger<SyncUpsInformationJob> _logger;
        private readonly ILoggerService _logger;
        private readonly SchedulerSettings _SchedulerSettings;
        private IConfiguration<Menu, GResposnse, SubMenuInfo> _dataRepository;
        public SyncUpsInformationJob(ILoggerService logger, IOptions<SchedulerSettings> SchedulerSettings, IConfiguration<Menu, GResposnse, SubMenuInfo> dataRepository)
        {
            _logger = logger;
            _SchedulerSettings = SchedulerSettings.Value;
            _dataRepository = dataRepository;
        }

        public Task Execute(IJobExecutionContext context)
        {
            _logger.LogInfo("Running UPS Imfomation Sync Scheduler at " +  DateTime.UtcNow.ToString());

            var upsServerLogin = MobileLogin();

            if(upsServerLogin != null)
            {
                foreach (var device in upsServerLogin.Devices)
                {
                    SyncUPSStatus(device, upsServerLogin);
                }
            }

            return Task.CompletedTask;
        }

        private  UpsMobileLoginResponseModel MobileLogin()
        {

            _logger.LogInfo("Inside MobileLogin Method");

            try
            {
                string apiURI = _SchedulerSettings.UPSApi_BaseUrl + _SchedulerSettings.UPSApi_Login_URI + _SchedulerSettings.UPSApi_Login_AuthCred;
                HttpClient client = new HttpClient();
                var response = client.GetStringAsync(apiURI);

                if (response != null && response.Result != null && response.Result != string.Empty)
                {
                    string base64Result = response.Result;
                    byte[] blobStr = Convert.FromBase64String(base64Result);
                    string jsonStr = Encoding.UTF8.GetString(blobStr);

                    var obj = JsonConvert.DeserializeObject<UpsMobileLoginResponseModel>(jsonStr);

                    _logger.LogInfo("Received following response: " + jsonStr);

                    return obj;

                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error While pefrorming mobile login: " + ex.Message );
                _logger.LogTrace(ex.StackTrace);
            }

            return null;
        }

        private void SyncUPSStatus(UpsDeviceModel device, UpsMobileLoginResponseModel upsServerLogin)
        {
            _logger.LogInfo("Inside SyncUPSStatus Method");

            try
            {
                var upsReadingPayload = new
                {
                    ups_id = device.ups_id,
                    users_id = upsServerLogin.users_id
                };

                string json = JsonConvert.SerializeObject(upsReadingPayload);
                var payloadBytes = System.Text.Encoding.UTF8.GetBytes(json);
                string base64payload = System.Convert.ToBase64String(payloadBytes);

                string apiURI = _SchedulerSettings.UPSApi_BaseUrl + _SchedulerSettings.UPSApi_UPS_Readings + base64payload;
                HttpClient client = new HttpClient();
                var response = client.GetStringAsync(apiURI);

                if (response != null && response.Result != null && response.Result != string.Empty)
                {
                    string base64Result = response.Result;
                    byte[] blobStr = Convert.FromBase64String(base64Result);
                    string jsonStr = Encoding.UTF8.GetString(blobStr);

                    _logger.LogInfo("Received following response: " + jsonStr);

                    SyncToDatabase(jsonStr, device, upsServerLogin);
                }
            }
            catch (Exception ex)
            {

                _logger.LogError("Error While pefrorming sync up: " + ex.Message + " " + ex.StackTrace);
            }
        }

        private void SyncToDatabase(string jsonData, UpsDeviceModel device, UpsMobileLoginResponseModel upsServerLogin)
        {
            try
            {
                object[] parameters = { upsServerLogin.users_id, upsServerLogin.organization_name, upsServerLogin.contact_no, upsServerLogin.contact_person, upsServerLogin.address, device.ups_id, device.ups_name, jsonData };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_SyncUpsReadingData, parameters);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error While pefrorming mobile login: " + ex.Message + " " + ex.StackTrace);
            }
        }
    }
}
