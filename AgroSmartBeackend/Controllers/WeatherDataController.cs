using AgroSmartBeackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgroSmartBeackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeatherDataController : ControllerBase
    {
        private readonly AgroSmartContext _context;

        #region Constructor
        public WeatherDataController(AgroSmartContext context)
        {
            _context = context;
        }
        #endregion

        #region GetAllWeatherData
        [HttpGet("All")]
        public async Task<ActionResult<List<WeatherDatum>>> GetAllWeatherData()
        {
            var data = await _context.WeatherData.ToListAsync();
            return Ok(data);
        }
        #endregion

        #region GetWeatherById
        [HttpGet("{id}")]
        public async Task<ActionResult<WeatherDatum>> GetWeatherById(long id)
        {
            var data = await _context.WeatherData.FindAsync(id);
            if (data == null)
                return NotFound();

            return Ok(data);
        }
        #endregion

        #region GetWeatherByLocation
        [HttpGet("ByLocation/{location}")]
        public async Task<ActionResult<List<WeatherDatum>>> GetWeatherByLocation(string location)
        {
            var data = await _context.WeatherData
                .Where(w => w.Location.ToLower().Contains(location.ToLower()))
                .OrderByDescending(w => w.ForecastDate)
                .ToListAsync();

            return Ok(data);
        }
        #endregion

        #region GetWeatherByDate
        [HttpGet("ByDate/{date}")]
        public async Task<ActionResult<List<WeatherDatum>>> GetWeatherByDate(string date)
        {
            if (!DateTime.TryParse(date, out DateTime parsedDate))
            {
                return BadRequest("Invalid date format. Use YYYY-MM-DD.");
            }

            var data = await _context.WeatherData
                .Where(w => w.ForecastDate.Date == parsedDate.Date)
                .ToListAsync();

            return Ok(data);
        }
        #endregion

        #region AddWeatherData
        [HttpPost]
        public async Task<ActionResult<WeatherDatum>> AddWeatherData(WeatherDatum weather)
        {
            weather.RetrievedAt = DateTime.UtcNow;
            await _context.WeatherData.AddAsync(weather);
            await _context.SaveChangesAsync();
            return Ok(weather);
        }
        #endregion

        #region UpdateWeatherData
        [HttpPut("{id}")]
        public async Task<ActionResult<WeatherDatum>> UpdateWeatherData(long id, WeatherDatum w)
        {
            if (id != w.WeatherId)
                return BadRequest("Weather ID mismatch");

            var existing = await _context.WeatherData.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.Location = w.Location;
            existing.Latitude = w.Latitude;
            existing.Longitude = w.Longitude;
            existing.Temperature = w.Temperature;
            existing.Humidity = w.Humidity;
            existing.Pressure = w.Pressure;
            existing.WindSpeed = w.WindSpeed;
            existing.WeatherDescription = w.WeatherDescription;
            existing.ForecastDate = w.ForecastDate;
            existing.DataType = w.DataType;
            existing.RetrievedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }
        #endregion

        #region DeleteWeatherData
        [HttpDelete("{id}")]
        public async Task<ActionResult<WeatherDatum>> DeleteWeatherData(long id)
        {
            var data = await _context.WeatherData.FindAsync(id);
            if (data == null)
                return NotFound();

            _context.WeatherData.Remove(data);
            await _context.SaveChangesAsync();
            return Ok(data);
        }
        #endregion

    }
}
