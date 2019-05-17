using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace BlazorBandNoodling.Shared.Models
{
    public class Student
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        [RegularExpression(@"M\d{8}", ErrorMessage = "Please include an M followed by 8 digits")]
        public string MNumber { get; set; }

        // "Connection" Properties

        ICollection<Enrollment> Enrollments { get; set; }
        // ICollection<Uniform> UniformParts { get; set; }
    }
}
