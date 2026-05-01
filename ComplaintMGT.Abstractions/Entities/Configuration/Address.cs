using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ComplaintMGT.Abstractions.Entities.Configuration
{
    public class AddressTypeInfo
    {
        [Key]
        public int AddressTypeId { get; set; }
        public string Description { get; set; }
        public Boolean IsActive { get; set; }
        public string CreateBy { get; set; }
      
    }
}
