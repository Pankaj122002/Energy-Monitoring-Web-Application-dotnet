using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Entities.Configuration;
using ComplaintMGT.Abstractions.Services;
using ComplaintMTG.Core.Utils;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Quartz;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace CompliantMGT.Scheduler
{
    [DisallowConcurrentExecution]
    public class SyncCustomerFootfallJob: IJob
    {
        private readonly ILoggerService _logger;
        private readonly SchedulerSettings _SchedulerSettings;
        private IConfiguration<Menu, GResposnse, SubMenuInfo> _dataRepository;

        public SyncCustomerFootfallJob(ILoggerService logger, IOptions<SchedulerSettings> SchedulerSettings, IConfiguration<Menu, GResposnse, SubMenuInfo> dataRepository)
        {
            _logger = logger;
            _SchedulerSettings = SchedulerSettings.Value;
            _dataRepository = dataRepository;
        }


        public Task Execute(IJobExecutionContext context)
        {
            _logger.LogInfo("Running Cutomer Footfall Scheduler at " + DateTime.UtcNow.ToString());

            // Customize this object to update payload parameters;
            var fromDate = DateTime.Now.AddDays(-1).ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);
            var toDate = DateTime.Now.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);

            FootfallApiPayload payload = new FootfallApiPayload
            {
                cat = _SchedulerSettings.FootfallApi_Category,
                id = _SchedulerSettings.FootfallApi_Ids,
                data = _SchedulerSettings.FootfallApi_Data,
                fromdate = fromDate,
                todate = toDate,
                period = _SchedulerSettings.FootfallApi_Period,
                dateformat = _SchedulerSettings.FootfallApi_DateFormat,
                timeformat = _SchedulerSettings.FootfallApi_TimeFormat
            };

            // Api Calling Ops 
            var apiURI = _SchedulerSettings.FootfallApi_URI+payload.GetJSONString()+ "&access_token="+_SchedulerSettings.FootfallApi_Token;

            try
            {
                HttpClient client = new HttpClient();
                var response = client.GetStringAsync(apiURI);

                if(response != null && response.Result != null && response.Result != string.Empty)
                {
                    string result = response.Result;
                    var obj = JsonConvert.DeserializeObject<dynamic>(result);

                    string responseData = string.Empty;

                    if(obj != null)
                    {
                        responseData = JsonConvert.SerializeObject(obj.Data);
                        SyncCustomerFootFallData(responseData);

                        _logger.LogInfo("Data Received: " + responseData);
                    }
                }
            }
            catch (Exception e)
            {
                _logger.LogError("Error Calling API: " + e.Message);
            }

            return Task.CompletedTask;
        }


        public void SyncCustomerFootFallData(string jsondata)
        {
            try
            {
                object[] parameters = { jsondata };
                string _response = _dataRepository.ExcuteRowSqlCommand(StoredProcedureHelper.sp_SyncCustomerFootfallData, parameters);

            }
            catch (Exception e)
            {
                _logger.LogError("Error SyncCustomerFootFallData: " + e.Message);
            }
        }
    }
}
