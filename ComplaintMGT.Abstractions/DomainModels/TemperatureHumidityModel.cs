using System;
using System.Collections.Generic;
using System.Text;

namespace ComplaintMGT.Abstractions.DomainModels
{
    public class TemperatureHumidityModel
    {
        public decimal Temperature { get; set; }
        public decimal Humidity { get; set; }
        public string DeviceID { get; set; }
        public string ReserveValue { get; set; }
        public string Timestamp { get; set; }
    }
}
