using AgroSmartBeackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgroSmartBeackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SmartInsightController : ControllerBase
    {
        private readonly AgroSmartContext _context;

        #region Constructor
        public SmartInsightController(AgroSmartContext context)
        {
            _context = context;
        }
        #endregion

        #region GetAllInsights
        [HttpGet("All")]
        public async Task<ActionResult<List<SmartInsight>>> GetAllInsights()
        {
            try
            {
                var insights = await _context.SmartInsights.ToListAsync();
                return Ok(insights);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching insights", Error = ex.Message });
            }
        }
        #endregion

        #region GetInsightById
        [HttpGet("{id}")]
        public async Task<ActionResult<SmartInsight>> GetInsightById(int id)
        {
            try
            {
                var insight = await _context.SmartInsights.FindAsync(id);
                if (insight == null)
                    return NotFound(new { Message = $"Insight with ID {id} not found." });

                return Ok(insight);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching insight", Error = ex.Message });
            }
        }
        #endregion

        #region AddInsight
        [HttpPost]
        public async Task<ActionResult<SmartInsight>> AddInsight(SmartInsight i)
        {
            try
            {
                i.CreatedAt = DateTime.UtcNow;
                await _context.SmartInsights.AddAsync(i);
                await _context.SaveChangesAsync();

                return Ok(i);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error adding insight", Error = ex.Message });
            }
        }
        #endregion

        #region UpdateInsight
        [HttpPut("{id}")]
        public async Task<ActionResult<SmartInsight>> UpdateInsight(int id, SmartInsight i)
        {
            if (id != i.InsightId)
                return BadRequest(new { Message = "Insight ID mismatch" });

            try
            {
                var existing = await _context.SmartInsights.FindAsync(id);
                if (existing == null)
                    return NotFound(new { Message = $"Insight with ID {id} not found." });

                existing.InsightType = i.InsightType;
                existing.Title = i.Title;
                existing.Message = i.Message;
                existing.Priority = i.Priority;
                existing.Status = i.Status;
                existing.SourceType = i.SourceType;
                existing.SourceId = i.SourceId;
                existing.TargetUserId = i.TargetUserId;
                existing.ValidUntil = i.ValidUntil;
                existing.IsResolved = i.IsResolved;

                await _context.SaveChangesAsync();
                return Ok(existing);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error updating insight", Error = ex.Message });
            }
        }
        #endregion

        #region DeleteInsight
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteInsight(int id)
        {
            try
            {
                var insight = await _context.SmartInsights.FindAsync(id);
                if (insight == null)
                    return NotFound(new { Message = $"Insight with ID {id} not found." });

                _context.SmartInsights.Remove(insight);
                await _context.SaveChangesAsync();
                return Ok(insight);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error deleting insight", Error = ex.Message });
            }
        }
        #endregion

        #region FilterInsights
        [HttpGet("Filter")]
        public async Task<ActionResult<List<SmartInsight>>> FilterInsights(
            [FromQuery] string? type,
            [FromQuery] string? title,
            [FromQuery] string? status,
            [FromQuery] int? targetUserId,
            [FromQuery] bool? isResolved,
            [FromQuery] DateTime? createdAfter,
            [FromQuery] DateTime? validBefore)
        {
            try
            {
                var query = _context.SmartInsights.AsQueryable();

                if (!string.IsNullOrWhiteSpace(type))
                    query = query.Where(i => i.InsightType.ToLower().Contains(type.ToLower()));

                if (!string.IsNullOrWhiteSpace(title))
                    query = query.Where(i => i.Title.ToLower().Contains(title.ToLower()));

                if (!string.IsNullOrWhiteSpace(status))
                    query = query.Where(i => i.Status.ToLower().Contains(status.ToLower()));

                if (targetUserId.HasValue)
                    query = query.Where(i => i.TargetUserId == targetUserId.Value);

                if (isResolved.HasValue)
                    query = query.Where(i => i.IsResolved == isResolved.Value);

                if (createdAfter.HasValue)
                    query = query.Where(i => i.CreatedAt >= createdAfter.Value);

                if (validBefore.HasValue)
                    query = query.Where(i => i.ValidUntil <= validBefore.Value);

                var result = await query.OrderByDescending(i => i.CreatedAt).ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error filtering insights", Error = ex.Message });
            }
        }
        #endregion

        #region GetUniqueSourceIds
        [HttpGet("UniqueSourceIds")]
        public async Task<ActionResult<List<object>>> GetUniqueSourceIds()
        {
            try
            {
                var uniqueSources = await _context.SmartInsights
                    .Where(s => s.SourceId != null)
                    .GroupBy(s => s.SourceId)
                    .Select(g => g
                        .OrderByDescending(x => x.CreatedAt) // or InsightId
                        .FirstOrDefault())
                    .Select(s => new
                    {
                        s.SourceId,
                        s.SourceType
                    })
                    .ToListAsync();

                return Ok(uniqueSources);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching unique SourceIds", Error = ex.Message });
            }
        }
        #endregion

    }
}
