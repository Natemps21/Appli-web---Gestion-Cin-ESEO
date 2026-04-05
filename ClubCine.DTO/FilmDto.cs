using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;


namespace ClubCine.DTO
{
    public class FilmDto
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [Required]
        public string Titre { get; set; }
        [Required]
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        [Range(1900,2100)]
        public int Year { get; set; }
        public string Genre { get; set; }
        [Range(0,10)]
        public double Rating { get; set; }
    }
}
