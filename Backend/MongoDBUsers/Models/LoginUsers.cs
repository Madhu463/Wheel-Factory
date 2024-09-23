using MongoDB.Bson.Serialization.Attributes;

namespace MongoDBUsers.Models
{
    public class LoginUsers
    {
        [BsonId]
        public int? Id { get; set; }
        public string userid { get; set; }
        public string password { get; set; }
        public string? role { get; set; }
    }
}
