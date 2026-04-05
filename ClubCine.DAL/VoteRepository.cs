using ClubCine.DTO;
using MongoDB.Driver;
using System.Threading.Tasks;

namespace ClubCine.DAL
{
    public class VoteRepository
    {
        private readonly IMongoCollection<VoteDto> _votes;
        public VoteRepository(MongoDbContext context)
        {
            _votes = context.Votes; // À ajouter dans MongoDbContext
        }

        public async Task AddVoteAsync(VoteDto vote)
        {
            await _votes.InsertOneAsync(vote);
        }

        public async Task<VoteDto> GetUserVoteAsync(string userId, string seanceId)
{
    try
    {
        var filter = Builders<VoteDto>.Filter.Eq(v => v.UserId, userId)
                   & Builders<VoteDto>.Filter.Eq(v => v.SeanceId, seanceId);
        var res = await _votes.Find(filter).FirstOrDefaultAsync();
        return res;
    }
    catch (Exception ex)
    {
        // Log dans la console pour debug si besoin : Console.WriteLine(ex.Message);
        return null;
    }
}



        public async Task<List<VoteDto>> GetVotesForSeanceAsync(string seanceId)
        {
            return await _votes.Find(v => v.SeanceId == seanceId).ToListAsync();
        }

        public async Task DeleteVoteAsync(string userId, string seanceId)
        {
            var filter = Builders<VoteDto>.Filter.Eq(v => v.UserId, userId) &
                         Builders<VoteDto>.Filter.Eq(v => v.SeanceId, seanceId);
            await _votes.DeleteOneAsync(filter);
        }

       public async Task<Dictionary<string, int>> GetStatsForSeanceAsync(string seanceId)
{
    var votes = await _votes.Find(v => v.SeanceId == seanceId).ToListAsync();
    return votes
        .GroupBy(v => v.FilmId)
        .ToDictionary(g => g.Key, g => g.Count());
}


    }
}
