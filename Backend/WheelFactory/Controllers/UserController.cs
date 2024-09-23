using Microsoft.AspNetCore.Mvc;
using WheelFactory.Models;
using WheelFactory.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WheelFactory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _user;
        public UserController(WheelContext wc)
        {
            _user = new UserService(wc);
        }

        // GET: api/<UserController>
        [HttpGet]
        public IEnumerable<User> Get()
        {
            return _user.GetUser();
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public User Get(int id)
        {
            return _user.GetUserById(id);
        }

        // POST api/<UserController>
        [HttpPost]
        public IActionResult Post([FromBody] User value)
        {
             
            if (_user.AddUser(value))
            {
                return Ok(value);
            }

            return BadRequest();
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] User value)
        {
            if(_user.UpdateUser(id,value))
            {
                return Ok(value);
            }return BadRequest();
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if(_user.DeleteUser(id))
            {
                return Ok();
            }return BadRequest();
        }
    }
}
