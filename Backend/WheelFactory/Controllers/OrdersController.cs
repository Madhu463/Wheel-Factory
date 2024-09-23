using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WheelFactory.Models;
using WheelFactory.Services;

namespace WheelFactory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly string _basePath = @"C:\Users\pulkit\Desktop\WheelFactory\Backend\backend\TheWheelFactory\WheelFactory\wwwroot\images\";
        private readonly IOrdersService _order;
        private readonly WheelContext _wheelContext;

        public OrdersController(WheelContext wc, IOrdersService orderService)
        {
            _order = orderService;
            _wheelContext = wc;
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            try
            {
                var order = _order.GetById(id);
               
                return Ok(order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet()]
        public IActionResult GetAllOrders()
        {
            try
            {
                var orders = _order.GetOrders();
        
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("current")]
        public IActionResult GetCurrentOrders()
        {
            try
            {
                var orders = _order.GetCurrent();
               
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("completed")]
        public IActionResult GetCompletedOrders()
        {
            try
            {
                var orders = _order.GetComplete();
               
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("scraped")]
        public IActionResult GetScrapedOrders()
        {
            try
            {
                var orders = _order.GetScraped();
               
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm] OrderDTO value)
        {
            try
            {
                if (value.ImageUrl == null || value.ImageUrl.Length == 0)
                    return BadRequest("No file uploaded.");

                var originalFileName = Path.GetFileName(value.ImageUrl.FileName);
                var filePath = Path.Combine(_basePath, originalFileName);

                if (!Directory.Exists(_basePath))
                {
                    Directory.CreateDirectory(_basePath);
                }

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await value.ImageUrl.CopyToAsync(stream);
                }

                var order = new Orders
                {
                    ClientName = value.ClientName,
                    Year = value.Year,
                    Make = value.Make,
                    Model = value.Model,
                    Notes = value.Notes,
                    Status = "neworder",
                    DamageType = value.DamageType,
                    ImageUrl = "http://localhost:5041/images/" + originalFileName
                };

                if (_order.AddOrders(order))
                {
                    return Ok(order);
                }

                return BadRequest("Failed to add the order.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromForm] OrderDTO value)
        {
            try
            {
                if (value == null || string.IsNullOrEmpty(value.Status))
                {
                    return BadRequest("Invalid order data provided.");
                }

                var isUpdated = _order.UpdateOrder(id, value.Status);
                if (isUpdated)
                {
                    return Ok($"Order with ID {id} updated successfully.");
                }

                return BadRequest($"Order with ID {id} not found or update failed.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("scrap/{id}")]
        public IActionResult PutScrapOrder(int id)
        {
            try
            {
                if (_order.ScrapOrder(id))
                {
                    return Ok($"Scraped order {id}");
                }
                return BadRequest("Failed to scrap the order.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("Inventory")]
        public IActionResult GetOrdersInventory()
        {
            try
            {
                var orders = _order.GetInventOrders();
               
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("Inventory/{id}")]
        public IActionResult PutOrdersInventory(int id)
        {
            try
            {
                if (_order.UpdateInventOrder(id))
                {
                    return Ok("Status changed to Soldering");
                }
                return BadRequest("Failed to update inventory order.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}

