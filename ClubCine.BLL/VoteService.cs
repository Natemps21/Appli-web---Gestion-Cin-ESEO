using ClubCine.DAL;
using ClubCine.DTO;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

public class VoteService
{
    private readonly VoteRepository _repo;
    public VoteService(VoteRepository repo)
    {
        _repo = repo;
    }

    public async Task<bool> HasUserVoted(string userId, string seanceId)
    {
        try
        {
            var vote = await _repo.GetUserVoteAsync(userId, seanceId);
            return vote != null;
        }
        catch
        {
            return false;
        }
    }

    public async Task AddVote(VoteDto vote)
    {
        var alreadyVoted = await _repo.GetUserVoteAsync(vote.UserId, vote.SeanceId);
        if (alreadyVoted != null)
            throw new Exception("User already voted for this seance.");
        await _repo.AddVoteAsync(vote);
    }

    public async Task<Dictionary<string, int>> GetStatsForSeance(string seanceId)
    {
        // Appel natif : le repo renvoie déjà le bon dictionnaire
        return await _repo.GetStatsForSeanceAsync(seanceId);
    }

    public async Task<Dictionary<string, int>> GetStats(string seanceId)
    {
        var votes = await _repo.GetVotesForSeanceAsync(seanceId);
        var stats = votes.GroupBy(v => v.FilmId)
                         .ToDictionary(g => g.Key, g => g.Count());
        return stats;
    }
}
