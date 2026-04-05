using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ClubCine.DTO
{
    public class UserDto
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Email { get; set; }
        public string Classe { get; set; }
        public string Role { get; set; }
        public string PasswordHash { get; set; }
    }
}
