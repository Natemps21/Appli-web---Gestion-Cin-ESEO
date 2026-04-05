using Microsoft.AspNetCore.Mvc;
using ClubCine.BLL;
using ClubCine.DTO;
using System.Threading.Tasks;

namespace ClubCineAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VoteController : ControllerBase
    {
        private readonly VoteService _service;
        public VoteController(VoteService service)
        {
            _service = service;
        }

        [HttpPost("vote")]
        public async Task<IActionResult> Vote([FromBody] VoteDto vote)
        {
            try
            {
                await _service.AddVote(vote);
                return Ok("Vote enregistré !");
            }
            catch (Exception ex)
            {
                return Conflict(ex.Message); // 409 si déjà voté
            }
        }

        [HttpGet("has-voted")]
public async Task<IActionResult> HasVoted(string userId, string seanceId)
{
    try
    {
        // En cas d'id mal formé, retourne toujours false au lieu de planter
        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(seanceId))
            return Ok(false);

        var result = await _service.HasUserVoted(userId, seanceId);
        return Ok(result);
    }
    catch (Exception ex)
    {
        // LOG ex.Message quelque part si possible
        return Ok(false); // ou return StatusCode(500, new {error = ex.Message});
    }
}


        [HttpGet("stats")]
        public async Task<IActionResult> GetStats(string seanceId)
        {
            var stats = await _service.GetStats(seanceId);
            return Ok(stats); // Format { filmId: pourcentage, ... }
        }
    }
}
