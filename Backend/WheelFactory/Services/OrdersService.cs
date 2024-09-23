using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using WheelFactory.Models;

namespace WheelFactory.Services
{
    public class OrdersService : IOrdersService
    {
        private readonly WheelContext _context;

        public OrdersService(WheelContext context)
        {
            _context = context;
        }

        public List<Orders> GetOrders()
        {
            try
            {
                return _context.OrderDetails.ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching orders", ex);
            }
        }

        public Orders GetById(int id)
        {
            try
            {
                var order = _context.OrderDetails.Find(id);
                if (order == null)
                {
                    throw new KeyNotFoundException($"Order with ID {id} not found");
                }
                return order;
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching order by ID", ex);
            }
        }

        public List<Orders> GetComplete()
        {
            try
            {
                return _context.OrderDetails.Where(o => o.Status == "completed").ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching completed orders", ex);
            }
        }

        public List<Orders> GetCurrent()
        {
            try
            {
                return _context.OrderDetails.Where(o =>( o.Status != "completed" && o.Status!="Scrap")).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching current orders", ex);
            }
        }

        public List<Orders> GetScraped()
        {
            try
            {
                return _context.OrderDetails.Where(o => o.Status == "Scrap").ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching scraped orders", ex);
            }
        }

        public bool AddOrders(Orders order)
        {
            try
            {
                _context.OrderDetails.Add(order);
                _context.SaveChanges();
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error adding new order to the database", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error adding order", ex);
            }
        }

        public bool UpdateOrder(int id, string status)
        {
            try
            {
                var order = _context.OrderDetails.Find(id);
                if (order == null)
                {
                    throw new KeyNotFoundException($"Order with ID {id} not found");
                }

                order.Status = status;
                _context.SaveChanges();

                return true;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error updating order in the database", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating order", ex);
            }
        }

        public bool ScrapOrder(int id)
        {
            try
            {
                var order = _context.OrderDetails.Find(id);
                if (order == null)
                {
                    return false;
                }

                order.Status = "Scrap";
                _context.SaveChanges();
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error marking order as scrap in the database", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error scrapping order", ex);
            }
        }

        public bool UpdateInventOrder(int id)
        {
            try
            {
                var order = _context.OrderDetails.Find(id);
                if (order == null)
                {
                    throw new KeyNotFoundException($"Order with ID {id} not found");
                }

                order.Status = "Soldering";
                _context.SaveChanges();
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Error updating order status to 'Soldering'", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating inventory order", ex);
            }
        }

        public List<Orders> GetInventOrders()
        {
            try
            {
                return _context.OrderDetails.Where(o => o.Status == "neworder").ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching inventory orders", ex);
            }
        }
    }
}

