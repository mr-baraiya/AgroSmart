using AgroSmartBeackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgroSmartBeackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecommendationController : ControllerBase
    {
        private readonly AgroSmartContext _context;

        #region Constructor
        public RecommendationController(AgroSmartContext context)
        {
            _context = context;
        }
        #endregion

        #region GetAllRecommendations
        [HttpGet("All")]
        public async Task<ActionResult<List<Recommendation>>> GetAllRecommendations()
        {
            try
            {
                var data = await _context.Recommendations.ToListAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                // Optional: log the exception
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        #endregion

        #region GetRecommendationById
        [HttpGet("{id}")]
        public async Task<ActionResult<Recommendation>> GetRecommendationById(int id)
        {
            try
            {
                var rec = await _context.Recommendations.FindAsync(id);
                if (rec == null)
                    return NotFound();

                return Ok(rec);
            }
            catch (Exception ex)
            {
                // Log the exception here if needed
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        #endregion

        #region AddRecommendation
        [HttpPost]
        public async Task<ActionResult<Recommendation>> AddRecommendation(Recommendation r)
        {
            try
            {
                r.GeneratedAt = DateTime.UtcNow;
                await _context.Recommendations.AddAsync(r);
                await _context.SaveChangesAsync();

                return Ok(r);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        #endregion

        #region UpdateRecommendation
        [HttpPut("{id}")]
        public async Task<ActionResult<Recommendation>> UpdateRecommendation(int id, Recommendation r)
        {
            if (id != r.RecommendationId)
                return BadRequest("Recommendation ID mismatch");

            try
            {
                var existing = await _context.Recommendations.FindAsync(id);
                if (existing == null)
                    return NotFound();

                existing.FieldId = r.FieldId;
                existing.RecommendationType = r.RecommendationType;
                existing.Title = r.Title;
                existing.Description = r.Description;
                existing.Priority = r.Priority;
                existing.EstimatedCost = r.EstimatedCost;
                existing.EstimatedBenefit = r.EstimatedBenefit;
                existing.ValidUntil = r.ValidUntil;
                existing.GeneratedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(existing);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        #endregion

        #region DeleteRecommendation
        [HttpDelete("{id}")]
        public async Task<ActionResult<Recommendation>> DeleteRecommendation(int id)
        {
            try
            {
                var r = await _context.Recommendations.FindAsync(id);
                if (r == null)
                    return NotFound();

                _context.Recommendations.Remove(r);
                await _context.SaveChangesAsync();

                return Ok(r);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        #endregion

        #region FilterRecommendations
        [HttpGet("Filter")]
        public async Task<ActionResult<List<Recommendation>>> FilterRecommendations(
            [FromQuery] int? fieldId,
            [FromQuery] string? type,
            [FromQuery] string? title,
            [FromQuery] string? priority,
            [FromQuery] decimal? minCost,
            [FromQuery] decimal? maxCost,
            [FromQuery] decimal? minBenefit,
            [FromQuery] decimal? maxBenefit,
            [FromQuery] DateTime? validUntilBefore,
            [FromQuery] DateTime? validUntilAfter)
        {
            try
            {
                var query = _context.Recommendations.AsQueryable();

                if (fieldId.HasValue)
                    query = query.Where(r => r.FieldId == fieldId.Value);

                if (!string.IsNullOrWhiteSpace(type))
                    query = query.Where(r => r.RecommendationType.ToLower().Contains(type.ToLower()));

                if (!string.IsNullOrWhiteSpace(title))
                    query = query.Where(r => r.Title.ToLower().Contains(title.ToLower()));

                if (!string.IsNullOrWhiteSpace(priority))
                    query = query.Where(r => r.Priority.ToLower().Contains(priority.ToLower()));

                if (minCost.HasValue)
                    query = query.Where(r => r.EstimatedCost >= minCost.Value);

                if (maxCost.HasValue)
                    query = query.Where(r => r.EstimatedCost <= maxCost.Value);

                if (minBenefit.HasValue)
                    query = query.Where(r => r.EstimatedBenefit >= minBenefit.Value);

                if (maxBenefit.HasValue)
                    query = query.Where(r => r.EstimatedBenefit <= maxBenefit.Value);

                if (validUntilBefore.HasValue)
                    query = query.Where(r => r.ValidUntil.HasValue && r.ValidUntil.Value <= validUntilBefore.Value);

                if (validUntilAfter.HasValue)
                    query = query.Where(r => r.ValidUntil.HasValue && r.ValidUntil.Value >= validUntilAfter.Value);

                var data = await query.ToListAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        #endregion

    }
}
