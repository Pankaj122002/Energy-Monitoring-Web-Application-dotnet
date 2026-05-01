using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ComplaintMGT.Abstractions.Entities.Device
{
    public class AssetInfo
    {
        [Key]
        public int AssetId { get; set; }
        public int AssetTypeId { get; set; }
        public string Tag { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string OEM { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public string SerialNo { get; set; }
        public decimal Quanitity { get; set; }
        public decimal Price { get; set; }
        public Boolean IsActive { get; set; }
        public string CreateBy { get; set; }
        public string Asset_Rating { get; set; }
        public string Asset_Capacity { get; set; }
    }
    public class AssetRulesInfo
    {
        [Key]
        public int AssetRulesId { get; set; }
        public string RuleName { get; set; }
        public int AssetId { get; set; }
        public string LCL { get; set; }
        public string UCL { get; set; }
        public string Measurement { get; set; }
        public string CreateBy { get; set; }
        
    }
    public class AssetOverrideInfo
    {
        [Key]
        public int AssetOverrideId { get; set; }
        public int AssetId { get; set; }
        public int CustomerId { get; set; }
        public int SiteId { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndADateTime { get; set; }
        public bool IsActive { get; set; }
        public string CreateBy { get; set; }
        
    }
}
