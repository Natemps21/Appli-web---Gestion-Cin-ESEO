using ClubCine.DAL;
using ClubCine.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

public class InscriptionService
{
    private readonly InscriptionRepository _repo;
    private readonly UserRepository _userRepo;

    public InscriptionService(InscriptionRepository repo, UserRepository userRepo)
    {
        _repo = repo;
        _userRepo = userRepo;
    }

    // Vérifie l'inscription à une séance club (ancienne logique)
    public async Task<bool> IsUserInscribed(string userId, string seanceId)
    {
        try
        {
            var insc = await _repo.GetUserInscriptionAsync(userId, seanceId);
            return insc != null;
        }
        catch
        {
            return false;
        }
    }

    // Vérifie l'inscription à une sortie cinéma
    public async Task<bool> IsUserInscribedSortie(string userId, string sortieCineId)
    {
        try
        {
            var insc = await _repo.GetInscriptionByUserAndSortieAsync(userId, sortieCineId);
            return insc != null;
        }
        catch
        {
            return false;
        }
    }

    public async Task AddInscription(InscriptionDto inscription)
    {
        // Logique multi-sortie correcte
        if (!string.IsNullOrEmpty(inscription.SortieCineId))
        {
            var deja = await _repo.GetInscriptionByUserAndSortieAsync(inscription.UserId, inscription.SortieCineId);
            if (deja != null)
                throw new System.Exception("User already inscribed for this sortie.");
        }
        else if (!string.IsNullOrEmpty(inscription.SeanceId))
        {
            var deja = await _repo.GetUserInscriptionAsync(inscription.UserId, inscription.SeanceId);
            if (deja != null)
                throw new System.Exception("User already inscribed for this seance.");
        }
        await _repo.AddInscriptionAsync(inscription);
    }

    public async Task RemoveInscription(string userId, string seanceId = null, string sortieCineId = null)
{
    if (!string.IsNullOrEmpty(sortieCineId))
        await _repo.DeleteInscriptionSortieAsync(userId, sortieCineId); // <-- do this!
    else if (!string.IsNullOrEmpty(seanceId))
        await _repo.DeleteInscriptionAsync(userId, seanceId);
}


    public async Task<List<UserDto>> GetUsersForSeance(string seanceId)
    {
        var inscriptions = await _repo.GetInscriptionsForSeanceAsync(seanceId);
        var users = new List<UserDto>();
        foreach(var insc in inscriptions)
        {
            var user = await _userRepo.GetUserByIdAsync(insc.UserId);
            if(user != null) users.Add(user);
        }
        return users;
    }

    public async Task<List<UserDto>> GetUsersForSortieCine(string sortieCineId)
    {
        var inscriptions = await _repo.GetInscriptionsForSortieCineAsync(sortieCineId);
        var users = new List<UserDto>();
        foreach(var insc in inscriptions)
        {
            var user = await _userRepo.GetUserByIdAsync(insc.UserId);
            if(user != null) users.Add(user);
        }
        return users;
    }
}
