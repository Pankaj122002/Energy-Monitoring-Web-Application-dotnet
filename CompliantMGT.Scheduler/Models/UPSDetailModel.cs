using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CompliantMGT.Scheduler.Models
{
    public class UPSDetailModel
    {
        public string date { get; set; }
        public string time { get; set; }
        public string input_voltage { get; set; }
        public string output_load { get; set; }
        public string board_temperature { get; set; }
        public string humidity { get; set; }
        public string water_level { get; set; }
        public string fire { get; set; }
        public string color { get; set; }
        public string mode_status { get; set; }
        public string power { get; set; }
        public string fault_status { get; set; }
        public string fault_msg { get; set; }
        public string warn_msg { get; set; }
        public string available_battery_backup_time { get; set; }
        public string available_battery_charge_percentage { get; set; }
        public string error_code { get; set; }
        public string error_msg { get; set; }
        public string status_msg { get; set; }
    }
}
