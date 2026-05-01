using System.Security;

namespace ComplaintMGT.Abstractions.Auth
{
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; }
        public SecureString SecuredPassword { get; set; }
        public bool LoginStatus { get; set; }
    }

    public class RefreshTokenRequest
    {
        public string JWTToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
