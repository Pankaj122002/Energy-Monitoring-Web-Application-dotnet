using ComplaintMGT.Abstractions.Entities;
using ComplaintMGT.Abstractions.Entities.Configuration;
using ComplaintMGT.Abstractions.Entities.Device;
using ComplaintMGT.Abstractions.Entities.Inventory;
using ComplaintMGT.Abstractions.Repositories;
using ComplaintMGT.Abstractions.Services;
using ComplaintMGT.Core.Utils.Report;
using ComplaintMTG.Core.REPOSITORY;
using ComplaintMTG.Core.SERVICES;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Win32;

namespace ComplaintMGT.Bootstrapper
{
    public static class Bootstrap
    {
        public static IServiceCollection RegisterServices(this IServiceCollection services)
        {
            services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IUser<tbl_User, LoginResponse, GUserInfo, GResposnse>, UserService>();
            services.AddScoped<IConfiguration<Menu, GResposnse, SubMenuInfo>, ConfigurationService>();
            services.AddScoped<IDeviceTransaction<GResposnse>, DeviceTransactionService>();
            services.AddScoped<IDevice<GResposnse, AssetInfo, DeviceInfo, AssetRulesInfo, AssetOverrideInfo>, DeviceService>();
            services.AddScoped<ISite<GResposnse, SiteInfo, SiteInformationInfo, SiteInformationBaselineInfo>, SiteService>();
            services.AddScoped<IMaster<GResposnse>, MasterService>();
            services.AddScoped<IInventory<GResposnse, OrderInfo>, InventoryService>();
            services.AddScoped<IData<GResposnse>, DataService>();
            // Configure Logger service.
            services.AddSingleton<ILoggerService, LoggerService>();
            return services;
        }


    }
}
