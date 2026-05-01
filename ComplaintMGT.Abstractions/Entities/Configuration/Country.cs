using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ComplaintMGT.Abstractions.Entities.Configuration
{
    public class CuntryMasterinfo
    {
        [Key]
        public int CountryId { get; set; }
        public string CountryName { get; set; }
        public bool Active { get; set; }
    }
    public class StateMasterinfo
    {
        [Key]
        public int StateId { get; set; }
        public int CountryId { get; set; }
        public string StateName { get; set; }
        public bool Active { get; set; }
    }
    public class CityMasterinfo
    {
        [Key]
        public int CityId { get; set; }
        public int StateId { get; set; }
        public string CityName { get; set; }
        public bool Active { get; set; }
    }
    public class ZoneMasterinfo
    {
        [Key]
        public int ZoneId { get; set; }
        public int CityId { get; set; }
        public string ZoneName { get; set; }
        public bool Active { get; set; }
    }
}
