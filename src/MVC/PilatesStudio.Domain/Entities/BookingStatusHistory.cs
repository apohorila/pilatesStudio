namespace PilatesStudio.Domain.Entities;

public class BookingStatusHistory : Entity
{
    public long BookingId { get; set; }
    public string OldStatus { get; set; }
    public string NewStatus { get; set; }
    public DateTime ChangedAt { get; set; }
}