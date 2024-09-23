using WheelFactory.Models;

namespace WheelFactory.Services
{
    public interface IOrdersService
    {
        bool AddOrders(Orders order);
        Orders GetById(int id);
        List<Orders> GetComplete();
        List<Orders> GetCurrent();
        List<Orders> GetInventOrders();
        List<Orders> GetOrders();
        List<Orders> GetScraped();
        bool ScrapOrder(int id);
        bool UpdateInventOrder(int id);
        bool UpdateOrder(int id, string status);
    }
}