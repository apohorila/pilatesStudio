namespace PilatesStudio.Domain.Entities;

public class ClassType : Entity, IAggregateRoot
{
    public string TypeName { get; set; }
    public string Description { get; set; }
}