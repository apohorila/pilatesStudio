namespace PilatesStudio.Domain.Entities;

public class TrainingClass : Entity, IAggregateRoot
{
    public string ClassName { get; set; }
    public string Description { get; set; }
    public DateTime ScheduledAt { get; set; }
    public int MaxCapacity { get; set; }
    public long InstructorUserId { get; set; } 
    public long TypeId { get; set; }
}