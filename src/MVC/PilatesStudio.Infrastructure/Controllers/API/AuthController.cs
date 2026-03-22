using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PilatesStudio.Domain.Entities;
using PilatesStudio.Infrastructure;

namespace PilatesStudio.Infrastructure.Controllers.Api
{
    public class RegisterDto
    {
        public string? FirstName { get; set; }
        public string? Surname { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
    }

    public class LoginDto
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }

    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly PilatesDbContext _mainContext;

        public AuthController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            PilatesDbContext mainContext
        )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mainContext = mainContext;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var identityUser = new AppUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                Surname = dto.Surname,
                Role = UserRole.User,
            };

            var result = await _userManager.CreateAsync(identityUser, dto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(identityUser, "User");
            await _signInManager.SignInAsync(identityUser, false);

            var user = new User
            {
                FirstName = dto.FirstName,
                Surname = dto.Surname,
                Email = dto.Email,
                PasswordHash = dto.Password,
                Role = UserRole.User,
            };

            _mainContext.Users.Add(user);
            await _mainContext.SaveChangesAsync();

            return Ok(
                new
                {
                    id = user.Id,
                    firstName = user.FirstName,
                    surname = user.Surname,
                    email = user.Email,
                    role = "User",
                }
            );
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _signInManager.PasswordSignInAsync(
                dto.Email!,
                dto.Password!,
                false,
                false
            );

            if (!result.Succeeded)
                return Unauthorized("Невірний email або пароль.");

            var identityUser = await _userManager.FindByEmailAsync(dto.Email!);
            var roles = await _userManager.GetRolesAsync(identityUser!);
            var role = roles.FirstOrDefault() ?? "User";

            var dbUser = await _mainContext
                .Users.Include(u => u.Instructor)
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            return Ok(
                new
                {
                    id = dbUser?.Id ?? 0,
                    firstName = dbUser?.FirstName ?? identityUser!.FirstName,
                    surname = dbUser?.Surname ?? identityUser!.Surname,
                    email = identityUser!.Email,
                    role,
                    instructorId = dbUser?.Instructor?.Id,
                }
            );
        }
    }
}
