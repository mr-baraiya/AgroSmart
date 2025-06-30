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
            var fields = await _context.Fields.ToListAsync();
            return Ok(fields);
        }
        #endregion

        #region GetFieldById
        [HttpGet("{id}")]
        public async Task<ActionResult<Field>> GetFieldById(int id)
        {
            var field = await _context.Fields.FindAsync(id);
            if (field == null)
            {
                return NotFound();
            }
            return Ok(field);
        }
        #endregion

        #region GetFieldsByFarmId
        [HttpGet("ByFarm/{farmId}")]
        public async Task<ActionResult<List<Field>>> GetFieldsByFarmId(int farmId)
        {
            var fields = await _context.Fields
                .Where(f => f.FarmId == farmId)
                .ToListAsync();

            return Ok(fields);
        }
        #endregion

        #region AddField
        [HttpPost]
        public async Task<ActionResult<Field>> AddField(Field field)
        {
            field.CreatedAt = DateTime.UtcNow;
            field.UpdatedAt = DateTime.UtcNow;

            await _context.Fields.AddAsync(field);
            await _context.SaveChangesAsync();

            return Ok(field);
        }
        #endregion

        #region UpdateField
        [HttpPut("{id}")]
        public async Task<ActionResult<Field>> UpdateField(int id, Field updatedField)
        {
            if (id != updatedField.FieldId)
            {
                return BadRequest("Field ID mismatch");
            }

            var existingField = await _context.Fields.FindAsync(id);
            if (existingField == null)
            {
                return NotFound();
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
        #endregion

        #region DeleteField
        [HttpDelete("{id}")]
        public async Task<ActionResult<Field>> DeleteField(int id)
        {
            var field = await _context.Fields.FindAsync(id);
            if (field == null)
            {
                return NotFound();
            }

            _context.Fields.Remove(field);
            await _context.SaveChangesAsync();

            return Ok(field);
        }
        #endregion

    }
}
