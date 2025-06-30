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
            var data = await _context.Users.ToListAsync();
            return Ok(data);
        }
        #endregion

        #region GetUserById
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
        #endregion

        #region AddUser
        [HttpPost]
        public async Task<ActionResult<User>> AddUser(User u)
        {
            await _context.Users.AddAsync(u);
            await _context.SaveChangesAsync();
            return Ok(u);
        }
        #endregion

        #region UpdateUser
        [HttpPut("{id}")]
        public async Task<ActionResult<User>> UpdateUser(int id, User u)
        {
            if (id != u.UserId)
            {
                return BadRequest("User ID mismatch");
            }

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            // Update allowed fields only
            existingUser.FullName = u.FullName;
            existingUser.Email = u.Email;
            existingUser.PasswordHash = u.PasswordHash;
            existingUser.Role = u.Role;
            existingUser.Phone = u.Phone;
            existingUser.Address = u.Address;
            existingUser.IsActive = u.IsActive;
            existingUser.UpdatedAt = DateTime.UtcNow; // Optional: Track update time

            await _context.SaveChangesAsync();

            return Ok(existingUser);
        }
        #endregion

        #region DeleteUser
        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(user);
        }
        #endregion

    }
}
