using MongoDB.Driver;
using MongoDBUsers.Models;

namespace MongoDbDemo.Repositories
{
    public class LoginUsersContext
    {
        private readonly IMongoDatabase _wheelFactory;
        private readonly IMongoClient _client;

        public LoginUsersContext()
        {
            _client = new MongoClient("mongodb://localhost:27017");
            _wheelFactory = _client.GetDatabase("WheelFactory");
        }

        public IMongoCollection<LoginUsers> Users => _wheelFactory.GetCollection<LoginUsers>("users");

        public bool AddUser(LoginUsers user)
        {
            Users.InsertOne(user);
            return true;
        }

        public List<LoginUsers> GetUsers()
        {
            return Users.Find(u => true).ToList();
        }

        public LoginUsers GetUserById(string userid)
        {
            return Users.Find(u => u.userid == userid).FirstOrDefault();
        }

        public bool UpdatePassword(string userid, string newPassword)
        {
            var filter = Builders<LoginUsers>.Filter.Eq(u => u.userid, userid);
            var update = Builders<LoginUsers>.Update.Set(u => u.password, newPassword);
            var result = Users.UpdateOne(filter, update);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public bool Validate(LoginUsers user)
        {
            var result = Users.Find(u => u.userid == user.userid && u.password == user.password).FirstOrDefault();
            return result != null;
        }

        public string GetUserRole(string userid)
        {
            var user = Users.Find(u => u.userid == userid).FirstOrDefault();
            return user?.role;
        }
    }
}
