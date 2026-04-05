using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ClubCine.BLL;
using ClubCine.DTO;

namespace ClubCineAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilmController : ControllerBase
    {
        private readonly FilmService _service;

        public FilmController(FilmService service)
        {
            _service = service;
        }

        // Liste de tous les films (accès public)
        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _service.GetAllFilms());

        // Détail d'un film par id (accès public)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var film = await _service.GetFilmById(id);
            return film != null ? Ok(film) : NotFound();
        }

        // Ajout d'un film (admin uniquement)
        [Authorize(Roles = "admin")]
[HttpPost]
public async Task<IActionResult> Add([FromBody] FilmDto film)
{
    try
    {
        await _service.AddFilm(film);
        return CreatedAtAction(nameof(GetById), new { id = film.Id }, film);
    }
    catch (Exception ex)
    {
        // Retourne un message User-Friendly sans stacktrace
        return BadRequest(new { message = ex.Message });
    }
}


        // Modification d'un film (admin uniquement)
        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] FilmDto film)
        {
            film.Id = id;
            await _service.UpdateFilm(id, film);
            return Ok(new { message = "Modification faite en tant qu'admin !" });
        }

        // Suppression d'un film (admin uniquement)
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _service.DeleteFilm(id);
            return NoContent();
        }
    }
}
