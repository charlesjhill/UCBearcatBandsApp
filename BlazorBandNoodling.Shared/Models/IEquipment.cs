using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BlazorBandNoodling.Shared.Models
{

    /// <summary>
    /// Defines a Model that represents some kind of Equipment with identification and value
    /// </summary>
    public interface IEquipment
    {
        string Type { get; set; }
        string Make { get; set; }
        string Model { get; set; }
        string Serial { get; set; }
        DateTime PurchaseDate { get; set; }
        decimal PurchaseValue { get; set; }
    }
}
