using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BlazorBandNoodling.Shared.Models
{

    public class Instrument : IEquipment
    {
        public int ID { get; set;}

        public string Type { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public string Serial { get; set; }

        [DataType(DataType.Currency)]
        public decimal PurchaseValue { get; set; }

        [DataType(DataType.Date)]
        public DateTime PurchaseDate { get; set; }

        public bool IsPersonal { get; set; }

        public string Notes { get; set; }

        // We are also eventually want to include some historical information
        // like receipts for repairs, current value information, etc

        // Instead of associating Instruments with Students,
        // We will associate it with the enrollment of a Student in an Ensemble
        public Enrollment Enrollment { get; set; }
    }
}
