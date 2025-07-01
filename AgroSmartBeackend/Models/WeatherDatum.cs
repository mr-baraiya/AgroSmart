using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
//using Newtonsoft.Json;

namespace AgroSmartBeackend.Models;

public partial class WeatherDatum
{
    public long WeatherId { get; set; }

    public string Location { get; set; } = null!;

    public decimal Latitude { get; set; }

    public decimal Longitude { get; set; }

    public decimal? Temperature { get; set; }

    public decimal? Humidity { get; set; }

    public decimal? Pressure { get; set; }

    public decimal? WindSpeed { get; set; }

    public string? WeatherDescription { get; set; }

    public DateTime ForecastDate { get; set; }

    public string DataType { get; set; } = null!;

    public DateTime RetrievedAt { get; set; }

    public int FarmId { get; set; }

    [JsonIgnore]
    public virtual Farm? Farm { get; set; }
}
