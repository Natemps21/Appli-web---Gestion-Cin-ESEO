using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace ClubCine.DTO
{
    public class SortieCineDto
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } // Auto (jamais modifiable côté front)

        public DateTime Date { get; set; }
        public double Prix { get; set; }
        public string Emplacement { get; set; }
        public string FilmId { get; set; }
        public string? HelloAssoUrl { get; set; }

    }
}