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
    [Authorize(Roles = "admin")]
    public class AdminStatsController : ControllerBase
    {
        private readonly SeanceService _seanceService;
        private readonly SortieCineService _sortieService;
        private readonly UserService _userService;
        private readonly InscriptionService _inscriptionService;
        private readonly VoteService _voteService;

        public AdminStatsController(
            SeanceService seance, SortieCineService sortie, UserService user, InscriptionService insc, VoteService vote)
        {
            _seanceService = seance;
            _sortieService = sortie;
            _userService = user;
            _inscriptionService = insc;
            _voteService = vote;
        }

        [HttpGet("seances-per-year")]
        public ActionResult<Dictionary<int, int>> SeancesPerYear()
        {
            var seances = _seanceService.GetAll();
            var stats = seances
                .GroupBy(s => s.Date.Year)
                .ToDictionary(g => g.Key, g => g.Count());
            return Ok(stats);
        }

        [HttpGet("current-seance-inscrits")]
        public async Task<ActionResult<List<UserDto>>> CurrentSeanceInscrits()
        {
            var seance = _seanceService.GetCurrent();
            if (seance == null) return NotFound();
            var users = await _inscriptionService.GetUsersForSeance(seance.Id);
            return Ok(users);
        }

        [HttpGet("next-sorties-inscrits")]
        public async Task<ActionResult<Dictionary<string, List<UserDto>>>> NextSortiesInscrits()
        {
            var sorties = _sortieService.GetAll().Where(s => s.Date > DateTime.Now).ToList();
            var result = new Dictionary<string, List<UserDto>>();
            foreach (var s in sorties)
                result[s.Id] = await _inscriptionService.GetUsersForSortieCine(s.Id);
            return Ok(result);
        }

        [HttpGet("current-seance-votes")]
        public async Task<ActionResult<Dictionary<string, int>>> CurrentSeanceVotes()
        {
            var seance = _seanceService.GetCurrent();
            if (seance == null) return NotFound();
            var stats = await _voteService.GetStatsForSeance(seance.Id);
            return Ok(stats);
        }

        [HttpGet("member-count")]
        public async Task<ActionResult<int>> MemberCount()
        {
            var users = await _userService.GetAll();
            return Ok(users.Count);
        }

        [HttpGet("class-distribution")]
        public async Task<ActionResult<Dictionary<string, int>>> ClassDistribution()
        {
            var users = await _userService.GetAll();
            var data = users
                .GroupBy(u => string.IsNullOrEmpty(u.Classe) ? "AUTRE" : u.Classe.ToUpper())
                .ToDictionary(g => g.Key, g => g.Count());
            return Ok(data);
        }
    }
}
