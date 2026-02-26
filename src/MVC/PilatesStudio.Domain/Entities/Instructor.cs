using System;
using System.Collections.Generic;

namespace PilatesStudio.Domain.Entities;

public partial class Instructor : Entity
{

    public string? Bio { get; set; }

    public DateOnly? WorkStartDate { get; set; }

    public long? UserId { get; set; }

    public virtual ICollection<Class> Classes { get; set; } = new List<Class>();

    public virtual User? User { get; set; }
}
