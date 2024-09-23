using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WheelFactory.Models
{
    public class Orders
    {
            [Key]
            [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
            public int OrderId { get; set; }
            public string ClientName { get; set; }
            public int Year { get; set; }
            public string Make { get; set; }
            public string Model { get; set; }
            public string DamageType { get; set; }
            public string ImageUrl { get; set; }
            public string Notes { get; set; }
            public string Status { get; set; }
            public DateTime? CreatedAt { get; set; } = DateTime.UtcNow.AddHours(5).AddMinutes(30);
            public virtual ICollection<Transaction> Transactions { get; set; }
            public virtual ICollection<Task> Tasks { get; set; }

        }
    }

