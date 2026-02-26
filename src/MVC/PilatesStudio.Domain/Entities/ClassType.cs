using System;
using System.Collections.Generic;

namespace PilatesStudio.Domain.Entities;

public partial class ClassType : Entity
{

    public string? TypeName { get; set; }

    public virtual ICollection<Class> Classes { get; set; } = new List<Class>();
}
