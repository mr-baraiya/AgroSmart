using AgroSmartBeackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgroSmartBeackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
            var crops = await _context.FieldWiseCrops.ToListAsync();
            return Ok(crops);
        }
        #endregion

        #region GetFieldWiseCropById
        [HttpGet("{id}")]
        public async Task<ActionResult<FieldWiseCrop>> GetFieldWiseCropById(int id)
        {
            var record = await _context.FieldWiseCrops.FindAsync(id);
            if (record == null)
                return NotFound();

            return Ok(record);
        }
        #endregion

        #region GetFieldWiseCropsByFieldId
        [HttpGet("ByField/{fieldId}")]
        public async Task<ActionResult<List<FieldWiseCrop>>> GetFieldWiseCropsByFieldId(int fieldId)
        {
            var records = await _context.FieldWiseCrops
                .Where(f => f.FieldId == fieldId)
                .ToListAsync();

            return Ok(records);
        }
        #endregion

        #region GetFieldWiseCropsByCropId
        [HttpGet("ByCrop/{cropId}")]
        public async Task<ActionResult<List<FieldWiseCrop>>> GetFieldWiseCropsByCropId(int cropId)
        {
            var records = await _context.FieldWiseCrops
                .Where(f => f.CropId == cropId)
                .ToListAsync();

            return Ok(records);
        }
        #endregion

        #region AddFieldWiseCrop
        [HttpPost]
        public async Task<ActionResult<FieldWiseCrop>> AddFieldWiseCrop(FieldWiseCrop fwc)
        {
            fwc.CreatedAt = DateTime.UtcNow;
            fwc.UpdatedAt = DateTime.UtcNow;

            await _context.FieldWiseCrops.AddAsync(fwc);
            await _context.SaveChangesAsync();

            return Ok(fwc);
        }
        #endregion

        #region UpdateFieldWiseCrop
        [HttpPut("{id}")]
        public async Task<ActionResult<FieldWiseCrop>> UpdateFieldWiseCrop(int id, FieldWiseCrop fwc)
        {
            if (id != fwc.FieldWiseCropId)
            {
                return BadRequest("Field Wise Crop ID mismatch");
            }

            var existing = await _context.FieldWiseCrops.FindAsync(id);
            if (existing == null)
            {
                return NotFound();
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
        #endregion

        #region DeleteFieldWiseCrop
        [HttpDelete("{id}")]
        public async Task<ActionResult<FieldWiseCrop>> DeleteFieldWiseCrop(int id)
        {
            var fwc = await _context.FieldWiseCrops.FindAsync(id);
            if (fwc == null)
                return NotFound();

            _context.FieldWiseCrops.Remove(fwc);
            await _context.SaveChangesAsync();

            return Ok(fwc);
        }
        #endregion

    }
}
