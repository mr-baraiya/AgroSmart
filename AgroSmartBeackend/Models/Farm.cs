using System;
using System.Collections.Generic;

namespace AgroSmartBeackend.Models;

public partial class Farm
{
    public int FarmId { get; set; }

    public string FarmName { get; set; } = null!;

    public string Location { get; set; } = null!;

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public decimal? TotalAcres { get; set; }

    public int UserId { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Field> Fields { get; set; } = new List<Field>();

    public virtual User User { get; set; } = null!;
}
