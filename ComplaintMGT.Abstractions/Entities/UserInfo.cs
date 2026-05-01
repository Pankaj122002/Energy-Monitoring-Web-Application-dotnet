using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ComplaintMGT.Abstractions.Entities
{
    public class UserInfo
    {
        [Key]
        public int UserId { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Mobile { get; set; }
        public string Password { get; set; }
        public string Address { get; set; }
        public string UserName { get; set; }
        public string filename { get; set; }
        public int? ddlCustomer { get; set; }
        public int? ddlRole { get; set; }
        public int? CountryId { get; set; }
        public int? StateId { get; set; }
        public int? CityId { get; set; }
        public int? ZoneId { get; set; }

    }
    [Table("tbl_User")]
    public class tbl_User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }

        public string FullName { get; set; }

        [Required(ErrorMessage = "Required.")]
        public string EmailId { get; set; }


        [Required(ErrorMessage = "Required.")]
        public string Pwd { get; set; }
        public string Mobile { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime LastLogin { get; set; }
    }
    public class GUserInfo
    {
        [Key]
        public string EmailId { get; set; }
        public string FullName { get; set; }
        public string Mobile { get; set; }
        public string Pwd { get; set; }
        public string LastLogin { get; set; }
        public string UserRole { get; set; }
    }

   
}
