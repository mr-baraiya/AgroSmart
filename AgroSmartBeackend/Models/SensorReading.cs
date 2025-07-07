using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
//using Newtonsoft.Json;

namespace AgroSmartBeackend.Models;

public partial class SensorReading
{
    public long ReadingId { get; set; }

    public int SensorId { get; set; }

    public decimal Value { get; set; }

    public string? Unit { get; set; }

    public decimal? QualityScore { get; set; }

    public DateTime ReadingTime { get; set; }

    [JsonIgnore]
    public virtual Sensor? Sensor { get; set; }
}
