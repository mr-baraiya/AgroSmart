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
            var data = await _context.Sensors.ToListAsync();
            return Ok(data);
        }
        #endregion

        #region GetSensorById
        [HttpGet("{id}")]
        public async Task<ActionResult<Sensor>> GetSensorById(int id)
        {
            var sensor = await _context.Sensors.FindAsync(id);
            if (sensor == null)
            {
                return NotFound();
            }
            return Ok(sensor);
        }
        #endregion

        #region GetSensorsByFieldId
        [HttpGet("ByField/{fieldId}")]
        public async Task<ActionResult<List<Sensor>>> GetSensorsByFieldId(int fieldId)
        {
            var sensors = await _context.Sensors
                .Where(s => s.FieldId == fieldId)
                .ToListAsync();
            return Ok(sensors);
        }
        #endregion

        #region AddSensor
        [HttpPost]
        public async Task<ActionResult<Sensor>> AddSensor(Sensor sensor)
        {
            sensor.CreatedAt = DateTime.UtcNow;

            await _context.Sensors.AddAsync(sensor);
            await _context.SaveChangesAsync();
            return Ok(sensor);
        }
        #endregion

        #region UpdateSensor
        [HttpPut("{id}")]
        public async Task<ActionResult<Sensor>> UpdateSensor(int id, Sensor sensor)
        {
            if (id != sensor.SensorId)
                return BadRequest("Sensor ID mismatch");

            var existing = await _context.Sensors.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.SensorType = sensor.SensorType;
            existing.Manufacturer = sensor.Manufacturer;
            existing.Model = sensor.Model;
            existing.SerialNumber = sensor.SerialNumber;
            existing.FieldId = sensor.FieldId;
            existing.InstallationDate = sensor.InstallationDate;
            existing.LastCalibrated = sensor.LastCalibrated;
            existing.CalibrationInterval = sensor.CalibrationInterval;
            existing.LatestValue = sensor.LatestValue;
            existing.LatestUnit = sensor.LatestUnit;
            existing.LatestQualityScore = sensor.LatestQualityScore;
            existing.LastReadingTime = sensor.LastReadingTime;
            existing.IsActive = sensor.IsActive;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }
        #endregion

        #region DeleteSensor
        [HttpDelete("{id}")]
        public async Task<ActionResult<Sensor>> DeleteSensor(int id)
        {
            var sensor = await _context.Sensors.FindAsync(id);
            if (sensor == null)
                return NotFound();

            _context.Sensors.Remove(sensor);
            await _context.SaveChangesAsync();
            return Ok(sensor);
        }
        #endregion

    }
}
