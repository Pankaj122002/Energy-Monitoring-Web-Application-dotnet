using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CompliantMGT.Scheduler
{
    public class FootfallApiPayload
    {

        public FootfallApiPayload()
        {
            cat = string.Empty;
            id = new List<string>();
            data = new List<string>();
            fromdate = string.Empty;
            todate = string.Empty;
            period = string.Empty;
            dateformat = string.Empty;
            timeformat = string.Empty;
        }


        public string cat { get; set; }
        public List<string> id { get; set; }
        public List<string> data { get; set; }
        public string fromdate { get; set; }
        public string todate { get; set; }
        public string period { get; set; }
        public string dateformat { get; set; }
        public string timeformat { get; set; }

        public string ConvertToJson()
        {
            return "Happy";
        }

       
    }

    public static class FootfallApiPayloadExtension
    {
        public static string GetJSONString(this FootfallApiPayload obj)
        {
            return JsonConvert.SerializeObject(obj);
        }
    }
}
