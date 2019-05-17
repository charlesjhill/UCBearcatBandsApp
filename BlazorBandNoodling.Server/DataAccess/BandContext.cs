using BlazorBandNoodling.Shared.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace BlazorBandNoodling.Server.DataAccess
{
    public partial class BandContext : DbContext
    {
        public BandContext(DbContextOptions<BandContext> options) : base(options)
        {
        }

        public DbSet<Student> Students { get; set;}
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Ensemble> Ensembles { get; set; }
        public DbSet<Instrument> Instruments { get; set; }
    }
}
