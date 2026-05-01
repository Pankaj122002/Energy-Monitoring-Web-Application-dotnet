using System;
using System.Collections.Generic;
using System.Text;

namespace ComplaintMGT.Abstractions.Entities.GENERIC
{
    public class LoadSensor
    {
        public int LoadSensorTransactionId { get; set; }
        public string VehicleNo { get; set; }
        public string PrimaryWeight { get; set; }
        public DateTime SyncOn { get; set; }
    }
}
