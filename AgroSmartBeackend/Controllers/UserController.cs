using AgroSmartBeackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        #region AddUser
        [HttpPost]
        public async Task<ActionResult<User>> AddUser(User u)
        {
            try
            {
                u.CreatedAt = DateTime.UtcNow;
                u.UpdatedAt = DateTime.UtcNow;

                await _context.Users.AddAsync(u);
                await _context.SaveChangesAsync();

                return Ok(u);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error adding user", Error = ex.Message });
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

                // Update allowed fields only
                existingUser.FullName = u.FullName;
                existingUser.Email = u.Email;
                existingUser.PasswordHash = u.PasswordHash;
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

    }
}
