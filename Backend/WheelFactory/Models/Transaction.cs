using System.ComponentModel.DataAnnotations.Schema;

namespace WheelFactory.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string Status { get; set; }
        public DateTime? Created { get; set; } = DateTime.UtcNow.AddHours(5).AddMinutes(30);
       
        public Orders? Order { get; set; }



    }
}
