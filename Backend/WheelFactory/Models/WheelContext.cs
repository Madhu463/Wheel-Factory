using Microsoft.AspNetCore.Hosting;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using System.Configuration;
using System.Reflection.Metadata;
using System.Threading.RateLimiting;

namespace WheelFactory.Models
{
    public class WheelContext:DbContext
    {
        public WheelContext(DbContextOptions<WheelContext>options):base(options)
        {
            
        }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<Orders> OrderDetails { get; set; }
        public DbSet<Colors> Color { get; set; }
        public DbSet<SandBlastingLevels> SandBlasting { get; set; }
        public DbSet<PaintType> Paint { get; set; }
        public DbSet<Rating> Rate { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Orders>()
                .ToTable(tb => tb.HasTrigger("triggers_log"));
        }

    }
}
