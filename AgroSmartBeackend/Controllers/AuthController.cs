using AgroSmartBeackend.Dtos;
using AgroSmartBeackend.Models;
using AgroSmartBeackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using ForgotPasswordRequest = AgroSmartBeackend.Dtos.ForgotPasswordRequest;
using ResetPasswordRequest = AgroSmartBeackend.Dtos.ResetPasswordRequest;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AgroSmartContext _context;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;

    #region Constructor
    public AuthController(AgroSmartContext context, IConfiguration configuration, IEmailService emailService)
    {
        _context = context;
        _configuration = configuration;
        _emailService = emailService;
    }
    #endregion

    #region Login
    [AllowAnonymous]
    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] AgroSmartBeackend.Dtos.LoginRequest login)
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
            // u.Role = "User";

            // Hash password before saving
            u.PasswordHash = BCrypt.Net.BCrypt.HashPassword(u.PasswordHash);

            // Set default profile image if not provided
            if (string.IsNullOrWhiteSpace(u.ProfileImage))
            {
                u.ProfileImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw1QlKvKrqi3DHMBtYFMA2cg1tKhWgsCs5kg&s";
            }

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
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
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

    #region Password Reset
    [HttpPost("request-password-reset")]
    public async Task<IActionResult> RequestPasswordReset([FromBody] ForgotPasswordRequest request)
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return NotFound(new { message = "Email not found" });

            var token = Guid.NewGuid().ToString();
            var expiry = DateTime.UtcNow.AddMinutes(15);

            // Create a new PasswordResetToken instance (not from Dtos namespace)
            var resetToken = new PasswordResetToken
            {
                UserId = user.UserId,
                Token = token,
                Expiry = expiry
            };

            _context.PasswordResetTokens.Add(resetToken);
            await _context.SaveChangesAsync();

            // var resetLink = $"https://agrosmart.me/auth/forgot-password?token={token}";
            var resetLink = $"http://localhost:5173/auth/forgot-password?token={token}";
            await _emailService.SendEmailAsync(user.Email, "Password Reset", $"Click the link to reset: {resetLink}");

            //Return both message and token
            return Ok(new
            {
                message = "Password reset link sent",
                token = token,
                expiry = expiry
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while processing request", error = ex.Message });
        }
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            var resetToken = await _context.PasswordResetTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == request.Token);

            if (resetToken == null || resetToken.Expiry < DateTime.UtcNow)
                return BadRequest(new { message = "Invalid or expired token" });

            // hash and update password
            resetToken.User.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            _context.PasswordResetTokens.Remove(resetToken);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password has been reset successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while resetting password", error = ex.Message });
        }
    }
    #endregion

}
