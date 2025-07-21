using AgroSmartBeackend.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace AgroSmartBeackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AgroSmartContext _context;

        #region Constructor
        public UserController(AgroSmartContext context)
        {
            this._context = context;
        }
        #endregion

        #region GetAllUsers
        [HttpGet("All")]
        public async Task<ActionResult<List<User>>> GetAllUsers()
        {
            try
            {
                var data = await _context.Users.ToListAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching users", Error = ex.Message });
            }
        }
        #endregion

        #region GetUserById
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return NotFound(new { Message = $"User with ID {id} not found." });

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching user", Error = ex.Message });
            }
        }
        #endregion

        #region UpdateUser
        [HttpPut("{id}")]
        public async Task<ActionResult<User>> UpdateUser(int id, User u)
        {
            if (id != u.UserId)
                return BadRequest(new { Message = "User ID mismatch" });

            try
            {
                var existingUser = await _context.Users.FindAsync(id);
                if (existingUser == null)
                    return NotFound(new { Message = $"User with ID {id} not found." });

                existingUser.FullName = u.FullName;
                existingUser.Email = u.Email;
                existingUser.Role = u.Role;
                existingUser.Phone = u.Phone;
                existingUser.Address = u.Address;
                existingUser.IsActive = u.IsActive;
                existingUser.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(existingUser);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error updating user", Error = ex.Message });
            }
        }
        #endregion

        #region DeleteUser
        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return NotFound(new { Message = $"User with ID {id} not found." });

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error deleting user", Error = ex.Message });
            }
        }
        #endregion

        #region FilterUsers
        [HttpGet("Filter")]
        public async Task<ActionResult<List<User>>> FilterUsers(
            [FromQuery] string? fullName,
            [FromQuery] string? email,
            [FromQuery] string? role,
            [FromQuery] string? phone,
            [FromQuery] bool? isActive,
            [FromQuery] DateTime? createdAfter,
            [FromQuery] DateTime? createdBefore,
            [FromQuery] DateTime? updatedAfter,
            [FromQuery] DateTime? updatedBefore)
        {
            try
            {
                var query = _context.Users.AsQueryable();

                if (!string.IsNullOrWhiteSpace(fullName))
                    query = query.Where(u => u.FullName.ToLower().Contains(fullName.ToLower()));

                if (!string.IsNullOrWhiteSpace(email))
                    query = query.Where(u => u.Email.ToLower().Contains(email.ToLower()));

                if (!string.IsNullOrWhiteSpace(role))
                    query = query.Where(u => u.Role.ToLower().Contains(role.ToLower()));

                if (!string.IsNullOrWhiteSpace(phone))
                    query = query.Where(u => u.Phone != null && u.Phone.Contains(phone));

                if (isActive.HasValue)
                    query = query.Where(u => u.IsActive == isActive.Value);

                if (createdAfter.HasValue)
                    query = query.Where(u => u.CreatedAt >= createdAfter.Value);

                if (createdBefore.HasValue)
                    query = query.Where(u => u.CreatedAt <= createdBefore.Value);

                if (updatedAfter.HasValue)
                    query = query.Where(u => u.UpdatedAt >= updatedAfter.Value);

                if (updatedBefore.HasValue)
                    query = query.Where(u => u.UpdatedAt <= updatedBefore.Value);

                var result = await query.OrderByDescending(u => u.CreatedAt).ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error filtering users", Error = ex.Message });
            }
        }
        #endregion

        #region LoginUser
        [HttpPost("Login")]
        public async Task<ActionResult> Login(Models.LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Identifier || u.Phone == request.Identifier);

            if (user == null)
                return Unauthorized(new { Message = "User not found." });

            bool isPasswordValid = false;

            try
            {
                isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            }
            catch (BCrypt.Net.SaltParseException)
            {
                return BadRequest(new { Message = "Invalid password format stored in database." });
            }

            if (!isPasswordValid)
                return Unauthorized(new { Message = "Invalid email/phone or password." });

            return Ok(new { Message = "Login successful", User = user });
        }
        #endregion

        #region RegisterUser
        [HttpPost("Register")]
        public async Task<ActionResult> RegisterUser(User u)
        {
            try
            {
                // Check if email or phone already exists
                bool exists = await _context.Users.AnyAsync(x => x.Email == u.Email || x.Phone == u.Phone);
                if (exists)
                    return BadRequest(new { Message = "Email or phone already in use." });

                // Validate password strength (optional but recommended)
                if (string.IsNullOrWhiteSpace(u.PasswordHash) || u.PasswordHash.Length < 6)
                    return BadRequest(new { Message = "Password must be at least 6 characters long." });

                // Hash the password securely before saving
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

        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] Models.ChangePasswordRequest request)
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
}
