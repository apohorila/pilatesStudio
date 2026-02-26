using System;
using System.Collections.Generic;

namespace PilatesStudio.Domain.Entities;

public partial class User : Entity
{

    public string? FirstName { get; set; }

    public string? Surname { get; set; }

    public string? Email { get; set; }

    public string? PasswordHash { get; set; }

    public DateOnly? BirthDate { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual Instructor? Instructor { get; set; }
}
