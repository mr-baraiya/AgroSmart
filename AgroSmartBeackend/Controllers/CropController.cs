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
    public class CropController : ControllerBase
    {
        private readonly AgroSmartContext _context;

        #region Constructor
        public CropController(AgroSmartContext context)
        {
            _context = context;
        }
        #endregion

        #region GetAllCrops
        [HttpGet("All")]
        public async Task<ActionResult<List<Crop>>> GetAllCrops()
        {
            try
            {
                var crops = await _context.Crops.ToListAsync();
                return Ok(crops);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error retrieving crops.", Error = ex.Message });
            }
        }
        #endregion

        #region GetCropById
        [HttpGet("{id}")]
        public async Task<ActionResult<Crop>> GetCropById(int id)
        {
            try
            {
                var crop = await _context.Crops.FindAsync(id);
                if (crop == null)
                {
                    return NotFound(new { Message = $"Crop with ID {id} not found." });
                }
                return Ok(crop);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error retrieving crop by ID.", Error = ex.Message });
            }
        }
        #endregion

        #region AddCrop
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Crop>> AddCrop(Crop crop)
        {
            try
            {
                crop.CreatedAt = DateTime.UtcNow;
                crop.UpdatedAt = DateTime.UtcNow;

                await _context.Crops.AddAsync(crop);
                await _context.SaveChangesAsync();

                return Ok(crop);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error adding crop.", Error = ex.Message });
            }
        }
        #endregion

        #region UpdateCrop
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Crop>> UpdateCrop(int id, Crop updatedCrop)
        {
            try
            {
                if (id != updatedCrop.CropId)
                {
                    return BadRequest(new { Message = "Crop ID mismatch." });
                }

                var existingCrop = await _context.Crops.FindAsync(id);
                if (existingCrop == null)
                {
                    return NotFound(new { Message = $"Crop with ID {id} not found." });
                }

                // Update fields
                existingCrop.CropName = updatedCrop.CropName;
                existingCrop.OptimalSoilpHmin = updatedCrop.OptimalSoilpHmin;
                existingCrop.OptimalSoilpHmax = updatedCrop.OptimalSoilpHmax;
                existingCrop.OptimalTempMin = updatedCrop.OptimalTempMin;
                existingCrop.OptimalTempMax = updatedCrop.OptimalTempMax;
                existingCrop.AvgWaterReqmm = updatedCrop.AvgWaterReqmm;
                existingCrop.GrowthDurationDays = updatedCrop.GrowthDurationDays;
                existingCrop.SeedingDepthCm = updatedCrop.SeedingDepthCm;
                existingCrop.HarvestSeason = updatedCrop.HarvestSeason;
                existingCrop.Description = updatedCrop.Description;
                existingCrop.IsActive = updatedCrop.IsActive;
                existingCrop.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(existingCrop);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error updating crop.", Error = ex.Message });
            }
        }
        #endregion

        #region DeleteCrop
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Crop>> DeleteCrop(int id)
        {
            try
            {
                var crop = await _context.Crops.FindAsync(id);
                if (crop == null)
                {
                    return NotFound(new { Message = $"Crop with ID {id} not found." });
                }

                _context.Crops.Remove(crop);
                await _context.SaveChangesAsync();

                return Ok(crop);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error deleting crop.", Error = ex.Message });
            }
        }
        #endregion

        #region CropDropdown
        [HttpGet("dropdown")]
        public async Task<ActionResult<IEnumerable<object>>> GetCropDropdown()
        {
            try
            {
                var crops = await _context.Crops
                    .Where(c => c.IsActive)
                    .Select(c => new
                    {
                        c.CropId,
                        c.CropName
                    })
                    .ToListAsync();

                return Ok(crops);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching crop dropdown data.", Error = ex.Message });
            }
        }
        #endregion

        #region FilterCrops
        [HttpGet("Filter")]
        public async Task<ActionResult<List<Crop>>> FilterCrops(
            [FromQuery] string? name,
            [FromQuery] string? harvestSeason,
            [FromQuery] decimal? minPH,
            [FromQuery] decimal? maxPH,
            [FromQuery] decimal? minTemp,
            [FromQuery] decimal? maxTemp,
            [FromQuery] decimal? minWater,
            [FromQuery] decimal? maxWater,
            [FromQuery] int? minDays,
            [FromQuery] int? maxDays,
            [FromQuery] decimal? minDepth,
            [FromQuery] decimal? maxDepth)
        {
            try
            {
                var query = _context.Crops.AsQueryable();

                if (!string.IsNullOrWhiteSpace(name))
                    query = query.Where(c => c.CropName.ToLower().Contains(name.ToLower()));

                if (!string.IsNullOrWhiteSpace(harvestSeason))
                    query = query.Where(c => c.HarvestSeason != null && c.HarvestSeason.ToLower().Contains(harvestSeason.ToLower()));

                if (minPH.HasValue)
                    query = query.Where(c => c.OptimalSoilpHmin >= minPH.Value);

                if (maxPH.HasValue)
                    query = query.Where(c => c.OptimalSoilpHmax <= maxPH.Value);

                if (minTemp.HasValue)
                    query = query.Where(c => c.OptimalTempMin >= minTemp.Value);

                if (maxTemp.HasValue)
                    query = query.Where(c => c.OptimalTempMax <= maxTemp.Value);

                if (minWater.HasValue)
                    query = query.Where(c => c.AvgWaterReqmm >= minWater.Value);

                if (maxWater.HasValue)
                    query = query.Where(c => c.AvgWaterReqmm <= maxWater.Value);

                if (minDays.HasValue)
                    query = query.Where(c => c.GrowthDurationDays >= minDays.Value);

                if (maxDays.HasValue)
                    query = query.Where(c => c.GrowthDurationDays <= maxDays.Value);

                if (minDepth.HasValue)
                    query = query.Where(c => c.SeedingDepthCm >= minDepth.Value);

                if (maxDepth.HasValue)
                    query = query.Where(c => c.SeedingDepthCm <= maxDepth.Value);

                query = query.Where(c => c.IsActive);

                var result = await query
                    .OrderBy(c => c.CropName)
                    .ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log the exception details (you can use a logger here)
                return StatusCode(500, new
                {
                    Message = "An error occurred while filtering crops.",
                    Error = ex.Message
                });
            }
        }
        #endregion

    }
}
