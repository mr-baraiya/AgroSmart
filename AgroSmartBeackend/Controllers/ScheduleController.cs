using AgroSmartBeackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgroSmartBeackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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
            try
            {
                var data = await _context.Schedules.ToListAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching schedules", Error = ex.Message });
            }
        }
        #endregion

        #region GetScheduleById
        [HttpGet("{id}")]
        public async Task<ActionResult<Schedule>> GetScheduleById(int id)
        {
            try
            {
                var schedule = await _context.Schedules.FindAsync(id);
                if (schedule == null)
                    return NotFound(new { Message = $"Schedule with ID {id} not found." });

                return Ok(schedule);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching schedule", Error = ex.Message });
            }
        }
        #endregion

        #region AddSchedule
        [HttpPost]
        public async Task<ActionResult<Schedule>> AddSchedule(Schedule s)
        {
            try
            {
                s.CreatedAt = DateTime.UtcNow;
                s.UpdatedAt = DateTime.UtcNow;

                await _context.Schedules.AddAsync(s);
                await _context.SaveChangesAsync();
                return Ok(s);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error adding schedule", Error = ex.Message });
            }
        }
        #endregion

        #region UpdateSchedule
        [HttpPut("{id}")]
        public async Task<ActionResult<Schedule>> UpdateSchedule(int id, Schedule s)
        {
            if (id != s.ScheduleId)
                return BadRequest(new { Message = "Schedule ID mismatch" });

            try
            {
                var existing = await _context.Schedules.FindAsync(id);
                if (existing == null)
                    return NotFound(new { Message = $"Schedule with ID {id} not found." });

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
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error updating schedule", Error = ex.Message });
            }
        }
        #endregion

        #region DeleteSchedule
        [HttpDelete("{id}")]
        public async Task<ActionResult<Schedule>> DeleteSchedule(int id)
        {
            try
            {
                var s = await _context.Schedules.FindAsync(id);
                if (s == null)
                    return NotFound(new { Message = $"Schedule with ID {id} not found." });

                _context.Schedules.Remove(s);
                await _context.SaveChangesAsync();
                return Ok(s);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error deleting schedule", Error = ex.Message });
            }
        }
        #endregion

        #region ScheduleFilter
        [HttpGet("Filter")]
        public async Task<ActionResult<List<Schedule>>> ScheduleFilter(
            [FromQuery] int? fieldId,
            [FromQuery] string? type,
            [FromQuery] string? title,
            [FromQuery] string? priority,
            [FromQuery] string? status,
            [FromQuery] bool? isCompleted,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate)
        {
            try
            {
                var query = _context.Schedules.AsQueryable();

                if (fieldId.HasValue)
                    query = query.Where(s => s.FieldId == fieldId.Value);

                if (!string.IsNullOrWhiteSpace(type))
                    query = query.Where(s => s.ScheduleType.ToLower().Contains(type.ToLower()));

                if (!string.IsNullOrWhiteSpace(title))
                    query = query.Where(s => s.Title.ToLower().Contains(title.ToLower()));

                if (!string.IsNullOrWhiteSpace(priority))
                    query = query.Where(s => s.Priority.ToLower().Contains(priority.ToLower()));

                if (!string.IsNullOrWhiteSpace(status))
                    query = query.Where(s => s.Status.ToLower().Contains(status.ToLower()));

                if (isCompleted.HasValue)
                    query = query.Where(s => s.IsCompleted == isCompleted.Value);

                if (startDate.HasValue)
                    query = query.Where(s => s.ScheduledDate >= startDate.Value);

                if (endDate.HasValue)
                    query = query.Where(s => s.ScheduledDate <= endDate.Value);

                var result = await query
                    .OrderByDescending(s => s.ScheduledDate)
                    .ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error filtering schedules", Error = ex.Message });
            }
        }
        #endregion

        #region MarkScheduleAsCompleted
        [HttpPut("{id}/complete")]
        public async Task<ActionResult> MarkScheduleAsCompleted(int id, [FromQuery] bool isCompleted = true)
        {
            try
            {
                var schedule = await _context.Schedules.FindAsync(id);
                if (schedule == null)
                    return NotFound(new { Message = $"Schedule with ID {id} not found." });

                schedule.IsCompleted = isCompleted;
                schedule.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = $"Schedule {(isCompleted ? "marked as completed" : "marked as not completed")} successfully.",
                    Schedule = schedule
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error updating schedule completion status", Error = ex.Message });
            }
        }
        #endregion

    }
}
