using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ClubCine.DTO
{
    public class InscriptionDto
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string UserId { get; set; }
        public string SeanceId { get; set; }
        public string SortieCineId { get; set; }
        public DateTime DateInscription { get; set; }
    }
}
