using WheelFactory.Models;

namespace WheelFactory.Services
{
    public class UserService
    {
        private readonly WheelContext _context;
        public UserService(WheelContext context)
        {
               _context = context;
        }
        public List<User> GetUser()
        {
            return _context.Users.ToList();
        }
        public User GetUserById(int id)
        {
            var user = _context.Users.Find(id);
            return (user);

        }
        public bool AddUser(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return true;
        }
        public bool UpdateUser(int id, User u)
        {
            var user = _context.Users.Find(id);

            if (user != null)
            {
                user.Password = u.Password;
                user.Role = u.Role;
                 _context.SaveChanges();
                return true;
            }

            return false;
        }

        public bool DeleteUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}
