using System;
using System.Collections.Generic;
using System.Text;

namespace ComplaintMGT.Abstractions.DomainModels
{
    public class RoleMaster
    {
        public string cn { get; set; }
        public string an { get; set; }
    }
    public class RoleInfo
    {
        public int fnRoleId { get; set; }
        public string ftRoleName { get; set; }
    }
}
