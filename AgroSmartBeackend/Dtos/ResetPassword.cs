using AgroSmartBeackend.Models;
using System.Text.Json.Serialization;

namespace AgroSmartBeackend.Dtos
{
    public class ForgotPasswordRequest
    {
        public string Email { get; set; } = null!;
    }

    public class ResetPasswordRequest
    {
        public string Token { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }
}
