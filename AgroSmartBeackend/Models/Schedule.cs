﻿using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
//using Newtonsoft.Json;

namespace AgroSmartBeackend.Models;

public partial class Schedule
{
    public int ScheduleId { get; set; }

    public int FieldId { get; set; }

    public string ScheduleType { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime ScheduledDate { get; set; }

    public decimal? Duration { get; set; }

    public decimal? EstimatedCost { get; set; }

    public string Priority { get; set; } = null!;

    public string Status { get; set; } = null!;

    public bool IsCompleted { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    [JsonIgnore]
    public virtual User? CreatedByNavigation { get; set; }

    [JsonIgnore]
    public virtual Field? Field { get; set; }
}
