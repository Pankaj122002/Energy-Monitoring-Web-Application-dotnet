using ComplaintMGT.Abstractions.DomainModels;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Principal;

namespace ComplaintMGT.Abstractions.Auth
{
    public class JwtUserInfo
    {
        public JwtUserInfo(IEnumerable<Claim> claims)
        {
            if (claims != null)
            {
                foreach (var claim in claims)
                {
                    switch (claim.Type)
                    {

                        case nameof(Username):
                            Username = Convert.ToString(claim.Value);
                            break;
                        case nameof(DisplayName):
                            DisplayName = Convert.ToString(claim.Value);
                            break;
                        case nameof(Email):
                            Email = Convert.ToString(claim.Value);
                            break;
                        case nameof(LoginDetailID):
                            LoginDetailID = Convert.ToInt32(claim.Value);
                            break;
                        case nameof(PersonnelId):
                            PersonnelId = Convert.ToInt32(claim.Value);
                            break;
                        case nameof(ApplicationRole):
                            ApplicationRole = Convert.ToString(claim.Value);
                            break;
                        case nameof(ApplicationRoleGroup):
                            ApplicationRoleGroup = Convert.ToString(claim.Value);
                            break;
                        case nameof(UserId):
                            UserId = Convert.ToString(claim.Value);
                            break;
                        case nameof(Department):
                            Department = Convert.ToString(claim.Value);
                            break;
                    }
                }
            }
        }
        public JwtUserInfo(IPrincipal user)
        {
            if (user != null)
            {
                var claims = ((ClaimsPrincipal)user).Claims;

                foreach (var claim in claims)
                {
                    switch (claim.Type)
                    {

                        case nameof(Username):
                            Username = Convert.ToString(claim.Value);
                            break;
                        case nameof(DisplayName):
                            DisplayName = Convert.ToString(claim.Value);
                            break;
                        case nameof(Email):
                            Email = Convert.ToString(claim.Value);
                            break;
                        case nameof(LoginDetailID):
                            LoginDetailID = Convert.ToInt32(claim.Value);
                            break;
                        case nameof(PersonnelId):
                            PersonnelId = Convert.ToInt32(claim.Value);
                            break;
                        case nameof(ApplicationRole):
                            ApplicationRole = Convert.ToString(claim.Value);
                            break;
                        case nameof(ApplicationRoleGroup):
                            ApplicationRoleGroup = Convert.ToString(claim.Value);
                            break;
                        case nameof(UserId):
                            UserId = Convert.ToString(claim.Value);
                            break;
                        case nameof(Department):
                            Department = Convert.ToString(claim.Value);
                            break;  
                    }
                }
            }
        }
        public int LoginDetailID { get; set; }
        public int PersonnelId { get; set; }
        public string Username { get; set; }

        public string ApplicationRole { get; set; }
        public string ApplicationRoleGroup { get; set; }
        public string UserId { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }

        public string Department { get; set; }
    }
}
