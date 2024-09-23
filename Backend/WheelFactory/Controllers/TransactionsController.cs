using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Versioning;
using WheelFactory.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Microsoft.CodeAnalysis.Elfie.Diagnostics;


namespace WheelFactory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TransactionsController : ControllerBase
    {
        private readonly WheelContext _context;
        private ILogger _logger;

        public TransactionsController(WheelContext wc,ILogger<TransactionsController> log)
        {
            _context = wc;
            _logger = log;
        }


        // GET: api/Transactions/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTransaction(int id)
        {
            _logger.LogInformation("this method is called get transactions");
            var transaction = await _context.Transactions.Where(a => a.OrderId == id).ToListAsync();

            return Ok(transaction);
        }


        // GET: api/Transactions
        [HttpGet()]
        public async Task<IActionResult> GetTransactions()
        {
            var trans = await _context.Transactions.ToListAsync();
            return Ok(trans);
        }

        

        [HttpPost("{id}")]
        public async Task<IActionResult> PostTranscation(Transaction t) {
        
            _context.Transactions.Add(t);
            await _context.SaveChangesAsync();
            return Ok(t);

          
        }


    }
}



