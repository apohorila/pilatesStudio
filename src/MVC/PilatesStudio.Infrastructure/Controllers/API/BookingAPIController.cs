using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PilatesStudio.Domain.Entities;
using PilatesStudio.Infrastructure;

namespace PilatesStudio.Infrastructure.Controllers.Api
{
    public class CreateBookingDto
    {
        public long UserId { get; set; }
        public long ClassId { get; set; }
    }

    [Route("api/bookings")]
    [ApiController]
    public class BookingsApiController : ControllerBase
    {
        private readonly PilatesDbContext _context;

        public BookingsApiController(PilatesDbContext context)
        {
            _context = context;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(long userId)
        {
            var bookings = await _context
                .Bookings.Where(b => b.UserId == userId)
                .Include(b => b.Class)
                    .ThenInclude(c => c.Type)
                .Include(b => b.Class)
                    .ThenInclude(c => c.Instructor)
                        .ThenInclude(i => i.User)
                .Include(b => b.Status)
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBookingDto dto)
        {
            var existing = await _context
                .Bookings.Include(b => b.Status)
                .FirstOrDefaultAsync(b =>
                    b.UserId == dto.UserId
                    && b.ClassId == dto.ClassId
                    && b.Status.StatusName != "Cancelled"
                );

            if (existing != null)
                return BadRequest("Ви вже записані на це заняття.");

            var booking = new Booking
            {
                UserId = dto.UserId,
                ClassId = dto.ClassId,
                CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                StatusId = 1,
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            return Ok(booking);
        }
    }
}
