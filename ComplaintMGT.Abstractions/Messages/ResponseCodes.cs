
namespace ComplaintMGT.Abstractions.Messages
{
    public static class ResponseCodes
    {
        public static readonly string SessionTokenExpired = "SessionTokenExpired";

        public static readonly string InvalidCredentials = "InvalidCredentials";

        public static readonly string PasswordChanged = "PasswordChanged";

        public static readonly string Authorized = "Authorized";
    }
}
