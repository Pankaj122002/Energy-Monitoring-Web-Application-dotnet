using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace ComplaintMGT.Middleware
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {

            try
            {
                //if has request header, do nothing
                if (httpContext.Request.Headers.TryGetValue("Authorization", out var authHeader) && authHeader.Any() &&
                    authHeader[0].StartsWith("Bearer", StringComparison.OrdinalIgnoreCase))
                {
                    return;
                }

                var endpoint = httpContext.GetEndpoint();
                //var attribute = endpoint.Metadata.OfType<JwtParameterAttribute>().FirstOrDefault();
                //if (attribute != null && httpContext.Request.Query.TryGetValue(attribute.Parameter, out var param))
                {
                    var token = Convert.ToString(httpContext.Session.GetString("JWTToken"));
                    //param.FirstOrDefault();
                    if (!string.IsNullOrWhiteSpace(token))
                    {
                        httpContext.Request.Headers.Add("Authorization", $"Bearer {token}");
                    }
                }
            }
            finally
            {
                // Call the next middleware delegate in the pipeline 
                await _next.Invoke(httpContext);
            }
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class JwtMiddlewareExtensions
    {
        public static IApplicationBuilder UseJwtMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<JwtMiddleware>();
        }
    }
}
