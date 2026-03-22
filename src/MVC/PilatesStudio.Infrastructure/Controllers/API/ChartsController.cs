using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PilatesStudio.Infrastructure;

namespace PilatesStudio.Infrastructure.Controllers.Api
{
    [Route("api/charts")]
    [ApiController]
    public class ChartsController : ControllerBase
    {
        private readonly PilatesDbContext _context;

        public ChartsController(PilatesDbContext context)
        {
            _context = context;
        }

        private record BookingsPerClassItem(string ClassName, int Count);

        [HttpGet("bookingsPerClass")]
        public async Task<JsonResult> GetBookingsPerClass(CancellationToken cancellationToken)
        {
            var data = await _context
                .Classes.Select(c => new BookingsPerClassItem(
                    c.ClassName ?? "—",
                    c.Bookings.Count(b => b.Status.StatusName != "Cancelled")
                ))
                .ToListAsync(cancellationToken);

            return new JsonResult(data);
        }

        private record BookingsByStatusItem(string Status, int Count);

        [HttpGet("bookingsByStatus")]
        public async Task<JsonResult> GetBookingsByStatus(CancellationToken cancellationToken)
        {
            var data = await _context
                .Bookings.GroupBy(b => b.Status.StatusName)
                .Select(g => new BookingsByStatusItem(g.Key ?? "—", g.Count()))
                .ToListAsync(cancellationToken);

            return new JsonResult(data);
        }
    }
}
