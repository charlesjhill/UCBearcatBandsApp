using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BlazorBandNoodling.Shared.Models
{
    public class Enrollment
    {
        public int ID { get; set; }
        public Grade? Grade { get; set; }

        // We could probably extrapolate "Part Assignment" out but let's chill for now
        public int PartAssignment { get; set; }

        // Connection Properties

        // Typically instruments are a relationship off student, but Student's use instruments for
        // Ensembles, and it's possible an instrument can be used in different ensembles by different students.
        public int InstrumentID { get; set; }
        public Instrument Instrument { get; set; }

        public int StudentID { get; set; }
        public Student Student { get; set; }

        public int EnsembleID { get; set; }
        public Ensemble Ensemble { get; set; }
    }
}
