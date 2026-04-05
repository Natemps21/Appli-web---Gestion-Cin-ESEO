using MongoDB.Driver;
using Microsoft.Extensions.Options;
using ClubCine.DTO; // <-- Ajoute cette ligne si UserDto est dans ClubCine.DTO

namespace ClubCine.DAL
{
    public class UserRepository
    {
        private readonly IMongoCollection<UserDto> _users;

        public UserRepository(MongoDbContext context)
        {
            _users = context.Users;
        }

        public async Task<UserDto> GetByEmailAsync(string email) =>
            await _users.Find(u => u.Email == email).FirstOrDefaultAsync();

        public async Task AddUserAsync(UserDto user) =>
            await _users.InsertOneAsync(user);


public async Task<UserDto> GetUserByIdAsync(string userId)
{
    return await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
}
public async Task<List<UserDto>> GetAllAsync()
{
    return await _users.Find(_ => true).ToListAsync();
}



        // Ajoute ici d'autres méthodes CRUD (Update, Delete, etc.) selon tes besoins !
    }
}
