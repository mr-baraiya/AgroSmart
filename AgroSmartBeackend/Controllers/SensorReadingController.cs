using AgroSmartBeackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgroSmartBeackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SensorReadingController : ControllerBase
    {
        private readonly AgroSmartContext _context;

        #region Constructor
        public SensorReadingController(AgroSmartContext context)
        {
            _context = context;
        }
        #endregion

        #region GetAllSensorReadings
        [HttpGet("All")]
        public async Task<ActionResult<List<SensorReading>>> GetAllSensorReadings()
        {
            try
            {
                var readings = await _context.SensorReadings.ToListAsync();
                return Ok(readings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching sensor readings", Error = ex.Message });
            }
        }
        #endregion

        #region GetReadingById
        [HttpGet("{id}")]
        public async Task<ActionResult<SensorReading>> GetReadingById(long id)
        {
            try
            {
                var reading = await _context.SensorReadings.FindAsync(id);
                if (reading == null)
                    return NotFound(new { Message = $"Reading with ID {id} not found." });

                return Ok(reading);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching reading", Error = ex.Message });
            }
        }
        #endregion

        #region AddSensorReading
        [HttpPost]
        public async Task<ActionResult<SensorReading>> AddSensorReading(SensorReading r)
        {
            try
            {
                await _context.SensorReadings.AddAsync(r);
                await _context.SaveChangesAsync();
                return Ok(r);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error adding reading", Error = ex.Message });
            }
        }
        #endregion

        #region UpdateSensorReading
        [HttpPut("{id}")]
        public async Task<ActionResult<SensorReading>> UpdateSensorReading(long id, SensorReading r)
        {
            if (id != r.ReadingId)
                return BadRequest(new { Message = "Reading ID mismatch" });

            try
            {
                var existing = await _context.SensorReadings.FindAsync(id);
                if (existing == null)
                    return NotFound(new { Message = $"Reading with ID {id} not found." });

                existing.SensorId = r.SensorId;
                existing.Value = r.Value;
                existing.Unit = r.Unit;
                existing.QualityScore = r.QualityScore;
                existing.ReadingTime = r.ReadingTime;

                await _context.SaveChangesAsync();
                return Ok(existing);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error updating reading", Error = ex.Message });
            }
        }
        #endregion

        #region DeleteSensorReading
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSensorReading(long id)
        {
            try
            {
                var reading = await _context.SensorReadings.FindAsync(id);
                if (reading == null)
                    return NotFound(new { Message = $"Reading with ID {id} not found." });

                _context.SensorReadings.Remove(reading);
                await _context.SaveChangesAsync();
                return Ok(reading);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error deleting reading", Error = ex.Message });
            }
        }
        #endregion

        #region FilterSensorReadings
        [HttpGet("Filter")]
        public async Task<ActionResult<List<SensorReading>>> FilterSensorReadings(
            [FromQuery] int? sensorId,
            [FromQuery] string? unit,
            [FromQuery] decimal? minValue,
            [FromQuery] decimal? maxValue,
            [FromQuery] decimal? minQuality,
            [FromQuery] decimal? maxQuality,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate)
        {
            try
            {
                var query = _context.SensorReadings.AsQueryable();

                if (sensorId.HasValue)
                    query = query.Where(r => r.SensorId == sensorId.Value);

                if (!string.IsNullOrWhiteSpace(unit))
                    query = query.Where(r => r.Unit != null && r.Unit.ToLower().Contains(unit.ToLower()));

                if (minValue.HasValue)
                    query = query.Where(r => r.Value >= minValue.Value);

                if (maxValue.HasValue)
                    query = query.Where(r => r.Value <= maxValue.Value);

                if (minQuality.HasValue)
                    query = query.Where(r => r.QualityScore >= minQuality.Value);

                if (maxQuality.HasValue)
                    query = query.Where(r => r.QualityScore <= maxQuality.Value);

                if (startDate.HasValue)
                    query = query.Where(r => r.ReadingTime >= startDate.Value);

                if (endDate.HasValue)
                    query = query.Where(r => r.ReadingTime <= endDate.Value);

                var result = await query.OrderByDescending(r => r.ReadingTime).ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error filtering sensor readings", Error = ex.Message });
            }
        }
        #endregion

    }
}
