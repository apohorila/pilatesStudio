using System;
using System.Collections.Generic;

namespace PilatesStudio.Domain.Entities;

public partial class Class : Entity
{

    public string? ClassName { get; set; }

    public long InstructorId { get; set; }

    public DateTime? ScheduledAt { get; set; }

    public long? TypeId { get; set; }

    public int? MaxCapacity { get; set; }

    public string? Description { get; set; }

    public string? Location { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual Instructor Instructor { get; set; } = null!;

    public virtual ClassType? Type { get; set; }
}
