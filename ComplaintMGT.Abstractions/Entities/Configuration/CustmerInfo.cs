using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ComplaintMGT.Abstractions.Entities.Configuration
{
    public class CustmerInfo
    {
        [Key]
        public int CustomerId { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
      
        [MaxLength(200)]
        public string Description { get; set; }
        [Required]
        [MaxLength(50)]
        public string Email { get; set; }
        [Required]
        [MaxLength(12)]
        public string PhoneNumber { get; set; }
        [Required]
        [MaxLength(12)]
        public string MobileNumber { get; set; }
        [Required]
        [MaxLength(50)]
        public string ContectPersonName { get; set; }
        public bool IsActive { get; set; }
        public string CCode { get; set; }
        public string CreateBy { get; set; }
        public string JArrayval { get; set; }
    }
}
