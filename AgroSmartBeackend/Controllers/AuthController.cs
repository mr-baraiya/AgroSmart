using AgroSmartBeackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AgroSmartContext _context;
    private readonly IConfiguration _configuration;

    #region Constructor
    public AuthController(AgroSmartContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }
    #endregion

    #region Login
    [AllowAnonymous]
    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest login)
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                (u.Email == login.Identifier || u.Phone == login.Identifier) &&
                u.Role.ToLower() == login.Role.ToLower());

            if (user == null)
                return Unauthorized("User not found with the provided identifier and role.");

            if (!BCrypt.Net.BCrypt.Verify(login.Password, user.PasswordHash))
                return Unauthorized("Incorrect password.");

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                message = "Login successfully",
                token,
                phone =user.Phone,
                email = user.Email,
                userId = user.UserId,
                name = user.FullName,
                role = user.Role
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }
    #endregion

    #region JWT Token Generation
    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
            new Claim("role", user.Role),
            new Claim("email", user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(6),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    #endregion

    #region RegisterUser
    [AllowAnonymous]
    [HttpPost("Register")]
    public async Task<ActionResult> RegisterUser(User u)
    {
        try
        {
            // Check if email or phone already exists
            bool exists = await _context.Users.AnyAsync(x => x.Email == u.Email || x.Phone == u.Phone);
            if (exists)
                return BadRequest(new { Message = "Email or phone already in use." });

            // Validate password strength
            if (string.IsNullOrWhiteSpace(u.PasswordHash) || u.PasswordHash.Length < 6)
                return BadRequest(new { Message = "Password must be at least 6 characters long." });

            // Set role as "User" (prevent override)
            //u.Role = "User";

            // Hash password before saving
            u.PasswordHash = BCrypt.Net.BCrypt.HashPassword(u.PasswordHash);
            u.CreatedAt = DateTime.UtcNow;
            u.UpdatedAt = DateTime.UtcNow;

            await _context.Users.AddAsync(u);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "User registered successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error registering user", Error = ex.Message });
        }
    }
    #endregion

    #region ChangePassword
    [Authorize]
    [HttpPost("ChangePassword")]
    public async Task<IActionResult> ChangePassword([FromBody] AgroSmartBeackend.Models.ChangePasswordRequest request)
    {
        try
        {
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
                return NotFound(new { Message = "User not found." });

            // Verify current password
            bool isCurrentPasswordValid = false;
            try
            {
                isCurrentPasswordValid = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash);
            }
            catch (BCrypt.Net.SaltParseException)
            {
                return BadRequest(new { Message = "Stored password format is invalid." });
            }

            if (!isCurrentPasswordValid)
                return Unauthorized(new { Message = "Current password is incorrect." });

            // Prevent same password reuse
            if (BCrypt.Net.BCrypt.Verify(request.NewPassword, user.PasswordHash))
                return BadRequest(new { Message = "New password cannot be the same as the current password." });

            // Strong password pattern check
            var passwordPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&^])[A-Za-z\d@$!%*?#&^]{8,}$";
            if (!Regex.IsMatch(request.NewPassword, passwordPattern))
                return BadRequest(new
                {
                    Message = "Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
                });

            // Hash and update password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Password changed successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Error changing password", Error = ex.Message });
        }
    }
    #endregion 

}
