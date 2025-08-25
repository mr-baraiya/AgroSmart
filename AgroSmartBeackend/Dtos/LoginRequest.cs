namespace AgroSmartBeackend.Dtos
{
    public class LoginRequest
    {
        public string Identifier { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = null!; 
    }
}
