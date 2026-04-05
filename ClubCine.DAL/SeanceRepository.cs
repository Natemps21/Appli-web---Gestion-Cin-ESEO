using ClubCine.DTO;
using MongoDB.Driver;

namespace ClubCine.DAL
{
    public class SeanceRepository
    {
        private readonly IMongoCollection<SeanceDto> _seances;

        public SeanceRepository(MongoDbContext dbContext)
        {
            _seances = dbContext.Seances;
        }

        public List<SeanceDto> GetAll()
        {
            return _seances.Find(_ => true).ToList();
        }

        public SeanceDto? GetById(string id)
        {
            return _seances.Find(s => s.Id == id).FirstOrDefault();
        }

        public void Insert(SeanceDto seance)
        {
            _seances.InsertOne(seance);
        }

        public bool Update(string id, SeanceDto seanceIn)
        {
            seanceIn.Id = id;
            var result = _seances.ReplaceOne(s => s.Id == id, seanceIn);
            return result.MatchedCount > 0; // true si un doc trouvé
        }


        public bool Delete(string id)
        {
            var result = _seances.DeleteOne(s => s.Id == id);
            return result.DeletedCount > 0;
        }


    }
}
