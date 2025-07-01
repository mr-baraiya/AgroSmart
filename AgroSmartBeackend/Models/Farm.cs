using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
//using Newtonsoft.Json;

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

    [JsonIgnore]
    public virtual ICollection<Field> Fields { get; set; } = new List<Field>();

    [JsonIgnore]
    public virtual ICollection<WeatherDatum> WeatherData { get; set; } = new List<WeatherDatum>();

    [JsonIgnore]
    public virtual User? User { get; set; }

}
