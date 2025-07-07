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
            try
            {
                var data = await _context.WeatherData.ToListAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        #endregion

        #region GetWeatherById
        [HttpGet("{id}")]
        public async Task<ActionResult<WeatherDatum>> GetWeatherById(long id)
        {
            try
            {
                var data = await _context.WeatherData.FindAsync(id);
                if (data == null)
                    return NotFound();

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        #endregion

        #region AddWeatherData
        [HttpPost]
        public async Task<ActionResult<WeatherDatum>> AddWeatherData(WeatherDatum weather)
        {
            try
            {
                weather.RetrievedAt = DateTime.UtcNow;
                await _context.WeatherData.AddAsync(weather);
                await _context.SaveChangesAsync();
                return Ok(weather);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        #endregion

        #region UpdateWeatherData
        [HttpPut("{id}")]
        public async Task<ActionResult<WeatherDatum>> UpdateWeatherData(long id, WeatherDatum w)
        {
            if (id != w.WeatherId)
                return BadRequest("Weather ID mismatch");

            try
            {
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
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        #endregion

        #region DeleteWeatherData
        [HttpDelete("{id}")]
        public async Task<ActionResult<WeatherDatum>> DeleteWeatherData(long id)
        {
            try
            {
                var data = await _context.WeatherData.FindAsync(id);
                if (data == null)
                    return NotFound();

                _context.WeatherData.Remove(data);
                await _context.SaveChangesAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        #endregion

        #region GetTopTemperatures
        [HttpGet("TopTemperatures")]
        public async Task<ActionResult<IEnumerable<WeatherDatum>>> GetTopTemperatures()
        {
            try
            {
                var topRecords = await _context.WeatherData
                    .Where(w => w.Temperature != null)
                    .OrderByDescending(w => w.Temperature)
                    .Take(10)
                    .ToListAsync();

                return Ok(topRecords);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        #endregion

        #region FilterWeather
        [HttpGet("Filter")]
        public async Task<ActionResult<List<WeatherDatum>>> FilterWeather(
            [FromQuery] string? location,
            [FromQuery] string? date,
            [FromQuery] decimal? minTemp,
            [FromQuery] decimal? maxTemp,
            [FromQuery] decimal? minHumidity,
            [FromQuery] decimal? maxHumidity,
            [FromQuery] decimal? minPressure,
            [FromQuery] decimal? maxPressure,
            [FromQuery] decimal? minWind,
            [FromQuery] decimal? maxWind)
        {
            try
            {
                var query = _context.WeatherData.AsQueryable();

                if (!string.IsNullOrWhiteSpace(location))
                    query = query.Where(w => w.Location.ToLower().Contains(location.ToLower()));

                if (DateTime.TryParse(date, out DateTime parsedDate))
                    query = query.Where(w => w.ForecastDate.Date == parsedDate.Date);

                if (minTemp.HasValue)
                    query = query.Where(w => w.Temperature >= minTemp.Value);

                if (maxTemp.HasValue)
                    query = query.Where(w => w.Temperature <= maxTemp.Value);

                if (minHumidity.HasValue)
                    query = query.Where(w => w.Humidity >= minHumidity.Value);

                if (maxHumidity.HasValue)
                    query = query.Where(w => w.Humidity <= maxHumidity.Value);

                if (minPressure.HasValue)
                    query = query.Where(w => w.Pressure >= minPressure.Value);

                if (maxPressure.HasValue)
                    query = query.Where(w => w.Pressure <= maxPressure.Value);

                if (minWind.HasValue)
                    query = query.Where(w => w.WindSpeed >= minWind.Value);

                if (maxWind.HasValue)
                    query = query.Where(w => w.WindSpeed <= maxWind.Value);

                var result = await query.OrderByDescending(w => w.ForecastDate).ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        #endregion

    }
}
