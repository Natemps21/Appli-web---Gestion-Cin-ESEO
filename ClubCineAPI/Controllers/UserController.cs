using Microsoft.AspNetCore.Mvc;
using ClubCine.BLL;
using ClubCine.DTO;

// AJOUTE CECI :
using System.Threading.Tasks;

namespace ClubCineAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto registerDto)
        {
            // Mapping manuel ou via AutoMapper si tu préfères
            var user = new UserDto
            {
                
                Nom = registerDto.Nom,
                Prenom = registerDto.Prenom,
                Email = registerDto.Email,
                Classe = registerDto.Classe,
                PasswordHash = registerDto.PasswordHash,
                Role = "user" // Toujours forcé !!
            };
            await _userService.RegisterUser(user);
            return Ok();
        }


        [HttpGet("{email}")]
        public async Task<IActionResult> GetByEmail(string email)
        {
            var user = await _userService.GetUserByEmail(email);
            return user != null ? Ok(user) : NotFound();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userService.GetUserByEmail(request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized();

            var token = _userService.GenerateJwt(user);

            // Renvoie aussi l'objet user
            return Ok(new
            {
                token = token,
                user = new
                {
                        id = user.Id,               // <-- AJOUTE CETTE LIGNE !

                    prenom = user.Prenom,
                    nom = user.Nom,
                    email = user.Email,
                    role = user.Role,
                    classe = user.Classe
                    // ajoute selon tes besoins, mais pas le PasswordHash !
                }
            });
        }



        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpPost("adminlogin")]
        public async Task<IActionResult> AdminLogin([FromBody] LoginRequest request)
        {
            var valid = await _userService.CheckAdminLogin(request.Email, request.Password);
            if (valid)
                return Ok("Admin connecté !");
            return Unauthorized();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpGet("admin/actions")]
        public IActionResult GetAdminActions([FromQuery] string role)
        {
            if (role != "admin")
                return Unauthorized("Accès réservé aux admins !");
            return Ok(new[] { "Ajouter film", "Modifier film", "Supprimer film", "Voir utilisateurs", "Statistiques" });
        }
        // Ajoute ici d'autres méthodes au besoin (login, update, delete...)
    }
}
