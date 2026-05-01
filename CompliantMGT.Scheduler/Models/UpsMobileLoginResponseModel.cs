using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CompliantMGT.Scheduler
{
    public class UpsMobileLoginResponseModel
    {
        public int users_id { get; set; }
        public string organization_name { get; set; }
        public string contact_person { get; set; }
        public string contact_no { get; set; }
        public string address { get; set; }
        public string error_code { get; set; }
        public string error_msg { get; set; }
        public string status_msg { get; set; }

        public List<UpsDeviceModel> Devices { get; set; }
    }

    public class UpsDeviceModel
    {
        public int ups_id { get; set; }
        public string ups_name { get; set; }

    }

}
