using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CompliantMGT.Scheduler
{
    public class SchedulerSettings
    {
        // Footfall API Properties
        public int FootfallApi_RunningInterval { get; set; }
        public string FootfallApi_URI { get; set; }
        public string FootfallApi_Token { get; set; }
        public string FootfallApi_Category { get; set; }
        public List<string> FootfallApi_Ids { get; set; }
        public List<string> FootfallApi_Data { get; set; }
        public string FootfallApi_Period { get; set; }
        public string FootfallApi_DateFormat { get; set; }
        public string FootfallApi_TimeFormat { get; set; }

        // UPS API Properties
        public int UPSApi_RunningInterval { get; set; }
        public string UPSApi_BaseUrl { get; set; }
        public string UPSApi_Login_URI {get; set;}
        public string UPSApi_UPS_Details {get; set;}
        public string UPSApi_UPS_Readings {get; set;}
        public string UPSApi_Login_AuthCred {get; set;}


    }
}
