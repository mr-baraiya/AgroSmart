using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
//using Newtonsoft.Json;

namespace AgroSmartBeackend.Models;

public partial class Recommendation
{
    public int RecommendationId { get; set; }

    public int FieldId { get; set; }

    public string RecommendationType { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string Priority { get; set; } = null!;

    public decimal? EstimatedCost { get; set; }

    public decimal? EstimatedBenefit { get; set; }

    public DateTime? ValidUntil { get; set; }

    public DateTime GeneratedAt { get; set; }

    [JsonIgnore]
    public virtual Field? Field { get; set; }
}
