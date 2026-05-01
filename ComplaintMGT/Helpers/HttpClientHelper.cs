using ComplaintMGT.Abstractions.Entities;
using DocumentFormat.OpenXml.InkML;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ComplaintMGT.Helpers
{

    public class HttpClientHelper<T>
    {
        static string apiBaseUrl = Startup.StaticConfig.GetValue<string>("WebAPIBaseUrl");
        static bool useBasicAuthorization = Convert.ToBoolean(Startup.StaticConfig.GetValue<string>("UseBasicAuthorization"));
        static string BasicAuth = "Basic " + Convert.ToBase64String(Encoding.Default.GetBytes("copmgt:copmgt#2022"));

        // ── shared helper: builds a configured HttpClient ──────────────────────
        private HttpClient BuildClient(HttpContext context)
        {
            var client = new HttpClient();
            client.Timeout = TimeSpan.FromSeconds(300); // explicit long timeout — default is only 100s

            client.DefaultRequestHeaders.Add("UseBasicAuthorization", useBasicAuthorization.ToString());
            if (useBasicAuthorization)
            {
                client.DefaultRequestHeaders.Add("Authorization", BasicAuth);
            }
            else
            {
                string jwtToken = Convert.ToString(context.Session.GetString("JWTToken"));
                if (!string.IsNullOrEmpty(jwtToken))
                    client.DefaultRequestHeaders.Add("Authorization", "bearer " + jwtToken);
            }
            return client;
        }

        // ── GET → T ───────────────────────────────────────────────────────────
        public async Task<T> GetSingleItemRequestAsync(string apiUrl, HttpContext context)
        {
            string endpoint = apiBaseUrl + apiUrl;
            var result1 = default(T);
            using (var client = BuildClient(context))
            {
                var response = await client.GetAsync(endpoint);
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    if (typeof(T).Name == "String")
                        result1 = (T)Convert.ChangeType(json, typeof(T));
                    else
                        result1 = JsonConvert.DeserializeObject<T>(json);
                }
            }
            return result1;
        }

        // ── POST → T ──────────────────────────────────────────────────────────
        public async Task<T> PostRequestAsync(string apiUrl, string bodyparam, HttpContext context)
        {
            string endpoint = apiBaseUrl + apiUrl;
            var result1 = default(T);
            using (var client = BuildClient(context))
            {
                var content = new StringContent(bodyparam, Encoding.UTF8, "application/json");
                var response = await client.PostAsync(endpoint, content);
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    result1 = JsonConvert.DeserializeObject<T>(json);
                }
            }
            return result1;
        }

        // ── POST → string ─────────────────────────────────────────────────────
        public async Task<string> PostRequestStringAsync(string apiUrl, string bodyparam, HttpContext context)
        {
            string endpoint = apiBaseUrl + apiUrl;
            string result1 = string.Empty;
            using (var client = BuildClient(context))
            {
                var content = new StringContent(bodyparam, Encoding.UTF8, "application/json");
                var response = await client.PostAsync(endpoint, content);
                if (response.IsSuccessStatusCode)
                    result1 = await response.Content.ReadAsStringAsync();
            }
            return result1;
        }

        // ── DELETE → string ───────────────────────────────────────────────────
        public async Task<string> DeleteRequestAsync(string apiUrl, HttpContext context)
        {
            string endpoint = apiBaseUrl + apiUrl;
            string result1 = string.Empty;
            using (var client = BuildClient(context))
            {
                var response = await client.DeleteAsync(endpoint);
                if (response.IsSuccessStatusCode)
                    result1 = await response.Content.ReadAsStringAsync();
            }
            return result1;
        }

        // ── GET → string ──────────────────────────────────────────────────────
        public async Task<string> GetRequestAsync(string apiUrl, HttpContext context)
        {
            string endpoint = apiBaseUrl + apiUrl;
            string result1 = string.Empty;
            using (var client = BuildClient(context))
            {
                var response = await client.GetAsync(endpoint);
                if (response.IsSuccessStatusCode)
                    result1 = await response.Content.ReadAsStringAsync();
            }
            return result1;
        }

        // ── BACKWARD-COMPAT sync wrappers ─────────────────────────────────────
        // Kept so nothing else in the project breaks while you migrate.
        // Remove them once all callers use the Async versions.
        [Obsolete("Use GetSingleItemRequestAsync instead")]
        public T GetSingleItemRequest(string apiUrl, HttpContext context)
            => GetSingleItemRequestAsync(apiUrl, context).GetAwaiter().GetResult();

        [Obsolete("Use PostRequestAsync instead")]
        public T PostRequest(string apiUrl, string bodyparam, HttpContext context)
            => PostRequestAsync(apiUrl, bodyparam, context).GetAwaiter().GetResult();

        [Obsolete("Use PostRequestStringAsync instead")]
        public string PostRequestString(string apiUrl, string bodyparam, HttpContext context)
            => PostRequestStringAsync(apiUrl, bodyparam, context).GetAwaiter().GetResult();

        [Obsolete("Use DeleteRequestAsync instead")]
        public string DeleteRequest(string apiUrl, HttpContext context)
            => DeleteRequestAsync(apiUrl, context).GetAwaiter().GetResult();

        [Obsolete("Use GetRequestAsync instead")]
        public string GetRequest(string apiUrl, HttpContext context)
            => GetRequestAsync(apiUrl, context).GetAwaiter().GetResult();
    }


    public static class JWTTokenHelper
    {
        public static LoginResponse GetUserClaim(JwtSecurityToken token)
        {
            var response = new LoginResponse();
            response.Result = Convert.ToInt32(token.Claims.First(c => c.Type == "Result").Value);
            response.CCode = token.Claims.First(c => c.Type == "CCode").Value;
            response.Msg = token.Claims.First(c => c.Type == "Msg").Value;
            response.LoginId = token.Claims.First(c => c.Type == "LoginId").Value;
            response.FullName = token.Claims.First(c => c.Type == "FullName").Value;
            response.RoleId = Convert.ToInt32(token.Claims.First(c => c.Type == "RoleId").Value);
            response.RoleName = token.Claims.First(c => c.Type == "RoleName").Value;
            return response;
        }
    }

    public static class SessionExtensions
    {
        public static void SetObjectAsJson(this ISession session, string key, object value)
        {
            session.SetString(key, JsonConvert.SerializeObject(value));
        }

        public static T GetObjectFromJson<T>(this ISession session, string key)
        {
            var value = session.GetString(key);
            return value == null ? default(T) : JsonConvert.DeserializeObject<T>(value);
        }
    }
}