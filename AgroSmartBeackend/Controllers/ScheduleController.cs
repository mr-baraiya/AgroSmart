using AgroSmartBeackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgroSmartBeackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly AgroSmartContext _context;

        #region Constructor
        public ScheduleController(AgroSmartContext context)
        {
            _context = context;
        }
        #endregion

        #region GetAllSchedules
        [HttpGet("All")]
        public async Task<ActionResult<List<Schedule>>> GetAllSchedules()
        {
            var data = await _context.Schedules.ToListAsync();
            return Ok(data);
        }
        #endregion

        #region GetScheduleById
        [HttpGet("{id}")]
        public async Task<ActionResult<Schedule>> GetScheduleById(int id)
        {
            var schedule = await _context.Schedules.FindAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }
            return Ok(schedule);
        }
        #endregion

        #region GetSchedulesByFieldId
        [HttpGet("ByField/{fieldId}")]
        public async Task<ActionResult<List<Schedule>>> GetSchedulesByFieldId(int fieldId)
        {
            var schedules = await _context.Schedules
                .Where(s => s.FieldId == fieldId)
                .ToListAsync();
            return Ok(schedules);
        }
        #endregion

        #region GetSchedulesByCreatedBy
        [HttpGet("ByCreatedBy/{userId}")]
        public async Task<ActionResult<List<Schedule>>> GetSchedulesByCreatedBy(int userId)
        {
            var schedules = await _context.Schedules
                .Where(s => s.CreatedBy == userId)
                .ToListAsync();

            return Ok(schedules);
        }
        #endregion

        #region AddSchedule
        [HttpPost]
        public async Task<ActionResult<Schedule>> AddSchedule(Schedule s)
        {
            s.CreatedAt = DateTime.UtcNow;
            s.UpdatedAt = DateTime.UtcNow;

            await _context.Schedules.AddAsync(s);
            await _context.SaveChangesAsync();
            return Ok(s);
        }
        #endregion

        #region UpdateSchedule
        [HttpPut("{id}")]
        public async Task<ActionResult<Schedule>> UpdateSchedule(int id, Schedule s)
        {
            if (id != s.ScheduleId)
            {
                return BadRequest("Schedule ID mismatch");
            }
                
            var existing = await _context.Schedules.FindAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            existing.FieldId = s.FieldId;
            existing.ScheduleType = s.ScheduleType;
            existing.Title = s.Title;
            existing.Description = s.Description;
            existing.ScheduledDate = s.ScheduledDate;
            existing.Duration = s.Duration;
            existing.EstimatedCost = s.EstimatedCost;
            existing.Priority = s.Priority;
            existing.Status = s.Status;
            existing.IsCompleted = s.IsCompleted;
            existing.CreatedBy = s.CreatedBy;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }
        #endregion

        #region DeleteSchedule
        [HttpDelete("{id}")]
        public async Task<ActionResult<Schedule>> DeleteSchedule(int id)
        {
            var s = await _context.Schedules.FindAsync(id);
            if (s == null)
                return NotFound();

            _context.Schedules.Remove(s);
            await _context.SaveChangesAsync();
            return Ok(s);
        }
        #endregion

    }
}
