using ClubCine.DTO;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ClubCine.DAL
{
    public class SortieCineRepository
    {
        private readonly IMongoCollection<SortieCineDto> _collection;

        public SortieCineRepository(MongoDbContext context)
    {
        _collection = context.SortiesCine;
    }

        public async Task<List<SortieCineDto>> GetAllAsync() =>
            await _collection.Find(_ => true).ToListAsync();

        public async Task<SortieCineDto?> GetByIdAsync(string id) =>
            await _collection.Find(s => s.Id == id).FirstOrDefaultAsync();

        public async Task InsertAsync(SortieCineDto sortie) =>
            await _collection.InsertOneAsync(sortie);

        public async Task UpdateAsync(string id, SortieCineDto sortie)
        {
            sortie.Id = id;
            await _collection.ReplaceOneAsync(s => s.Id == id, sortie);
        }

        public async Task DeleteAsync(string id) =>
            await _collection.DeleteOneAsync(s => s.Id == id);
            

            public List<SortieCineDto> GetAll()
{
    // Si tu utilises MongoDB.Driver, adapte le nom de ta collection !
    return _collection.Find(FilterDefinition<SortieCineDto>.Empty).ToList();
}

    }
}
