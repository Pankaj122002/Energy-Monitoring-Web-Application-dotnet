using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Quartz;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CompliantMGT.Scheduler
{
    public static class SchedulerDependencies
    {
        public static void AddSchedulerInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {

            services.AddQuartz(option =>
            {
                // Footfall Information sync Schedular job
                string footfallTimespan = configuration.GetSection("Scheduler:FootfallApi_RunningInterval").Value.ToString();
                int footfallApiInterval = int.TryParse(footfallTimespan, out footfallApiInterval) ? footfallApiInterval : 1800;

                var footfallJobKey = JobKey.Create(nameof(SyncCustomerFootfallJob));
                option.AddJob<SyncCustomerFootfallJob>(footfallJobKey)
                        .AddTrigger(tgr => tgr.ForJob(footfallJobKey)
                                            .WithSimpleSchedule(schedule => schedule.WithIntervalInSeconds(footfallApiInterval).RepeatForever()));

                // UPS Information sync Schedular Job
                string UPSApiTimespan = configuration.GetSection("Scheduler:UPSApi_RunningInterval").Value.ToString();
                int UpsApiInterval = int.TryParse(UPSApiTimespan, out UpsApiInterval) ? UpsApiInterval : 1800;

                var UpsApiJobKey = JobKey.Create(nameof(SyncUpsInformationJob));
                option.AddJob<SyncUpsInformationJob>(UpsApiJobKey)
                        .AddTrigger(tgr => tgr.ForJob(UpsApiJobKey)
                                            .WithSimpleSchedule(schedule => schedule.WithIntervalInSeconds(UpsApiInterval).RepeatForever()));
            });

            services.AddQuartzHostedService();
        }
    }
}
