using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Entities.Configuration;
using ComplaintMGT.Abstractions.Entities.Device;
using ComplaintMGT.Abstractions.Entities.Inventory;

namespace ComplaintMGT.Infrastructure.Data
{
    public class CMGTContext : DbContext
    {
        public CMGTContext() { }
        public CMGTContext(DbContextOptions<CMGTContext> options)
          : base(options)
        {
            //Database.Migrate();
        }
     
        [NotMapped]
        public DbSet<LoginResponse> LoginResponse { get; set; }
        [NotMapped]
        public DbSet<GResposnse> ReasonInfo { get; set; } 
        [NotMapped]
        public DbSet<Menu> MenuInfo { get; set; }
        [NotMapped]
        public DbSet<SubMenuInfo> SubMenuInfo { get; set; } 
        [NotMapped]
        public DbSet<CuntryMasterinfo> CuntryMasterinfo { get; set; } 
        [NotMapped]
        public DbSet<StateMasterinfo> StateMasterinfo { get; set; } 
        [NotMapped]
        public DbSet<CityMasterinfo> CityMasterinfo { get; set; }
        [NotMapped]
        public DbSet<AddressTypeInfo> AddressTypeInfo { get; set; }
        [NotMapped]
        public DbSet<CustmerInfo> CustmerInfo { get; set; }
        [NotMapped]
        public DbSet<DeviceInfo> DeviceInfo { get; set; }
        [NotMapped]
        public DbSet<AssetInfo> AssetInfo { get; set; }
        [NotMapped]
        public DbSet<AssetTypeInfo> AssetTypeInfo { get; set; }
        [NotMapped]
        public DbSet<SiteInfo> SiteInfo { get; set; }
        [NotMapped]
        public DbSet<SiteOperatingRulesInfo> SiteOperatingRulesInfo { get; set; }
        [NotMapped]
        public DbSet<SiteOperationWindowInfo> SiteOperationWindowInfo { get; set; } 
        [NotMapped]
        public DbSet<AssetRulesInfo> AssetRulesInfo { get; set; } 
        [NotMapped]
        public DbSet<OrderInfo> OrderInfo { get; set; }
        [NotMapped]
        public DbSet<AssetOverrideInfo> AssetOverrideInfo { get; set; }
        [NotMapped]
        public DbSet<SiteInformationInfo> SiteInformationInfo { get; set; }
        [NotMapped]
        public DbSet<SiteInformationBaselineInfo> SiteInformationBaselineInfo { get; set; }
    }
}
