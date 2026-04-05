using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClubCine.BLL;
using ClubCine.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ClubCineAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeanceController : ControllerBase
    {
        private readonly SeanceService _service;

        public SeanceController(SeanceService service)
        {
            _service = service;
        }

        [HttpGet("all")]
        //[Authorize] // Accessible à tous les users connectés
        public ActionResult<List<SeanceDto>> GetAll()
        {
            return _service.GetAll();
        }

        [HttpGet("{id:length(24)}")] // <-- cette ligne clé : n'accepte que des id de longueur 24 (ObjectId Mongo)
        [Authorize]
        public ActionResult<SeanceDto> GetById(string id)
        {
            var seance = _service.GetById(id);
            if (seance == null) return NotFound();
            return seance;
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> Create([FromBody] SeanceDto dto)
        {
            var seance = new SeanceDto
            {
                Date = dto.Date,
                Lieu = dto.Lieu,
                FilmIds = dto.FilmIds,
                Statut = dto.Statut,
                HelloAssoUrl = dto.HelloAssoUrl
            };
            var created = await _service.InsertAsync(seance);
            if (!created)
                return BadRequest("Date de séance déjà prise OU ID(s) de film invalide(s)");
            return Ok();
        }

        [HttpPut("{id:length(24)}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> Update(string id, [FromBody] SeanceDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (!updated) return NotFound("Séance non trouvée OU ID(s) de film invalide(s)");
            return Ok();
        }

        [HttpDelete("{id:length(24)}")]
        [Authorize(Roles = "admin")]
        public ActionResult Delete(string id)
        {
            var deleted = _service.Delete(id);
            if (!deleted) return NotFound("Séance non trouvée");
            return Ok();
        }

        [HttpGet("prochaine")]
        public ActionResult<SeanceDto> GetProchaine()
        {
            var s = _service.GetProchaine();
            if (s == null) return NotFound();
            return Ok(s);
        }
    }
}
