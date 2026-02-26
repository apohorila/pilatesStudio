using System;
using System.Collections.Generic;

namespace PilatesStudio.Domain.Entities;

public partial class Booking: Entity
{
  
    public long UserId { get; set; }

    public long ClassId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public long StatusId { get; set; }

    public virtual BookingStatusHistory? BookingStatusHistory { get; set; }

    public virtual Class Class { get; set; } = null!;

    public virtual BookingStatus Status { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
