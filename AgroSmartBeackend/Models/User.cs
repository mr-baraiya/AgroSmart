﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
//using Newtonsoft.Json;

namespace AgroSmartBeackend.Models;

public partial class User
{
    public int UserId { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string Role { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public string? ProfileImage { get; set; }

    [JsonIgnore]
    public virtual ICollection<Farm> Farms { get; set; } = new List<Farm>();

    [JsonIgnore]
    public virtual ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();

    [JsonIgnore]
    public virtual ICollection<SmartInsight> SmartInsights { get; set; } = new List<SmartInsight>();

}