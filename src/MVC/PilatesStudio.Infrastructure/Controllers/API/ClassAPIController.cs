using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PilatesStudio.Domain.Entities;
using PilatesStudio.Infrastructure;

namespace PilatesStudio.Infrastructure.Controllers.Api
{
    public class CreateClassDto
    {
        public string? ClassName { get; set; }
        public DateTime? ScheduledAt { get; set; }
        public long? TypeId { get; set; }
        public int? MaxCapacity { get; set; }
        public string? Description { get; set; }
        public string? Location { get; set; }
    }

    [Route("api/classes")]
    [ApiController]
    public class ClassesApiController : ControllerBase
    {
        private readonly PilatesDbContext _context;

        public ClassesApiController(PilatesDbContext context)
        {
            _context = context;
        }

        [HttpGet("instructor/{instructorId}")]
        public async Task<IActionResult> GetByInstructor(long instructorId)
        {
            var classes = await _context
                .Classes.Where(c => c.InstructorId == instructorId)
                .Include(c => c.Type)
                .Include(c => c.Bookings)
                    .ThenInclude(b => b.User)
                .Include(c => c.Bookings)
                    .ThenInclude(b => b.Status)
                .ToListAsync();

            return Ok(classes);
        }

        [HttpGet("detail/{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var c = await _context
                .Classes.Include(c => c.Type)
                .Include(c => c.Instructor)
                    .ThenInclude(i => i.User)
                .Include(c => c.Bookings)
                    .ThenInclude(b => b.User)
                .Include(c => c.Bookings)
                    .ThenInclude(b => b.Status)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (c == null)
                return NotFound();
            return Ok(c);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll(
            [FromQuery] long? typeId,
            [FromQuery] DateTime? date
        )
        {
            var query = _context
                .Classes.Include(c => c.Type)
                .Include(c => c.Instructor)
                    .ThenInclude(i => i.User)
                .Include(c => c.Bookings)
                .Where(c => c.ScheduledAt > DateTime.Now)
                .AsQueryable();

            if (typeId.HasValue)
                query = query.Where(c => c.TypeId == typeId);

            if (date.HasValue)
                query = query.Where(c =>
                    c.ScheduledAt.HasValue && c.ScheduledAt.Value.Date == date.Value.Date
                );

            var classes = await query.OrderBy(c => c.ScheduledAt).ToListAsync();
            return Ok(classes);
        }

        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateClassDto dto,
            [FromQuery] long instructorId
        )
        {
            if (dto.ScheduledAt.HasValue && dto.ScheduledAt.Value < DateTime.Now)
                return BadRequest("Не можна створити заняття в минулому.");
            var newClass = new Class
            {
                ClassName = dto.ClassName,
                InstructorId = instructorId,
                ScheduledAt = dto.ScheduledAt.HasValue
                    ? DateTime.SpecifyKind(dto.ScheduledAt.Value, DateTimeKind.Unspecified)
                    : null,
                TypeId = dto.TypeId,
                MaxCapacity = dto.MaxCapacity,
                Description = dto.Description,
                Location = dto.Location,
            };

            _context.Classes.Add(newClass);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = newClass.Id }, newClass);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] CreateClassDto dto)
        {
            var c = await _context.Classes.FindAsync(id);
            if (c == null)
                return NotFound();

            c.ClassName = dto.ClassName;
            c.ScheduledAt = dto.ScheduledAt;
            c.TypeId = dto.TypeId;
            c.MaxCapacity = dto.MaxCapacity;
            c.Description = dto.Description;
            c.Location = dto.Location;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var c = await _context.Classes.FindAsync(id);
            if (c == null)
                return NotFound();

            _context.Classes.Remove(c);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("bookings/{bookingId}/confirm")]
        public async Task<IActionResult> ConfirmBooking(long bookingId)
        {
            var booking = await _context.Bookings.FindAsync(bookingId);
            if (booking == null)
                return NotFound();

            booking.StatusId = 2; 
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("bookings/{bookingId}/cancel")]
        public async Task<IActionResult> CancelBooking(long bookingId)
        {
            var booking = await _context.Bookings.FindAsync(bookingId);
            if (booking == null)
                return NotFound();

            booking.StatusId = 3;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("bookings/{bookingId}/attend")]
        public async Task<IActionResult> AttendBooking(long bookingId)
        {
            var booking = await _context.Bookings.FindAsync(bookingId);
            if (booking == null)
                return NotFound();

            booking.StatusId = 4;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
