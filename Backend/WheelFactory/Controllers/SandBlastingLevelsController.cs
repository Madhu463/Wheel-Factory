using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WheelFactory.Models;

namespace WheelFactory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SandBlastingLevelsController : ControllerBase
    {
        private readonly WheelContext _context;

        public SandBlastingLevelsController(WheelContext context)
        {
            _context = context;
        }

        // GET: api/SandBlastingLevels
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SandBlastingLevels>>> GetSandBlasting()
        {
            return await _context.SandBlasting.ToListAsync();
        }

        // GET: api/SandBlastingLevels/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SandBlastingLevels>> GetSandBlastingLevels(int id)
        {
            var sandBlastingLevels = await _context.SandBlasting.FindAsync(id);

            if (sandBlastingLevels == null)
            {
                return NotFound();
            }

            return sandBlastingLevels;
        }

        // PUT: api/SandBlastingLevels/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSandBlastingLevels(int id, SandBlastingLevels sandBlastingLevels)
        {
            if (id != sandBlastingLevels.Id)
            {
                return BadRequest();
            }

            _context.Entry(sandBlastingLevels).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SandBlastingLevelsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/SandBlastingLevels
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SandBlastingLevels>> PostSandBlastingLevels(SandBlastingLevels sandBlastingLevels)
        {
            _context.SandBlasting.Add(sandBlastingLevels);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSandBlastingLevels", new { id = sandBlastingLevels.Id }, sandBlastingLevels);
        }

        // DELETE: api/SandBlastingLevels/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSandBlastingLevels(int id)
        {
            var sandBlastingLevels = await _context.SandBlasting.FindAsync(id);
            if (sandBlastingLevels == null)
            {
                return NotFound();
            }

            _context.SandBlasting.Remove(sandBlastingLevels);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SandBlastingLevelsExists(int id)
        {
            return _context.SandBlasting.Any(e => e.Id == id);
        }
    }
}
