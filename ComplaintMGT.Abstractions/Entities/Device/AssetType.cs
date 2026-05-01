using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ComplaintMGT.Abstractions.Entities.Device
{
    public class AssetTypeInfo
    {
        [Key]
        public int AssetTypeId { get; set; }
        public string Description { get; set; }
        public string IsActive { get; set; }
        public string CreateBy { get; set; }
    }
    public class AssetPrametersInfo
    {
        [Key]
        public int AssetPrametersId { get; set; }
        public int AssetTypeId { get; set; }
        public string ParameterName { get; set; }
        public string MeasurementUnit { get; set; }
        public string Description { get; set; }
        public string IsActive { get; set; }
        public string CreateBy { get; set; }
    }
}
