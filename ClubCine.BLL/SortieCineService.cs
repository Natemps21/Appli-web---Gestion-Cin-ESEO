using ClubCine.DAL;
using ClubCine.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ClubCine.BLL
{
    public class SortieCineService
    {
        private readonly SortieCineRepository _repo;

        public SortieCineService(SortieCineRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<SortieCineDto>> GetAllSorties() => await _repo.GetAllAsync();
        public async Task<SortieCineDto?> GetById(string id) => await _repo.GetByIdAsync(id);
        public async Task InsertAsync(SortieCineDto sortie) => await _repo.InsertAsync(sortie);
        public async Task UpdateAsync(string id, SortieCineDto sortie) => await _repo.UpdateAsync(id, sortie);
        public async Task DeleteAsync(string id) => await _repo.DeleteAsync(id);

        // Ajoute cette méthode pour le GET synchrone pour "prochaines"
        public List<SortieCineDto> GetAll()
        {
            return _repo.GetAll();
        }
    }
}
