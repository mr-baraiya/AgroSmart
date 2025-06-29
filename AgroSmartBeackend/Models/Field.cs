using System;
using System.Collections.Generic;

namespace AgroSmartBeackend.Models;

public partial class Field
{
    public int FieldId { get; set; }

    public string FieldName { get; set; } = null!;

    public decimal SizeAcres { get; set; }

    public string? SoilType { get; set; }

    public string? IrrigationType { get; set; }

    public int FarmId { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Farm Farm { get; set; } = null!;

    public virtual ICollection<FieldWiseCrop> FieldWiseCrops { get; set; } = new List<FieldWiseCrop>();

    public virtual ICollection<Recommendation> Recommendations { get; set; } = new List<Recommendation>();

    public virtual ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();

    public virtual ICollection<Sensor> Sensors { get; set; } = new List<Sensor>();
}
