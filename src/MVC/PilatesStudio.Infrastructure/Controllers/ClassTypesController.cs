using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using PilatesStudio.Domain.Entities;
using PilatesStudio.Infrastructure;

namespace PilatesStudio.Infrastructure.Controllers
{
    public class ClassTypesController : Controller
    {
        private readonly PilatesDbContext _context;

        public ClassTypesController(PilatesDbContext context)
        {
            _context = context;
        }

        // GET: ClassTypes
        public async Task<IActionResult> Index()
        {
            return View(await _context.ClassTypes.ToListAsync());
        }

        // GET: ClassTypes/Details/5
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var classType = await _context.ClassTypes
                .FirstOrDefaultAsync(m => m.Id == id);
            if (classType == null)
            {
                return NotFound();
            }

            return View(classType);
        }

        // GET: ClassTypes/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: ClassTypes/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("TypeName,Description,Id")] ClassType classType)
        {
            if (ModelState.IsValid)
            {
                _context.Add(classType);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(classType);
        }

        // GET: ClassTypes/Edit/5
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var classType = await _context.ClassTypes.FindAsync(id);
            if (classType == null)
            {
                return NotFound();
            }
            return View(classType);
        }

        // POST: ClassTypes/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, [Bind("TypeName,Description,Id")] ClassType classType)
        {
            if (id != classType.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(classType);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ClassTypeExists(classType.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(classType);
        }

        // GET: ClassTypes/Delete/5
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var classType = await _context.ClassTypes
                .FirstOrDefaultAsync(m => m.Id == id);
            if (classType == null)
            {
                return NotFound();
            }

            return View(classType);
        }

        // POST: ClassTypes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            var classType = await _context.ClassTypes.FindAsync(id);
            if (classType != null)
            {
                _context.ClassTypes.Remove(classType);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ClassTypeExists(long id)
        {
            return _context.ClassTypes.Any(e => e.Id == id);
        }
    }
}
