using Microsoft.AspNetCore.Identity;

namespace PilatesStudio.Domain.Entities
{
    public class AppUser : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? Surname { get; set; }
        public DateOnly? BirthDate { get; set; }
        public UserRole Role { get; set; } = UserRole.User;
    }
}
