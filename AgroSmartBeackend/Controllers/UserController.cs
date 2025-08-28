using AgroSmartBeackend.Helper;
using AgroSmartBeackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace AgroSmartBeackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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

        #region SoftDeleteUser
        // Soft Delete: Marks user as inactive instead of removing from DB
        [HttpDelete("SoftDelete/{id}")]
        public async Task<ActionResult<User>> SoftDeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return NotFound(new { Message = $"User with ID {id} not found." });

                if (!user.IsActive)
                    return BadRequest(new { Message = $"User with ID {id} is already inactive." });

                user.IsActive = false;              // Soft delete
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { Message = $"User with ID {id} has been deactivated (soft deleted).", User = user });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error soft deleting user", Error = ex.Message });
            }
        }
        #endregion

        #region HardDeleteUser
        // Hard Delete: Permanently removes user from DB
        [HttpDelete("HardDelete/{id}")]
        public async Task<ActionResult<User>> HardDeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return NotFound(new { Message = $"User with ID {id} not found." });

                _context.Users.Remove(user);        // Hard delete
                await _context.SaveChangesAsync();

                return Ok(new { Message = $"User with ID {id} has been permanently deleted.", User = user });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error hard deleting user", Error = ex.Message });
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

        //#region Upload Image
        //[HttpPost]
        //public async Task<IActionResult> UploadProfileImage([FromForm] int userId, [FromForm] IFormFile profileImg)
        //{
        //    var user = await _context.Users.FindAsync(userId);
        //    if (user == null)
        //        return NotFound(new { Message = "User not found." });

        //    if (profileImg != null && profileImg.Length > 0)
        //    {
        //        // Delete old image if exists and is not default
        //        if (!string.IsNullOrEmpty(user.ProfileImage) &&
        //            user.ProfileImage != "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw1QlKvKrqi3DHMBtYFMA2cg1tKhWgsCs5kg&s")
        //        {
        //            try
        //            {
        //                ImageHelper.DeleteFile(user.ProfileImage);
        //            }
        //            catch
        //            {
        //                // ignore errors
        //            }
        //        }

        //        // Save new profile image
        //        string savedPath = ImageHelper.SaveImageToFile(profileImg);
        //        if (string.IsNullOrEmpty(savedPath))
        //            return BadRequest(new { Message = "Failed to save profile image." });

        //        user.ProfileImage = savedPath;
        //        await _context.SaveChangesAsync();
        //    }

        //    return Ok(user);
        //}

        //// -------------------- Delete Profile Image --------------------
        //[HttpDelete]
        //public async Task<IActionResult> DeleteProfileImage(int userId)
        //{
        //    var user = await _context.Users.FindAsync(userId);
        //    if (user == null)
        //        return NotFound(new { Message = "User not found." });

        //    if (!string.IsNullOrEmpty(user.ProfileImage) &&
        //        user.ProfileImage != "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw1QlKvKrqi3DHMBtYFMA2cg1tKhWgsCs5kg&s")
        //    {
        //        ImageHelper.DeleteFile(user.ProfileImage);
        //    }

        //    // Reset to default image
        //    user.ProfileImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw1QlKvKrqi3DHMBtYFMA2cg1tKhWgsCs5kg&s";
        //    await _context.SaveChangesAsync();

        //    return Ok(user);
        //}
        //#endregion

    }
}