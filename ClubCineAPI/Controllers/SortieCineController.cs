using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClubCine.BLL;
using ClubCine.DTO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClubCineAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SortieCineController : ControllerBase
    {
        private readonly SortieCineService _service;

        public SortieCineController(SortieCineService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllSorties());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id) => Ok(await _service.GetById(id));

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] SortieCineDto sortie)
        {
            await _service.InsertAsync(sortie);
            return CreatedAtAction(nameof(GetById), new { id = sortie.Id }, sortie);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] SortieCineDto sortie)
        {
            sortie.Id = id;
            await _service.UpdateAsync(id, sortie);
            return Ok();
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("prochaines")]
        public ActionResult<List<SortieCineDto>> GetProchaines()
        {
            var sorties = _service.GetAll()
                .Where(s => s.Date > DateTime.Now)
                .OrderBy(s => s.Date).ToList();
            return Ok(sorties);
        }
        
    }
}
