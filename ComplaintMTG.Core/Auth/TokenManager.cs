using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
//using Microsoft.IdentityModel.Tokens;
//using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ComplaintMGT.Abstractions.Auth;
using ComplaintMGT.Abstractions;
using System.Security.Cryptography;
//using OfficeOpenXml.FormulaParsing.Excel.Functions.Math;

namespace ComplaintMGT.Core.Auth
{
    public class TokenManager//: ITokenManager
    {
        //private readonly ILogger _logger;
        //public TokenManager(ILogger logger)
        //{
        //    _logger = logger;
        //}
        //public string GenerateToken(LoginResponse userClaims, DateTime expires)
        //{
        //    _logger.Info("TokenManager.GenerateToken method is called");
        //    try
        //    {
        //        string sec = Convert.ToString(System.Configuration.ConfigurationManager.AppSettings["JwtSecurityKey"]);
        //        var securityKey = new SymmetricSecurityKey(Encoding.Default.GetBytes(sec));
        //        var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);


        //        var token = new JwtSecurityToken(
        //            audience: "NavigatorAPI",
        //            issuer: "NavigatorAPI",
        //            claims: GetClaims(userClaims),
        //            expires: expires,
        //            signingCredentials: signingCredentials);
        //        var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);
        //        _logger.Info("TokenManager.GenerateToken-Token generated: " + jwtToken);
        //        return jwtToken;
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.Error("TokenManager.GenerateToken Error | " + ex.Message);
        //        return "";
        //    }
        //}
        //public ClaimsPrincipal GetPrincipal(string token)
        //{
        //    try
        //    {
        //        var tokenHandlerDecr = new JwtSecurityTokenHandler();
        //        var tok = tokenHandlerDecr.ReadToken(token);
        //        if (tok == null) return null;
        //        string sec = Convert.ToString(System.Configuration.ConfigurationManager.AppSettings["JwtSecurityKey"]);
        //        var securityKey = new SymmetricSecurityKey(Encoding.Default.GetBytes(sec));
        //        TokenValidationParameters parameters = new TokenValidationParameters()
        //        {

        //            RequireExpirationTime = true,
        //            ValidateIssuer = false,
        //            ValidateAudience = false,
        //            IssuerSigningKey = securityKey,
        //            // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
        //            ClockSkew = TimeSpan.Zero
        //        };

        //        SecurityToken securityToken;
        //        ClaimsPrincipal principal = tokenHandlerDecr.ValidateToken(token, parameters, out securityToken);
        //        return principal;
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.Error("TokenManager.GetPrincipal - principal value is null " + ex.Message);
        //        //if token validation fail then return null
        //        return null;
        //    }
        //}
        //public JwtUserInfo GetPrincipalWithoutVerifying(string token)
        //{
        //    try
        //    {
        //        var tokenHandlerDecr = new JwtSecurityTokenHandler();
        //        var tok = tokenHandlerDecr.ReadJwtToken(token);
        //        if (tok == null) return null;
        //        var claims = tok.Claims;
        //        JwtUserInfo userclaims = new JwtUserInfo(claims);
        //        return userclaims;
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.Error("TokenManager.GetPrincipalWithoutVerifying - userclaims value is null " + ex.Message);
        //        return null;
        //    }
        //}
        //public IEnumerable<Claim> GetClaimFromToken(string token)
        //{
        //    try
        //    {
        //        var tokenHandlerDecr = new JwtSecurityTokenHandler();
        //        var tok = tokenHandlerDecr.ReadJwtToken(token);
        //        if (tok == null) return null;
        //        var principal = tok.Claims;
        //        return principal;
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.Error("TokenManager.GetClaimFromToken - principal value is null " + ex.Message);
        //        //if token validation fail then return null
        //        return Enumerable.Empty<Claim>();
        //    }
        //}
        //private IList<Claim> GetClaims(LoginResponse userClaims)
        //{
        //    List<Claim> claims = new List<Claim>();
        //    claims.Add(new Claim("Username", userClaims.Username != null ? userClaims.Username : ""));
        //    claims.Add(new Claim("DisplayName", userClaims.DisplayName != null ? userClaims.DisplayName : ""));
        //    claims.Add(new Claim("Email", userClaims.Email != null ? userClaims.Email : ""));

        //    claims.Add(new Claim("UserId", userClaims.UserId != null ? userClaims.UserId : ""));
        //    claims.Add(new Claim("LoginDetailID", Convert.ToString(userClaims.LoginDetailID)));
        //    claims.Add(new Claim("PersonnelId", Convert.ToString(userClaims.PersonnelId)));
        //    claims.Add(new Claim("ApplicationRole", userClaims.ApplicationRole != null ? userClaims.ApplicationRole : ""));
        //    claims.Add(new Claim("ApplicationRoleGroup", userClaims.ApplicationRoleGroup != null ? userClaims.ApplicationRoleGroup : ""));
        //    claims.Add(new Claim("Department", userClaims.Department != null ? userClaims.Department : ""));
        //    claims.Add(new Claim("HasPendingFeedback", Convert.ToString(userClaims.HasPendingFeedback)));
        //    return claims;
        //}

        //public string GenerateRefreshToken()
        //{
        //    _logger.Info("TokenManager.GenerateRefreshToken method is called");
        //    try
        //    {
        //        var randomNumber = new byte[64];
        //        var rng = RandomNumberGenerator.Create();
        //        rng.GetBytes(randomNumber);
        //        var refreshToken = Convert.ToBase64String(randomNumber);
        //        return refreshToken;
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.Error("TokenManager.GenerateRefreshToken - principal value is null " + ex.Message);
        //        return "";
        //    }
        //}


    }
}
