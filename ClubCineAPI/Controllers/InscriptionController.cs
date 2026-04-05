using Microsoft.AspNetCore.Mvc;
using ClubCine.BLL;
using ClubCine.DTO;
using System.Threading.Tasks;

namespace ClubCineAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InscriptionController : ControllerBase
    {
        private readonly InscriptionService _service;
        public InscriptionController(InscriptionService service)
        {
            _service = service;
        }

        [HttpPost("inscribe")]
        public async Task<IActionResult> Inscribe([FromBody] InscriptionDto inscription)
        {
            try
            {
                await _service.AddInscription(inscription);
                return Ok("Inscription enregistrée !");
            }
            catch (Exception ex)
            {
                return Conflict(ex.Message); // 409 si déjà inscrit
            }
        }

        [HttpGet("is-inscribed")]
        public async Task<IActionResult> IsInscribed(string userId, string seanceId = null, string sortieCineId = null)
        {
            try
            {
                if (string.IsNullOrEmpty(userId) || (string.IsNullOrEmpty(seanceId) && string.IsNullOrEmpty(sortieCineId)))
                    return Ok(false);

                bool result;
                if (!string.IsNullOrEmpty(seanceId))
                    result = await _service.IsUserInscribed(userId, seanceId);
                else
                    result = await _service.IsUserInscribedSortie(userId, sortieCineId);
                return Ok(result);
            }
            catch
            {
                return Ok(false); // Toujours un bool, pas d'exception
            }
        }

        [HttpPost("unsubscribe")]
public async Task<IActionResult> Unsubscribe([FromBody] InscriptionDto inscription)
{
    await _service.RemoveInscription(inscription.UserId, inscription.SeanceId, inscription.SortieCineId);
    return Ok("Inscription supprimée !");
}

    }
}
