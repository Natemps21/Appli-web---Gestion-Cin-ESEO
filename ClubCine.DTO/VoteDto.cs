using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ClubCine.DTO
{
    public class VoteDto
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string UserId { get; set; }          // L'utilisateur qui vote
        public string SeanceId { get; set; }        // Sur quelle séance porte le vote
        public string FilmId { get; set; }          // Pour quel film
    }
}
