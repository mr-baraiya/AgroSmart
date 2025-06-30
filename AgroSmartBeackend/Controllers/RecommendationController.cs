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
            var data = await _context.Recommendations.ToListAsync();
            return Ok(data);
        }
        #endregion

        #region GetRecommendationById
        [HttpGet("{id}")]
        public async Task<ActionResult<Recommendation>> GetRecommendationById(int id)
        {
            var rec = await _context.Recommendations.FindAsync(id);
            if (rec == null)
            {
                return NotFound();
            }
            return Ok(rec);
        }
        #endregion

        #region GetRecommendationsByFieldId
        [HttpGet("ByField/{fieldId}")]
        public async Task<ActionResult<List<Recommendation>>> GetRecommendationsByFieldId(int fieldId)
        {
            var data = await _context.Recommendations
                .Where(r => r.FieldId == fieldId)
                .ToListAsync();

            return Ok(data);
        }
        #endregion

        #region AddRecommendation
        [HttpPost]
        public async Task<ActionResult<Recommendation>> AddRecommendation(Recommendation r)
        {
            r.GeneratedAt = DateTime.UtcNow;

            await _context.Recommendations.AddAsync(r);
            await _context.SaveChangesAsync();

            return Ok(r);
        }
        #endregion

        #region UpdateRecommendation
        [HttpPut("{id}")]
        public async Task<ActionResult<Recommendation>> UpdateRecommendation(int id, Recommendation r)
        {
            if (id != r.RecommendationId)
            {
                return BadRequest("Recommendation ID mismatch");
            }

            var existing = await _context.Recommendations.FindAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

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
        #endregion

        #region DeleteRecommendation
        [HttpDelete("{id}")]
        public async Task<ActionResult<Recommendation>> DeleteRecommendation(int id)
        {
            var r = await _context.Recommendations.FindAsync(id);
            if (r == null)
            {
                return NotFound();
            }

            _context.Recommendations.Remove(r);
            await _context.SaveChangesAsync();

            return Ok(r);
        }
        #endregion

    }
}
