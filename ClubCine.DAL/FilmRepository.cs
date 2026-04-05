using MongoDB.Driver;
using ClubCine.DTO;

namespace ClubCine.DAL
{
    public class FilmRepository
    {
        private readonly IMongoCollection<FilmDto> _films;

        public FilmRepository(MongoDbContext context)
        {
            _films = context.Films; // à ajouter dans MongoDbContext !
        }

        public async Task<List<FilmDto>> GetAllAsync() =>
            await _films.Find(_ => true).ToListAsync();

        public async Task<FilmDto?> GetByIdAsync(string id) =>
            await _films.Find(f => f.Id == id).FirstOrDefaultAsync();

        public async Task AddAsync(FilmDto film) =>
            await _films.InsertOneAsync(film);

        public async Task UpdateAsync(string id, FilmDto updatedFilm) =>
            await _films.ReplaceOneAsync(f => f.Id == id, updatedFilm);

        public async Task DeleteAsync(string id) =>
            await _films.DeleteOneAsync(f => f.Id == id);
            
    }
}
