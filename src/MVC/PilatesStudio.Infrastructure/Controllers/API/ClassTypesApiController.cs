using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PilatesStudio.Domain.Entities;
using PilatesStudio.Infrastructure;

namespace PilatesStudio.Infrastructure.Controllers.Api
{
    public class CreateClassTypeDto
    {
        public string? TypeName { get; set; }
        public string? Description { get; set; }
    }

    [Route("api/classtypes")]
    [ApiController]
    public class ClassTypesApiController : ControllerBase
    {
        private readonly PilatesDbContext _context;

        public ClassTypesApiController(PilatesDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var types = await _context.ClassTypes.ToListAsync();

            if (!types.Any())
                return NotFound("No class types found.");

            return Ok(types);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var type = await _context.ClassTypes.FindAsync(id);

            if (type == null)
                return NotFound($"Class type with ID {id} not found.");

            return Ok(type);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateClassTypeDto dto)
        {
            var classType = new ClassType
            {
                TypeName = dto.TypeName,
                Description = dto.Description,
            };

            _context.ClassTypes.Add(classType);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = classType.Id }, classType);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] ClassType classType)
        {
            if (id != classType.Id)
                return BadRequest("ID in URL does not match ID in body.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var exists = await _context.ClassTypes.AnyAsync(ct => ct.Id == id);
            if (!exists)
                return NotFound($"Class type with ID {id} not found.");

            _context.Entry(classType).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var type = await _context.ClassTypes.FindAsync(id);

            if (type == null)
                return NotFound($"Class type with ID {id} not found.");

            _context.ClassTypes.Remove(type);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
