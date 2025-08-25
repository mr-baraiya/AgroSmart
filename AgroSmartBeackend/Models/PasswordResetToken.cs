using System.Text.Json.Serialization;

namespace AgroSmartBeackend.Models
{
    public class PasswordResetToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Token { get; set; } = null!;
        public DateTime Expiry { get; set; }

        [JsonIgnore]
        public virtual User? User { get; set; }
    }
}
