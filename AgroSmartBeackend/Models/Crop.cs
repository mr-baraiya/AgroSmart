using System;
using System.Collections.Generic;

namespace AgroSmartBeackend.Models;

public partial class Crop
{
    public int CropId { get; set; }

    public string CropName { get; set; } = null!;

    public decimal? OptimalSoilpHmin { get; set; }

    public decimal? OptimalSoilpHmax { get; set; }

    public decimal? OptimalTempMin { get; set; }

    public decimal? OptimalTempMax { get; set; }

    public decimal? AvgWaterReqmm { get; set; }

    public int? GrowthDurationDays { get; set; }

    public decimal? SeedingDepthCm { get; set; }

    public string? HarvestSeason { get; set; }

    public string? Description { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<FieldWiseCrop> FieldWiseCrops { get; set; } = new List<FieldWiseCrop>();
}
