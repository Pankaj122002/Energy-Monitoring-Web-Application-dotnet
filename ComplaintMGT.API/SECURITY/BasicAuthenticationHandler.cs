
using ComplaintMGT.Abstractions.Entities.GENERIC;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using OfficeOpenXml.FormulaParsing.LexicalAnalysis;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace ComplaintMGTAPI.SECURITY
{
    public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {

        public BasicAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock)
            : base(options, logger, encoder, clock)
        {
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (Request.Path.Value.Contains("swagger") || Request.Path.Value.Contains("User/Login"))
            {
                var claims = new[] {
                new Claim(ClaimTypes.NameIdentifier, ""),
                new Claim(ClaimTypes.Name, "") };
                var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
                var principal = new ClaimsPrincipal(identity);
                var ticket = new AuthenticationTicket(principal, JwtBearerDefaults.AuthenticationScheme);
                return AuthenticateResult.Success(ticket);
            }
            if (!Request.Headers.ContainsKey("Authorization"))
                return AuthenticateResult.Fail("Missing Authorization Header");
            //Use JWT Authorization when Basic Authorization is set to false
            var authenticationHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"])?.Scheme?.ToLower();
            if ((Request.Headers.ContainsKey("UseBasicAuthorization") && Convert.ToBoolean(Request.Headers["UseBasicAuthorization"]) == false) || authenticationHeader.Contains("bearer"))
            {
                BUserInfo user = new BUserInfo();
                bool IsAuthorized = false;
                try
                {
                    //jwt token parsed
                    var authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
                    //validate jwt token here
                    string Key = Convert.ToString(Startup.StaticConfig.GetSection("Jwt").GetValue(typeof(string), "Key"));
                    string Issuer = Convert.ToString(Startup.StaticConfig.GetSection("Jwt").GetValue(typeof(string), "Issuer"));
                    string Audience = Convert.ToString(Startup.StaticConfig.GetSection("Jwt").GetValue(typeof(string), "Audience"));
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var key = Encoding.ASCII.GetBytes(Key);
                    tokenHandler.ValidateToken(authHeader.Parameter, new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                        ClockSkew = TimeSpan.Zero,
                        ValidIssuer = Issuer,
                        ValidAudience = Audience
                    }, out SecurityToken validatedToken);

                    var jwtToken = (JwtSecurityToken)validatedToken;
                    var userClaim = jwtToken.Claims.FirstOrDefault(x => x.Type == "LoginId").Value;
                    user.UserName = Convert.ToString(userClaim);

                    IsAuthorized = true;// await IsAuthorizedUser(username, password);

                }
                catch (Exception ex)
                {
                    return AuthenticateResult.Fail("Invalid Authorization Header");
                }

                if (IsAuthorized == false)
                    return AuthenticateResult.Fail("Invalid Username or Password");

                var claims = new[] {
                new Claim(ClaimTypes.NameIdentifier, user.UserName.ToString()),
                new Claim(ClaimTypes.Name, user.UserName) };
                var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
                var principal = new ClaimsPrincipal(identity);
                var ticket = new AuthenticationTicket(principal, JwtBearerDefaults.AuthenticationScheme);
                return AuthenticateResult.Success(ticket);
            }
            else
            {
                BUserInfo user = null;
                bool IsAuthorized = false;
                try
                {
                    var authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
                    var credentialBytes = Convert.FromBase64String(authHeader.Parameter);
                    var credentials = Encoding.UTF8.GetString(credentialBytes).Split(new[] { ':' }, 2);
                    var username = credentials[0];
                    var password = credentials[1];
                    user = new BUserInfo();
                    user.UserName = username;
                    IsAuthorized = await IsAuthorizedUser(username, password);
                }
                catch
                {
                    return AuthenticateResult.Fail("Invalid Authorization Header");
                }

                if (IsAuthorized == false)
                    return AuthenticateResult.Fail("Invalid Username or Password");

                var claims = new[] {
                        new Claim(ClaimTypes.NameIdentifier, user.UserName.ToString()),
                        new Claim(ClaimTypes.Name, user.UserName)};
                var identity = new ClaimsIdentity(claims, Scheme.Name);
                var principal = new ClaimsPrincipal(identity);
                var ticket = new AuthenticationTicket(principal, Scheme.Name);

                return AuthenticateResult.Success(ticket);
            }

            // return await Task.FromResult(AuthenticateResult.Success(ticket));
        }
        public async Task<bool> IsAuthorizedUser(string Username, string Password)
        {
            List<BUserInfo> _lst = new List<BUserInfo>();

            _lst.Add(new BUserInfo { UserName = "copmgt", Password = "copmgt#2022" });

            // In this method we can handle our database logic here...
            bool IsAuthorize = await Task.Run(() => _lst.Any(i => i.UserName == Username && i.Password == Password));
            return IsAuthorize;
        }
    }

}
