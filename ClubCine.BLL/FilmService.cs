using ClubCine.DAL;
using ClubCine.DTO;

namespace ClubCine.BLL
{
    public class FilmService
    {
        private readonly FilmRepository _repo;

        public FilmService(FilmRepository repo)
        {
            _repo = repo;
        }

        

        public Task<List<FilmDto>> GetAllFilms() => _repo.GetAllAsync();
        public Task<FilmDto?> GetFilmById(string id) => _repo.GetByIdAsync(id);
        public async Task AddFilm(FilmDto film)
        {
            var allFilms = await _repo.GetAllAsync();
            if (allFilms.Any(f => f.Titre.ToLower() == film.Titre.ToLower()))
                throw new Exception("Un film avec ce titre existe déjà !");
            await _repo.AddAsync(film);
        }
  
        public Task UpdateFilm(string id, FilmDto film) => _repo.UpdateAsync(id, film);
        public Task DeleteFilm(string id) => _repo.DeleteAsync(id);
    }
}
