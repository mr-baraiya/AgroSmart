using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
//using Newtonsoft.Json;

namespace AgroSmartBeackend.Models;

public partial class SmartInsight
{
    public int InsightId { get; set; }

    public string InsightType { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string Message { get; set; } = null!;

    public string? Priority { get; set; }

    public string? Status { get; set; }

    public string? SourceType { get; set; }

    public int? SourceId { get; set; }

    public int TargetUserId { get; set; }

    public DateTime? ValidUntil { get; set; }

    public DateTime? CreatedAt { get; set; }

    public bool? IsResolved { get; set; }

    [JsonIgnore]
    public virtual User? TargetUser { get; set; }
}
