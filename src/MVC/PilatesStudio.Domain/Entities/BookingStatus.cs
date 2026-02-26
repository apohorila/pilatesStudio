using System;
using System.Collections.Generic;

namespace PilatesStudio.Domain.Entities;

public partial class BookingStatus: Entity
{

    public string StatusName { get; set; } = null!;

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
