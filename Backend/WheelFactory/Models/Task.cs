namespace WheelFactory.Models
{
    public class Task
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string Status { get; set; }
        public string? SandBlastingLevel { get; set; }
        public string ImageUrl { get; set; }
        public string Notes { get; set; }
        public int ? IRating { get; set; }
        public string? PColor { get; set; }
        public string? PType { get; set; }

        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow.AddHours(5).AddMinutes(30);
        public Orders? Order { get; set; }

    }
}
