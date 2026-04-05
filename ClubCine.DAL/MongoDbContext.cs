using MongoDB.Driver;
using Microsoft.Extensions.Options;
using ClubCine.DTO;

namespace ClubCine.DAL
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            _database = client.GetDatabase(settings.Value.DatabaseName);
        }
        public IMongoCollection<FilmDto> Films => _database.GetCollection<FilmDto>("Film"); // Ajout de la collection Film
        public IMongoCollection<SeanceDto> Seances => _database.GetCollection<SeanceDto>("Seance");
        public IMongoCollection<SortieCineDto> SortiesCine => _database.GetCollection<SortieCineDto>("SortiesCine");
        public IMongoCollection<VoteDto> Votes => _database.GetCollection<VoteDto>("Vote");
        public IMongoCollection<InscriptionDto> Inscriptions => _database.GetCollection<InscriptionDto>("Inscription");



        




        public IMongoCollection<UserDto> Users => _database.GetCollection<UserDto>("User"); // Collection des utilisateurs
        // Ajoute ici les autres collections quand tu les créeras (Film, Seance, etc.)
    }

}