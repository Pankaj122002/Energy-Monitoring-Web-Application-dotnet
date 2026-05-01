using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ComplaintMGT.Abstractions.Entities
{
    public class SiteInfo
    {
        [Key]
        public int SiteId { get; set; }
        public int CustomerId { get; set; }
        public int CountryId { get; set; }
        public int StateId { get; set; }
        public int CityId { get; set; }
        public string Name { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public int PinCode { get; set; }
        public Boolean IsDSTEnabled { get; set; }
        public Boolean IsActive { get; set; }
        public string CreateBy { get; set; }
    }
    
    public class SiteOperationWindowInfo
    {
        [Key]
        public int SiteOperationWindowId { get; set; }
        public int SiteId { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int DayOfWeek { get; set; }
        public Boolean IsActive { get; set; }
        public string CreateBy { get; set; }
        public string SiteOperationWindow { get; set; }
    }

    public class SiteOperatingRulesInfo
    {
        [Key]
        public int OperatingParameterId { get; set; }
        public int SiteId { get; set; }
        public string Rules { get; set; }
        public Boolean IsActive { get; set; }
        public string CreateBy { get; set; }
    }
    public class SiteInformationInfo
    {
        [Key]
        public int SiteInformationId { get; set; }
        public int SiteId { get; set; }
        public DateTime ICStartTime { get; set; }
        public DateTime ICEndTime { get; set; }    
        public Boolean ICSignOffFlag { get; set; }
        public DateTime ICSignOffTime { get; set; }
        public string ICSignOffGivenBy { get; set; }
        public Boolean IsActive { get; set; }
        public string CreateBy { get; set; }
        
    }
    public class SiteInformationBaselineInfo
    {
        [Key]
        public int SiteInformationBaselineId { get; set; }
        public int SiteId { get; set; }
        public DateTime BaselineStartTime { get; set; }
        public DateTime BaselineEndTime { get; set; }    
        public Boolean BaselineSignOffFlag { get; set; }
        public DateTime BaselineSignOffTime { get; set; }
        public string BaselineSignOffGivenBy { get; set; }
        public Boolean IsActive { get; set; }
        public string CreateBy { get; set; }
        
    }
}
