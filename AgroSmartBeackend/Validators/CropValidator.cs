using FluentValidation;
using AgroSmartBeackend.Models;

public class CropValidator : AbstractValidator<Crop>
{
    public CropValidator()
    {
        RuleFor(x => x.CropName)
            .NotEmpty().WithMessage("Crop name is required.")
            .MaximumLength(150).WithMessage("Crop name cannot exceed 150 characters.");

        RuleFor(x => x.OptimalSoilpHmin)
            .InclusiveBetween(0, 14).WithMessage("Minimum soil pH must be between 0 and 14.")
            .When(x => x.OptimalSoilpHmin.HasValue);

        RuleFor(x => x.OptimalSoilpHmax)
            .InclusiveBetween(0, 14).WithMessage("Maximum soil pH must be between 0 and 14.")
            .When(x => x.OptimalSoilpHmax.HasValue);

        RuleFor(x => x)
            .Must(x => !x.OptimalSoilpHmin.HasValue || !x.OptimalSoilpHmax.HasValue || x.OptimalSoilpHmin <= x.OptimalSoilpHmax)
            .WithMessage("Minimum soil pH cannot be greater than maximum soil pH.");

        RuleFor(x => x.OptimalTempMin)
            .InclusiveBetween(-50, 100).WithMessage("Minimum temperature must be between -50 and 100 °C.")
            .When(x => x.OptimalTempMin.HasValue);

        RuleFor(x => x.OptimalTempMax)
            .InclusiveBetween(-50, 100).WithMessage("Maximum temperature must be between -50 and 100 °C.")
            .When(x => x.OptimalTempMax.HasValue);

        RuleFor(x => x)
            .Must(x => !x.OptimalTempMin.HasValue || !x.OptimalTempMax.HasValue || x.OptimalTempMin <= x.OptimalTempMax)
            .WithMessage("Minimum temperature cannot be greater than maximum temperature.");

        RuleFor(x => x.AvgWaterReqmm)
            .GreaterThan(0).WithMessage("Average water requirement must be a positive number.")
            .When(x => x.AvgWaterReqmm.HasValue);

        RuleFor(x => x.GrowthDurationDays)
            .GreaterThan(0).WithMessage("Growth duration must be a positive number of days.")
            .When(x => x.GrowthDurationDays.HasValue);

        RuleFor(x => x.SeedingDepthCm)
            .GreaterThan(0).WithMessage("Seeding depth must be a positive number.")
            .When(x => x.SeedingDepthCm.HasValue);

        RuleFor(x => x.HarvestSeason)
            .MaximumLength(100).WithMessage("Harvest season cannot exceed 100 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.HarvestSeason));

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.Description));

        RuleFor(x => x.CreatedAt)
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("CreatedAt cannot be in the future.");

        RuleFor(x => x.UpdatedAt)
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("UpdatedAt cannot be in the future.");
    }
}
