using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace AgroSmartBeackend.Models;

public partial class AgroSmartContext : DbContext
{
    public AgroSmartContext()
    {
    }

    public AgroSmartContext(DbContextOptions<AgroSmartContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Crop> Crops { get; set; }

    public virtual DbSet<Farm> Farms { get; set; }

    public virtual DbSet<Field> Fields { get; set; }

    public virtual DbSet<FieldWiseCrop> FieldWiseCrops { get; set; }

    public virtual DbSet<Recommendation> Recommendations { get; set; }

    public virtual DbSet<Schedule> Schedules { get; set; }

    //public virtual DbSet<Sensor> Sensors { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<WeatherDatum> WeatherData { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Crop>(entity =>
        {
            entity.HasKey(e => e.CropId).HasName("PK__Crops__92356115A66909F4");

            entity.Property(e => e.AvgWaterReqmm).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.CropName).HasMaxLength(100);
            entity.Property(e => e.HarvestSeason).HasMaxLength(20);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.OptimalSoilpHmax)
                .HasColumnType("decimal(4, 2)")
                .HasColumnName("OptimalSoilpHMax");
            entity.Property(e => e.OptimalSoilpHmin)
                .HasColumnType("decimal(4, 2)")
                .HasColumnName("OptimalSoilpHMin");
            entity.Property(e => e.OptimalTempMax).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.OptimalTempMin).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.SeedingDepthCm).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<Farm>(entity =>
        {
            entity.HasKey(e => e.FarmId).HasName("PK__Farms__ED7BBAB9BEECD75F");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.FarmName).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Latitude).HasColumnType("decimal(9, 6)");
            entity.Property(e => e.Location).HasMaxLength(255);
            entity.Property(e => e.Longitude).HasColumnType("decimal(9, 6)");
            entity.Property(e => e.TotalAcres).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.User).WithMany(p => p.Farms)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Farms_Users");
        });

        modelBuilder.Entity<Field>(entity =>
        {
            entity.HasKey(e => e.FieldId).HasName("PK__Fields__C8B6FF07A1EAAB85");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.FieldName).HasMaxLength(100);
            entity.Property(e => e.IrrigationType).HasMaxLength(30);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.SizeAcres).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.SoilType).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Farm).WithMany(p => p.Fields)
                .HasForeignKey(d => d.FarmId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Fields_Farms");
        });

        modelBuilder.Entity<FieldWiseCrop>(entity =>
        {
            entity.HasKey(e => e.FieldWiseCropId).HasName("PK__FieldWis__F4E7970C0428C908");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.CurrentGrowthStage).HasMaxLength(50);
            entity.Property(e => e.PlantedArea).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Active");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Crop).WithMany(p => p.FieldWiseCrops)
                .HasForeignKey(d => d.CropId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FieldWiseCrops_Crops");

            entity.HasOne(d => d.Field).WithMany(p => p.FieldWiseCrops)
                .HasForeignKey(d => d.FieldId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FieldWiseCrops_Fields");
        });

        modelBuilder.Entity<Recommendation>(entity =>
        {
            entity.HasKey(e => e.RecommendationId).HasName("PK__Recommen__AA15BEE4ADEEF177");

            entity.Property(e => e.EstimatedBenefit).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.EstimatedCost).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.GeneratedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Priority)
                .HasMaxLength(20)
                .HasDefaultValue("Medium");
            entity.Property(e => e.RecommendationType).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(200);

            entity.HasOne(d => d.Field).WithMany(p => p.Recommendations)
                .HasForeignKey(d => d.FieldId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Recommendations_Fields");
        });

        modelBuilder.Entity<Schedule>(entity =>
        {
            entity.HasKey(e => e.ScheduleId).HasName("PK__Schedule__9C8A5B49C7A53B7E");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Duration).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.EstimatedCost).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Priority)
                .HasMaxLength(20)
                .HasDefaultValue("Medium");
            entity.Property(e => e.ScheduleType).HasMaxLength(50);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Scheduled");
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Schedules)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Schedules_Users");

            entity.HasOne(d => d.Field).WithMany(p => p.Schedules)
                .HasForeignKey(d => d.FieldId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Schedules_Fields");
        });

        //modelBuilder.Entity<Sensor>(entity =>
        //{
        //    entity.HasKey(e => e.SensorId).HasName("PK__Sensors__D8099BFAB56C1AF3");

        //    entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
        //    entity.Property(e => e.IsActive).HasDefaultValue(true);
        //    entity.Property(e => e.LatestQualityScore).HasColumnType("decimal(3, 2)");
        //    entity.Property(e => e.LatestUnit).HasMaxLength(20);
        //    entity.Property(e => e.LatestValue).HasColumnType("decimal(15, 4)");
        //    entity.Property(e => e.Manufacturer).HasMaxLength(100);
        //    entity.Property(e => e.Model).HasMaxLength(100);
        //    entity.Property(e => e.SensorType).HasMaxLength(50);
        //    entity.Property(e => e.SerialNumber).HasMaxLength(100);

        //    entity.HasOne(d => d.Field).WithMany(p => p.Sensors)
        //        .HasForeignKey(d => d.FieldId)
        //        .OnDelete(DeleteBehavior.ClientSetNull)
        //        .HasConstraintName("FK_Sensors_Fields");
        //});

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C78D84D04");

            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(15);
            entity.Property(e => e.Role).HasMaxLength(20);
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<WeatherDatum>(entity =>
        {
            entity.HasKey(e => e.WeatherId).HasName("PK__WeatherD__0BF97BF5004E414A");

            entity.Property(e => e.DataType).HasMaxLength(20);
            entity.Property(e => e.Humidity).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Latitude).HasColumnType("decimal(9, 6)");
            entity.Property(e => e.Location).HasMaxLength(255);
            entity.Property(e => e.Longitude).HasColumnType("decimal(9, 6)");
            entity.Property(e => e.Pressure).HasColumnType("decimal(7, 2)");
            entity.Property(e => e.RetrievedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Temperature).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.WeatherDescription).HasMaxLength(200);
            entity.Property(e => e.WindSpeed).HasColumnType("decimal(5, 2)");

            entity.HasOne(d => d.Farm).WithMany(p => p.WeatherData)
                .HasForeignKey(d => d.FarmId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_WeatherData_Farm");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
