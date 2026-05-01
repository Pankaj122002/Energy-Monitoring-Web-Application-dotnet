using System;
using System.Collections.Generic;
using System.Text;

namespace ComplaintMGT.Abstractions.DomainModels
{
    public class DeviceHandlingSensorModel
    {
        public string mac_addr { get; set; }
        public string human { get; set; }
        public string pir_detected { get; set; }
        public string door_closed { get; set; }
    }
}
