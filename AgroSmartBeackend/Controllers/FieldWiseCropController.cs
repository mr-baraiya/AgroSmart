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
    public class FieldWiseCropController : ControllerBase
    {
        private readonly AgroSmartContext _context;

        #region Constructor
        public FieldWiseCropController(AgroSmartContext context)
        {
            _context = context;
        }
        #endregion

        #region GetAllFieldWiseCrops
        [HttpGet("All")]
        public async Task<ActionResult<List<FieldWiseCrop>>> GetAllFieldWiseCrops()
        {
            try
            {
                var crops = await _context.FieldWiseCrops.ToListAsync();
                return Ok(crops);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error retrieving FieldWiseCrops.", Error = ex.Message });
            }
        }
        #endregion

        #region GetFieldWiseCropById
        [HttpGet("{id}")]
        public async Task<ActionResult<FieldWiseCrop>> GetFieldWiseCropById(int id)
        {
            try
            {
                var record = await _context.FieldWiseCrops.FindAsync(id);
                if (record == null)
                    return NotFound(new { Message = $"FieldWiseCrop with ID {id} not found." });

                return Ok(record);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error retrieving FieldWiseCrop by ID.", Error = ex.Message });
            }
        }
        #endregion

        #region AddFieldWiseCrop
        [HttpPost]
        public async Task<ActionResult<FieldWiseCrop>> AddFieldWiseCrop(FieldWiseCrop fwc)
        {
            try
            {
                fwc.CreatedAt = DateTime.UtcNow;
                fwc.UpdatedAt = DateTime.UtcNow;

                await _context.FieldWiseCrops.AddAsync(fwc);
                await _context.SaveChangesAsync();

                return Ok(fwc);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error adding FieldWiseCrop.", Error = ex.Message });
            }
        }
        #endregion

        #region UpdateFieldWiseCrop
        [HttpPut("{id}")]
        public async Task<ActionResult<FieldWiseCrop>> UpdateFieldWiseCrop(int id, FieldWiseCrop fwc)
        {
            try
            {
                if (id != fwc.FieldWiseCropId)
                {
                    return BadRequest(new { Message = "FieldWiseCrop ID mismatch." });
                }

                var existing = await _context.FieldWiseCrops.FindAsync(id);
                if (existing == null)
                {
                    return NotFound(new { Message = $"FieldWiseCrop with ID {id} not found." });
                }

                existing.FieldId = fwc.FieldId;
                existing.CropId = fwc.CropId;
                existing.PlantedDate = fwc.PlantedDate;
                existing.ExpectedHarvestDate = fwc.ExpectedHarvestDate;
                existing.ActualHarvestDate = fwc.ActualHarvestDate;
                existing.CurrentGrowthStage = fwc.CurrentGrowthStage;
                existing.PlantedArea = fwc.PlantedArea;
                existing.Status = fwc.Status;
                existing.Notes = fwc.Notes;
                existing.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(existing);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error updating FieldWiseCrop.", Error = ex.Message });
            }
        }
        #endregion

        #region DeleteFieldWiseCrop
        [HttpDelete("{id}")]
        public async Task<ActionResult<FieldWiseCrop>> DeleteFieldWiseCrop(int id)
        {
            try
            {
                var fwc = await _context.FieldWiseCrops.FindAsync(id);
                if (fwc == null)
                    return NotFound(new { Message = $"FieldWiseCrop with ID {id} not found." });

                _context.FieldWiseCrops.Remove(fwc);
                await _context.SaveChangesAsync();

                return Ok(fwc);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error deleting FieldWiseCrop.", Error = ex.Message });
            }
        }
        #endregion

        #region FilterFieldWiseCrops
        [HttpGet("filter")]
        public async Task<ActionResult<List<FieldWiseCrop>>> FilterFieldWiseCrops(
            [FromQuery] int? fieldId,
            [FromQuery] int? cropId,
            [FromQuery] string? status,
            [FromQuery] string? growthStage,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate)
        {
            try
            {
                var query = _context.FieldWiseCrops.AsQueryable();

                if (fieldId.HasValue)
                    query = query.Where(f => f.FieldId == fieldId.Value);

                if (cropId.HasValue)
                    query = query.Where(f => f.CropId == cropId.Value);

                if (!string.IsNullOrWhiteSpace(status))
                    query = query.Where(f => f.Status.ToLower().Contains(status.ToLower()));

                if (!string.IsNullOrWhiteSpace(growthStage))
                    query = query.Where(f => f.CurrentGrowthStage != null && f.CurrentGrowthStage.ToLower().Contains(growthStage.ToLower()));

                // Convert DateTime to DateOnly if provided
                if (startDate.HasValue)
                {
                    var start = DateOnly.FromDateTime(startDate.Value);
                    query = query.Where(f => f.PlantedDate >= start);
                }

                if (endDate.HasValue)
                {
                    var end = DateOnly.FromDateTime(endDate.Value);
                    query = query.Where(f => f.PlantedDate <= end);
                }

                var result = await query
                    .OrderByDescending(f => f.PlantedDate)
                    .ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Error filtering FieldWiseCrops.",
                    Error = ex.Message
                });
            }
        }
        #endregion

    }
}
