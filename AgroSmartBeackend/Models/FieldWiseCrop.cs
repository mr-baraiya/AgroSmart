using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
//using Newtonsoft.Json;

namespace AgroSmartBeackend.Models;

public partial class FieldWiseCrop
{
    public int FieldWiseCropId { get; set; }

    public int FieldId { get; set; }

    public int CropId { get; set; }

    public DateOnly PlantedDate { get; set; }

    public DateOnly? ExpectedHarvestDate { get; set; }

    public DateOnly? ActualHarvestDate { get; set; }

    public string? CurrentGrowthStage { get; set; }

    public decimal? PlantedArea { get; set; }

    public string Status { get; set; } = null!;

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    [JsonIgnore]
    public virtual Crop? Crop { get; set; }

    [JsonIgnore]
    public virtual Field? Field { get; set; }
}
