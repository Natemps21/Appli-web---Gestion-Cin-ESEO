using ClubCine.DTO;
using MongoDB.Driver;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ClubCine.DAL
{
    public class InscriptionRepository
    {
        private readonly IMongoCollection<InscriptionDto> _inscriptions;
        public InscriptionRepository(MongoDbContext context)
        {
            _inscriptions = context.Inscriptions; // À ajouter dans MongoDbContext
        }

        public async Task AddInscriptionAsync(InscriptionDto inscription)
        {
            await _inscriptions.InsertOneAsync(inscription);
        }

        public async Task<InscriptionDto> GetUserInscriptionAsync(string userId, string seanceId)
        {
            try
            {
                var filter = Builders<InscriptionDto>.Filter.Eq(i => i.UserId, userId) &
                             Builders<InscriptionDto>.Filter.Eq(i => i.SeanceId, seanceId);
                return await _inscriptions.Find(filter).FirstOrDefaultAsync();
            }
            catch
            {
                return null;
            }
        }

        public async Task<InscriptionDto> GetInscriptionByUserAndSortieAsync(string userId, string sortieCineId)
        {
            try
            {
                var filter = Builders<InscriptionDto>.Filter.Eq(i => i.UserId, userId) &
                             Builders<InscriptionDto>.Filter.Eq(i => i.SortieCineId, sortieCineId);
                return await _inscriptions.Find(filter).FirstOrDefaultAsync();
            }
            catch
            {
                return null;
            }
        }

        public async Task DeleteInscriptionAsync(string userId, string seanceId)
        {
            var filter = Builders<InscriptionDto>.Filter.Eq(i => i.UserId, userId) &
                         Builders<InscriptionDto>.Filter.Eq(i => i.SeanceId, seanceId);
            await _inscriptions.DeleteOneAsync(filter);
        }

        // Ajout pour la désinscription à une sortie cinéma
        public async Task DeleteInscriptionSortieAsync(string userId, string sortieCineId)
{
    var filter = Builders<InscriptionDto>.Filter.Eq(i => i.UserId, userId) &
                 Builders<InscriptionDto>.Filter.Eq(i => i.SortieCineId, sortieCineId);
    await _inscriptions.DeleteOneAsync(filter);
}


        public async Task<List<InscriptionDto>> GetInscriptionsForSeanceAsync(string seanceId)
        {
            return await _inscriptions.Find(i => i.SeanceId == seanceId).ToListAsync();
        }

        public async Task<List<InscriptionDto>> GetInscriptionsForSortieCineAsync(string sortieCineId)
        {
            return await _inscriptions.Find(i => i.SortieCineId == sortieCineId).ToListAsync();
        }
    }
}
