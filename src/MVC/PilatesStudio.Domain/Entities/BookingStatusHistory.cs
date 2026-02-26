using System;
using System.Collections.Generic;

namespace PilatesStudio.Domain.Entities;

public partial class BookingStatusHistory : Entity
{

    public long BookingId { get; set; }

    public string? OldStatus { get; set; }

    public string? NewStatus { get; set; }

    public DateTime? ChangedAt { get; set; }

    public virtual Booking Booking { get; set; } = null!;
}
