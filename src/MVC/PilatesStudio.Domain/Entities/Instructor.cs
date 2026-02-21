namespace PilatesStudio.Domain.Entities;

public class Instructor : User
{
    public string Bio { get; set; }
    public DateTime WorkStartDate { get; set; }
    public long ClassTypeId { get; set; }
}