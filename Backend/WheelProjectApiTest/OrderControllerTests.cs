using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using WheelFactory.Controllers;
using WheelFactory.Models;
using WheelFactory.Services;

namespace WheelFactory.Tests
{
    [TestFixture]
    public class OrdersControllerTests
    {
        private Mock<IOrdersService> _mockService;
        private OrdersController _controller;

        [SetUp]
        public void SetUp()
        {
            _mockService = new Mock<IOrdersService>();
            _controller = new OrdersController(null, _mockService.Object);
        }

        // Test for Get(int id)
        [Test]
        public void GetOrderById_ExistingId_ReturnsOkResult()
        {
            // Arrange
            var order = new Orders { OrderId = 1, ClientName = "Client 1", Status = "neworder" };
            _mockService.Setup(s => s.GetById(1)).Returns(order);

            // Act
            var result = _controller.Get(1);

            // Assert
            //Assert.That(result, Is.EqualTo(order));
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            Assert.That(((OkObjectResult)result).Value, Is.EqualTo(order));
        }

        // Test for GetAllOrders
        [Test]
        public void GetAllOrders_ReturnsListOfOrders()
        {
            // Arrange
            var orders = new List<Orders>
            {
                new Orders { OrderId = 1, ClientName = "Client 1", Status = "neworder" },
                new Orders { OrderId = 2, ClientName = "Client 2", Status = "completed" }
            };
            _mockService.Setup(s => s.GetOrders()).Returns(orders);

            // Act
            var result = _controller.GetAllOrders();

            // Assert
            //Assert.That(result, Is.EqualTo(orders));

            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            Assert.That(((OkObjectResult)result).Value, Is.EqualTo(orders));
        }

        // Test for GetCurrentOrders
        [Test]
        public void GetCurrentOrders_ReturnsCurrentOrders()
        {
            // Arrange
            var currentOrders = new List<Orders> { new Orders { OrderId = 1, Status = "neworder" } };
            _mockService.Setup(s => s.GetCurrent()).Returns(currentOrders);

            // Act
            var result = _controller.GetCurrentOrders();

            // Assert
            //Assert.That(result, Is.EqualTo(currentOrders));
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.That(((OkObjectResult)result).Value, Is.EqualTo(currentOrders));
        }

        // Test for GetCompletedOrders
        [Test]
        public void GetCompletedOrders_ReturnsCompletedOrders()
        {
            // Arrange
            var completedOrders = new List<Orders> { new Orders { OrderId = 1, Status = "completed" } };
            _mockService.Setup(s => s.GetComplete()).Returns(completedOrders);

            // Act
            var result = _controller.GetCompletedOrders();

            // Assert
            //Assert.That(result, Is.EqualTo(completedOrders));
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            Assert.That(((OkObjectResult)result).Value, Is.EqualTo(completedOrders));
        }

        // Test for Post Order
        [Test]
        public async System.Threading.Tasks.Task PostOrder_ValidOrder_ReturnsOkResult()
        {
            // Arrange
            var orderDto = new OrderDTO
            {
                ClientName = "Test Client",
                ImageUrl = new FormFile(new MemoryStream(), 0, 100, "Data", "test.jpg")
            };
            _mockService.Setup(s => s.AddOrders(It.IsAny<Orders>())).Returns(true);

            // Act
            var result = await _controller.Post(orderDto);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }

        [Test]
        public async System.Threading.Tasks.Task PostOrder_NoFileUploaded_ReturnsBadRequest()
        {
            // Arrange
            var orderDto = new OrderDTO { ClientName = "Test Client" };

            // Act
            var result = await _controller.Post(orderDto);

            // Assert
            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
        }

        // Test for Put Order
        [Test]
        public void PutOrder_ValidOrder_ReturnsOkResult()
        {
            // Arrange
            var orderDto = new OrderDTO { Status = "completed" };
            _mockService.Setup(s => s.UpdateOrder(1, "completed")).Returns(true);

            // Act
            var result = _controller.Put(1, orderDto);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }

        [Test]
        public void PutOrder_InvalidOrder_ReturnsBadRequest()
        {
            // Arrange
            var orderDto = new OrderDTO { Status = "completed" };
            _mockService.Setup(s => s.UpdateOrder(1, "completed")).Returns(false);

            // Act
            var result = _controller.Put(1, orderDto);

            // Assert
            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
        
    }








        // Test for Scrap Order
        [Test]
        public void ScrapOrder_ValidId_ReturnsOkResult()
        {
            // Arrange
            _mockService.Setup(s => s.ScrapOrder(1)).Returns(true);

            // Act
            var result = _controller.PutScrapOrder(1);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }

        [Test]
        public void ScrapOrder_InvalidId_ReturnsBadRequest()
        {
            // Arrange
            _mockService.Setup(s => s.ScrapOrder(1)).Returns(false);

            // Act
            var result = _controller.PutScrapOrder(1);

            // Assert
            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
        }

        // Test for Inventory Orders
        [Test]
        public void GetInventoryOrders_ReturnsOkResult()
        {
            // Arrange
            var orders = new List<Orders> { new Orders { OrderId = 1, Status = "neworder" } };
            _mockService.Setup(s => s.GetInventOrders()).Returns(orders);

            // Act
            var result = _controller.GetOrdersInventory();

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }

        [Test]
        public void UpdateInventoryOrder_ValidId_ReturnsOkResult()
        {
            // Arrange
            _mockService.Setup(s => s.UpdateInventOrder(1)).Returns(true);

            // Act
            var result = _controller.PutOrdersInventory(1);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }

        [Test]
        public void UpdateInventoryOrder_InvalidId_ReturnsBadRequest()
        {
            // Arrange
            _mockService.Setup(s => s.UpdateInventOrder(1)).Returns(false);

            // Act
            var result = _controller.PutOrdersInventory(1);

            // Assert
            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
        }
    }
}
