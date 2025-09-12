using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AgroSmartBeackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() => Ok("OK");

        [HttpGet("/")]
        public IActionResult Home()
        {
            return Ok("Welcome to AgroSmart Backend 🚀");
        }

    }
}
