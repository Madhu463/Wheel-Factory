using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using WheelFactory.Models;
using static NuGet.Packaging.PackagingConstants;
using Task = WheelFactory.Models.Task;

namespace WheelFactory.Services
{
    public class TaskService : ITaskService
    {
        private readonly WheelContext _context;
        private readonly IOrdersService _orders;

        public TaskService(WheelContext context, IOrdersService service)
        {
            _context = context;
            _orders = service;
        }

        [HttpGet]
        public List<Task> GetTask()
        {
            try
            {
                return _context.Tasks.ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching tasks", ex);
            }
        }

        public List<Task> GetTaskById(int id)
        {
            try
            {
                var tasks = _context.Tasks.Where(t => t.OrderId == id).ToList();
                if (tasks == null || !tasks.Any())
                {
                    throw new KeyNotFoundException($"No tasks found for Order ID {id}");
                }
                return tasks;
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching tasks by Order ID", ex);
            }
        }

        public List<Task> GetPackId(int id)
        {
            try
            {
                return _context.Tasks.Where(b => b.OrderId == id && b.Status == "packaging").ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching packaging tasks by Order ID", ex);
            }
        }

        public List<Orders> GetSold()
        {
            try
            {
                return _context.OrderDetails.Where(o => o.Status == "Soldering" || o.Status == "Redo").ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching soldering or redo orders", ex);
            }
        }

        public List<Task> GetSoldId(int id)
        {
            try
            {
                return _context.Tasks.Where(b => b.OrderId == id && b.Status == "soldering").ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching soldering tasks by Order ID", ex);
            }
        }

        public List<Task> GetPaintId(int id)
        {
            try
            {
                return _context.Tasks.Where(b => b.OrderId == id && b.Status == "painting").ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching painting tasks by Order ID", ex);
            }
        }

        public bool AddSandOrders(Task sand)
        {
            try
            {
                _context.Tasks.Add(sand);
                _context.SaveChanges();
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error adding sand orders to the database", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error adding sand orders", ex);
            }
        }

        public List<Orders> GetPaint()
        {
            try
            {
                return _context.OrderDetails.Where(o => o.Status == "Painting").ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching painting orders", ex);
            }
        }

        public List<Task> GetAllPaint()
        {
            try
            {
                return _context.Tasks.Where(o => o.Status == "Soldering").ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching all soldering tasks", ex);
            }
        }

        public List<Orders> GetPack()
        {
            try
            {
                return _context.OrderDetails.Where(o => o.Status == "Packaging").ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching packaging orders", ex);
            }
        }

        public bool AddPaintOrders(Task p)
        {
            try
            {
                _context.Tasks.Add(p);
                _context.SaveChanges();
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error adding paint orders to the database", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error adding paint orders", ex);
            }
        }

        public bool AddPackOrders(Task p)
        {
            try
            {
                _context.Tasks.Add(p);
                _context.SaveChanges();
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error adding pack orders to the database", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error adding pack orders", ex);
            }
        }

        public bool UpdateTask(int id, Task t)
        {
            try
            {
                var task = _context.Tasks.Find(id);
                if (task == null)
                {
                    throw new KeyNotFoundException($"Task with ID {id} not found");
                }

                task.SandBlastingLevel = t.SandBlastingLevel;
                task.Status = t.Status;
                task.ImageUrl = t.ImageUrl;
                task.Notes = t.Notes;
                task.IRating = t.IRating;
                task.PColor = t.PColor;
                task.PType = t.PType;

                _context.SaveChanges();
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error updating task in the database", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating task", ex);
            }
        }

        public bool DeleteTask(int id)
        {
            try
            {
                var task = _context.Tasks.Find(id);
                if (task == null)
                {
                    throw new KeyNotFoundException($"Task with ID {id} not found");
                }

                _context.Tasks.Remove(task);
                _context.SaveChanges();
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error deleting task from the database", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting task", ex);
            }
        }
    }
}

