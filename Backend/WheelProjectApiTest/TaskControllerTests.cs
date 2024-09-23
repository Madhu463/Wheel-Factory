using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using WheelFactory.Controllers;
using WheelFactory.Models;
using WheelFactory.Services;

namespace WheelFactory.Tests
{
    [TestFixture]
    public class TaskControllerTests
    {
        private Mock<ITaskService> _mockTaskService;
        private Mock<IOrdersService> _mockOrdersService;
        private Mock<WheelContext> _mockContext;
        private TaskController _controller;

        [SetUp]
        public void SetUp()
        {
            _mockTaskService = new Mock<ITaskService>();
            _mockOrdersService = new Mock<IOrdersService>();
            _mockContext = new Mock<WheelContext>();

            _controller = new TaskController(null, _mockTaskService.Object, _mockOrdersService.Object);
        }

        // Test for Get Packaging By Id
        [Test]
        public void GetPackagingById_ExistingId_ReturnsOkResult()
        {
            // Arrange
            var tasks = new List<WheelFactory.Models.Task> { new WheelFactory.Models.Task { Id = 1, Status = "packaging" } };
            _mockTaskService.Setup(s => s.GetPackId(1)).Returns(tasks);

            // Act
            var result = _controller.GetPackagingById(1);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(tasks));
        }

        // Test for Get All Tasks
        [Test]
        public void GetAllTasks_ReturnsOkResult()
        {
            // Arrange
            var tasks = new List<WheelFactory.Models.Task> { new WheelFactory.Models.Task { Id = 1 } };
            _mockTaskService.Setup(s => s.GetTask()).Returns(tasks);

            // Act
            var result = _controller.Get();

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(tasks));
        }

        // Test for Get Task By Id
        [Test]
        public void GetTaskById_ExistingId_ReturnsOkResult()
        {
            // Arrange
            var tasks = new List<WheelFactory.Models.Task> { new WheelFactory.Models.Task { Id = 1 } };
            _mockTaskService.Setup(s => s.GetTaskById(1)).Returns(tasks);

            // Act
            var result = _controller.Get(1);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(tasks));
        }

        // Test for Get Orders Soldering
        [Test]
        public void GetOrdersSoldering_ReturnsOkResult()
        {
            // Arrange
            var orders = new List<Orders> { new Orders { Status = "Soldering" } };
            _mockTaskService.Setup(s => s.GetSold()).Returns(orders);

            // Act
            var result = _controller.GetOrdersSoldering(1);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(orders));
        }

        // Test for Get Soldering By Id
        [Test]
        public void GetSolderingById_ExistingId_ReturnsOkResult()
        {
            // Arrange
            var tasks = new List<WheelFactory.Models.Task> { new WheelFactory.Models.Task { Id = 1, Status = "soldering" } };
            _mockTaskService.Setup(s => s.GetSoldId(1)).Returns(tasks);

            // Act
            var result = _controller.GetSolderingById(1);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(tasks));
        }

        // Test for Get Painting By Id
        [Test]
        public void GetPaintingById_ExistingId_ReturnsOkResult()
        {
            // Arrange
            var tasks = new List<WheelFactory.Models.Task> { new WheelFactory.Models.Task { Id = 1, Status = "painting" } };
            _mockTaskService.Setup(s => s.GetPaintId(1)).Returns(tasks);

            // Act
            var result = _controller.GetPaintingById(1);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(tasks));
        }

        // Test for Post Orders Soldering
        [Test]
        public async System.Threading.Tasks.Task PostOrdersSoldering_ValidOrder_ReturnsOkResult()
        {
            // Arrange
            var fileMock = new Mock<IFormFile>();
            var sandDto = new SandDTO
            {
                OrderId = 1,
                SandBlastingLevel = "Level 1",
                Notes = "Some notes",
                ImageUrl = fileMock.Object
            };

            _mockTaskService.Setup(s => s.AddSandOrders(It.IsAny<WheelFactory.Models.Task>())).Returns(true);
            _mockContext.Setup(c => c.OrderDetails.Find(It.IsAny<int>())).Returns(new Orders { Status = "Painting" });

            // Act
            var result = await _controller.PostOrdersSoldering(sandDto);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }

        // Test for Get Orders Painting
        [Test]
        public void GetOrdersPainting_ReturnsOkResult()
        {
            // Arrange
            var orders = new List<Orders> { new Orders { Status = "Painting" } };
            _mockTaskService.Setup(s => s.GetPaint()).Returns(orders);

            // Act
            var result = _controller.GetOrdersPainting();

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(orders));
        }

        // Test for Post Orders Painting
        [Test]
        public async System.Threading.Tasks.Task PostOrdersPainting_ValidOrder_ReturnsOkResult()
        {
            // Arrange
            var fileMock = new Mock<IFormFile>();
            var paintDto = new PaintDTO
            {
                OrderId = 1,
                PColor = "Red",
                PType = "Type 1",
                Notes = "Some notes",
                ImageUrl = fileMock.Object
            };

            _mockTaskService.Setup(s => s.AddPaintOrders(It.IsAny<WheelFactory.Models.Task>())).Returns(true);
            _mockContext.Setup(c => c.OrderDetails.Find(It.IsAny<int>())).Returns(new Orders { Status = "Packaging" });

            // Act
            var result = await _controller.PostOrdersPainting(paintDto);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }

        // Test for Get Orders Packaging
        [Test]
        public void GetOrdersPackaging_ReturnsOkResult()
        {
            // Arrange
            var orders = new List<Orders> { new Orders { Status = "Packaging" } };
            _mockTaskService.Setup(s => s.GetPack()).Returns(orders);

            // Act
            var result = _controller.GetOrdersPackaging();

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(orders));
        }

        // Test for Get All Painting
        [Test]
        public void GetAllPainting_ReturnsOkResult()
        {
            // Arrange
            var tasks = new List<WheelFactory.Models.Task> { new WheelFactory.Models.Task { Status = "Soldering" } };
            _mockTaskService.Setup(s => s.GetAllPaint()).Returns(tasks);

            // Act
            var result = _controller.GetAllPainting();

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(tasks));
        }

        // Test for Post Orders Packaging
        [Test]
        public async System.Threading.Tasks.Task PostOrdersPackaging_ValidOrder_ReturnsOkResult()
        {
            // Arrange
            var fileMock = new Mock<IFormFile>();
            var packDto = new PackDTO
            {
                OrderId = 1,
                IRating = 5,
                Notes = "Some notes",
                ImageUrl = fileMock.Object
            };

            _mockTaskService.Setup(s => s.AddPackOrders(It.IsAny<WheelFactory.Models.Task>())).Returns(true);
            _mockContext.Setup(c => c.OrderDetails.Find(It.IsAny<int>())).Returns(new Orders { Status = "completed" });

            // Act
            var result = await _controller.PostOrdersPackaging(packDto);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }
    }
}



