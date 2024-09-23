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
    public class ColorsController : ControllerBase
    {
        private readonly WheelContext _context;

        public ColorsController(WheelContext context)
        {
            _context = context;
        }

        // GET: api/Colors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Colors>>> GetColor()
        {
            return await _context.Color.ToListAsync();
        }

        // GET: api/Colors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Colors>> GetColors(int id)
        {
            var colors = await _context.Color.FindAsync(id);

            if (colors == null)
            {
                return NotFound();
            }

            return colors;
        }

        // PUT: api/Colors/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutColors(int id, Colors colors)
        {
            if (id != colors.Id)
            {
                return BadRequest();
            }

            _context.Entry(colors).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ColorsExists(id))
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

        // POST: api/Colors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Colors>> PostColors(Colors colors)
        {
            _context.Color.Add(colors);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetColors", new { id = colors.Id }, colors);
        }

        // DELETE: api/Colors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteColors(int id)
        {
            var colors = await _context.Color.FindAsync(id);
            if (colors == null)
            {
                return NotFound();
            }

            _context.Color.Remove(colors);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ColorsExists(int id)
        {
            return _context.Color.Any(e => e.Id == id);
        }
    }
}
