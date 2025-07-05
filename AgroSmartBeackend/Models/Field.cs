using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
//using Newtonsoft.Json;

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

    [JsonIgnore]
    public virtual Farm? Farm { get; set; }

    [JsonIgnore]
    public virtual ICollection<FieldWiseCrop> FieldWiseCrops { get; set; } = new List<FieldWiseCrop>();

    [JsonIgnore]
    public virtual ICollection<Recommendation> Recommendations { get; set; } = new List<Recommendation>();

    [JsonIgnore]
    public virtual ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();

}
