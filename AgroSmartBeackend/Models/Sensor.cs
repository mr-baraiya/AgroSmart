using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
//using Newtonsoft.Json;

namespace AgroSmartBeackend.Models;

public partial class Sensor
{
    public int SensorId { get; set; }

    public string SensorType { get; set; } = null!;

    public string? Manufacturer { get; set; }

    public string? Model { get; set; }

    public string? SerialNumber { get; set; }

    public int FieldId { get; set; }

    public DateTime? InstallationDate { get; set; }

    public DateTime? LastCalibrated { get; set; }

    public int? CalibrationInterval { get; set; }

    public decimal? LatestValue { get; set; }

    public string? LatestUnit { get; set; }

    public decimal? LatestQualityScore { get; set; }

    public DateTime? LastReadingTime { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    [JsonIgnore]
    public virtual Field? Field { get; set; }

    [JsonIgnore]
    public virtual ICollection<SensorReading> SensorReadings { get; set; } = new List<SensorReading>();
}
