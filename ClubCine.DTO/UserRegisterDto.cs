namespace ClubCine.DTO
{
    public class UserRegisterDto
    {
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Email { get; set; }
        public string Classe { get; set; }
        public string PasswordHash { get; set; }
    }
}
