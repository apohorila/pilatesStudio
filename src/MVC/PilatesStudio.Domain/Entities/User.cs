namespace PilatesStudio.Domain.Entities;

public class User : Entity, IAggregateRoot
{
    public string FirstName {get;set;}
    public string Surname {get; set;}
    public string Email {get;set;}
    public string PasswordHash {get; set;}
    public DateTime BirthDate {get;set;}
}