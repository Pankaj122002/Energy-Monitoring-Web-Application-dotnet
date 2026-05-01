using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ComplaintMGT.Abstractions.Entities.Configuration
{
    public class Menu
    {
        [Key]
        public int MenuId { get; set; }
        public int ParentId { get; set; }
        public string MenuName { get; set; }
        public int Order { get; set; }
        public string Icon { get; set; }
        public int ModuleId { get; set; }
        public Boolean IsActive { get; set; }
    }
    public class SubMenuInfo
    {
        [Key]
        public int fnSubMenuId { get; set; }
        public int fnMenuId { get; set; }
        public string ftSubMenuName { get; set; }
        public int fnOrderId { get; set; }
        public string ftControllerName { get; set; }
        public string ftActionName { get; set; }
        public string ftArea { get; set; }
        public string ftSCssIcon { get; set; }
        public Boolean fbIsActive { get; set; }
    }
}
