using Microsoft.AspNetCore.Identity;
using PilatesStudio.Domain.Entities;

namespace PilatesStudio.Infrastructure
{
    public class RoleInitializer
    {
        public static async Task InitializeAsync(
            UserManager<AppUser> userManager, 
            RoleManager<IdentityRole> roleManager)
        {
            
            if (await roleManager.FindByNameAsync("Admin") == null)
                await roleManager.CreateAsync(new IdentityRole("Admin"));

            if (await roleManager.FindByNameAsync("User") == null)
                await roleManager.CreateAsync(new IdentityRole("User"));

            if (await roleManager.FindByNameAsync("Instructor") == null)
                await roleManager.CreateAsync(new IdentityRole("Instructor"));

       
            string adminEmail = "admin@svidomo.com";
            string adminPassword = "Admin_123";

            if (await userManager.FindByNameAsync(adminEmail) == null)
            {
                AppUser admin = new AppUser
                {
                    Email = adminEmail,
                    UserName = adminEmail,
                    FirstName = "Admin",
                    Role = UserRole.Admin
                };

                IdentityResult result = await userManager.CreateAsync(admin, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "Admin");
                }
            }
        }
    }
}