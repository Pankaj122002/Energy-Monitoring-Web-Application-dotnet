using ComplaintMGT.Infrastructure.Data;
using ComplaintMGTAPI.SECURITY;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using ComplaintMGT.Bootstrapper;
using ComplaintMGT.Abstractions.DomainModels;
using NLog;
using System.IO;
using ComplaintMGT.API.ExceptionHandlerMiddleware;
using CompliantMGT.Scheduler;

namespace ComplaintMGTAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            StaticConfig = configuration;
            LogManager.LoadConfiguration(string.Concat(Directory.GetCurrentDirectory(), "/nlog.config"));
        }
        public static IConfiguration StaticConfig { get; private set; }
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.Configure<FormOptions>(options =>
            {
                options.MultipartBodyLengthLimit = long.MaxValue;
            });

            services.AddCors();
            services.AddControllers().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ContractResolver = new DefaultContractResolver();
                options.SerializerSettings.Formatting = Formatting.Indented;
                //options.JsonSerializerOptions.WriteIndented = true;
            });
            services.AddCors(option => option.AddPolicy("MyBlogPolicy", builder =>
            {
                builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();

            }));

            services.AddDbContext<CMGTContext>(options =>
                 options.UseSqlServer(Configuration.GetConnectionString("CKCENTITY")));

            // Adding Scheduler
            services.Configure<SchedulerSettings>(Configuration.GetSection("Scheduler"));
            services.AddSchedulerInfrastructure(Configuration);


            services.AddAuthentication("BasicAuthentication")
                .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);

            services.AddSingleton(new DatabaseOptions(Configuration.GetConnectionString("CKCENTITY")));

            // register the `Data: DefaultConnection` configuration section as
            // a configuration for the `DatabaseOptions` type
            //services.Configure<DatabaseOptions>(Configuration.GetSection("ConnectionStrings:CKCENTITY"));

            services.RegisterServices();

            services.AddSwaggerGen(setup =>
            {
                // Include 'SecurityScheme' to use JWT Authentication
                var jwtSecurityScheme = new OpenApiSecurityScheme
                {
                    BearerFormat = "JWT",
                    Name = "JWT Authentication",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = JwtBearerDefaults.AuthenticationScheme,
                    Description = "SynCoTics API",

                    Reference = new OpenApiReference
                    {
                        Id = JwtBearerDefaults.AuthenticationScheme,
                        Type = ReferenceType.SecurityScheme
                    }
                };
                setup.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
                setup.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                        { jwtSecurityScheme, Array.Empty<string>() }
                });
                //setup.AddSecurityDefinition("basic", new OpenApiSecurityScheme
                //{
                //    Name = "Authorization",
                //    Type = SecuritySchemeType.Http,
                //    Scheme = "basic",
                //    In = ParameterLocation.Header,
                //    Description = "Basic Authorization header using the Bearer scheme."
                //});

                //setup.AddSecurityRequirement(new OpenApiSecurityRequirement
                //{
                //    {
                //          new OpenApiSecurityScheme
                //            {
                //                Reference = new OpenApiReference
                //                {
                //                    Type = ReferenceType.SecurityScheme,
                //                    Id = "basic"
                //                }
                //            },
                //            new string[] {}
                //    }
                //});
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //Configure Exception Middelware
            app.UseMiddleware<ExceptionMiddleware>();

            app.UseRouting();
            app.UseCors("MyBlogPolicy");
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            // This middleware serves generated Swagger document as a JSON endpoint
            app.UseSwagger();

            // This middleware serves the Swagger documentation UI
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint(Configuration.GetSection("Swagger:SwaggerDefinitionfileUrl").Get<string>(), "ComplaintMGT API V1");
            });

        }
    }
}
