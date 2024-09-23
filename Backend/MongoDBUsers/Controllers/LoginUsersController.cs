using Microsoft.AspNetCore.Mvc;
using MongoDbDemo.Repositories;
using MongoDBUsers.Helpers;
using MongoDBUsers.Models;

namespace MongoDBUsers.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginUsersController : ControllerBase
    {
        private readonly LoginUsersContext _context = new LoginUsersContext();
        private readonly TokenHelper _tokenHelper = new TokenHelper();

        // API 1: Validate user and return token + role (only userid and password required)
        [HttpPost("validate")]
        public IActionResult Validate([FromBody] LoginDTO value)
        {
            string userid = value.userid;
            string password = value.password;

            if (string.IsNullOrEmpty(userid) || string.IsNullOrEmpty(password))
                return BadRequest("Invalid Request");

            // Fetch the user from MongoDB based on userid and password
            var user = _context.GetUserById(userid);
            if (user != null && user.password == password)
            {
                var token = _tokenHelper.GenerateToken(user);
                return Ok(new { Status = "Success", Token = token, Role = user.role });
            }

            return Unauthorized(new { Status = "Failed", Message = "Invalid credentials" });
        }

        // API 2: Get role by userid
        [HttpGet("role/{userid}")]
        public IActionResult GetUserRole(string userid)
        {
            var role = _context.GetUserRole(userid);
            if (string.IsNullOrEmpty(role))
                return NotFound(new { Status = "Failed", Message = "User not found" });

            return Ok(new { UserId = userid, Role = role });
        }

        // API 3: Get all users
        [HttpGet("all")]
        public IActionResult GetAllUsers()
        {
            var users = _context.GetUsers();
            return Ok(users);
        }

        // API 4: Change password
        [HttpPost("change-password")]
        public IActionResult ChangePassword([FromBody] LoginDTO payload)
        {
            string userid = payload.userid;
            string newPassword = payload.password;

            if (string.IsNullOrEmpty(userid) || string.IsNullOrEmpty(newPassword))
                return BadRequest("Invalid Request");

            var updated = _context.UpdatePassword(userid, newPassword);
            if (updated)
                return Ok(new { Status = "Success", Message = "Password updated successfully" });

            return NotFound(new { Status = "Failed", Message = "User not found" });
        }
    }
}
