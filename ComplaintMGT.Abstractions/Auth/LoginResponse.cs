using ComplaintMGT.Abstractions.DomainModels;
using System.Collections.Generic;

namespace ComplaintMGT.Abstractions.Auth
{
    public class LoginResponse
    {
        public int LoginDetailID { get; set; }
        public int PersonnelId { get; set; }
        public string Username { get; set; }

        public string ApplicationRole { get; set; }
        public string ApplicationRoleGroup { get; set; }      

        public string AuthToken { get; set; }
        public string RefreshToken { get; set; }

        public int IdleTimeoutMins { get; set; }

        public string ApplicationVersion { get; set; }

        public string UserId { get; set; }

        public string Email { get; set; }
        public string DisplayName { get; set; }

        public string Department { get; set; }

        public string SessionId { get; set; }

        public bool HasPendingFeedback { get; set; }

        public List<string> UserPermissionList { get; set; }
        public bool IsAuthenticationResponseSucesss{ get; set; }
    }
}
