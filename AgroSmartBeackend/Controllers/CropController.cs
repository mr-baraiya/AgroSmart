using AgroSmartBeackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgroSmartBeackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
            var crops = await _context.Crops.ToListAsync();
            return Ok(crops);
        }
        #endregion

        #region GetCropById
        [HttpGet("{id}")]
        public async Task<ActionResult<Crop>> GetCropById(int id)
        {
            var crop = await _context.Crops.FindAsync(id);
            if (crop == null)
            {
                return NotFound();
            }
            return Ok(crop);
        }
        #endregion

        #region AddCrop
        [HttpPost]
        public async Task<ActionResult<Crop>> AddCrop(Crop crop)
        {
            crop.CreatedAt = DateTime.UtcNow;
            crop.UpdatedAt = DateTime.UtcNow;

            await _context.Crops.AddAsync(crop);
            await _context.SaveChangesAsync();
            return Ok(crop);
        }
        #endregion

        #region UpdateCrop
        [HttpPut("{id}")]
        public async Task<ActionResult<Crop>> UpdateCrop(int id, Crop updatedCrop)
        {
            if (id != updatedCrop.CropId)
            {
                return BadRequest("Crop ID mismatch");
            }

            var existingCrop = await _context.Crops.FindAsync(id);
            if (existingCrop == null)
            {
                return NotFound();
            }

            // Update allowed fields
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
        #endregion

        #region DeleteCrop
        [HttpDelete("{id}")]
        public async Task<ActionResult<Crop>> DeleteCrop(int id)
        {
            var crop = await _context.Crops.FindAsync(id);
            if (crop == null)
            {
                return NotFound();
            }

            _context.Crops.Remove(crop);
            await _context.SaveChangesAsync();

            return Ok(crop);
        }
        #endregion

    }
}
