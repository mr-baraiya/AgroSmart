using AgroSmartBeackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgroSmartBeackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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
            try
            {
                var data = await _context.Farms.ToListAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error retrieving farms.", Error = ex.Message });
            }
        }
        #endregion

        #region GetFarmById
        [HttpGet("{id}")]
        public async Task<ActionResult<Farm>> GetFarmById(int id)
        {
            try
            {
                var farm = await _context.Farms.FindAsync(id);
                if (farm == null)
                {
                    return NotFound(new { Message = $"Farm with ID {id} not found." });
                }
                return Ok(farm);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error retrieving farm by ID.", Error = ex.Message });
            }
        }
        #endregion

        #region AddFarm
        [HttpPost]
        public async Task<ActionResult<Farm>> AddFarm(Farm f)
        {
            try
            {
                f.CreatedAt = DateTime.UtcNow;
                f.UpdatedAt = DateTime.UtcNow;

                await _context.Farms.AddAsync(f);
                await _context.SaveChangesAsync();

                return Ok(f);
                // return CreatedAtAction(nameof(GetFarmById), new { id = f.FarmId }, f);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error adding farm.", Error = ex.Message });
            }
        }
        #endregion

        #region UpdateFarm
        [HttpPut("{id}")]
        public async Task<ActionResult<Farm>> UpdateFarm(int id, Farm f)
        {
            try
            {
                if (id != f.FarmId)
                {
                    return BadRequest(new { Message = "Farm ID mismatch." });
                }

                var existingFarm = await _context.Farms.FindAsync(id);
                if (existingFarm == null)
                {
                    return NotFound(new { Message = $"Farm with ID {id} not found." });
                }

                // Update allowed fields
                existingFarm.FarmName = f.FarmName;
                existingFarm.Location = f.Location;
                existingFarm.Latitude = f.Latitude;
                existingFarm.Longitude = f.Longitude;
                existingFarm.TotalAcres = f.TotalAcres;
                existingFarm.UserId = f.UserId;
                existingFarm.IsActive = f.IsActive;
                existingFarm.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(existingFarm);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error updating farm.", Error = ex.Message });
            }
        }
        #endregion

        #region DeleteFarm
        [HttpDelete("{id}")]
        public async Task<ActionResult<Farm>> DeleteFarm(int id)
        {
            try
            {
                var farm = await _context.Farms.FindAsync(id);
                if (farm == null)
                {
                    return NotFound(new { Message = $"Farm with ID {id} not found." });
                }

                _context.Farms.Remove(farm);
                await _context.SaveChangesAsync();

                return Ok(farm);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error deleting farm.", Error = ex.Message });
            }
        }
        #endregion

        #region FarmDropdown
        [HttpGet("dropdown")]
        public async Task<ActionResult<IEnumerable<object>>> GetFarmDropdown()
        {
            try
            {
                var farms = await _context.Farms
                    .Where(f => f.IsActive)
                    .Select(f => new
                    {
                        f.FarmId,
                        f.FarmName
                    })
                    .ToListAsync();

                return Ok(farms);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Error fetching farm dropdown data.",
                    Error = ex.Message
                });
            }
        }
        #endregion

        #region FilterFarms
        [HttpGet("filter")]
        public async Task<ActionResult<List<Farm>>> FilterFarms(
            [FromQuery] string? name,
            [FromQuery] string? location,
            [FromQuery] decimal? minLatitude,
            [FromQuery] decimal? maxLatitude,
            [FromQuery] decimal? minLongitude,
            [FromQuery] decimal? maxLongitude,
            [FromQuery] decimal? minAcres,
            [FromQuery] decimal? maxAcres,
            [FromQuery] int? userId)
        {
            try
            {
                var query = _context.Farms.AsQueryable();

                if (!string.IsNullOrWhiteSpace(name))
                    query = query.Where(f => f.FarmName.ToLower().Contains(name.ToLower()));

                if (!string.IsNullOrWhiteSpace(location))
                    query = query.Where(f => f.Location.ToLower().Contains(location.ToLower()));

                if (minLatitude.HasValue)
                    query = query.Where(f => f.Latitude >= minLatitude.Value);

                if (maxLatitude.HasValue)
                    query = query.Where(f => f.Latitude <= maxLatitude.Value);

                if (minLongitude.HasValue)
                    query = query.Where(f => f.Longitude >= minLongitude.Value);

                if (maxLongitude.HasValue)
                    query = query.Where(f => f.Longitude <= maxLongitude.Value);

                if (minAcres.HasValue)
                    query = query.Where(f => f.TotalAcres >= minAcres.Value);

                if (maxAcres.HasValue)
                    query = query.Where(f => f.TotalAcres <= maxAcres.Value);

                if (userId.HasValue)
                    query = query.Where(f => f.UserId == userId.Value);

                // Optional: filter only active farms
                query = query.Where(f => f.IsActive);

                var result = await query
                    .OrderBy(f => f.FarmName)
                    .ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "An error occurred while filtering farms.",
                    Error = ex.Message
                });
            }
        }
        #endregion

    }
}
