namespace PilatesStudio.Domain.Entities;

public class Booking : Entity, IAggregateRoot
{
    public long UserId { get; set; }
    public long ClassId { get; set; }
    public string Status { get; set; } 
    public DateTime CreatedAt { get; set; }
}