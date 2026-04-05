using ClubCine.DAL;
using ClubCine.DTO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace ClubCine.BLL
{
    public class SeanceService
    {
        private readonly SeanceRepository _seanceRepo;
        private readonly FilmRepository _filmRepo;

        public SeanceService(SeanceRepository seanceRepo, FilmRepository filmRepo)
        {
            _seanceRepo = seanceRepo;
            _filmRepo = filmRepo;
        }

        // Toutes les séances
        public List<SeanceDto> GetAll()
        {
            return _seanceRepo.GetAll();
        }

        // Détails séance
        public SeanceDto? GetById(string id)
        {
            return _seanceRepo.GetById(id);
        }

        // Création (Vérifie que les films existent)
        public async Task<bool> InsertAsync(SeanceDto seance)
        {
            var dejaExistante = _seanceRepo.GetAll().Any(s => s.Date == seance.Date);
            if (dejaExistante)
                return false;

            if (seance.FilmIds == null) return false;
            foreach (var id in seance.FilmIds)
            {
                var film = await _filmRepo.GetByIdAsync(id);
                if (film == null) return false;
            }
            _seanceRepo.Insert(seance);
            return true;
        }

        // Modification
        public async Task<bool> UpdateAsync(string id, SeanceDto seanceIn)
        {
            if (seanceIn.FilmIds == null) return false;
            foreach (var fId in seanceIn.FilmIds)
            {
                var film = await _filmRepo.GetByIdAsync(fId);
                if (film == null) return false;
            }
            return _seanceRepo.Update(id, seanceIn);
        }

        // Prochaine séance
        public SeanceDto GetProchaine()
        {
            var toutes = _seanceRepo.GetAll();
            return toutes.OrderBy(s => s.Date).FirstOrDefault(s => s.Date > DateTime.Now);
        }
        public SeanceDto GetCurrent()
{
    var now = DateTime.Now;
    // Récupère toutes les séances à venir (ou en cours)
    return GetAll()
        .Where(s => s.Date >= now)
        .OrderBy(s => s.Date)
        .FirstOrDefault();
}


        // Suppression
        public bool Delete(string id) => _seanceRepo.Delete(id);
    }
}