//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Moq;
//using NUnit.Framework;
//using System.Collections.Generic;
//using System.IO;
//using System.Threading.Tasks;
//using WheelFactory.Controllers;
//using WheelFactory.Models;
//using WheelFactory.Services;

//namespace WheelFactory.Tests
//{
//    [TestFixture]
//    public class TaskControllerTests
//    {
//        private Mock<ITaskService> _mockTaskService;
//        private Mock<IOrdersService> _mockOrdersService;
//        private TaskController _controller;

//        [SetUp]
//        public void SetUp()
//        {
//            _mockTaskService = new Mock<ITaskService>();
//            _mockOrdersService = new Mock<IOrdersService>();
//            _controller = new TaskController(null, _mockTaskService.Object, _mockOrdersService.Object);
//        }

//        // Test for Get Packaging By Id
//        [Test]
//        public void GetPackagingById_ExistingId_ReturnsOkResult()
//        {
//            // Arrange
//            var tasks = new List<WheelFactory.Models.Task> { new WheelFactory.Models.Task { Id = 1, Status = "packaging" } };
//            _mockTaskService.Setup(s => s.GetPackId(1)).Returns(tasks);

//            // Act
//            var result = _controller.GetPackagingById(1);

//            // Assert
//            Assert.That(result, Is.EqualTo(tasks));
//        }

//        // Test for Get All Tasks
//        [Test]
//        public void GetAllTasks_ReturnsOkResult()
//        {
//            // Arrange
//            var tasks = new List<WheelFactory.Models.Task> { new WheelFactory.Models.Task { Id = 1 } };
//            _mockTaskService.Setup(s => s.GetTask()).Returns(tasks);

//            // Act
//            var result = _controller.Get();

//            // Assert
//            Assert.That(result, Is.EqualTo(tasks));
//        }

//        // Test for Get Task By Id
//        [Test]
//        public void GetTaskById_ExistingId_ReturnsOkResult()
//        {
//            // Arrange
//            var tasks = new List<WheelFactory.Models.Task> { new WheelFactory.Models.Task { Id = 1 } };
//            _mockTaskService.Setup(s => s.GetTaskById(1)).Returns(tasks);

//            // Act
//            var result = _controller.Get(1);

//            // Assert
//            Assert.That(result, Is.EqualTo(tasks));
//        }

//        // Test for Get Orders Soldering
//        [Test]
//        public void GetOrdersSoldering_ReturnsOkResult()
//        {
//            // Arrange
//            var orders = new List<Orders> { new Orders { Status = "Soldering" } };
//            _mockTaskService.Setup(s => s.GetSold()).Returns(orders);

//            // Act
//            var result = _controller.GetOrdersSoldering(1);

//            // Assert
//            Assert.That(result, Is.InstanceOf<OkObjectResult>());
//            var okResult = result as OkObjectResult;
//            Assert.That(okResult.Value, Is.EqualTo(orders));
//        }

//        // Test for Get Soldering By Id
//        [Test]
//        public void GetSolderingById_ExistingId_ReturnsOkResult()
//        {
//            // Arrange
//            var tasks = new List<WheelFactory.Models.Task> { new WheelFactory.Models.Task { Id = 1, Status = "soldering" } };
//            _mockTaskService.Setup(s => s.GetSoldId(1)).Returns(tasks);

