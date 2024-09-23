using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WheelFactory.Models;
using WheelFactory.Services;
using Task = WheelFactory.Models.Task;

namespace WheelFactory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TaskController : ControllerBase
    {
        private readonly string _basePath = @"C:\Users\pulkit\Desktop\WheelFactory\Backend\backend\TheWheelFactory\WheelFactory\wwwroot\images\";
        private readonly ITaskService _task;
        private readonly IOrdersService _orders;
        private readonly WheelContext _wc;

        public TaskController(WheelContext wc, ITaskService ts, IOrdersService os)
        {
            _wc = wc;
            _task = ts;
            _orders = os;
        }

        [HttpGet("packaging/{id}")]
        public IActionResult GetPackagingById(int id)
        {
            try
            {
                var result = _task.GetPackId(id);
                if (result == null || result.Count == 0)
                {
                    return NotFound($"No packaging found with ID {id}.");
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var tasks = _task.GetTask();
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            try
            {
                var tasks = _task.GetTaskById(id);
                if (tasks == null || tasks.Count == 0)
                {
                    return NotFound($"No task found with ID {id}.");
                }
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("soldering")]
        public IActionResult GetOrdersSoldering(int id)
        {
            try
            {
                var sold = _task.GetSold();
                if (sold == null)
                {
                    return NotFound("No soldering orders found.");
                }
                return Ok(sold);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("soldering/{id}")]
        public IActionResult GetSolderingById(int id)
        {
            try
            {
                var result = _task.GetSoldId(id);
                if (result == null || result.Count == 0)
                {
                    return NotFound($"No soldering task found with ID {id}.");
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("soldering")]
        public async Task<IActionResult> PostOrdersSoldering([FromForm] SandDTO value)
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

                var task = new Task
                {
                    OrderId = value.OrderId,
                    SandBlastingLevel = value.SandBlastingLevel,
                    Notes = value.Notes,
                    Status = "Soldering",
                    ImageUrl = "http://localhost:5041/images/" + originalFileName
                };

                if (_task.AddSandOrders(task))
                {
                    var obj = _wc.OrderDetails.Find(value.OrderId);
                    if (obj != null)
                    {
                        obj.Status = "Painting";
                        _wc.OrderDetails.Update(obj);
                        _wc.SaveChanges();
                    }
                    return Ok(value);
                }

                return BadRequest("Failed to add soldering order.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("painting")]
        public IActionResult GetOrdersPainting()
        {
            try
            {
                var sold = _task.GetPaint();
                if (sold == null)
                {
                    return NotFound("No painting orders found.");
                }
                return Ok(sold);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("painting/{id}")]
        public IActionResult GetPaintingById(int id)
        {
            try
            {
                var tasks = _task.GetPaintId(id);
                if (tasks == null || tasks.Count == 0)
                {
                    return NotFound($"No painting task found with ID {id}.");
                }
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("painting")]
        public async Task<IActionResult> PostOrdersPainting([FromForm] PaintDTO value)
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

                var task = new Task
                {
                    OrderId = value.OrderId,
                    PColor = value.PColor,
                    PType = value.PType,
                    Notes = value.Notes,
                    Status = "Painting",
                    ImageUrl = "http://localhost:5041/images/" + originalFileName
                };

                if (_task.AddPaintOrders(task))
                {
                    var obj = _wc.OrderDetails.Find(value.OrderId);
                    if (obj != null)
                    {
                        obj.Status = "Packaging";
                        _wc.OrderDetails.Update(obj);
                        _wc.SaveChanges();
                    }
                    return Ok(value);
                }

                return BadRequest("Failed to add painting order.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("packaging")]
        public IActionResult GetOrdersPackaging()
        {
            try
            {
                var sold = _task.GetPack();
                if (sold == null)
                {
                    return NotFound("No packaging orders found.");
                }
                return Ok(sold);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("allpainting")]
        public IActionResult GetAllPainting()
        {
            try
            {
                var sold = _task.GetAllPaint();
                if (sold == null)
                {
                    return NotFound("No painting tasks found.");
                }
                return Ok(sold);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("packaging")]
        public async Task<IActionResult> PostOrdersPackaging([FromForm] PackDTO value)
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

                var task = new Task
                {
                    OrderId = value.OrderId,
                    IRating = value.IRating,
                    Notes = value.Notes,
                    Status = "Packaging",
                    ImageUrl = "http://localhost:5041/images/" + originalFileName
                };

                if (_task.AddPackOrders(task))
                {
                    var obj = _wc.OrderDetails.Find(value.OrderId);
                    if (obj != null)
                    {
                        obj.Status = "Completed";
                        _wc.OrderDetails.Update(obj);
                        _wc.SaveChanges();
                    }
                    return Ok(value);
                }

                return BadRequest("Failed to add packaging order.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}

