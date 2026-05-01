using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Http;
using System.Net;
using Microsoft.Extensions.DependencyInjection.Extensions;
using ComplaintMGT.Helpers;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Text;
using ComplaintMGT.Middleware;
using Microsoft.Extensions.Logging;
using ComplaintMGT.Core.Utils.Report;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using System.IO;
using Microsoft.AspNetCore.DataProtection;

namespace ComplaintMGT
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            StaticConfig = configuration;
        }

        public static IConfiguration StaticConfig { get; private set; }
        public IConfiguration Configuration { get; }
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //added for session persistance
            services.AddDataProtection().PersistKeysToFileSystem(new DirectoryInfo(Directory.GetCurrentDirectory())).SetDefaultKeyLifetime(TimeSpan.FromDays(30));

            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });
            //services.AddHttpContextAccessor();
            //services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            //services.AddBrowserDetection();
            services.AddDistributedMemoryCache();

            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            services.AddScoped<ExcelReport>();
            services.AddScoped<PdfReport>();

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
            {
                options.LoginPath = "/Account/Login";
                options.AccessDeniedPath = "/Account/Login";
                options.LogoutPath = "/Account/Logout";
                options.SlidingExpiration = true;
                options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
            });
            services.AddControllersWithViews().AddSessionStateTempDataProvider()
                       .AddNewtonsoftJson(options =>
                       {

                           options.UseMemberCasing();
                       }).AddRazorRuntimeCompilation();

            //services.TryAdd(ServiceDescriptor.Singleton(typeof(IHttpClientHelper<>), typeof(HttpClientHelper<>)));

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseDeveloperExceptionPage();
            //if (env.IsDevelopment())
            //{
            //    app.UseDeveloperExceptionPage();
            //}
            //else
            //{
            //    app.UseExceptionHandler("/Home/Error500");
            //}
            //app.Use(async (context, next) =>
            //{
            //    await next();
            //    if (context.Response.StatusCode == 404)
            //    {
            //        context.Request.Path = "/Home/Error404";
            //        await next();
            //    }

            //});
            //app.UseStatusCodePages(async (context) =>
            //{
            //    var request = context.HttpContext.Request;
            //    var response = context.HttpContext.Response;

            //    if (response.StatusCode == (int)HttpStatusCode.Unauthorized)
            //    {
            //        response.Redirect("/Home/Error401");
            //    }
            //});

            var provider = new FileExtensionContentTypeProvider();


            app.UseStaticFiles(new StaticFileOptions { ContentTypeProvider = provider });



            app.UseSession();
            app.UseRouting();
            app.UseCookiePolicy();



            app.UseAuthentication();
            app.UseAuthorization();

            //app.UseMiddleware<JwtMiddleware>();

            app.UseEndpoints(endpoints =>
            {
                // ── ADDED: registers [Route("api/MapView/...")] attribute-routed actions
                //           (GetMapSites / GetMapAssets / GetMapDevices) so the fetch()
                //           calls in Index.cshtml don't get 404.
                //           MapControllerRoute alone only handles conventional routes.
                endpoints.MapControllers();

                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Deshboard}/{action=IndexNew}/{id?}");
            });
        }
    }
}