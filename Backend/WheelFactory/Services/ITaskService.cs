using WheelFactory.Models;

namespace WheelFactory.Services
{
    public interface ITaskService
    {
        bool AddPackOrders(Models.Task p);
        bool AddPaintOrders(Models.Task p);
        bool AddSandOrders(Models.Task sand);
        bool DeleteTask(int id);
        List<Models.Task> GetAllPaint();
        List<Orders> GetPack();
        List<Models.Task> GetPackId(int id);
        List<Orders> GetPaint();
        List<Models.Task> GetPaintId(int id);
        List<Orders> GetSold();
        List<Models.Task> GetSoldId(int id);
        List<Models.Task> GetTask();
        List<Models.Task> GetTaskById(int id);
        bool UpdateTask(int id, Models.Task t);
    }
}