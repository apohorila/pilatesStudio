using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PilatesStudio.Domain.Entities;

namespace PilatesStudio.Infrastructure.Controllers.Api
{
    public class CreateInstructorDto
    {
        public string? FirstName { get; set; }
        public string? Surname { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Bio { get; set; }
        public DateOnly? WorkStartDate { get; set; }
    }

    [Route("api/instructors")]
    [ApiController]
    public class InstructorsApiController : ControllerBase
    {
        private readonly PilatesDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public InstructorsApiController(PilatesDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var instructors = await _context.Instructors.Include(i => i.User).ToListAsync();

            return Ok(instructors);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var instructor = await _context
                .Instructors.Include(i => i.User)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (instructor == null)
                return NotFound();

            return Ok(instructor);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateInstructorDto dto)
        {
            if (
                dto.WorkStartDate.HasValue
                && dto.WorkStartDate.Value > DateOnly.FromDateTime(DateTime.Now)
            )
                return BadRequest("Дата початку роботи не може бути в майбутньому.");
            var identityUser = new AppUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                Surname = dto.Surname,
                Role = UserRole.Instructor,
            };

            var result = await _userManager.CreateAsync(identityUser, dto.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(string.Join(", ", errors));
            }

            await _userManager.AddToRoleAsync(identityUser, "Instructor");

            var user = new User
            {
                FirstName = dto.FirstName,
                Surname = dto.Surname,
                Email = dto.Email,
                PasswordHash = dto.Password,
                Role = UserRole.Instructor,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var instructor = new Instructor
            {
                Bio = dto.Bio,
                WorkStartDate = dto.WorkStartDate,
                UserId = user.Id,
            };

            _context.Instructors.Add(instructor);
            await _context.SaveChangesAsync();

            return Ok(
                new
                {
                    instructor.Id,
                    instructor.Bio,
                    instructor.WorkStartDate,
                    user = new
                    {
                        user.Id,
                        user.FirstName,
                        user.Surname,
                        user.Email,
                    },
                }
            );
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] CreateInstructorDto dto)
        {
            var instructor = await _context
                .Instructors.Include(i => i.User)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (instructor == null)
                return NotFound();

            if (instructor.User != null)
            {
                instructor.User.FirstName = dto.FirstName;
                instructor.User.Surname = dto.Surname;
                instructor.User.Email = dto.Email;
            }

            instructor.Bio = dto.Bio;
            instructor.WorkStartDate = dto.WorkStartDate;

            await _context.SaveChangesAsync();

            var identityUser = await _userManager.FindByEmailAsync(instructor.User!.Email!);
            if (identityUser != null && identityUser.Email != dto.Email)
            {
                identityUser.Email = dto.Email;
                identityUser.UserName = dto.Email;
                await _userManager.UpdateAsync(identityUser);
            }

            return Ok(instructor);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var instructor = await _context
                .Instructors.Include(i => i.User)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (instructor == null)
                return NotFound();

            var identityUser = await _userManager.FindByEmailAsync(instructor.User!.Email!);
            if (identityUser != null)
                await _userManager.DeleteAsync(identityUser);

            _context.Users.Remove(instructor.User!);
            _context.Instructors.Remove(instructor);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
