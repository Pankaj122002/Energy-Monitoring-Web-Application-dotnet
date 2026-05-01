using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ComplaintMGT.Abstractions.Entities.Device
{
    public class DeviceInfo
    {
        [Key]
        public int DeviceId { get; set; }
        public int AssetId { get; set; }
        public int CustomerId { get; set; }
        public int SiteId { get; set; }
        public int DeviceStatusId { get; set; }
        public string AssetTag { get; set; }
        public string ImeiNo { get; set; }
        public string DeviceIdForExternal { get; set; }
        public string DispalyName { get; set; }
        public Boolean IsActive { get; set; }
        public string CreateBy { get; set; }
        public int DeviceTypeId { get; set; }
        public string FirmwareVersion { get; set; }
        public string Accesskey { get; set; }
        public string Upgradeavailable { get; set; }

    }
    public class DeviceStatusInfo
    {
        [Key]
        public int DeviceStatusId { get; set; }
        public string Description { get; set; }
        public Boolean IsActive { get; set; }
        public string CreateBy { get; set; }
    }
    public class StatusInfo
    {
        [Key]
        public int StatusId { get; set; }
        public string Description { get; set; }
        public Boolean IsActive { get; set; }
        public string CreateBy { get; set; }
    }
    public class DeviceTypeInfo
    {
        [Key]
        public int DeviceTypeId { get; set; }
        public string DeviceType { get; set; }
        public Boolean IsActive { get; set; }
        public string CreateBy { get; set; }
    }
}
