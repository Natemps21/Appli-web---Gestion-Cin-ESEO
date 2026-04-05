using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ClubCine.DTO
{
    public class SeanceDto
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public DateTime Date { get; set; }         // Date et heure de la séance
        public string Lieu { get; set; }           // Nom / Salle où a lieu la séance
        public List<string> FilmIds { get; set; } // IDs des films proposés (liste d'ID MongoDB)
        public string? SelectedFilmId { get; set; }       // Film vainqueur une fois voté/admin
        public string Statut { get; set; }         // Statut ("vote", "inscription", "terminée", ...)
        public string? HelloAssoUrl { get; set; }  // Lien HelloAsso éventuel pour inscription/paiement

        // Optionally later : public List<string> Participants { get; set; }
    }
}
