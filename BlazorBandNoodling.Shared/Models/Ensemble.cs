using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BlazorBandNoodling.Shared.Models
{

    public class Ensemble
    {
        public int ID { get; set; }
        public string Name { get; set; }


        public ICollection<Enrollment> Enrollments { get; set; }
    }
}
