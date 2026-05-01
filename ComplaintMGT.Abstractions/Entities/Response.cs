using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ComplaintMGT.Abstractions.Entities
{
    public class LoginResponse
    {
        [Key]
        public int Result { get; set; }
        public string Msg { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public string LoginId { get; set; }
        public string FullName { get; set; }
        public string CCode { get; set; }

    }
    public class GResposnse
    {
        [Key]
        public int Result { get; set; }
        public string Msg { get; set; }
        public string Code { get; set; }
    }
}
