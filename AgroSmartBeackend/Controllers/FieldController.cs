using AgroSmartBeackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgroSmartBeackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FieldController : ControllerBase
    {
        private readonly AgroSmartContext _context;

        #region Constructor
        public FieldController(AgroSmartContext context)
        {
            _context = context;
        }
        #endregion

        #region GetAllFields
        [HttpGet("All")]
        public async Task<ActionResult<List<Field>>> GetAllFields()
        {
            try
            {
                var fields = await _context.Fields.ToListAsync();
                return Ok(fields);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error retrieving fields.", Error = ex.Message });
            }
        }
        #endregion

        #region GetFieldById
        [HttpGet("{id}")]
        public async Task<ActionResult<Field>> GetFieldById(int id)
        {
            try
            {
                var field = await _context.Fields.FindAsync(id);
                if (field == null)
                {
                    return NotFound(new { Message = $"Field with ID {id} not found." });
                }
                return Ok(field);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error retrieving field by ID.", Error = ex.Message });
            }
        }
        #endregion

        #region AddField
        [HttpPost]
        public async Task<ActionResult<Field>> AddField(Field field)
        {
            try
            {
                field.CreatedAt = DateTime.UtcNow;
                field.UpdatedAt = DateTime.UtcNow;

                await _context.Fields.AddAsync(field);
                await _context.SaveChangesAsync();

                return Ok(field);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error adding field.", Error = ex.Message });
            }
        }
        #endregion

        #region UpdateField
        [HttpPut("{id}")]
        public async Task<ActionResult<Field>> UpdateField(int id, Field updatedField)
        {
            try
            {
                if (id != updatedField.FieldId)
                {
                    return BadRequest(new { Message = "Field ID mismatch." });
                }

                var existingField = await _context.Fields.FindAsync(id);
                if (existingField == null)
                {
                    return NotFound(new { Message = $"Field with ID {id} not found." });
                }

                existingField.FieldName = updatedField.FieldName;
                existingField.SizeAcres = updatedField.SizeAcres;
                existingField.SoilType = updatedField.SoilType;
                existingField.IrrigationType = updatedField.IrrigationType;
                existingField.FarmId = updatedField.FarmId;
                existingField.IsActive = updatedField.IsActive;
                existingField.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(existingField);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error updating field.", Error = ex.Message });
            }
        }
        #endregion

        #region DeleteField
        [HttpDelete("{id}")]
        public async Task<ActionResult<Field>> DeleteField(int id)
        {
            try
            {
                var field = await _context.Fields.FindAsync(id);
                if (field == null)
                {
                    return NotFound(new { Message = $"Field with ID {id} not found." });
                }

                _context.Fields.Remove(field);
                await _context.SaveChangesAsync();

                return Ok(field);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error deleting field.", Error = ex.Message });
            }
        }
        #endregion

        #region FieldDropdown
        [HttpGet("dropdown")]
        public async Task<ActionResult<IEnumerable<object>>> GetFieldDropdown()
        {
            try
            {
                var fields = await _context.Fields
                    .Where(f => f.IsActive)
                    .Select(f => new
                    {
                        f.FieldId,
                        f.FieldName
                    })
                    .ToListAsync();

                return Ok(fields);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Error fetching field dropdown data.",
                    Error = ex.Message
                });
            }
        }
        #endregion

        #region FilterFields
        [HttpGet("filter")]
        public async Task<ActionResult<List<Field>>> FilterFields(
            [FromQuery] string? name,
            [FromQuery] string? soilType,
            [FromQuery] string? irrigationType,
            [FromQuery] decimal? minSize,
            [FromQuery] decimal? maxSize,
            [FromQuery] int? farmId)
        {
            try
            {
                var query = _context.Fields.AsQueryable();

                if (!string.IsNullOrWhiteSpace(name))
                    query = query.Where(f => f.FieldName.ToLower().Contains(name.ToLower()));

                if (!string.IsNullOrWhiteSpace(soilType))
                    query = query.Where(f => f.SoilType != null && f.SoilType.ToLower().Contains(soilType.ToLower()));

                if (!string.IsNullOrWhiteSpace(irrigationType))
                    query = query.Where(f => f.IrrigationType != null && f.IrrigationType.ToLower().Contains(irrigationType.ToLower()));

                if (minSize.HasValue)
                    query = query.Where(f => f.SizeAcres >= minSize.Value);

                if (maxSize.HasValue)
                    query = query.Where(f => f.SizeAcres <= maxSize.Value);

                if (farmId.HasValue)
                    query = query.Where(f => f.FarmId == farmId.Value);

                query = query.Where(f => f.IsActive);

                var result = await query
                    .OrderBy(f => f.FieldName)
                    .ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Error filtering fields.",
                    Error = ex.Message
                });
            }
        }
        #endregion

    }
}
