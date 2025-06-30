using AgroSmartBeackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgroSmartBeackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FarmController : ControllerBase
    {
        private readonly AgroSmartContext _context;

        #region Constructor
        public FarmController(AgroSmartContext context)
        {
            this._context = context;
        }
        #endregion

        #region GetAllFarms
        [HttpGet("All")]
        public async Task<ActionResult<List<Farm>>> GetAllFarms()
        {
            var data = await _context.Farms.ToListAsync();
            return Ok(data);
        }
        #endregion

        #region GetFarmById
        [HttpGet("{id}")]
        public async Task<ActionResult<Farm>> GetFarmById(int id)
        {
            var farm = await _context.Farms.FindAsync(id);
            if (farm == null)
            {
                return NotFound();
            }
            return Ok(farm);
        }
        #endregion

        #region AddFarm
        [HttpPost]
        public async Task<ActionResult<Farm>> AddFarm(Farm f)
        {
            f.CreatedAt = DateTime.UtcNow;
            f.UpdatedAt = DateTime.UtcNow;
            await _context.Farms.AddAsync(f);
            await _context.SaveChangesAsync();
            return Ok(f);
            //return CreatedAtAction(nameof(GetFarmById), new { id = f.FarmId }, f);
        }
        #endregion

        #region UpdateFarm
        [HttpPut("{id}")]
        public async Task<ActionResult<Farm>> UpdateFarm(int id, Farm f)
        {
            if (id != f.FarmId)
            {
                return BadRequest("Farm ID mismatch");
            }

            var existingFarm = await _context.Farms.FindAsync(id);
            if (existingFarm == null)
            {
                return NotFound();
            }

            // Update allowed fields only
            existingFarm.FarmName = f.FarmName;
            existingFarm.Location = f.Location;
            existingFarm.Latitude = f.Latitude;
            existingFarm.Longitude = f.Longitude;
            existingFarm.TotalAcres = f.TotalAcres;
            existingFarm.UserId = f.UserId;
            existingFarm.IsActive = f.IsActive;
            existingFarm.UpdatedAt = DateTime.UtcNow; // Optional: Track update time

            await _context.SaveChangesAsync();

            return Ok(existingFarm);
        }
        #endregion

        #region DeleteFarm
        [HttpDelete("{id}")]
        public async Task<ActionResult<Farm>> DeleteFarm(int id)
        {
            var farm = await _context.Farms.FindAsync(id);
            if (farm == null)
            {
                return NotFound();
            }
            _context.Farms.Remove(farm);
            await _context.SaveChangesAsync();
            return Ok(farm);
        }
        #endregion

    }
}
