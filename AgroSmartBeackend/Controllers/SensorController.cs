using AgroSmartBeackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgroSmartBeackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SensorController : ControllerBase
    {
        private readonly AgroSmartContext _context;

        #region Constructor
        public SensorController(AgroSmartContext context)
        {
            _context = context;
        }
        #endregion

        #region GetAllSensors
        [HttpGet("All")]
        public async Task<ActionResult<List<Sensor>>> GetAllSensors()
        {
            try
            {
                var sensors = await _context.Sensors.ToListAsync();
                return Ok(sensors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching sensors", Error = ex.Message });
            }
        }
        #endregion

        #region GetSensorById
        [HttpGet("{id}")]
        public async Task<ActionResult<Sensor>> GetSensorById(int id)
        {
            try
            {
                var sensor = await _context.Sensors.FindAsync(id);
                if (sensor == null)
                    return NotFound(new { Message = $"Sensor with ID {id} not found." });

                return Ok(sensor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching sensor", Error = ex.Message });
            }
        }
        #endregion

        #region AddSensor
        [HttpPost]
        public async Task<ActionResult<Sensor>> AddSensor(Sensor s)
        {
            try
            {
                s.CreatedAt = DateTime.UtcNow;
                s.IsActive = true;

                await _context.Sensors.AddAsync(s);
                await _context.SaveChangesAsync();

                return Ok(s);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error adding sensor", Error = ex.Message });
            }
        }
        #endregion

        #region UpdateSensor
        [HttpPut("{id}")]
        public async Task<ActionResult<Sensor>> UpdateSensor(int id, Sensor s)
        {
            if (id != s.SensorId)
                return BadRequest(new { Message = "Sensor ID mismatch" });

            try
            {
                var existing = await _context.Sensors.FindAsync(id);
                if (existing == null)
                    return NotFound(new { Message = $"Sensor with ID {id} not found." });

                existing.SensorType = s.SensorType;
                existing.Manufacturer = s.Manufacturer;
                existing.Model = s.Model;
                existing.SerialNumber = s.SerialNumber;
                existing.FieldId = s.FieldId;
                existing.InstallationDate = s.InstallationDate;
                existing.LastCalibrated = s.LastCalibrated;
                existing.CalibrationInterval = s.CalibrationInterval;
                existing.LatestValue = s.LatestValue;
                existing.LatestUnit = s.LatestUnit;
                existing.LatestQualityScore = s.LatestQualityScore;
                existing.LastReadingTime = s.LastReadingTime;
                existing.IsActive = s.IsActive;

                await _context.SaveChangesAsync();
                return Ok(existing);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error updating sensor", Error = ex.Message });
            }
        }
        #endregion

        #region GetSensorDropdown
        [HttpGet("Dropdown")]
        public async Task<ActionResult<List<object>>> GetSensorDropdown()
        {
            try
            {
                var dropdown = await _context.Sensors
                    .Select(s => new
                    {
                        s.SensorId,
                        s.SensorType
                    })
                    .ToListAsync();

                return Ok(dropdown);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching sensor dropdown", Error = ex.Message });
            }
        }
        #endregion

        #region DeleteSensor
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSensor(int id)
        {
            try
            {
                var sensor = await _context.Sensors.FindAsync(id);
                if (sensor == null)
                    return NotFound(new { Message = $"Sensor with ID {id} not found." });

                _context.Sensors.Remove(sensor);
                await _context.SaveChangesAsync();

                return Ok(sensor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error deleting sensor", Error = ex.Message });
            }
        }
        #endregion

        #region FilterSensors
        [HttpGet("Filter")]
        public async Task<ActionResult<List<Sensor>>> FilterSensors(
            [FromQuery] string? sensorType,
            [FromQuery] string? model,
            [FromQuery] int? fieldId,
            [FromQuery] bool? isActive,
            [FromQuery] decimal? minValue,
            [FromQuery] decimal? maxValue,
            [FromQuery] decimal? minQuality,
            [FromQuery] decimal? maxQuality,
            [FromQuery] DateTime? installedAfter,
            [FromQuery] DateTime? calibratedBefore)
        {
            try
            {
                var query = _context.Sensors.AsQueryable();

                if (!string.IsNullOrWhiteSpace(sensorType))
                    query = query.Where(s => s.SensorType.ToLower().Contains(sensorType.ToLower()));

                if (!string.IsNullOrWhiteSpace(model))
                    query = query.Where(s => s.Model != null && s.Model.ToLower().Contains(model.ToLower()));

                if (fieldId.HasValue)
                    query = query.Where(s => s.FieldId == fieldId.Value);

                if (isActive.HasValue)
                    query = query.Where(s => s.IsActive == isActive.Value);

                if (minValue.HasValue)
                    query = query.Where(s => s.LatestValue >= minValue.Value);

                if (maxValue.HasValue)
                    query = query.Where(s => s.LatestValue <= maxValue.Value);

                if (minQuality.HasValue)
                    query = query.Where(s => s.LatestQualityScore >= minQuality.Value);

                if (maxQuality.HasValue)
                    query = query.Where(s => s.LatestQualityScore <= maxQuality.Value);

                if (installedAfter.HasValue)
                    query = query.Where(s => s.InstallationDate >= installedAfter.Value);

                if (calibratedBefore.HasValue)
                    query = query.Where(s => s.LastCalibrated <= calibratedBefore.Value);

                var result = await query.OrderByDescending(s => s.CreatedAt).ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error filtering sensors", Error = ex.Message });
            }
        }
        #endregion

    }
}
