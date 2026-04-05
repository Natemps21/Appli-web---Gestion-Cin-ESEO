using ClubCine.DAL;
using ClubCine.DTO;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;

public class UserService
{
    private readonly UserRepository _repo;
    private readonly string _jwtKey;

    public UserService(UserRepository repo, IConfiguration configuration)
    {
        _repo = repo;
        _jwtKey = configuration["JwtSettings:Key"];
    }

    public async Task<UserDto> RegisterUser(UserDto user)
    {
        user.Role = "user";
        var existing = await _repo.GetByEmailAsync(user.Email);
        if (existing != null)
            throw new Exception("Email déjà utilisé");
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
        await _repo.AddUserAsync(user);
        return user;
    }

    public async Task<UserDto> GetUserByEmail(string email)
    {
        return await _repo.GetByEmailAsync(email);
    }

    public async Task<bool> CheckUserLogin(string email, string plainPassword)
    {
        var user = await _repo.GetByEmailAsync(email);
        if (user == null) return false;
        return BCrypt.Net.BCrypt.Verify(plainPassword, user.PasswordHash);
    }

    public async Task<bool> CheckAdminLogin(string email, string plainPassword)
    {
        var user = await _repo.GetByEmailAsync(email);
        if (user == null || user.Role != "admin") return false;
        return BCrypt.Net.BCrypt.Verify(plainPassword, user.PasswordHash);
    }

    public string GenerateJwt(UserDto user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("email", user.Email),
            new Claim("role", user.Role)
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddHours(3),
            signingCredentials: credentials
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<List<UserDto>> GetAll()
    {
        return await _repo.GetAllAsync();
    }
}