//            // Act
//            var result = _controller.GetSolderingById(1);

//            // Assert
//            Assert.That(result, Is.EqualTo(tasks));
//        }

//        // Test for Get Painting By Id
//        [Test]
//        public void GetPaintingById_ExistingId_ReturnsOkResult()
//        {
//            // Arrange
//            var tasks = new List<WheelFactory.Models.Task> { new WheelFactory.Models.Task { Id = 1, Status = "painting" } };
//            _mockTaskService.Setup(s => s.GetPaintId(1)).Returns(tasks);

//            // Act
//            var result = _controller.GetPaintingById(1);

//            // Assert
//            Assert.That(result, Is.EqualTo(tasks));
//        }

//        // Test for Post Orders Soldering
//        [Test]
//        public async System.Threading.Tasks.Task PostOrdersSoldering_ValidOrder_ReturnsOkResult()
//        {
//            // Arrange
//            var fileMock = new Mock<IFormFile>();
//            var sandDto = new SandDTO
//            {
//                OrderId = 1,
//                SandBlastingLevel = "Level 1",
//                Notes = "Some notes",
//                ImageUrl = fileMock.Object,
//                Status="some"
                
//            };

//            _mockTaskService.Setup(s => s.AddSandOrders(It.IsAny<WheelFactory.Models.Task>())).Returns(true);

//            // Act
//            var result = await _controller.PostOrdersSoldering(sandDto);

//            // Assert
//            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
//        }

//        // Test for Get Orders Painting
//        [Test]
//        public void GetOrdersPainting_ReturnsOkResult()
//        {
//            // Arrange
//            var orders = new List<Orders> { new Orders { Status = "Painting" } };
//            _mockTaskService.Setup(s => s.GetPaint()).Returns(orders);

//            // Act
//            var result = _controller.GetOrdersPainting();

//            // Assert
//            Assert.That(result, Is.InstanceOf<OkObjectResult>());
//            var okResult = result as OkObjectResult;
//            Assert.That(okResult.Value, Is.EqualTo(orders));
//        }

//        // Test for Post Orders Painting
//        [Test]
//        public async System.Threading.Tasks.Task PostOrdersPainting_ValidOrder_ReturnsOkResult()
//        {
//            // Arrange
//            var paintDto = new PaintDTO
//            {
//                OrderId = 1,
//                PColor = "Red",
//                PType = "Type 1",
//                Notes = "Some notes",
//                Status =   "some status" ,
//                ImageUrl = new FormFile(new MemoryStream(), 0, 100, "Data", "test.jpg")
//            };

//            _mockTaskService.Setup(s => s.AddPaintOrders(It.IsAny<WheelFactory.Models.Task>())).Returns(true);

//            // Act
//            var result = await _controller.PostOrdersPainting(paintDto);

//            // Assert
//            Assert.That(result, Is.InstanceOf<OkObjectResult>());
//        }

//        // Test for Get Orders Packaging
//        [Test]
//        public void GetOrdersPackaging_ReturnsOkResult()
//        {
//            // Arrange
//            var orders = new List<Orders> { new Orders { Status = "Packaging" } };
//            _mockTaskService.Setup(s => s.GetPack()).Returns(orders);

//            // Act
//            var result = _controller.GetOrdersPackaging();

//            // Assert
//            Assert.That(result, Is.InstanceOf<OkObjectResult>());
//            var okResult = result as OkObjectResult;
//            Assert.That(okResult.Value, Is.EqualTo(orders));
//        }

//        // Test for Get All Painting
//        [Test]
//        public void GetAllPainting_ReturnsOkResult()
//        {
//            // Arrange
//            var tasks = new List<WheelFactory.Models.Task> { new WheelFactory.Models.Task { Status = "Soldering" } };
//            _mockTaskService.Setup(s => s.GetAllPaint()).Returns(tasks);

//            // Act
//            var result = _controller.GetAllPainting();

//            // Assert
//            Assert.That(result, Is.InstanceOf<OkObjectResult>());
//            var okResult = result as OkObjectResult;
//            Assert.That(okResult.Value, Is.EqualTo(tasks));
//        }

//        // Test for Post Orders Packaging
//        [Test]
//        public async System.Threading.Tasks.Task PostOrdersPackaging_ValidOrder_ReturnsOkResult()
//        {
//            // Arrange
//            var fileMock = new Mock<IFormFile>();
//            var packDto = new PackDTO
//            {
//                OrderId = 1,
//                IRating = 5,
//                Notes = "Some notes",
//                ImageUrl = new FormFile(new MemoryStream(), 0, 100, "Data", "test.jpg")
//            };

//            _mockTaskService.Setup(s => s.AddPackOrders(It.IsAny<WheelFactory.Models.Task>())).Returns(true);

//            // Act
//            var result = await _controller.PostOrdersPackaging(packDto);

//            // Assert
//            Assert.That(result, Is.InstanceOf<OkObjectResult>());
//        }
//    }
//}
